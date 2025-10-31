import { AuthProps } from "@/types/auth"
import { getInitials } from "@/utils/stringHelper"
import { Cancel01Icon, Edit03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { router, usePage } from "@inertiajs/react"
import { Avatar, Divider, Form, Input, message, Modal } from "antd"
import axios from "axios"
import React, { useEffect, useRef, useState } from "react"

function ProfileModal({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {

  // Hooks

  const { user } = usePage().props.auth as AuthProps
  const [form] = Form.useForm()

  // Constants and States

  const pictureUploadRef = useRef<HTMLInputElement | null>(null)
  const [preview, setPreview] = useState<string>(user.photo ?? '')

  // Functions

  const handleOverlayClick = () => {
    pictureUploadRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    // Revoke previous blob URL if it was one
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview)
    }
    setPreview(url)

    let form = new FormData()
    form.append('photo', file)

    axios.post(route('profile.update-photo'), form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((res) => {
      message.success(res.data.message || "Profile photo updated successfully")
      router.reload()
    }).catch((e) => {
      message.error(e.response?.data?.message || "Failed to update profile photo")
    })
  }

  function handleSave() {
    form
      .validateFields()
      .then((values) => {
        axios.post(route('profile.update'), values)
          .then((res) => {
            message.success(res.data.message || "Profile updated successfully")
            router.reload()
            setOpen(false)
          })
          .catch((e) => {
            message.error(e.response?.data?.message || "Failed to update profile")
          });
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  }

  // Effects

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  return (
    <Modal
      title="Profile"
      open={open}
      onCancel={() => setOpen(false)}
      closeIcon={<HugeiconsIcon icon={Cancel01Icon} size={32} />}
      // footer={null}
      width={800}
      okText="Save"
      onOk={handleSave}
      afterClose={form.resetFields}
    >
      {/* Photo */}

      <div className="">
        <input
          ref={pictureUploadRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <div className="relative w-20 h-20 ratio-square rounded-full overflow-hidden m-auto">
          {preview ? (
            <img
              src={preview}
              alt="Profile Photo"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 grid place-content-center">
              <Avatar size={80} className="text-white">{getInitials(user.full_name)}</Avatar>
            </div>
          )}
          <div
            role="button"
            tabIndex={0}
            onClick={handleOverlayClick}
            className="bg-black text-white opacity-0 w-full h-full absolute top-0 left-0 hover:opacity-50 cursor-pointer grid place-content-center transition-all"
          >
            <HugeiconsIcon icon={Edit03Icon} size={32} />
          </div>
        </div>
      </div>

      <Divider />

      {/* Fields */}

      <div className="">
        <Form
          layout="vertical"
          className="w-full"
          form={form}
          initialValues={{
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phone: user.phone,
            address: user.address,
          }}
          onKeyDown={(e: React.KeyboardEvent<HTMLFormElement>) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleSave()
            }
          }}
          validateTrigger='onBlur'
        // onValuesChange={handleValuesChange}
        >
          <div className="sm:flex gap-4">
            <Form.Item
              name="firstname"
              label="First Name"
              rules={[
              { required: true, message: 'First Name is required' },
              { max: 255, message: 'First Name cannot exceed 255 characters' }
              ]}
              className="sm:w-1/2"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="lastname"
              label="Last Name"
              rules={[
                { max: 255, message: 'Last Name cannot exceed 255 characters' }
              ]}
              className="sm:w-1/2"
            >
              <Input />
            </Form.Item>
          </div>
          <div className="sm:flex gap-4">
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Email is required' },
                { type: 'email', message: 'Email is not valid' },
              ]}
              className="sm:w-1/2"
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Phone"
              rules={[
                { max: 20, message: 'Phone number cannot exceed 20 characters' }
              ]}
              className="sm:w-1/2"
            >
              <Input />
            </Form.Item>
          </div>
          <Divider plain >Address</Divider>
          <div className="md:flex gap-4">
            <Form.Item
              name={['address', 'street']}
              label="Street Address"
              rules={[{ max: 255, message: 'Street Address cannot exceed 255 characters' }]}
              className="w-full grow"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={['address', 'unit']}
              label="Unit"
              rules={[{ max: 255, message: 'Unit cannot exceed 255 characters' }]}
              className="md:shrink min-w-[100px]"
            >
              <Input />
            </Form.Item>
          </div>
          <div className="grid grid-cols-4 gap-x-4">
            <Form.Item
              name={['address', 'city']}
              label="City"
              rules={[{ max: 255, message: 'City cannot exceed 255 characters' }]}
              className="col-span-4 sm:col-span-2 lg:col-span-1"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={['address', 'province']}
              label="Province/State"
              rules={[{ max: 255, message: 'Province/State cannot exceed 255 characters' }]}
              className="col-span-4 sm:col-span-2 lg:col-span-1"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={['address', 'postal_code']}
              label="Postal Code"
              rules={[{ max: 20, message: 'Postal Code cannot exceed 20 characters' }]}
              className="col-span-4 sm:col-span-2 lg:col-span-1"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={['address', 'country']}
              label="Country"
              rules={[{ max: 50, message: 'Country cannot exceed 50 characters' }]}
              className="col-span-4 sm:col-span-2 lg:col-span-1"
            >
              <Input />
            </Form.Item>
          </div>
        </Form>
      </div>
    </Modal>
  )
}

export default ProfileModal
