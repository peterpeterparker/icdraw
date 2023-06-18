import { Excalidraw } from "@excalidraw/excalidraw";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import type { AppState, BinaryFiles } from "@excalidraw/excalidraw/types/types";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { memo, useContext, useEffect, useState } from "react";
import { setScene as setSceneIDB } from "../../services/idb.services.ts";
import { Scene } from "../../types/app.ts";
import { SceneContext } from "../context/Scene.tsx";
import styles from "./Draw.module.scss";

export const Draw = ({ scene }: { scene: Scene }) => {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  const { setScene } = useContext(SceneContext);

  const onChange = async (
    elements: readonly ExcalidrawElement[],
    appState: AppState,
    files: BinaryFiles
  ) => {
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
    if (excalidrawAPI === null) {
      return;
    }

    excalidrawAPI.updateScene({
      elements: scene.elements,
    });
  }, [scene]);

  return (
    <div className={styles.wrapper}>
      <Excalidraw
        ref={(api) => setExcalidrawAPI(api as ExcalidrawImperativeAPI)}
        initialData={{
          ...scene,
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
  ({ scene: { key: prevKey } }, { scene: { key: nextKey } }) =>
    prevKey === nextKey
);
