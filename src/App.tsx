import { initJuno } from "@junobuild/core";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { Auth } from "./components/context/Auth.tsx";
import { Worker } from "./components/context/Worker.tsx";
import { Draw } from "./components/draw/Draw.tsx";
import { Footer } from "./components/misc/Footer.tsx";
import { Header } from "./components/misc/Header.tsx";
import { getScene } from "./services/idb.services.ts";
import { Scene } from "./types/app.ts";
import {Spinner} from "./components/misc/Spinner.tsx";

const App = () => {
  const [ready, setReady] = useState(false);

  const [scene, setScene] = useState<Scene | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const existingScene = await getScene();
      setScene(
        existingScene !== undefined
          ? existingScene
          : { key: nanoid(), lastChange: undefined }
      );
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
      <Worker>
        {scene !== undefined && ready ? (
          <>
            <Header />

            <Draw scene={scene} />

            <Footer />
          </>
        ) : (
          <Spinner />
        )}
      </Worker>
    </Auth>
  );
};

export default App;
