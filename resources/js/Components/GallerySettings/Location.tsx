import { useGallerySettings } from "@/contexts/GallerySettingsContext"
import { router } from "@inertiajs/react"
import { Form, message } from "antd"
import axios from "axios"
import { useEffect, useState } from "react"
import ActionFooter from "../ActionFooter"
import AddressFields from "../Fields/AddressFields"

function Location() {

  // Constants

  const { gallery, open } = useGallerySettings()
  const [form] = Form.useForm()

  // Save Changes

  const [processing, setProcessing] = useState(false);

  function handleSave() {
    form
      .validateFields()
      .then((values) => {
        setProcessing(true);
        axios.post(route('galleries.update-address', { gallery: gallery.id }), values)
          .then((res) => {
            message.success(res.data.message || "Gallery address updated successfully")
            router.reload()
          })
          .catch((e) => {
            message.error(e.response?.data?.message || "Failed to update gallery address")
          })
          .finally(() => {
            setProcessing(false);
          });
      })
  }

  // Effects

  useEffect(() => {
    if (open) {
      form.resetFields()
    }
  }, [open]);

  return (
    <div className="flex flex-col gap-3">

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          address: gallery?.address || '',
        }}
        validateTrigger="onSubmit"
      >
        <AddressFields />
      </Form>
      <ActionFooter
        isProcessing={processing}
        save={handleSave}
      />
    </div>
  )
}

export default Location
