import { LOCATION_TYPES } from "@/constants/locationTypes";
import { LocationProps } from "@/types/location";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router } from "@inertiajs/react";
import { Checkbox, Divider, Form, Input, message, Modal, Select } from "antd";
import axios from "axios";
import AddressFields from "../Fields/AddressFields";
import StyledDivider from "../StyledDivider";
import { FORM_RULES } from "@/constants/formRules";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode?: 'create' | 'edit';
  location?: LocationProps;
}

function LocationCreateEditModal({ open, setOpen, mode = 'create', location }: Props) {

  const [form] = Form.useForm();

  function handleClose() {
    form.resetFields()
    setOpen(false)
  }

  function handleSave() {
    form.validateFields().then((values) => {
      axios.post(route('locations.store-update'), {
        ...values,
        id: location ? location.id : undefined,
        mode: mode,
      })
        .then(() => {
          message.success(`Location ${mode === 'create' ? 'created' : 'updated'} successfully`);
          handleClose();
          router.reload();
        })
        .catch((error) => {
          message.error(error.response?.data?.message || 'An error occurred while saving the location');
        })
    })
    setOpen(false)
  }

  const watchForm = Form.useWatch([], form);

  return (
    <Modal
      title={mode === 'create' ? "Create Location" : "Edit Location"}
      open={open}
      onCancel={handleClose}
      closeIcon={<HugeiconsIcon icon={Cancel01Icon} size={32} />}
      okText="Save"
      onOk={handleSave}
      afterClose={handleClose}
      afterOpenChange={() => form.resetFields()}
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={location ? location : {
          address_same_as_gallery: true,
          is_primary: false,
        }}
        validateTrigger="onBlur"
        className="mt-5"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter the location name' }]}
        >
          <Input placeholder="Enter location name" />
        </Form.Item>

        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: 'Please select a location type' }]}
        >
          <Select
            options={LOCATION_TYPES}
            defaultValue={LOCATION_TYPES.find(l => l.default)?.value}
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
        >
          <Input.TextArea
            rows={4}
            placeholder="Enter location description"
          />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={FORM_RULES.phone}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { type: 'email', message: 'Please enter a valid email address' },
            { max: 255, message: 'Email cannot exceed 255 characters' }
          ]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>

        <Form.Item
          name="address_same_as_gallery"
          valuePropName="checked"
        >
          <Checkbox defaultChecked >
            Same address as Gallery
          </Checkbox>
        </Form.Item>

        {!watchForm?.address_same_as_gallery && (
          <>
            <StyledDivider variant="light" >Address</StyledDivider>
            <AddressFields />
            <Divider />
          </>
        )}

        <Form.Item
          name="is_primary"
          valuePropName="checked"
        >
          <Checkbox
            defaultChecked={location ? location.is_primary : false}
            disabled={location ? !location.is_active : false}
          >
            Set as Primary Location
          </Checkbox>
        </Form.Item>

      </Form>
    </Modal>
  )
}

export default LocationCreateEditModal;
