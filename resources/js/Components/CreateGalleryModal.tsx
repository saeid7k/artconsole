import { trimWebsite } from "@/utils/formatter";
import { Add01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router } from "@inertiajs/react";
import { Form, GetProp, Input, message, Modal, Upload, UploadProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { useState } from "react";
type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function CreateGalleryModal({ open, setOpen }: Props) {

  const [form] = Form.useForm()

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

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
    if (isImage && isLt10M) {
      setLogoPreview(URL.createObjectURL(file));
      return true;
    } else {
      return false;
    }
  }

  const normFile = (e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  function handleSave() {
    form
    .validateFields()
    .then((values) => {
      setProcessing(true);
      let payload = {
        ...values,
        logo: values.logo?.[0]?.originFileObj || null,
      }
      axios.post(route('galleries.create'), payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
        .then((response) => {
          message.success(response.data.message || 'Gallery created successfully');
          handleClose();
          router.reload();
        })
        .catch((error) => {
          message.error(error.response?.data?.message || 'Failed to create gallery. Please try again.');
        })
        .finally(() => {
          setProcessing(false);
        })
    })
    .catch((info) => {
      console.log('Validate Failed:', info);
    });
  }

  function handleClose() {
    setLogoPreview(null);
    form.resetFields();
    setOpen(false);
  }

  return (
    <Modal
      title="Create New Gallery"
      open={open}
      onCancel={handleClose}
      closeIcon={<HugeiconsIcon icon={Cancel01Icon} size={32} />}
      width={800}
      okText={processing ? "Creating..." : "Create"}
      afterClose={handleClose}
      style={{ top: 50 }}
      onOk={handleSave}
      okButtonProps={{ loading: processing }}
    >
      <Form
        form={form}
        layout="horizontal"
        initialValues={{
          logo: null,
          name: '',
          about: '',
          website: '',
          email: '',
        }}
        validateTrigger="onSubmit"
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
        className="mt-10"
      >
        <Form.Item
          label="Logo"
          name="logo"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            listType="picture-card"
            className="avatar-uploader !cursor-pointer"
            showUploadList={false}
            beforeUpload={beforeUploadLogo}
            customRequest={() => {}}
          >
            {logoPreview ? (
              <img draggable={false} src={logoPreview} alt="avatar" style={{ width: '100%' }} />
            ) : (
              <div className="flex flex-col items-center justify-center gap-1">
                <HugeiconsIcon icon={Add01Icon} size={32} />
                <div>Upload</div>
              </div>
            )}
          </Upload>
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
    </Modal>
  )
}

export default CreateGalleryModal;
