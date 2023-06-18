import { ExcalidrawScene } from "./excalidraw.ts";
import { JunoScene, JunoSceneKey } from "./juno.ts";

export type Scene = JunoScene &
  Pick<ExcalidrawScene, "files"> & { key: JunoSceneKey };
