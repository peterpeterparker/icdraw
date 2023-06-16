import { BinaryFiles } from "@excalidraw/excalidraw/types/types";
import { createStore, entries, getMany, setMany } from "idb-keyval";
import { Scene } from "../types/app.ts";

const stateStore = createStore("icdraw-state", "state");
const filesStore = createStore("icdraw-files", "files");

const KEY_SCENE = "scene-key";
const KEY_APP_STATE = "app-state";
const KEY_ELEMENTS = "elements";

export const setScene = async ({ files, ...rest }: Scene) =>
  Promise.all([setState(rest), setFiles(files)]);

const setState = ({ appState, elements, key }: Omit<Scene, "files">) =>
  setMany(
    [
      [KEY_SCENE, key],
      [KEY_APP_STATE, appState],
      [KEY_ELEMENTS, elements],
    ],
    stateStore
  );

const setFiles = (files: BinaryFiles | undefined) =>
  files !== undefined && Object.keys(files).length > 0
    ? setMany(Object.entries(files), filesStore)
    : Promise.resolve();

export const getScene = async (): Promise<Scene | undefined> => {
  const [state, files] = await Promise.all([
    getMany([KEY_SCENE, KEY_APP_STATE, KEY_ELEMENTS], stateStore),
    entries(filesStore),
  ]);

  if (state === undefined) {
    return undefined;
  }

  const [key, appState, elements] = state;

  if (key === undefined) {
      return undefined;
  }

  return {
    key,
    appState,
    elements,
    files: files.reduce(
      (acc, [key, value]) => ({ ...acc, [key as string]: value }),
      {}
    ),
  };
};
