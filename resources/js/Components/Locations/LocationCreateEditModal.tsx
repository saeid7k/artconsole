import { LocationProps } from "@/types/location";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Form, Modal } from "antd";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode?: 'create' | 'edit';
  location?: LocationProps;
}

function LocationCreateEditModal({ open, setOpen, mode = 'create', location }: Props) {

  const [form] = Form.useForm();

  function handleClose() {
    setOpen(false)
  }

  function handleSave() {
    // Save logic here
    setOpen(false)
  }

  return (
    <Modal
      title={mode === 'create' ? "Create Location" : "Edit Location"}
      open={open}
      onCancel={handleClose}
      closeIcon={<HugeiconsIcon icon={Cancel01Icon} size={32} />}
      // footer={null}
      // width={800}
      okText="Save"
      onOk={handleSave}
      afterClose={handleClose}
      // afterOpenChange={() => form.resetFields()}
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={location ? location : {}}
        // validateTrigger="onBlur"
      >
        I am an {mode} location form.
      </Form>
    </Modal>
  )
}

export default LocationCreateEditModal;
