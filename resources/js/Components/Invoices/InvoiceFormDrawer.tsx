import { useWindow } from "@/hooks/useWindow";
import { InvoiceProps } from "@/types/invoice";
import { router } from "@inertiajs/react";
import { Button, Drawer, Form, message, Select } from "antd";
import axios from "axios";
import { useState } from "react";

type Props = {
  show: boolean;
  onClose: () => void;
  selectedInvoice?: InvoiceProps | null;
}

function InvoiceFormDrawer({ show, onClose, selectedInvoice = null }: Props) {

  const { windowWidth, breakpoint } = useWindow()
  const [form] = Form.useForm()

  const [saving, setSaving] = useState(false);

  // Select Customer

  const handleClose = () => {
    onClose();
  }

  function handleSubmit() {
    form.validateFields().then(values => {
      setSaving(true);
      axios.post(route('invoices.store'), values)
        .then(() => {
          message.success('Invoice created successfully');
          form.resetFields();
          onClose();
          router.visit(route('invoices.index'), { preserveState: false })
        })
        .catch((err) => {
          message.error(err?.response?.data?.message || 'Failed to create invoice');
        })
        .finally(() => { setSaving(false) })
    })
      .catch(e => { })
  }

  // Watchers

  const formWatch = Form.useWatch([], form) ?? {}

  return (
    <Drawer
      title={`${selectedInvoice ? 'Edit' : 'Create'} Invoice`}
      placement="right"
      size={breakpoint == "xs" ? windowWidth : (Math.min(windowWidth * 0.9, 1024))}
      onClose={handleClose}
      open={show}
      keyboard={false}
      extra={
        <Button
          type="primary"
          onClick={() => form.submit()}
          loading={saving}
        >
          Save
        </Button>
      }
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={selectedInvoice ? selectedInvoice : {}}
        onFinish={handleSubmit}
      >
        <div>
          <Form.Item
            name="contact_id"
            label="Select Customer"
            className="w-full sm:w-1/2"
          >
            <Select
              options={[]}
              placeholder="Select Contact"
              showSearch={{ optionFilterProp: ['label', 'value'] }}
              // onChange={(value: string) => onChangeArtist(value)}
              // onDeselect={() => clearArtist()}
            />
          </Form.Item>
        </div>
      </Form>
    </Drawer>
  )
}

export default InvoiceFormDrawer
