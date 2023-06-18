import { ExcalidrawScene } from "./excalidraw.ts";

export type Timestamp = number;
export type JunoSceneKey = string;

export type JunoScene = Pick<ExcalidrawScene, "elements" | "appState"> & {
  name: string;
  lastChange: Timestamp | undefined;
};
