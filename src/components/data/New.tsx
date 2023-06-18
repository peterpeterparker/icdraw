import { FileAddOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import { useContext, useState } from "react";
import { newScene } from "../../utils/scene.utils.ts";
import { SceneContext } from "../context/Scene.tsx";
import {WorkerContext} from "../context/Worker.tsx";

export const New = () => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const { setScene } = useContext(SceneContext);
  const { busy } = useContext(WorkerContext);

  const showPopconfirm = () => setOpen(true);

  const handleOk = () => {
    setConfirmLoading(true);

    setScene?.(newScene());

    setOpen(false);
    setConfirmLoading(false);
  };

  const handleCancel = () => setOpen(false);

  return (
    <Popconfirm
      title="New"
      description="Start a new scene?"
      open={open}
      onConfirm={handleOk}
      okButtonProps={{ loading: confirmLoading }}
      onCancel={handleCancel}
      cancelButtonProps={{
        disabled: confirmLoading,
      }}
    >
      <Button
        onClick={showPopconfirm}
        shape="circle"
        icon={<FileAddOutlined />}
        aria-label="New"
        disabled={busy}
      ></Button>
    </Popconfirm>
  );
};
