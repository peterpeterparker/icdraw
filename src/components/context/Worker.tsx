import { createContext, ReactNode, useEffect, useState } from "react";

export const WorkerContext = createContext<{
  worker: Worker | undefined;
}>({
  worker: undefined,
});

export const Worker = ({ children }: { children?: ReactNode }) => {
  const [worker, setWorker] = useState<Worker | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const Worker = await import("../../workers/worker?worker");
      setWorker(new Worker.default());
    })();
  }, []);

  return (
    <WorkerContext.Provider value={{ worker }}>
      {children}
    </WorkerContext.Provider>
  );
};
