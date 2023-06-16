import { ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types/types";
import { useEffect, useState } from "react";
import { ICDraw } from "./components/ICDraw.tsx";
import { getScene } from "./services/idb.services.ts";

const App = () => {
  const [scene, setScene] = useState<ExcalidrawInitialDataState | undefined>(
    undefined
  );

  useEffect(() => {
    (async () => {
      const existingScene = await getScene();
      setScene({
        ...(existingScene !== undefined && existingScene),
        scrollToContent: true,
      });
    })();
  }, []);

  return (
    <>
      {scene !== undefined ? <ICDraw scene={scene} /> : <div>Loading...</div>}
    </>
  );
};

export default App;
