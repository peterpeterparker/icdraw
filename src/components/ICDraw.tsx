import { Excalidraw } from "@excalidraw/excalidraw";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import type {
  AppState,
  BinaryFiles,
  ExcalidrawInitialDataState,
} from "@excalidraw/excalidraw/types/types";
import { useRef } from "react";
import { setScene } from "../services/idb.services.ts";
import styles from "./ICDraw.module.scss";

export const ICDraw = ({scene}: {scene: ExcalidrawInitialDataState}) => {
  const excalidrawRef = useRef(null);

  const onChange = async (
    elements: readonly ExcalidrawElement[],
    appState: AppState,
    files: BinaryFiles
  ) => {
    const scene: ExcalidrawInitialDataState = {
      elements,
      appState,
      files,
    };

    await setScene(scene);
  };

  return (
    <main className={styles.wrapper}>
      <Excalidraw
        ref={excalidrawRef}
        initialData={scene}
        theme="dark"
        onChange={onChange}
        renderTopRightUI={() => {
          return (
            <button
              style={{
                background: "#70b1ec",
                border: "none",
                color: "#fff",
                width: "max-content",
                fontWeight: "bold",
              }}
              onClick={() => window.alert("This is dummy top right UI")}
            >
              Click me
            </button>
          );
        }}
      />
    </main>
  );
};
