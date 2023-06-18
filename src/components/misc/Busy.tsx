import { SyncOutlined } from "@ant-design/icons";
import { useContext } from "react";
import { WorkerContext } from "../context/Worker.tsx";
import styles from "./Busy.module.scss";

export const Busy = () => {
  const { busy } = useContext(WorkerContext);

  return <div className={styles.busy}>{busy ? <SyncOutlined spin /> : undefined}</div>;
};
