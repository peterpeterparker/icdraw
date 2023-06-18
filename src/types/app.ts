import { ExcalidrawScene } from "./excalidraw.ts";
import { JunoSceneKey } from "./juno.ts";

export type Timestamp = number;

export type Scene = ExcalidrawScene & {
  key: JunoSceneKey;
  lastChange: Timestamp | undefined;
};
