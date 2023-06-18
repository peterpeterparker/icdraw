import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import styles from "./Spinner.module.scss";

export const Spinner = () => (
  <div className={styles.spinner}>
    <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} />
  </div>
);
