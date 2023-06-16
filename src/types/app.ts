import {ExcalidrawScene} from "./excalidraw.ts";
import {JunoSceneKey} from "./juno.ts";

export type Scene = ExcalidrawScene & { key: JunoSceneKey };