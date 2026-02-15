import ACCESS_LEVELS from "@/constants/accessLevels";
import { GalleryProps } from "@/types/gallery";
import { ucFirst } from "@/utils/stringHelper";
import { AddMaleIcon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router } from "@inertiajs/react";
import { Form, Input, message, Modal, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { useState } from "react";
import CONFIGS from "~/resources/configs.json";
import GalleryAvatar from "../Galleries/GalleryAvatar";

type Props = {
  open?: boolean;
  setOpen: (open: boolean) => void;
  gallery: GalleryProps;
}

function AddMemberModal({ open = false, setOpen, gallery }: Props) {

  const [form] = useForm()

  function handleClose() {
    setOpen(false)
    form.resetFields()
    router.reload()
  }

  const [processing, setProcessing] =  useState(false);

  function handleSubmit() {
    form.validateFields().then(values => {
      setProcessing(true);
      axios.post(route('members.add', { gallery: gallery.id }), values)
        .then((response) => {
          message.success(response.data.message || 'Invitation sent successfully.');
          handleClose();
        })
        .catch(error => {
          message.error(error.response?.data?.message || 'Failed to send invitation.', 7);
        })
        .finally(() => {
          setProcessing(false);
        });
    });
  }

  return (
    <Modal
      title="Add Member"
      open={open}
      onCancel={handleClose}
      closeIcon={<HugeiconsIcon icon={Cancel01Icon} size={32} />}
      style={{ top: 100 }}
      okText="Send Invitation"
      afterClose={handleClose}
      onOk={handleSubmit}
    >
      <div className="flex flex-col items-center">
        <div className="flex">
          <GalleryAvatar gallery={gallery} size={64} shape="circle" border />
          <HugeiconsIcon icon={AddMaleIcon} strokeWidth={1} size={64} />
        </div>
        <p className="max-w-[300px] text-muted text-center">
          Invite a new member to access <span className="font-semibold text-primary-500 whitespace-nowrap">{gallery.name}</span> by entering their email address below.
        </p>
      </div>
      <Form
        form={form}
        layout="vertical"
        validateTrigger="onSubmit"
        initialValues={{
          access: CONFIGS.defaults.access_level
        }}
        disabled={processing}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter an email address.' },
            { type: 'email', message: 'Please enter a valid email address.' }
          ]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>
        <Form.Item
          label="Access Level"
          name="access"
          rules={[{ required: true, message: 'Please select an access level.' }]}
        >
          <Select
            placeholder="Select access level"
            defaultValue={CONFIGS.defaults.access_level}
          >
            {ACCESS_LEVELS.map(level => (
              <Select.Option key={level.name} value={level.name}>
                {ucFirst(level.name)}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Message (optional)"
          name="message"
        >
          <Input.TextArea
            rows={4}
            placeholder="Write a personal message to include in the invitation email"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddMemberModal;
