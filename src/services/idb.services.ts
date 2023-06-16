import { BinaryFiles } from "@excalidraw/excalidraw/types/types";
import { createStore, entries, getMany, setMany } from "idb-keyval";
import type { ExcalidrawScene } from "../types/excalidraw.ts";

const stateStore = createStore("icdraw-state", "state");
const filesStore = createStore("icdraw-files", "files");

const KEY_APP_STATE = "app-state";
const KEY_ELEMENTS = "elements";

export const setScene = async ({ files, ...rest }: ExcalidrawScene) =>
  Promise.all([setState(rest), setFiles(files)]);

const setState = ({ appState, elements }: Omit<ExcalidrawScene, "files">) =>
  setMany(
    [
      [KEY_APP_STATE, appState],
      [KEY_ELEMENTS, elements],
    ],
    stateStore
  );

const setFiles = (files: BinaryFiles | undefined) =>
  files !== undefined && Object.keys(files).length > 0
    ? setMany(Object.entries(files), filesStore)
    : Promise.resolve();

export const getScene = async (): Promise<ExcalidrawScene | undefined> => {
  const [state, files] = await Promise.all([
    getMany([KEY_APP_STATE, KEY_ELEMENTS], stateStore),
    entries(filesStore),
  ]);

  if (state === undefined) {
    return undefined;
  }

  const [appState, elements] = state;

  return {
    appState,
    elements,
    files: files.reduce(
      (acc, [key, value]) => ({ ...acc, [key as string]: value }),
      {}
    ),
  };
};
