import { nanoid } from "nanoid";
import { Metadata, Scene } from "../types/app.ts";

export const newMetadata = (): Metadata => ({
  key: nanoid(),
  name: `Unnamed ${new Date().toLocaleString()}`,
});

export const newScene = (): Scene => ({
  elements: [],
  files: undefined,
});

export const reloadScene = (scene: Scene) => {
  const event = new CustomEvent<Scene>("reload", {
    detail: scene,
    bubbles: true,
  });
  window.dispatchEvent(event);
};
