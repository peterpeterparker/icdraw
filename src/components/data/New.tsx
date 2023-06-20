import { FileAddOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import { useContext, useState } from "react";
import { newMetadata, newScene, reloadScene } from "../../utils/scene.utils.ts";
import { MetadataContext } from "../context/Metadata.tsx";
import { WorkerContext } from "../context/Worker.tsx";

export const New = () => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const { setMetadata } = useContext(MetadataContext);
  const { busy } = useContext(WorkerContext);

  const showPopconfirm = () => setOpen(true);

  const handleOk = () => {
    setConfirmLoading(true);

    setMetadata?.(newMetadata());

    reloadScene(newScene());

    setOpen(false);
    setConfirmLoading(false);
  };

  const handleCancel = () => setOpen(false);

  return (
    <div>
      <Button
        onClick={showPopconfirm}
        shape="circle"
        icon={<FileAddOutlined />}
        aria-label="New"
        disabled={busy}
        className="header"
      ></Button>
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
      ></Popconfirm>
    </div>
  );
};
