import { TaxProps } from "@/types/tax"
import { Form, Input, message, Modal, Space } from "antd"
import { useForm } from "antd/es/form/Form"
import FormItem from "antd/es/form/FormItem"
import TextArea from "antd/es/input/TextArea"
import axios from "axios"

type Props = {
  show: boolean
  onClose: () => void
  selectedTax?: TaxProps | null
}

function TaxFormModal({ show, onClose, selectedTax }: Props) {

  const [form] = useForm()

  function handleSubmit() {
    form.validateFields()
      .then(values => {
        if (selectedTax) {
          axios.put(route('taxes.update', { tax: selectedTax.id }), values)
            .then(() => {
              message.success('Tax updated successfully')
              form.resetFields()
              onClose()
            })
            .catch((error) => {
              message.error(error.response?.data?.message || 'Failed to update tax')
            })
        } else {
          axios.post(route('taxes.store'), values)
            .then(() => {
              message.success('Tax created successfully')
              form.resetFields()
              onClose()
            })
            .catch((error) => {
              message.error(error.response?.data?.message || 'Failed to create tax')
            })
        }
      })
  }

  function handleCancel() {
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      open={show}
      onCancel={handleCancel}
      okText={selectedTax ? "Update" : "Add"}
      title={`${selectedTax ? 'Edit' : 'Add'} Tax`}
      afterOpenChange={() => form.resetFields()}
      onOk={handleSubmit}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={selectedTax ? selectedTax : {
          name: '',
          rate: 0,
          description: ''
        }}
        className="mt-5"
        validateTrigger='onBlur'
        onFinish={handleSubmit}
      >
        <FormItem label="Name" name="name" required rules={[{ required: true, message: 'Tax name is required' }]} >
          <Input placeholder="Enter tax name" />
        </FormItem>
        <FormItem
          label="Rate"
          name="rate"
          required
          rules={[
            { required: true, message: 'Tax rate is required' },
          ]}
        >
          <Space.Compact className="w-full">
            <Space.Addon>%</Space.Addon>
            <Input
              type="number"
              min={0}
              max={100}
              defaultValue={selectedTax ? selectedTax.rate : 0}
              onChange={(e) => form.setFieldValue('rate', Number(e.target.value))}
              placeholder="Enter the tax rate"
            />
          </Space.Compact>
        </FormItem>
        <FormItem label="Description" name="description">
          <TextArea placeholder="Enter a description" />
        </FormItem>
      </Form>
    </Modal>
  )
}

export default TaxFormModal
