import { LogoutOutlined } from "@ant-design/icons";
import { signOut } from "@junobuild/core";
import { Button } from "antd";
import { useContext } from "react";
import { WorkerContext } from "../context/Worker.tsx";

export const Logout = () => {
  const { busy } = useContext(WorkerContext);

  return (
    <Button
      onClick={signOut}
      shape="circle"
      icon={<LogoutOutlined />}
      aria-label="Logout"
      disabled={busy}
      className="header"
    ></Button>
  );
};
