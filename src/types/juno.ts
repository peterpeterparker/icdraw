import { ExcalidrawScene } from "./excalidraw.ts";

export type JunoSceneKey = string;

export type JunoScene = Pick<ExcalidrawScene, "elements" | "appState"> & {
  name?: string;
};
