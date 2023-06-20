import { initJuno } from "@junobuild/core";
import { ConfigProvider } from "antd";
import { useEffect, useState } from "react";
import { Scene } from "./components/Scene.tsx";
import { Auth } from "./components/context/Auth.tsx";
import { Metadata } from "./components/context/Metadata.tsx";
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
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#000000",
        },
      }}
    >
      <Auth>
        <Worker>
          <Metadata>
            <Scene ready={ready} />
          </Metadata>
        </Worker>
      </Auth>
    </ConfigProvider>
  );
};

export default App;
