import COUNTRIES from "@/constants/countries.json";
import { useProfile } from "@/contexts/ProfileContext";
import { AuthProps } from "@/types/auth";
import { router, usePage } from "@inertiajs/react";
import { Button, Divider, Form, Input, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import FlexBox from "../Containers/FlexBox";
import AddressFields from "../Fields/AddressFields";
import LoadingSpinner from "../LoadingSpinner";

function ProfilePersonalTab() {

  const { user } = usePage().props.auth as AuthProps
  const { profileTriggerCounter } = useProfile()
  const [form] = Form.useForm()
  const [isSaving, setIsSaving] = useState(false)

  const watchCountry = Form.useWatch(['address', 'country'], form);

  function handleSave() {
    form
      .validateFields()
      .then((values) => {
        setIsSaving(true)
        axios.post(route('profile.update'), values)
          .then((res) => {
            message.success(res.data.message || "Profile updated successfully")
            router.reload()
          })
          .catch((e) => {
            message.error(e.response?.data?.message || "Failed to update profile")
          })
          .finally(() => {
            setIsSaving(false)
          });
      })
      .catch((info) => {
        message.error("Please correct the errors in the form")
      });
  }

  useEffect(() => {
    form.resetFields()
  }, [profileTriggerCounter])

  return (
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
          <Input
            addonBefore={COUNTRIES.find(country => country.name === watchCountry)?.dialCode}
          />
        </Form.Item>
      </div>
      <Divider plain >Address</Divider>
      <AddressFields />

      <FlexBox justifyContent="end" >
        <Button
          type="primary"
          onClick={handleSave}
        >
          {isSaving && <LoadingSpinner size="small" color="white" />}
          Save
        </Button>
      </FlexBox>
    </Form>
  )
}

export default ProfilePersonalTab
