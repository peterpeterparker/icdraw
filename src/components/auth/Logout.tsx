import { LogoutOutlined } from "@ant-design/icons";
import { signOut } from "@junobuild/core";
import { Button } from "antd";

export const Logout = () => {
  return (
    <Button
      onClick={signOut}
      shape="circle"
      icon={<LogoutOutlined />}
      aria-label="Logout"
    >
    </Button>
  );
};
