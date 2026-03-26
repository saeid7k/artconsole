import { useApp } from "@/contexts/AppContext";
import useTaxes from "@/hooks/useTaxes";
import { useWindow } from "@/hooks/useWindow";
import ContactFormDrawer from "@/Pages/Contacts/Partials/ContactFormDrawer";
import { PageProps } from "@/types";
import { GalleryProps } from "@/types/gallery";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router, usePage } from "@inertiajs/react";
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
import PaymentFormModal from "./PaymentFormModal";

type Props = {
  show: boolean;
  onClose: () => void;
  invoiceId?: number | null;
  selectedArtworksIds?: number[];
}

function InvoiceFormDrawer({ show, onClose, invoiceId = null, selectedArtworksIds = [] }: Props) {

  const gallery = usePage<PageProps>().props?.current_gallery as GalleryProps;
  const { currencySymbol } = useApp()
  const { windowWidth, breakpoint } = useWindow()
  const [form] = Form.useForm()
  const watchForm = Form.useWatch([], form) ?? {}
  const { taxesOptions, defaultTaxId, taxesQuery } = useTaxes({ enableQuery: show })

  const [items, setItems] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Fetch Editing Invoice

  const editingInvoiceQuery = useQuery({
    queryKey: ['editing-invoice', invoiceId],
    queryFn: () => axios.get(route('invoices.get', { invoice: invoiceId })).then(res => res.data),
    enabled: !!invoiceId && show,
  })

  useEffect(() => {
    if (editingInvoiceQuery.data) {
      const invoiceData = editingInvoiceQuery.data;
      form.setFieldsValue({
        contact_id: invoiceData.contact_id,
        number: invoiceData.number,
        date: invoiceData.date ? dayjs(invoiceData.date) : null,
        due_date: invoiceData.due_date ? dayjs(invoiceData.due_date) : null,
        available_extra_costs: {
          shipping: invoiceData.shipping_cost > 0,
          discount: invoiceData.discount_amount > 0,
        },
        shipping_cost: invoiceData.shipping_cost,
        shipping_taxable: invoiceData.shipping_taxable,
        discount_type: invoiceData.discount_type || 'fixed',
        discount_rate: invoiceData.discount_rate || null,
        discount_amount: invoiceData.discount_amount || 0,
        tax_id: invoiceData.tax_id || null,
        tax_rate: invoiceData.tax_rate || 0,
        tax_amount: invoiceData.tax_amount || 0,
        notes: invoiceData.notes || null,
      });
      setItems(invoiceData.items || []);
    } else {
      form.resetFields();
      setItems([]);
    }
  }, [editingInvoiceQuery.data, show])

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
    enabled: show && !invoiceId,
  })

  // Set default tax

  useEffect(() => {
    if (!invoiceId && defaultTaxId && !watchForm.tax_id) {
      const defaultTax = taxesQuery.data?.find(t => t.id === defaultTaxId);
      if (defaultTax) {
        form.setFieldValue('tax_id', defaultTaxId);
        form.setFieldValue('tax_rate', defaultTax.rate);
      }
    }
  }, [defaultTaxId, watchForm, invoiceId]);

  // Handlers

  const handleClose = () => {
    form.resetFields();
    if (!invoiceId) setItems([]);
    onClose();
  }

  function handleSubmit() {
    form.validateFields().then(values => {
      if (items.length === 0) {
        message.error('Please add at least one item to the invoice');
        return;
      }
      setSaving(true);
      let routeName = invoiceId ? 'invoices.update' : 'invoices.store';
      let payload = {
        ...values,
        gallery_id: gallery.id,
        date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : null,
        due_date: values.due_date ? dayjs(values.due_date).format('YYYY-MM-DD') : null,
        items: items.map((item) => ({
          id: item.id,
          type: item.type,
          artwork_id: item.type === 'artwork' ? item.artwork.id : null,
          name: item.name,
          description: item.description,
          quantity: Number(item.quantity),
          price: Number(item.price),
          taxable: item.taxable,
        })),
        tax_rate: Number(values.tax_rate) || 0,
      }
      if (invoiceId) {
        axios.put(route(routeName, { invoice: invoiceId }), payload)
          .then(() => {
            message.success('Invoice updated successfully');
            form.resetFields();
            onClose();
            router.visit(route('invoices.index'), { preserveState: false })
          })
          .catch((err) => {
            message.error(err?.response?.data?.message || 'Failed to create invoice');
          })
          .finally(() => { setSaving(false) })
      } else {
        axios.post(route(routeName), payload)
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
      }
    })
      .catch(e => { })
  }

  // Calculate totals

  function calculateTotals() {
    const taxRate = Number(watchForm.tax_rate) || 0;

    const subtotal = Number(items.reduce((total, item) => total + (Number(item.price) * Number(item.quantity)), 0));
    const taxableSubtotal = Number(items.reduce((total, item) => total + (item.taxable ? (Number(item.price) * Number(item.quantity)) : 0), 0));

    const shippingCost = Number(watchForm.available_extra_costs?.shipping ? (watchForm.shipping_cost || 0) : 0);
    const shippingTaxable = Boolean(watchForm.shipping_taxable);

    const grossTotal = subtotal + shippingCost;
    const taxableTotal = taxableSubtotal + (shippingTaxable ? shippingCost : 0);

    const discountRate = Number(watchForm.discount_rate) || 0;
    const discountRatio = watchForm.available_extra_costs?.discount ? (
        watchForm.discount_type === 'percentage' ? (discountRate / 100) : (discountRate / grossTotal)
      ) : 0;
    const discountAmount = watchForm.discount_type === 'percentage' ? discountRatio * grossTotal : discountRate;

    const discountOfTaxable = discountRatio * taxableTotal;

    const tax = (taxableTotal - discountOfTaxable) * (taxRate / 100)
    const total = grossTotal - discountAmount + tax;
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

  // Set New Contact

  const handleCloseContactForm = async () => {
    setShowContactForm(false);
    await axios.get(route('contacts.fresh'))
      .then(res => {
        if (res.data.id && !watchForm.contact_id) {
          form.setFieldValue('contact_id', res.data.id);
        }
      })
    contactsQuery.refetch();
  }

  return (
    <>
      <Drawer
        title={`${invoiceId ? 'Edit' : 'Create'} Invoice`}
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
        zIndex={1000}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="horizontal"
          initialValues={{
            contact_id: null,
            number: '',
            date: dayjs(),
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
            tax_id: null,
            tax_rate: 0,
            tax_amount: 0,
            total: 0,
            notes: null,
          }}
          onFinish={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-3">
              <div className="flex flex-wrap gap-2">
                <Form.Item
                  name="contact_id"
                  label="Select Customer"
                  className="w-full sm:max-w-[300px]"
                  hidden={watchForm.contact_id}
                >
                  <Select
                    options={contactsQuery.data?.map((contact: any) => ({ label: contact.full_name, value: contact.id }))}
                    placeholder="Select from contacts"
                    showSearch={{ optionFilterProp: ['label', 'value'] }}
                    loading={contactsQuery.isLoading}
                  />
                </Form.Item>
                <AnimatedContainer
                  condition={!watchForm.contact_id}
                  type="fadeRight"
                  speed="slowest"
                  onlyInitial
                >
                  <Button
                    type="dashed"
                    size="middle"
                    className="text-ghost"
                    onClick={() => setShowContactForm(true)}
                  >
                    + New Contact
                  </Button>
                </AnimatedContainer>
              </div>
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
                className="w-full mb-3"
                labelCol={{ span: 8 }}
                rules={[
                  { required: true, message: 'Please enter the invoice number' },
                  { max: 100, message: 'Invoice number cannot exceed 100 characters' },
                ]}
              >
                <Space.Compact>
                  <Space.Addon className="whitespace-nowrap">{gallery?.invoice_prefix}</Space.Addon>
                  <Input
                    placeholder="Invoice Number"
                    value={form.getFieldValue('number')}
                    onChange={(e) => {
                      const value = e.target.value;
                      form.setFieldValue('number', value.replace(/\D/g, ''));
                    }}
                  />
                </Space.Compact>
              </Form.Item>
              <Form.Item
                name="date"
                label="Invoice Date"
                className="w-full mb-3"
                labelCol={{ span: 8 }}
                getValueProps={(value) => ({
                  value: value ? dayjs(value) : null,
                })}
                rules={[
                  { required: true, message: 'Please select the invoice date' },
                ]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
              <Form.Item
                name="due_date"
                label="Due Date"
                className="w-full mb-3"
                labelCol={{ span: 8 }}
                getValueProps={(value) => ({
                  value: value ? dayjs(value) : null,
                })}
              >
                <DatePicker className="w-full" />
              </Form.Item>
            </div>
          </div>
          <InvoiceItemsTable
            items={items}
            setItems={setItems}
            selectedArtworksIds={selectedArtworksIds}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-5 mt-5">

            {/* Options */}

            <div className="flex flex-col gap-3 border !border-dashed bg-light rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Form.Item
                  name={["available_extra_costs", "shipping"]}
                  valuePropName="checked"
                  className="mb-0 min-w-[120px]"
                >
                  <Checkbox
                    defaultChecked={watchForm.available_extra_costs?.shipping}
                  >Shipping Cost</Checkbox>
                </Form.Item>
                <AnimatedContainer condition={watchForm.available_extra_costs?.shipping} type="fadeRight" speed="slow" className="flex items-center gap-2" >
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
                </AnimatedContainer>
              </div>
              <div className="flex items-center gap-2">
                <Form.Item
                  name={["available_extra_costs", "discount"]}
                  valuePropName="checked"
                  className="mb-0 min-w-[120px]"
                >
                  <Checkbox
                    defaultChecked={watchForm.available_extra_costs?.discount}
                  >Discount</Checkbox>
                </Form.Item>
                <AnimatedContainer condition={watchForm.available_extra_costs?.discount} type="fadeRight" speed="slow" className="flex items-center gap-2" >
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
                </AnimatedContainer>
              </div>
              <Form.Item
                name="notes"
                label="Notes"
                className="w-full mb-0"
                labelCol={{ span: 24 }}
                rules={[{ max: 500, message: 'Notes cannot exceed 200 characters.' }]}
              >
                <Input.TextArea rows={4} placeholder="Notes to the customer" />
              </Form.Item>
            </div>

            {/* Totals Column */}

            <div className="w-full xl:pe-5">
              <div className="flex flex-col items-end box-border [&_.label]:mb-0">
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
              </div>

              {/* Hidden Fields */}
              <div>
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

              {/* Payments */}
              <div className="mt-5">
                <div className="flex justify-end">
                  <Button onClick={() => setShowPaymentModal(true)}>
                    Record Payment
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </Form>
      </Drawer>

      {/* Components */}

      <ContactFormDrawer
        show={showContactForm}
        onClose={handleCloseContactForm}
        mode="create"
      />

      <PaymentFormModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        invoice={editingInvoiceQuery.data}
      />
    </>
  )
}

export default InvoiceFormDrawer
