import { BinaryFiles } from "@excalidraw/excalidraw/types/types";
import { createStore, entries, get, getMany, setMany } from "idb-keyval";
import { Scene } from "../types/app.ts";

const stateStore = createStore("icdraw-state", "state");
const filesStore = createStore("icdraw-files", "files");

const KEY_SCENE = "scene-key";
const KEY_NAME = "scene-name";
const KEY_LAST_CHANGE = "last-change";
const KEY_APP_STATE = "app-state";
const KEY_ELEMENTS = "elements";

export type SetScene = Required<Pick<Scene, "lastChange">> &
  Omit<Scene, "lastChange">;

export const setScene = async ({ files, ...rest }: SetScene) =>
  Promise.all([setState(rest), setFiles(files)]);

const setState = ({
  appState,
  elements,
  key,
  lastChange,
  name,
}: Omit<SetScene, "files">) =>
  setMany(
    [
      [KEY_SCENE, key],
      [KEY_NAME, name],
      [KEY_LAST_CHANGE, lastChange],
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
    getMany(
      [KEY_SCENE, KEY_NAME, KEY_LAST_CHANGE, KEY_APP_STATE, KEY_ELEMENTS],
      stateStore
    ),
    entries(filesStore),
  ]);

  if (state === undefined) {
    return undefined;
  }

  const [key, name, lastChange, appState, elements] = state;

  if (key === undefined) {
    return undefined;
  }

  return {
    key,
    name,
    lastChange,
    appState,
    elements,
    files: files.reduce(
      (acc, [key, value]) => ({ ...acc, [key as string]: value }),
      {}
    ),
  };
};

export const getLastChange = (): Promise<number | undefined> =>
  get(KEY_LAST_CHANGE, stateStore);
