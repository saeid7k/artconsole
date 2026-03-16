import { useApp } from "@/contexts/AppContext";
import useTaxes from "@/hooks/useTaxes";
import { useWindow } from "@/hooks/useWindow";
import { InvoiceProps } from "@/types/invoice";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import { Button, Checkbox, DatePicker, Divider, Drawer, Form, Input, InputNumber, message, Popover, Segmented, Select, Space } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import AnimatedContainer from "../AnimatedContainer";
import ContactWidget from "../Contacts/ContactWidget";
import FlexBox from "../Containers/FlexBox";
import StyledCurrency from "../StyledCurrency";
import InvoiceItemsTable from "./InvoiceItemsTable";

type Props = {
  show: boolean;
  onClose: () => void;
  selectedInvoice?: InvoiceProps | null;
}

function InvoiceFormDrawer({ show, onClose, selectedInvoice = null }: Props) {

  const { windowWidth, breakpoint } = useWindow()
  const [form] = Form.useForm()
  const { taxesOptions, defaultTaxValue, taxesQuery } = useTaxes({ enableQuery: show })
  const { currencySymbol } = useApp()

  const [items, setItems] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  // Select Customer

  const contactsQuery = useQuery({
    queryKey: ['contacts'],
    queryFn: () => axios.get(route('contacts.all')).then(res => res.data),
  });

  // Get next invoice number

  const nextInvoiceNumberQuery = useQuery({
    queryKey: ['next-invoice-number'],
    queryFn: () => axios.get(route('invoices.next-number'))
      .then(res => {
        if (!watchForm.number) {
          form.setFieldValue('number', res.data.next_invoice_number);
        }
        return res.data.next_invoice_number;
      }),
    enabled: show && !selectedInvoice,
  })

  // Set default tax

  useEffect(() => {
    if (!selectedInvoice && defaultTaxValue) {
      form.setFieldValue('tax_id', defaultTaxValue);
      const selectedTax = taxesQuery.data?.find(t => t.id === defaultTaxValue);
      if (selectedTax) {
        form.setFieldValue('tax_rate', selectedTax.rate);
      }
    }
  }, [defaultTaxValue, selectedInvoice]);

  // Handlers

  const handleClose = () => {
    form.resetFields();
    setItems([]);
    onClose();
  }

  function handleSubmit() {
    form.validateFields().then(values => {
      if (items.length === 0) {
        message.error('Please add at least one item to the invoice');
        return;
      }
      setSaving(true);
      axios.post(route('invoices.store'), {
        ...values,
        date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : null,
        due_date: values.due_date ? dayjs(values.due_date).format('YYYY-MM-DD') : null,
        items: items.map((item) => ({
          type: item.type,
          artwork_id: item.type === 'artwork' ? item.artwork.id : null,
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          price: item.price,
          taxable: item.taxable,
        }))
      })
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

  const watchForm = Form.useWatch([], form) ?? {}

  // Calculate totals

  function calculateTotals() {
    const taxRate = Number(watchForm.tax_rate) || 0;

    const subtotal = Number(items.reduce((total, item) => total + (Number(item.price) * Number(item.quantity)), 0));
    const taxableSubtotal = Number(items.reduce((total, item) => total + (item.taxable ? (Number(item.price) * Number(item.quantity)) : 0), 0));

    const shippingCost = Number(watchForm.available_extra_costs?.shipping ? (watchForm.shipping_cost || 0) : 0);
    const shippingTaxable = Boolean(watchForm.shipping_taxable);

    const grossTotal = subtotal + shippingCost;
    const taxableTotal = taxableSubtotal + (shippingTaxable ? shippingCost : 0);
    const taxExcludedTotal = grossTotal - taxableSubtotal;

    const discountRatio = watchForm.available_extra_costs?.discount ? (
        watchForm.discount_type === 'percentage' ? (Number(watchForm.discount_rate) / 100) : (Number(watchForm.discount_rate) / grossTotal)
      ) : 0;
    const discountAmount = watchForm.available_extra_costs?.discount ? (
        watchForm.discount_type === 'fixed' ? Number(watchForm.discount_rate) : (Number(watchForm.discount_rate) * grossTotal / 100)
      ) : 0;

    const discountOfTaxable = discountRatio * taxableTotal;
    const discountOfNonTaxable = discountRatio * taxExcludedTotal;

    const tax = (taxableTotal - discountOfTaxable) * (taxRate / 100)
    const total = subtotal + shippingCost - discountAmount + tax;
    form.setFieldsValue({
      subtotal,
      shipping_cost: shippingCost,
      discount_amount: discountAmount,
      tax_amount: tax,
      total,
    });
  }

  useEffect(() => {
    calculateTotals();
  }, [items, watchForm])

  return (
    <>
      <Drawer
        title={`${selectedInvoice ? 'Edit' : 'Create'} Invoice`}
        placement="right"
        size={breakpoint == "xs" ? windowWidth : (Math.min(windowWidth * 0.9, 1280))}
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
            subtotal: 0,
            available_extra_costs: {
              shipping: false,
              discount: false,
            },
            shipping_cost: 0,
            shipping_taxable: true,
            discount_type: 'fixed',
            discount_rate: null,
            discount_amount: 0,
            tax_id: defaultTaxValue || null,
            tax_rate: 0,
            tax_amount: 0,
            total: 0,
            notes: null,
          }}
          onFinish={handleSubmit}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Form.Item
                name="contact_id"
                label="Select Customer"
                className="w-full sm:max-w-[300px]"
                hidden={watchForm.contact_id}
              >
                <Select
                  options={contactsQuery.data?.map((contact: any) => ({ label: contact.full_name, value: contact.id }))}
                  placeholder="Select Customer"
                  showSearch={{ optionFilterProp: ['label', 'value'] }}
                  loading={contactsQuery.isLoading}
                />
              </Form.Item>
              <AnimatedContainer
                condition={!!watchForm.contact_id}
                type="fadeRight"
              >
                <div className="label">Bill to:</div>
                <ContactWidget
                  title="Customer"
                  contact={contactsQuery.data?.find((c: any) => c.id === watchForm.contact_id)}
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
                rules={[
                  { required: true, message: 'Please select the invoice date' },
                ]}
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
          <InvoiceItemsTable
            invoiceForm={form}
            items={items}
            setItems={setItems}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Options */}

            <div className="flex flex-col gap-3 pt-5">
              <div className="flex items-center gap-2">
                <Form.Item
                  name={["available_extra_costs", "shipping"]}
                  valuePropName="checked"
                  className="mb-0"
                >
                  <Checkbox
                    defaultChecked={watchForm.available_extra_costs?.shipping}
                  >Shipping Cost</Checkbox>
                </Form.Item>
                <Form.Item
                  name="shipping_cost"
                  className="mb-0"
                  hidden={!watchForm.available_extra_costs?.shipping}
                >
                  <Space.Compact>
                    <Space.Addon>{currencySymbol}</Space.Addon>
                    <InputNumber
                      value={form.getFieldValue('shipping_cost')}
                      onChange={(value) => form.setFieldValue('shipping_cost', value)}
                    />
                  </Space.Compact>
                </Form.Item>
                <Form.Item
                  name="shipping_taxable"
                  valuePropName="checked"
                  className="mb-0"
                  hidden={!watchForm.available_extra_costs?.shipping}
                >
                  <Checkbox>Taxable</Checkbox>
                </Form.Item>
              </div>
              <div className="flex items-center gap-2">
                <Form.Item
                  name={["available_extra_costs", "discount"]}
                  valuePropName="checked"
                  className="mb-0"
                >
                  <Checkbox
                    defaultChecked={watchForm.available_extra_costs?.discount}
                  >Discount</Checkbox>
                </Form.Item>
                <Form.Item
                  name='discount_type'
                  className="mb-0"
                  hidden={!watchForm.available_extra_costs?.discount}
                >
                  <Segmented
                    options={[
                      { label: '%', value: 'percentage' },
                      { label: currencySymbol, value: 'fixed' },
                    ]}
                    value={form.getFieldValue('discount_type')}
                    onChange={(value) => form.setFieldValue('discount_type', value)}
                  />
                </Form.Item>
                <Form.Item
                  name='discount_rate'
                  className="mb-0"
                  hidden={!watchForm.available_extra_costs?.discount}
                >
                  <InputNumber />
                </Form.Item>
              </div>
              <Form.Item
                name="notes"
                label="Notes"
                className="w-full"
                labelCol={{ span: 24 }}
                rules={[{ max: 500, message: 'Notes cannot exceed 200 characters.' }]}
              >
                <Input.TextArea rows={4} placeholder="Notes to the customer" />
              </Form.Item>
            </div>

            {/* Totals Column */}

            <div className="w-full flex flex-col items-end xl:pe-5 box-border [&_.label]:mb-0">
              <FlexBox alignItems="baseline" justifyContent="end" gap={3} className="w-[200px]" >
                <div className="label">Subtotal:</div>
                <div className="w-[100px] text-end">
                  <StyledCurrency value={watchForm.subtotal} />
                </div>
              </FlexBox>
              <Divider dashed size="small" className="border-soft" />
              <AnimatedContainer condition={watchForm.available_extra_costs?.shipping} type="fadeRight" speed="slow" >
                <FlexBox alignItems="baseline" justifyContent="end" gap={3} className="w-[200px]" >
                  <div className="label">Shipping:</div>
                  <div className="w-[100px] text-end">
                    <StyledCurrency value={watchForm.shipping_cost} />
                  </div>
                </FlexBox>
              </AnimatedContainer>
              {watchForm.available_extra_costs?.shipping && <Divider dashed size="small" className="border-soft" />}
              <AnimatedContainer condition={watchForm.available_extra_costs?.discount} type="fadeRight" speed="slow" >
                <FlexBox alignItems="baseline" justifyContent="end" gap={3} className="w-[200px]" >
                  <div className="label">Discount:</div>
                  <div className="w-[100px] text-end">
                    <StyledCurrency value={watchForm.discount_amount} />
                  </div>
                </FlexBox>
              </AnimatedContainer>
              {watchForm.available_extra_costs?.discount && <Divider dashed size="small" className="border-soft" />}
              {/* TAX Row */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1">
                {!taxesQuery.isLoading && (
                  <Form.Item
                    name="tax_id"
                    label="Tax Type"
                    className="mb-0"
                  >
                    <Select
                      placeholder="Select Tax"
                      options={taxesOptions}
                      popupMatchSelectWidth={false}
                      onChange={(value) => {
                        const selectedTax = taxesQuery.data?.find(t => t.id === value);
                        form.setFieldValue('tax_rate', selectedTax ? selectedTax.rate : 0);
                      }}
                      loading={taxesQuery.isLoading}
                      disabled={taxesOptions.length === 0}
                    />
                  </Form.Item>
                )}
                {taxesOptions.length === 0 && (
                  <Popover
                    content="No tax found. Please create a tax first in gallery settings."
                    children={<HugeiconsIcon icon={InformationCircleIcon} size={16} />}
                  />
                )}
                <Form.Item
                  name="tax_rate"
                  label={null}
                  className="mb-0"
                  hidden
                >
                  <Space.Compact>
                    <Space.Addon>%</Space.Addon>
                    <InputNumber
                      placeholder="Tax Rate"
                      value={watchForm.tax_rate}
                      readOnly
                      className="w-[60px]"
                    />
                  </Space.Compact>
                </Form.Item>
                <FlexBox alignItems="baseline" justifyContent="end" gap={3} className="w-[200px]" >
                  <div className="label">Tax:</div>
                  <div className="w-[100px] text-end">
                    <StyledCurrency value={watchForm.tax_amount} />
                  </div>
                </FlexBox>
              </div>
              <Divider dashed size="small" className="border-soft" />
              <div className="flex justify-end items-baseline gap-3 w-[200px] font-bold text-base" >
                <div className="label">Total:</div>
                <div className="w-[100px] text-end">
                  <StyledCurrency value={watchForm.total} />
                </div>
              </div>

              {/* Hidden Fields */}
              <Form.Item name="subtotal" hidden >
                <Input />
              </Form.Item>
              <Form.Item name="shipping_cost" hidden >
                <Input />
              </Form.Item>
              <Form.Item name="discount_amount" hidden >
                <Input />
              </Form.Item>
              <Form.Item name="tax_amount" hidden >
                <Input />
              </Form.Item>
              <Form.Item name="total" hidden >
                <Input />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Drawer>
    </>
  )
}

export default InvoiceFormDrawer
