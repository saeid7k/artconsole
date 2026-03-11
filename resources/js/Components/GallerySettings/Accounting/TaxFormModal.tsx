import { TaxProps } from "@/types/tax"
import { Form, Input, Modal, Space } from "antd"
import { useForm } from "antd/es/form/Form"
import FormItem from "antd/es/form/FormItem"
import TextArea from "antd/es/input/TextArea"

type Props = {
  show: boolean
  onClose: () => void
  selectedTax?: TaxProps | null
}

function TaxFormModal({ show, onClose, selectedTax }: Props) {

  const [form] = useForm()

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
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={selectedTax ? selectedTax : {}}
        className="mt-5"
        validateTrigger='onBlur'
        >
        <FormItem label="Name" name="name" required rules={[{ required: true, message: 'Tax name is required' }]} >
          <Input placeholder="Enter tax name" />
        </FormItem>
        <FormItem label="Abbreviation" name="abbreviation">
          <Input placeholder="Set an abbreviation" />
        </FormItem>
        <FormItem label="Rate" name="rate" required rules={[{ required: true, message: 'Tax rate is required' }]} >
          <Space.Compact className="w-full">
            <Space.Addon>%</Space.Addon>
            <Input
              type="number"
              min={0}
              max={100}
              defaultValue={selectedTax ? selectedTax.rate : 0}
              onChange={(e) => form.setFieldValue('rate', e.target.value)}
              placeholder="Enter the tax rate"
            />
          </Space.Compact>
        </FormItem>
        <FormItem label="Tax Number" name="tax_number">
          <Input placeholder="Enter your tax number" />
        </FormItem>
        <FormItem label="Description" name="description">
          <TextArea placeholder="Enter a description" />
        </FormItem>
      </Form>
    </Modal>
  )
}

export default TaxFormModal
