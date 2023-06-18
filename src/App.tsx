import { initJuno } from "@junobuild/core";
import { useEffect, useState } from "react";
import { Main } from "./components/Main.tsx";
import { Auth } from "./components/context/Auth.tsx";
import { Scene } from "./components/context/Scene.tsx";
import { Worker } from "./components/context/Worker.tsx";

const App = () => {
  const [ready, setReady] = useState(false);

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
        <Scene>
          <Main ready={ready} />
        </Scene>
      </Worker>
    </Auth>
  );
};

export default App;
