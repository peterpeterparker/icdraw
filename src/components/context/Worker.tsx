import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContext } from "./Auth.tsx";

export const WorkerContext = createContext<{
  worker: Worker | undefined;
}>({
  worker: undefined,
});

export const Worker = ({ children }: { children?: ReactNode }) => {
  const [worker, setWorker] = useState<Worker | undefined>(undefined);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      let w: Worker | undefined = worker;

      if (w === undefined) {
        const Worker = await import("../../workers/worker?worker");
        w = new Worker.default();

        setWorker(w);
      }

      w?.postMessage({
        msg: user !== undefined && user !== null ? "start" : "stop",
        data: {
          user,
        },
      });
    })();

    return () => worker?.postMessage({ msg: "stop" });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <WorkerContext.Provider value={{ worker }}>
      {children}
    </WorkerContext.Provider>
  );
};
