import { FolderOpenOutlined } from "@ant-design/icons";
import { Doc, listDocs } from "@junobuild/core";
import { Button, List, Modal, Radio, RadioChangeEvent, message } from "antd";
import { useContext, useEffect, useState } from "react";
import { JunoScene } from "../../types/juno.ts";
import { SceneContext } from "../context/Scene.tsx";
import { WorkerContext } from "../context/Worker.tsx";
import {loadAssets} from "../../services/assets.services.ts";

export const Open = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [items, setItems] = useState<Doc<JunoScene>[]>([]);
  const [selected, setSelected] = useState<Doc<JunoScene> | undefined>(
    undefined
  );

  const { setScene } = useContext(SceneContext);
  const { busy } = useContext(WorkerContext);

  const showModal = () => setOpen(true);

  const list = async () => {
    const { items } = await listDocs<JunoScene>({
      collection: "scenes",
      filter: {},
    });

    setItems(items);
  };

  useEffect(() => {
    (async () => {
      if (!open) {
        return;
      }

      await list();
    })();
  }, [open]);

  const handleOk = async () => {
    if (selected === undefined) {
      await messageApi.open({
        type: "error",
        content: "No scene selected.",
      });
      return;
    }

    try {
      setConfirmLoading(true);

      const { key, data } = selected;

      const files = await loadAssets(key);

      setScene?.({
        key,
        files,
        ...data,
      });

      setOpen(false);

      // Reset list
      setItems([]);
      setSelected(undefined);
    } catch (err: unknown) {
      console.error(err);

      await messageApi.open({
        type: "error",
        content: "Cannot load scene.",
      });
    }

    setConfirmLoading(false);
  };

  const handleCancel = () => setOpen(false);

  const onChange = (e: RadioChangeEvent) => setSelected(e.target.value);

  return (
    <>
      {contextHolder}

      <Button
        onClick={showModal}
        shape="circle"
        icon={<FolderOpenOutlined />}
        aria-label="Open a scene"
        disabled={busy}
      ></Button>

      <Modal
        title="Open a scene saved on chain"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okButtonProps={{
          disabled: selected === undefined,
        }}
        cancelButtonProps={{
          disabled: confirmLoading,
        }}
      >
        <Radio.Group
          onChange={onChange}
          value={selected}
          disabled={confirmLoading}
        >
          <List
            dataSource={items}
            renderItem={(item) => (
              <List.Item>
                <Radio value={item}>{item.data.name}</Radio>
              </List.Item>
            )}
          />
        </Radio.Group>
      </Modal>
    </>
  );
};
