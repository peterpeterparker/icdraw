import type { ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types/types";

export type ExcalidrawScene = Pick<
  ExcalidrawInitialDataState,
  "elements" | "appState" | "files"
>;
