import { ExcalidrawScene } from "./excalidraw.ts";
import { JunoScene, JunoSceneKey } from "./juno.ts";

export type Metadata = Pick<JunoScene, "name"> & { key: JunoSceneKey };

export type Scene = Omit<JunoScene, "name" | "lastChange"> &
  Pick<ExcalidrawScene, "files">;
