import { useApp } from "@/contexts/AppContext";
import { InvoiceProps } from "@/types/invoice";
import { DatePicker, Form, InputNumber, Modal, Space } from "antd";
import { useForm } from "antd/es/form/Form";
import SpaceAddon from "antd/es/space/Addon";
import Compact from "antd/es/space/Compact";

type Props = {
  open: boolean;
  onClose: () => void;
  invoice: InvoiceProps;
};

function PaymentFormModal({ open, onClose, invoice }: Props) {

  const [form] = useForm();
  const { currencySymbol } = useApp();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Record Payment"
      okText="Submit"
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        className="pt-3"
        initialValues={{
          amount: invoice?.total,
        }}
      >
        <Form.Item
          name='payment_date'
          label='Payment Date'
        >
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item
          name='amount'
          label='Amount'
          rules={[{ required: true, message: 'Please enter the payment amount' }]}
        >
          <Space.Compact className="w-full">
            <SpaceAddon>{currencySymbol}</SpaceAddon>
            <InputNumber
              className="w-full"
              precision={2}
              defaultValue={invoice?.total}
              onChange={(value) => form.setFieldsValue({ amount: value })}
            />
          </Space.Compact>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default PaymentFormModal;
