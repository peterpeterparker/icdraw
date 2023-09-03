import { createContext, ReactNode, useEffect, useState } from "react";
import {
  getMetadata,
  setMetadata as setMetadataIDB,
} from "../../services/idb.services.ts";
import { Metadata as MetadataType } from "../../types/app.ts";
import { newMetadata } from "../../utils/scene.utils.ts";

export const MetadataContext = createContext<{
  metadata: MetadataType | undefined;
  setMetadata:
    | React.Dispatch<React.SetStateAction<MetadataType | undefined>>
    | undefined;
}>({
  metadata: undefined,
  setMetadata: undefined,
});

export const Metadata = ({ children }: { children?: ReactNode }) => {
  const [metadata, setMetadata] = useState<MetadataType | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const existingMetada = await getMetadata();
      setMetadata(
        existingMetada !== undefined ? existingMetada : newMetadata(),
      );
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (metadata === undefined) {
        return;
      }

      await setMetadataIDB(metadata);
    })();
  }, [metadata]);

  return (
    <MetadataContext.Provider value={{ metadata, setMetadata }}>
      {children}
    </MetadataContext.Provider>
  );
};
