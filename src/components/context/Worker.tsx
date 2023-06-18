import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  PostMessage,
  PostMessageDataResponse,
} from "../../types/post-message.ts";
import { AuthContext } from "./Auth.tsx";

export const WorkerContext = createContext<{
  worker: Worker | undefined;
  busy: boolean;
}>({
  worker: undefined,
  busy: false,
});

export const Worker = ({ children }: { children?: ReactNode }) => {
  const [worker, setWorker] = useState<Worker | undefined>(undefined);
  const [busy, setBusy] = useState<boolean>(false);

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

      if (w !== undefined) {
        w.onmessage = ({
          data,
        }: MessageEvent<PostMessage<PostMessageDataResponse>>) => {
          const { msg } = data;
          setBusy(msg === "busy");
        };
      }
    })();

    return () => worker?.postMessage({ msg: "stop" });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <WorkerContext.Provider value={{ worker, busy }}>
      {children}
    </WorkerContext.Provider>
  );
};
