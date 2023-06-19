import { BinaryFiles } from "@excalidraw/excalidraw/types/types";
import { createStore, entries, get, getMany, setMany } from "idb-keyval";
import { Metadata, Scene } from "../types/app.ts";

const stateStore = createStore("icdraw-state", "state");
const filesStore = createStore("icdraw-files", "files");

const KEY_SCENE = "scene-key";
const KEY_NAME = "scene-name";
const KEY_LAST_CHANGE = "last-change";
const KEY_APP_STATE = "app-state";
const KEY_ELEMENTS = "elements";

export const setMetadata = ({ key, name }: Metadata) =>
  setMany(
    [
      [KEY_LAST_CHANGE, Date.now()],
      [KEY_SCENE, key],
      [KEY_NAME, name],
    ],
    stateStore
  );

export const setScene = async ({ files, ...rest }: Scene) =>
  Promise.all([setState(rest), setFiles(files)]);

const setState = ({ appState, elements }: Omit<Scene, "files">) =>
  setMany(
    [
      [KEY_LAST_CHANGE, Date.now()],
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
    getMany([KEY_APP_STATE, KEY_ELEMENTS], stateStore),
    entries(filesStore),
  ]);

  if (state === undefined) {
    return undefined;
  }

  const [appState, elements] = state;

  if (elements === undefined || appState === undefined) {
    return undefined;
  }

  return {
    appState,
    elements,
    files: files.reduce(
      (acc, [key, value]) => ({ ...acc, [key as string]: value }),
      {}
    ),
  };
};

export const getMetadata = async (): Promise<Metadata | undefined> => {
  const state = await getMany([KEY_SCENE, KEY_NAME], stateStore);

  if (state === undefined) {
    return undefined;
  }

  const [key, name] = state;

  if (key === undefined) {
    return undefined;
  }

  return {
    key,
    name,
  };
};

export const getLastChange = (): Promise<number | undefined> =>
  get(KEY_LAST_CHANGE, stateStore);
