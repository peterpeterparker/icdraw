import { createContext, ReactNode, useEffect, useState } from "react";
import { getScene } from "../../services/idb.services.ts";
import { Scene as SceneType } from "../../types/app.ts";
import { newScene } from "../../utils/scene.utils.ts";

export const SceneContext = createContext<{
  scene: SceneType | undefined;
  setScene:
    | React.Dispatch<React.SetStateAction<SceneType | undefined>>
    | undefined;
}>({
  scene: undefined,
  setScene: undefined,
});

export const Scene = ({ children }: { children?: ReactNode }) => {
  const [scene, setScene] = useState<SceneType | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const existingScene = await getScene();
      setScene(existingScene !== undefined ? existingScene : newScene());
    })();
  }, []);

  return (
    <SceneContext.Provider value={{ scene, setScene }}>
      {children}
    </SceneContext.Provider>
  );
};
