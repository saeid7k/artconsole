import ActionFooter from "@/Components/ActionFooter";
import { CURRENCIES_OPTIONS } from "@/constants/currencies";
import { useGallerySettings } from "@/contexts/GallerySettingsContext";
import { Form, message, Select } from "antd"
import axios from "axios";
import { useEffect, useState } from "react";
import CONFIGS from "~/resources/configs.json";

function Currency() {

  const { open, gallery } = useGallerySettings()
  const [form] = Form.useForm()
  const [isProcessing, setIsProcessing] = useState(false);

  function handleSave() {
    form
      .validateFields()
      .then(values => {
        setIsProcessing(true);
        axios.post(route('galleries.update-accounting', { gallery: gallery.id }), values)
          .then((response) => {
            message.success(response.data.message || 'Accounting settings updated successfully.');
          })
          .catch(error => {
            message.error(error.response?.data?.message || 'Failed to update accounting settings.');
          })
          .finally(() => {
            setIsProcessing(false);
          });
    });
  }

  useEffect(() => {
    if (open) {
      form.resetFields()
    }
  }, [open]);

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          currency: gallery?.meta?.currency || CONFIGS.defaults.currency,
        }}
        validateTrigger="onSubmit"
      >
        <Form.Item label="Currency" name="currency">
          <Select
            options={CURRENCIES_OPTIONS}
            showSearch
            defaultValue={CONFIGS.defaults.currency}
          />
        </Form.Item>
      </Form>
      <ActionFooter
        save={handleSave}
        isProcessing={isProcessing}
      />
    </div>
  )
}

export default Currency
