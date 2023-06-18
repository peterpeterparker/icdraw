import { Excalidraw } from "@excalidraw/excalidraw";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import type { AppState, BinaryFiles } from "@excalidraw/excalidraw/types/types";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { memo, useContext, useEffect, useState } from "react";
import { setScene as setSceneIDB } from "../../services/idb.services.ts";
import { Scene } from "../../types/app.ts";
import { SceneContext } from "../context/Scene.tsx";
import styles from "./Draw.module.scss";

export const Draw = ({ initialData }: { initialData: Scene }) => {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  const { setScene, scene } = useContext(SceneContext);

  const onChange = async (
    elements: readonly ExcalidrawElement[],
    appState: AppState,
    files: BinaryFiles
  ) => {
    if (scene === undefined) {
      return;
    }

    const updatedScene: Scene = {
      key: scene.key,
      name: scene.name,
      lastChange: Date.now(),
      elements,
      appState,
      files,
    };

    await setSceneIDB(updatedScene);

    setScene?.(scene);
  };

  useEffect(() => {
    if (excalidrawAPI === null || scene === undefined) {
      return;
    }

    // TODO: reload only when needed

    excalidrawAPI.updateScene({
      elements: scene.elements,
    });

    excalidrawAPI.addFiles(
      Object.entries(scene.files ?? {}).map(([_, value]) => value)
    );
  }, [scene]);

  return (
    <div className={styles.wrapper}>
      <Excalidraw
        ref={(api) => setExcalidrawAPI(api as ExcalidrawImperativeAPI)}
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
    </div>
  );
};

export const MemoizedDraw = memo(
  Draw,
  ({ initialData: { key: prevKey } }, { initialData: { key: nextKey } }) =>
    prevKey === nextKey
);
