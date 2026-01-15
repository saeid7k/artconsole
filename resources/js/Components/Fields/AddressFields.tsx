import CONFIGS from "@/constants/configs.json";
import COUNTRIES from "@/constants/countries.json";
import { Form, Input, Select } from "antd";

type Props = {
  namePathPrefix?: string[];
}

function AddressFields({ namePathPrefix = [] }: Props) {

  const countryOptions = COUNTRIES.map((country) => ({
    label: country.name,
    value: country.name,
  }))

  return (
    <div>
      <div className="sm:flex gap-4">
        <Form.Item
          name={[...namePathPrefix, 'address', 'street']}
          label="Street Address"
          rules={[{ max: 255, message: 'Street Address cannot exceed 255 characters' }]}
          className="w-full grow"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={[...namePathPrefix, 'address', 'unit']}
          label="Unit"
          rules={[{ max: 255, message: 'Unit cannot exceed 255 characters' }]}
          className="sm:shrink min-w-[100px]"
        >
          <Input />
        </Form.Item>
      </div>
      <div className="grid grid-cols-4 gap-x-4">
        <Form.Item
          name={[...namePathPrefix, 'address', 'city']}
          label="City"
          rules={[{ max: 255, message: 'City cannot exceed 255 characters' }]}
          className="col-span-4 sm:col-span-2 lg:col-span-1"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={[...namePathPrefix, 'address', 'province']}
          label="Province/State"
          rules={[{ max: 255, message: 'Province/State cannot exceed 255 characters' }]}
          className="col-span-4 sm:col-span-2 lg:col-span-1"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={[...namePathPrefix, 'address', 'postal_code']}
          label="Postal Code"
          rules={[{ max: 20, message: 'Postal Code cannot exceed 20 characters' }]}
          className="col-span-4 sm:col-span-2 lg:col-span-1"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={[...namePathPrefix, 'address', 'country']}
          label="Country"
          rules={[{ max: 50, message: 'Country cannot exceed 50 characters' }]}
          className="col-span-4 sm:col-span-2 lg:col-span-1"
        >
          <Select
            options={countryOptions}
            showSearch
            defaultValue={CONFIGS.defaults.country}
          />
        </Form.Item>
      </div>
    </div>
  )
}

export default AddressFields;
