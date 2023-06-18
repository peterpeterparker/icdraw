import { FolderOpenOutlined } from "@ant-design/icons";
import { Doc, listDocs } from "@junobuild/core";
import { Button, List, Modal, Radio, RadioChangeEvent, message } from "antd";
import { useContext, useEffect, useState } from "react";
import { JunoScene } from "../../types/juno.ts";
import { SceneContext } from "../context/Scene.tsx";

export const Open = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [items, setItems] = useState<Doc<JunoScene>[]>([]);
  const [selected, setSelected] = useState<Doc<JunoScene> | undefined>(
    undefined
  );

  const { setScene } = useContext(SceneContext);

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

    setConfirmLoading(true);

    const { key, data } = selected;

    setScene?.({
      key,
      ...data,
    });

    setOpen(false);

    // Reset list
    setItems([]);
    setSelected(undefined);

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