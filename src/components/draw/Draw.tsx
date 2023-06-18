import { Excalidraw } from "@excalidraw/excalidraw";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import type { AppState, BinaryFiles } from "@excalidraw/excalidraw/types/types";
import { useRef } from "react";
import { setScene } from "../../services/idb.services.ts";
import { Scene } from "../../types/app.ts";
import styles from "./Draw.module.scss";

export const Draw = ({ scene }: { scene: Scene }) => {
  const excalidrawRef = useRef(null);

  const onChange = async (
    elements: readonly ExcalidrawElement[],
    appState: AppState,
    files: BinaryFiles
  ) => {
    const updatedScene: Scene = {
      key: scene.key,
      lastChange: Date.now(),
      elements,
      appState,
      files,
    };

    await setScene(updatedScene);
  };

  return (
    <div className={styles.wrapper}>
      <Excalidraw
        ref={excalidrawRef}
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
