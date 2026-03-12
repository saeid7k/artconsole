import { useWindow } from "@/hooks/useWindow";
import { InvoiceProps } from "@/types/invoice";
import { router } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import { Button, DatePicker, Drawer, Form, Input, message, Select } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import ContactWidget from "../Contacts/ContactWidget";
import { AnimatePresence, motion } from "framer-motion";
import AnimatedContainer from "../AnimatedContainer";

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

  const contactsQuery = useQuery({
    queryKey: ['contacts'],
    queryFn: () => axios.get(route('contacts.all')).then(res => res.data),
  });

  // Get next invoice number

  const nextInvoiceNumberQuery = useQuery({
    queryKey: ['next-invoice-number'],
    queryFn: () => axios.get(route('invoices.next-number')).then(res => res.data.next_invoice_number),
    enabled: show && !selectedInvoice,
  })

  useEffect(() => {
    if (nextInvoiceNumberQuery.data && !selectedInvoice) {
      form.setFieldValue('number', nextInvoiceNumberQuery.data);
    }
  }, [nextInvoiceNumberQuery.data])

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
        layout="horizontal"
        initialValues={selectedInvoice ? selectedInvoice : {
          contact_id: null,
          number: '',
          date: null,
          due_date: null,
        }}
        onFinish={handleSubmit}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Form.Item
              name="contact_id"
              label="Select Customer"
              className="w-full sm:max-w-[300px]"
              hidden={formWatch.contact_id}
            >
              <Select
                options={contactsQuery.data?.map((contact: any) => ({ label: contact.full_name, value: contact.id }))}
                placeholder="Select Customer"
                showSearch={{ optionFilterProp: ['label', 'value'] }}
                loading={contactsQuery.isLoading}
              />
            </Form.Item>
            <AnimatedContainer
              condition={!!formWatch.contact_id}
              type="fadeRight"
            >
              <ContactWidget
                title="Customer"
                contact={contactsQuery.data?.find((c: any) => c.id === formWatch.contact_id)}
                showAddress
                unsetFunction={() => form.setFieldValue('contact_id', null)}
              />
            </AnimatedContainer>
          </div>
          <div className="w-full sm:max-w-[300px] flex flex-col items-end justify-self-end">
            <Form.Item
              name="number"
              label="Number"
              className="w-full"
              labelCol={{ span: 8 }}
              rules={[
                { required: true, message: 'Please enter the invoice number' },
                { max: 100, message: 'Invoice number cannot exceed 100 characters' },
              ]}
            >
              <Input
                placeholder="Invoice Number"
                onChange={(e) => {
                  const value = e.target.value;
                  form.setFieldValue('number', value.replace(/\D/g, ''));
                }}
              />
            </Form.Item>
            <Form.Item
              name="date"
              label="Invoice Date"
              className="w-full"
              labelCol={{ span: 8 }}
            >
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item
              name="due_date"
              label="Due Date"
              className="w-full"
              labelCol={{ span: 8 }}
            >
              <DatePicker className="w-full" />
            </Form.Item>
          </div>
        </div>
      </Form>
    </Drawer>
  )
}

export default InvoiceFormDrawer
