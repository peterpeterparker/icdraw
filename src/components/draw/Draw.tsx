import { Excalidraw } from "@excalidraw/excalidraw";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import type { AppState, BinaryFiles } from "@excalidraw/excalidraw/types/types";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { memo, useEffect, useRef, useState } from "react";
import {
  getScene,
  setScene as setSceneIDB,
} from "../../services/idb.services.ts";
import { Scene } from "../../types/app.ts";
import { newScene } from "../../utils/scene.utils.ts";
import styles from "./Draw.module.scss";

const Draw = () => {
  const [excalidrawAPI, _setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  const [initialData, setInitialData] = useState<Scene | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const existingScene = await getScene();
      setInitialData(existingScene !== undefined ? existingScene : newScene());
    })();
  }, []);

  const onChange = async (
    elements: readonly ExcalidrawElement[],
    appState: AppState,
    files: BinaryFiles
  ) => {
    if (initialData === undefined) {
      return;
    }

    const updatedScene: Scene = {
      elements,
      appState,
      files,
    };

    await setSceneIDB(updatedScene);
  };

  const excalidrawAPIRef = useRef(excalidrawAPI);
  const setExcalidrawAPIRef = (api: ExcalidrawImperativeAPI) => {
    excalidrawAPIRef.current = api;
    _setExcalidrawAPI(api);
  };

  const reload = ($event: Event) => {
    const { detail: scene } = $event as CustomEvent<Scene>;

    if (excalidrawAPIRef.current === null || scene === undefined) {
      return;
    }

    excalidrawAPIRef.current.updateScene({
      elements: scene.elements,
    });

    excalidrawAPIRef.current.addFiles(
      Object.entries(scene.files ?? {}).map(([_, value]) => value)
    );
  };

  useEffect(() => {
    window.addEventListener("reload", ($event: Event) => reload($event));

    return () => {
      window.removeEventListener("reload", ($event: Event) => reload($event));
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      {initialData !== undefined ? (
        <Excalidraw
          ref={(api) => setExcalidrawAPIRef(api as ExcalidrawImperativeAPI)}
          initialData={{
            ...initialData,
            scrollToContent: true,
          }}
          theme="dark"
          onChange={onChange}
          UIOptions={{
            canvasActions: {
              loadScene: false,
              saveToActiveFile: false,
            },
          }}
        />
      ) : undefined}
    </div>
  );
};

export const MemoizedDraw = memo(Draw);
