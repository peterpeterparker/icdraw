import { ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types/types";
import { initJuno } from "@junobuild/core";
import { useEffect, useState } from "react";
import { Auth } from "./components/Auth.tsx";
import { Draw } from "./components/Draw.tsx";
import { Worker } from "./components/context/Worker.tsx";
import { getScene } from "./services/idb.services.ts";

const App = () => {
  const [ready, setReady] = useState(false);

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

  useEffect(() => {
    (async () => {
      await initJuno({
        satelliteId: "fqotu-wqaaa-aaaal-acp3a-cai",
      });

      setReady(true);
    })();
  }, []);

  return (
    <Worker>
      <Auth>
        {scene !== undefined && ready ? (
          <Draw scene={scene} />
        ) : (
          <div>Loading...</div>
        )}
      </Auth>
    </Worker>
  );
};

export default App;
