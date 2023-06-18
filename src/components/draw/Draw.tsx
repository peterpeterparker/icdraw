import { Excalidraw } from "@excalidraw/excalidraw";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import type { AppState, BinaryFiles } from "@excalidraw/excalidraw/types/types";
import { User } from "@junobuild/core";
import { useContext, useRef } from "react";
import { setScene } from "../../services/idb.services.ts";
import { Scene } from "../../types/app.ts";
import { debounce } from "../../utils/debounce.utils.ts";
import { Header } from "../misc/Header.tsx";
import { AuthContext } from "../context/Auth.tsx";
import { WorkerContext } from "../context/Worker.tsx";
import styles from "./Draw.module.scss";

const debounceSync = debounce(
  ({ worker, user }: { worker: Worker; user: User | undefined | null }) =>
    worker?.postMessage({
      msg: "sync",
      data: {
        user,
      },
    }), 500
);

export const Draw = ({ scene }: { scene: Scene }) => {
  const excalidrawRef = useRef(null);

  const { worker } = useContext(WorkerContext);
  const { user } = useContext(AuthContext);

  const onChange = async (
    elements: readonly ExcalidrawElement[],
    appState: AppState,
    files: BinaryFiles
  ) => {
    const updatedScene: Scene = {
      key: scene.key,
      elements,
      appState,
      files,
    };

    await setScene(updatedScene);

    debounceSync({ worker, user });
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
        renderTopRightUI={() => <Header />}
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
