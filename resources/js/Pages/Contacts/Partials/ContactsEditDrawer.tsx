import countries from "@/constants/Countries.json";
import { ContactProps } from "@/types/contact";
import { router } from "@inertiajs/react";
import { Button, DatePicker, Divider, Drawer, Form, Input, message, Select, Tabs } from "antd";
import axios from "axios";
import dayjs from "dayjs";

function ContactsEditDrawer({ contact, show, onClose }: { contact: ContactProps; show: boolean; onClose: () => void }) {

  const [form] = Form.useForm();

  function handleClose() {
    form.resetFields()
    onClose()
  }

  const countryOptions = countries.map((country) => ({
    label: country.name,
    value: country.name,
  }))

  const watchCountry = Form.useWatch(['address', 'country'], form);
  const watchBusinessCountry = Form.useWatch(['business', 'address', 'country'], form);

  function handleSave() {
    form
      .validateFields()
      .then((values) => {
        let payload = { ...values }

        // preserve business address and website here since they're not in the form
        payload.business = { ...payload.business, address: contact.business?.address || {}, website: contact.business?.website || '' }

        axios.post(route('contacts.update', { contact: contact.id }), payload)
          .then((res) => {
            message.success(res.data.message || "Profile updated successfully")
            router.reload()
            handleClose()
          })
          .catch((e) => {
            message.error(e.response?.data?.message || "Failed to update profile")
          });
      })
      .catch((info) => {
        message.error("Please correct the errors in the form")
      })
  }

  return (
    <Drawer
      title="Edit Contact"
      placement="right"
      size="large"
      onClose={handleClose}
      open={show}
      extra={
        <Button type="primary" onClick={handleSave}>Save</Button>
      }
      afterOpenChange={() => form.resetFields()}
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={{ ...contact,
          birthday: contact.birthday ? dayjs(contact.birthday) : null
        }}
        validateTrigger="onBlur"
      >
        <Tabs defaultActiveKey="personal" type="card" >
          <Tabs.TabPane tab="Personal" key="personal">
            <div className="sm:flex gap-4">
              <Form.Item
                label="First Name"
                name="firstname"
                rules={[
                  { max: 255, message: 'First Name cannot exceed 255 characters' }
                ]}
                className="sm:w-1/2"
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Last Name"
                name="lastname"
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
                name="phone"
                label="Phone"
                rules={[
                  { pattern: /^\d+$/, message: 'Phone number must be digits only' },
                  { max: 20, message: 'Phone number cannot exceed 20 characters' }
                ]}
                className="sm:w-1/2"
              >
                <Input
                  addonBefore={countries.find(country => country.name === watchCountry)?.dialCode}
                />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { type: 'email', message: 'Email is not valid' },
                ]}
                className="sm:w-1/2"
              >
                <Input />
              </Form.Item>
            </div>
            <Form.Item
              name="birthday"
              label="Birthday"
            >
              <DatePicker
                // format="YYYY-MM-DD"
              />
            </Form.Item>
            <Divider><div className="text-muted font-light">Address</div></Divider>
            <div className="sm:flex gap-4">
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
                className="sm:shrink min-w-[100px]"
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
                <Select
                  options={countryOptions}
                  showSearch
                />
              </Form.Item>
            </div>
          </Tabs.TabPane>
          {/* <Tabs.TabPane tab="Address" key="address">
          </Tabs.TabPane> */}
          <Tabs.TabPane tab="Business" key="business">
            <div className="sm:flex gap-4">
              <Form.Item
                label="Business Name"
                name={['business', 'name']}
                rules={[
                  { max: 255, message: 'Business Name cannot exceed 255 characters' }
                ]}
                className="sm:w-1/2"
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Job Title"
                name={['business', 'title']}
                rules={[
                  { max: 255, message: 'Job Title cannot exceed 255 characters' }
                ]}
                className="sm:w-1/2"
              >
                <Input />
              </Form.Item>
            </div>
            <div className="sm:flex gap-4">
              <Form.Item
                name={['business', 'phone']}
                label="Business Phone"
                rules={[
                  { pattern: /^\d+$/, message: 'Phone number must be digits only' },
                  { max: 20, message: 'Phone number cannot exceed 20 characters' },
                ]}
                className="sm:w-1/2"
              >
                <Input
                  addonBefore={countries.find(country => country.name === watchBusinessCountry)?.dialCode}
                />
              </Form.Item>
              <Form.Item
                name={['business', 'email']}
                label="Business Email"
                rules={[
                  { type: 'email', message: 'Email is not valid' },
                ]}
                className="sm:w-1/2"
              >
                <Input />
              </Form.Item>
            </div>
            <Divider><div className="text-muted font-light">Address</div></Divider>
            <div className="sm:flex gap-4">
              <Form.Item
                name={['business', 'address', 'street']}
                label="Street Address"
                rules={[{ max: 255, message: 'Street Address cannot exceed 255 characters' }]}
                className="w-full grow"
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={['business', 'address', 'unit']}
                label="Unit"
                rules={[{ max: 255, message: 'Unit cannot exceed 255 characters' }]}
                className="sm:shrink min-w-[100px]"
              >
                <Input />
              </Form.Item>
            </div>
            <div className="grid grid-cols-4 gap-x-4">
              <Form.Item
                name={['business', 'address', 'city']}
                label="City"
                rules={[{ max: 255, message: 'City cannot exceed 255 characters' }]}
                className="col-span-4 sm:col-span-2 lg:col-span-1"
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={['business', 'address', 'province']}
                label="Province/State"
                rules={[{ max: 255, message: 'Province/State cannot exceed 255 characters' }]}
                className="col-span-4 sm:col-span-2 lg:col-span-1"
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={['business', 'address', 'postal_code']}
                label="Postal Code"
                rules={[{ max: 20, message: 'Postal Code cannot exceed 20 characters' }]}
                className="col-span-4 sm:col-span-2 lg:col-span-1"
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={['business', 'address', 'country']}
                label="Country"
                rules={[{ max: 50, message: 'Country cannot exceed 50 characters' }]}
                className="col-span-4 sm:col-span-2 lg:col-span-1"
              >
                <Select
                  options={countryOptions}
                  showSearch
                />
              </Form.Item>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </Form>
    </Drawer>
  );
}

export default ContactsEditDrawer
