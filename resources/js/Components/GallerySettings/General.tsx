import { useGallerySettings } from "@/contexts/GallerySettingsContext"
import { trimWebsite } from "@/utils/formatHelper"
import { Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { router } from "@inertiajs/react"
import { Button, Form, GetProp, Input, message, Tooltip, Upload, UploadProps } from "antd"
import { useWatch } from "antd/es/form/Form"
import TextArea from "antd/es/input/TextArea"
import axios from "axios"
import { useEffect, useState } from "react"
import ActionFooter from "../ActionFooter"
import PhoneField from "../FormFields/PhoneField"
import LoadingSpinner from "../LoadingSpinner"

function General() {

  // Hooks & State

  const { gallery, open } = useGallerySettings()
  const [form] = Form.useForm()
  const watchForm = useWatch(undefined, form)

  // Save Changes

  const [processing, setProcessing] = useState(false);

  function handleSave() {
    form
      .validateFields()
      .then((values) => {
        setProcessing(true);
        axios.post(route('galleries.update', { gallery: gallery.id }), values)
          .then((res) => {
            message.success(res.data.message || "Gallery updated successfully")
            router.reload()
          })
          .catch((e) => {
            message.error(e.response?.data?.message || "Failed to update gallery")
          })
          .finally(() => {
            setProcessing(false);
          });
      })
  }

  // Update Logo

  const [logoLoading, setLogoLoading] = useState(false);

  type LogoType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
  const beforeUploadLogo = (file: LogoType) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image file!');
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('Image must smaller than 10MB!');
    }
    return isImage && isLt10M;
  }

  const handleChangeLogo: UploadProps['onChange'] = (info) => {
    setLogoLoading(true);

    const form = new FormData();
    const fileObj = (info.file as any).originFileObj ?? (info.file as unknown as Blob);
    if (fileObj) {
      form.append('logo', fileObj as Blob);
    }

    axios.post(route('galleries.update-logo', { gallery: gallery?.id }), form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((response) => {
      message.success('Logo updated successfully');
    }).catch(() => {
      message.error('Failed to update logo');
    }).finally(() => {
      setLogoLoading(false);
      router.reload();
    })
  }

  const uploadButton = (
    <button style={{ border: 0, background: 'none', cursor: 'pointer' }} type="button">
      {logoLoading ? <LoadingSpinner /> : <HugeiconsIcon icon={Add01Icon} />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  // Remove Logo

  function removeLogo() {
    setLogoLoading(true);

    axios.post(route('galleries.remove-logo', { gallery: gallery?.id }))
      .then(() => {
        message.success('Logo removed successfully');
      })
      .catch(() => {
        message.error('Failed to remove logo');
      })
      .finally(() => {
        setLogoLoading(false);
        router.reload();
      });
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
        layout="horizontal"
        initialValues={{
          name: gallery?.name || '',
          about: gallery?.about || '',
          country_code: gallery?.country_code || '+1',
          phone: gallery?.phone || '',
          website: gallery?.website || '',
          email: gallery?.email || '',
        }}
        validateTrigger="onBlur"
        labelCol={{
          xs:{span: 24},
          sm:{span: 6},
          md:{span: 4}
        }}
        wrapperCol={{
          xs:{span: 24},
          sm:{span: 18},
          md:{span: 20}
        }}
      >
        <Form.Item
          label="Logo"
        >
          <div className="flex items-start gap-1">
            <Upload
              name="logo"
              listType="picture-card"
              className="avatar-uploader !cursor-pointer"
              showUploadList={false}
              beforeUpload={beforeUploadLogo}
              onChange={handleChangeLogo}
              customRequest={() => {}}
            >
              {gallery?.logo_url ? (
                <img draggable={false} src={gallery.logo_url} alt="avatar" style={{ width: '100%' }} />
              ) : (
                uploadButton
              )}
            </Upload>
            {gallery?.logo_url && (
              <div>
                <Tooltip title="Remove Logo">
                  <Button
                    variant="text"
                    color="danger"
                    shape="circle"
                    onClick={removeLogo}
                  >
                    <HugeiconsIcon icon={Delete02Icon} size={20}  />
                  </Button>
                </Tooltip>
              </div>
            )}
          </div>
        </Form.Item>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter the gallery name' }]}
        >
          <Input placeholder="Enter gallery name" />
        </Form.Item>

        <Form.Item
          label="About"
          name="about"
        >
          <TextArea
            rows={4}
            placeholder="Write a brief description about the gallery"
          />
        </Form.Item>

        <PhoneField form={form} />

        <Form.Item
          label="Website"
          name="website"
        >
          <Input
            placeholder="Enter gallery website"
            addonBefore="https://"
            onChange={(e) => {form.setFieldsValue({ website: trimWebsite(e.target.value) })}}
          />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ type: 'email', message: 'Please enter a valid email address' }]}
        >
          <Input
            placeholder="Enter gallery email"
          />
        </Form.Item>
      </Form>
      <ActionFooter
        isProcessing={processing}
        save={handleSave}
      />
    </div>
  )
}

function ItemRow({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="relative flex flex-wrap md:flex-nowrap items-center gap-2">
      <label className="whitespace-nowrap min-w-[100px]">{label}</label>
      {children}
    </div>
  )
}

export default General
