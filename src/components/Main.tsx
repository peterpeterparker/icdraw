import {useContext, useEffect} from "react";
import { SceneContext } from "./context/Scene.tsx";
import { Draw } from "./draw/Draw.tsx";
import { Footer } from "./misc/Footer.tsx";
import { Header } from "./misc/Header.tsx";
import { Spinner } from "./misc/Spinner.tsx";

export const Main = ({ ready }: { ready: boolean }) => {
  const { scene } = useContext(SceneContext);

  useEffect(() => {
    if (scene === undefined) {
      return;
    }

    document.title = scene.name;
  }, [scene]);

  return (
    <>
      {scene !== undefined && ready ? (
        <>
          <Header />

          <Draw scene={scene} />

          <Footer />
        </>
      ) : (
        <Spinner />
      )}
    </>
  );
};
