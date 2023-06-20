import { EditOutlined } from "@ant-design/icons";
import { Button, Input, Modal, message } from "antd";
import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { MetadataContext } from "../context/Metadata.tsx";
import { WorkerContext } from "../context/Worker.tsx";

export const Edit = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [sceneName, setSceneName] = useState<string | undefined>(undefined);

  const { metadata, setMetadata } = useContext(MetadataContext);
  const { busy } = useContext(WorkerContext);

  const showModal = () => setOpen(true);

  useEffect(() => {
    if (!open || metadata === undefined) {
      return;
    }

    setSceneName(metadata.name);
  }, [open, metadata]);

  const handleOk = async () => {
    if (sceneName === undefined || sceneName === "") {
      await messageApi.open({
        type: "error",
        content: "Scene name is undefined or empty.",
      });
      return;
    }

    if (metadata === undefined) {
      await messageApi.open({
        type: "error",
        content: "The scene is undefined.",
      });
      return;
    }

    setConfirmLoading(true);

    setMetadata?.({
      ...metadata,
      name: sceneName,
    });

    setOpen(false);

    // Reset list
    setSceneName(undefined);

    setConfirmLoading(false);
  };

  const handleCancel = () => setOpen(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSceneName(e.target.value);

  return (
    <>
      {contextHolder}

      <Button
        onClick={showModal}
        shape="circle"
        icon={<EditOutlined />}
        aria-label="Edit scene name"
        disabled={busy}
        className="header"
      ></Button>

      <Modal
        title="Edit scene name"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okButtonProps={{
          disabled: sceneName === "",
        }}
        cancelButtonProps={{
          disabled: confirmLoading,
        }}
      >
        {sceneName !== undefined ? (
          <Input
            placeholder="A name for your scene"
            status={sceneName === "" ? "error" : ""}
            defaultValue={sceneName}
            onChange={onChange}
          />
        ) : undefined}
      </Modal>
    </>
  );
};
