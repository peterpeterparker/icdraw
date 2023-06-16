import { User, getDoc, setDoc, unsafeIdentity } from "@junobuild/core";
import { getScene } from "../services/idb.services.ts";
import { PostMessage, PostMessageDataRequest } from "../types/post-message";

onmessage = async ({
  data: { msg, data },
}: MessageEvent<PostMessage<PostMessageDataRequest>>) => {
  switch (msg) {
    case "sync":
      await sync(data?.user);
      break;
  }
};

const sync = async (user: User | undefined | null) => {
  if (user === null || user === undefined) {
    return;
  }

  const scene = await getScene();

  if (scene === undefined) {
    return;
  }

  const { files, key, ...rest } = scene;

  const satellite = {
    identity: await unsafeIdentity(),
    satelliteId: "fqotu-wqaaa-aaaal-acp3a-cai",
  };

  const docKey = `${user.key}#${key}`;

  const doc = await getDoc({
    collection: "scenes",
    key: docKey,
    satellite,
  });

  console.log('DOC', doc);

  await setDoc({
    collection: "scenes",
    doc: {
      ...doc,
      key: `${user.key}#${key}`,
      data: {
        ...rest,
      },
    },
    satellite,
  });
};

export {};
