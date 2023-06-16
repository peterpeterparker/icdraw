import { Excalidraw } from "@excalidraw/excalidraw";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import type {
  AppState,
  BinaryFiles,
  ExcalidrawInitialDataState,
} from "@excalidraw/excalidraw/types/types";
import { useRef } from "react";
import { setScene } from "../services/idb.services.ts";
import styles from "./Draw.module.scss";
import { LoginLogout } from "./LoginLogout.tsx";

export const Draw = ({ scene }: { scene: ExcalidrawInitialDataState }) => {
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
        renderTopRightUI={() => <LoginLogout />}
      />
    </main>
  );
};
