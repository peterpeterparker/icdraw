import { EditOutlined } from "@ant-design/icons";
import { Button, Input, Modal, message } from "antd";
import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { SceneContext } from "../context/Scene.tsx";
import {WorkerContext} from "../context/Worker.tsx";

export const Edit = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [sceneName, setSceneName] = useState<string | undefined>(undefined);

  const { scene, setScene } = useContext(SceneContext);
  const { busy } = useContext(WorkerContext);

  const showModal = () => setOpen(true);

  useEffect(() => {
    if (!open || scene === undefined) {
      return;
    }

    setSceneName(scene.name);
  }, [open, scene]);

  const handleOk = async () => {
    if (sceneName === undefined || sceneName === "") {
      await messageApi.open({
        type: "error",
        content: "Scene name is undefined or empty.",
      });
      return;
    }

    if (scene === undefined) {
      await messageApi.open({
        type: "error",
        content: "The scene is undefined.",
      });
      return;
    }

    setConfirmLoading(true);

    setScene?.({
      ...scene,
      name: sceneName,
      lastChange: Date.now()
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
