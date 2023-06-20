import { useContext, useEffect } from "react";
import { MetadataContext } from "./context/Metadata.tsx";
import { MemoizedDraw } from "./draw/Draw.tsx";
import { Footer } from "./misc/Footer.tsx";
import { Header } from "./misc/Header.tsx";
import { Spinner } from "./misc/Spinner.tsx";

export const Scene = ({ ready }: { ready: boolean }) => {
  const { metadata } = useContext(MetadataContext);

  useEffect(() => {
    if (metadata === undefined) {
      return;
    }

    document.title = metadata.name;
  }, [metadata]);

  return (
    <>
      {metadata !== undefined && ready ? (
        <>
          <Header />

          <MemoizedDraw />

          <Footer />
        </>
      ) : (
        <Spinner />
      )}
    </>
  );
};
