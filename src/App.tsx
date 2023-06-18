import { initJuno } from "@junobuild/core";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { Auth } from "./components/context/Auth.tsx";
import { Worker } from "./components/context/Worker.tsx";
import { Draw } from "./components/draw/Draw.tsx";
import { Footer } from "./components/misc/Footer.tsx";
import { getScene } from "./services/idb.services.ts";
import { Scene } from "./types/app.ts";
import {Header} from "./components/misc/Header.tsx";

const App = () => {
  const [ready, setReady] = useState(false);

  const [scene, setScene] = useState<Scene | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const existingScene = await getScene();
      console.log(existingScene);
      setScene(existingScene !== undefined ? existingScene : { key: nanoid() });
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
        <Header />

        {scene !== undefined && ready ? (
          <Draw scene={scene} />
        ) : (
          <div>Loading...</div>
        )}

        <Footer />
      </Auth>
    </Worker>
  );
};

export default App;
