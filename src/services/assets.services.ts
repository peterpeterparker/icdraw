import {
  ALLOWED_IMAGE_MIME_TYPES,
  MIME_TYPES,
} from "@excalidraw/excalidraw/types/constants";
import { FileId } from "@excalidraw/excalidraw/types/element/types";
import {
  BinaryFileData,
  BinaryFiles,
  DataURL,
} from "@excalidraw/excalidraw/types/types";
import { listAssets } from "@junobuild/core";
import { JunoSceneKey } from "../types/juno.ts";

export const loadAssets = async (key: JunoSceneKey): Promise<BinaryFiles> => {
  const { assets } = await listAssets({
    collection: "files",
    filter: {
      matcher: {
        description: key,
      },
    },
  });

  const files = await Promise.all(
    assets.map(async ({ downloadUrl, headers, name }) => {
      const response = await fetch(
        downloadUrl.replace(".icp0.io", ".raw.icp0.io"),
      );
      const blob = await response.blob();
      const reader = new FileReader();
      await new Promise((resolve, reject) => {
        reader.onload = resolve;
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const dataURL = reader?.result as string;

      const now = Date.now();

      const bnData: BinaryFileData = {
        id: name as FileId,
        dataURL: dataURL as DataURL,
        created: now,
        lastRetrieved: now,
        mimeType: (headers.find(
          ([header, _]) => header === "Content-Type'",
        )?.[1] ?? "image/jpeg") as
          | (typeof ALLOWED_IMAGE_MIME_TYPES)[number]
          | typeof MIME_TYPES.binary,
      };

      return bnData;
    }),
  );

  return files.reduce(
    (acc, value) => ({
      ...acc,
      [value.id]: value,
    }),
    {},
  );
};
