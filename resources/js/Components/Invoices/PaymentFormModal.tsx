import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/constants/paymentMethods";
import { useApp } from "@/contexts/AppContext";
import { InvoiceProps } from "@/types/invoice";
import { PaymentProps } from "@/types/payment";
import { DatePicker, Form, Input, InputNumber, message, Modal, Select, Space } from "antd";
import { useForm, useWatch } from "antd/es/form/Form";
import SpaceAddon from "antd/es/space/Addon";
import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  open: boolean;
  onClose: () => void;
  invoice: InvoiceProps;
  payment?: PaymentProps;
};

function PaymentFormModal({ open, onClose, invoice, payment }: Props) {

  const [form] = useForm();
  const watchForm = useWatch([], form) ?? {};
  const { currencySymbol } = useApp();

  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit() {
    setIsSubmitting(true);
    form.validateFields()
      .then(values => {
        let payload = {
          ...values,
          invoice_id: invoice.id,
          payment_date: values.payment_date.format('YYYY-MM-DD'),
        }
        axios.post(route('payments.store'), payload)
          .then(response => {
            message.success(response.data.message || 'Payment recorded successfully');
            handleClose();
          })
          .catch((error) => message.error(error.response?.data?.message || 'Error recording payment'))
          .finally(() => setIsSubmitting(false));
      })
      .catch(() => setIsSubmitting(false));
  }

  function handleClose() {
    form.resetFields();
    onClose();
  }

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title="Record Payment"
      okText="Submit"
      destroyOnHidden
      onOk={handleSubmit}
      confirmLoading={isSubmitting}
    >
      <Form
        form={form}
        layout="vertical"
        className="pt-3"
        initialValues={{
          payment_date: payment ? dayjs(payment.payment_date) : dayjs(),
          amount: invoice?.amount_due || 0,
          payment_method: payment ? payment.payment_method : DEFAULT_PAYMENT_METHOD.value,
          reference: payment ? payment.reference : null,
          notes: payment ? payment.notes : null,
        }}
        onFinish={handleSubmit}
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
              defaultValue={invoice?.amount_due || 0}
              onChange={(value) => form.setFieldsValue({ amount: value })}
            />
          </Space.Compact>
          <div
            className={twMerge(
              "text-xs text-green-600 text-end",
              watchForm.amount >= invoice?.amount_due ? "" : "opacity-0"
            )}
          >
            Invoice will be fully paid.
          </div>
        </Form.Item>
        <Form.Item
          name='payment_method'
          label='Payment Method'
        >
          <Select
            options={PAYMENT_METHODS}
            defaultValue={DEFAULT_PAYMENT_METHOD.value}
          />
        </Form.Item>
        <Form.Item
          name='reference'
          label='Reference Number'
        >
          <Input placeholder="Transaction ID, Check Number, etc." />
        </Form.Item>
        <Form.Item
          name='notes'
          label='Notes'
        >
          <Input.TextArea placeholder="Additional details about the payment" rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default PaymentFormModal;
