import { ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types/types";
import { useEffect, useState } from "react";
import { Draw } from "./components/Draw.tsx";
import { getScene } from "./services/idb.services.ts";
import {Auth} from "./components/Auth.tsx";
import {initJuno} from "@junobuild/core";

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
    <Auth>
      {scene !== undefined && ready ? <Draw scene={scene} /> : <div>Loading...</div>}
    </Auth>
  );
};

export default App;
