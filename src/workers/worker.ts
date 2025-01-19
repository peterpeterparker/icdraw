import { ExcalidrawImageElement } from "@excalidraw/excalidraw/types/element/types";
import { BinaryFileData } from "@excalidraw/excalidraw/types/types";
import {
  Asset,
  User,
  deleteAsset,
  getDoc,
  listAssets,
  setDoc,
  unsafeIdentity,
  uploadBlob,
} from "@junobuild/core";
import { nanoid } from "nanoid";
import {
  getLastChange,
  getMetadata,
  getScene,
} from "../services/idb.services.ts";
import { ExcalidrawScene } from "../types/excalidraw.ts";
import { JunoScene, JunoSceneKey } from "../types/juno.ts";
import { PostMessage, PostMessageDataRequest } from "../types/post-message";
import type { SatelliteOptions } from "@junobuild/core";

onmessage = async ({
  data: { msg, data },
}: MessageEvent<PostMessage<PostMessageDataRequest>>) => {
  switch (msg) {
    case "start":
      await startTimer(data?.user);
      break;
    case "stop":
      stopTimer();
      break;
  }
};

let timer: NodeJS.Timeout | undefined = undefined;

const stopTimer = () => {
  if (!timer) {
    return;
  }

  clearInterval(timer);
  timer = undefined;
};

const startTimer = async (user: User | undefined | null) => {
  // Avoid re-starting the timer
  if (timer !== undefined) {
    return;
  }

  if (user === null || user === undefined) {
    // We do nothing if no user
    console.error("Attempted to initiate a worker without a user.");
    return;
  }

  const execute = async () => await sync(user);

  // We starts now but also schedule the update after wards
  await execute();

  timer = setInterval(execute, 1000);
};

let inProgress = false;
let lastChangeProcessed: number | undefined = undefined;

const sync = async (user: User | undefined | null) => {
  if (user === null || user === undefined) {
    return;
  }

  if (inProgress) {
    // Already in progress
    return;
  }

  const lastChange = await getLastChange();

  if (lastChange === undefined) {
    // There weren't any changes
    return;
  }

  if (lastChangeProcessed !== undefined && lastChange <= lastChangeProcessed) {
    // No new changes
    return;
  }

  inProgress = true;

  postMessage({
    msg: "busy",
  });

  try {
    const [scene, metadata] = await Promise.all([getScene(), getMetadata()]);

    if (scene === undefined) {
      throw new Error("No scene found.");
    }

    if (metadata === undefined) {
      throw new Error("No metadata found.");
    }

    const { files, elements, ...rest } = scene;
    const { key, ...restMetadata } = metadata;

    const CONTAINER = import.meta.env.VITE_CONTAINER;
    const SATELLITE_ID = import.meta.env.VITE_SATELLITE_ID;

    const satellite: SatelliteOptions = {
      identity: await unsafeIdentity(),
      satelliteId: SATELLITE_ID,
      ...(CONTAINER !== undefined && {
        container: true,
      }),
    };

    const doc = await getDoc<JunoScene>({
      collection: "scenes",
      key,
      satellite,
    });

    await setDoc<JunoScene>({
      collection: "scenes",
      doc: {
        ...doc,
        key,
        data: {
          elements,
          ...rest,
          ...restMetadata,
          lastChange,
        },
      },
      satellite,
    });

    await uploadFiles({
      elements,
      files,
      satellite,
      key,
    });

    // Save timestamp to skip further changes if no changes
    lastChangeProcessed = lastChange;
  } catch (err: unknown) {
    console.error(err);

    // In case of error we stop the sync
    stopTimer();
  }

  inProgress = false;

  postMessage({
    msg: "idle",
  });
};

const uploadFiles = async ({
  files,
  elements,
  satellite,
  key: sceneKey,
}: {
  satellite: SatelliteOptions;
} & Pick<ExcalidrawScene, "elements" | "files"> & { key: JunoSceneKey }) => {
  if (!files) {
    return;
  }

  const { assets } = await listAssets({
    collection: "files",
    satellite,
  });

  type File = {
    key: string;
    file: BinaryFileData;
  };

  let uploadFiles: File[] = [];
  let deleteFiles: Asset[] = [];

  for (const [key, file] of Object.entries(files)) {
    const deleted =
      elements?.find(
        (element) =>
          element.type === "image" &&
          (element as ExcalidrawImageElement).fileId === key &&
          element.isDeleted,
      ) !== undefined;
    const reactivated =
      elements?.find(
        (element) =>
          element.type === "image" &&
          (element as ExcalidrawImageElement).fileId === key &&
          !element.isDeleted,
      ) !== undefined;

    const asset = assets.find(({ name }) => key === name);

    if (deleted && !reactivated && asset !== undefined) {
      deleteFiles = [...deleteFiles, asset];
    }

    if (asset === undefined && (!deleted || reactivated)) {
      uploadFiles = [...uploadFiles, { key, file }];
    }
  }

  await Promise.all([
    ...deleteFiles.map((storageFile) =>
      deleteAsset({
        collection: "files",
        fullPath: storageFile.fullPath,
        satellite,
      }),
    ),
    ...uploadFiles.map(async ({ key, file }) =>
      uploadBlob({
        collection: "files",
        filename: key,
        data: await (await fetch(file.dataURL)).blob(),
        headers: [
          ...(file.mimeType === undefined
            ? []
            : ([["Content-Type", file.mimeType]] as [string, string][])),
        ],
        token: nanoid(),
        description: sceneKey,
        satellite,
      }),
    ),
  ]);
};

export {};
