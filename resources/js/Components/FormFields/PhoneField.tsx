import COUNTRIES from "@/constants/countries.json";
import { FORM_RULES } from "@/constants/formRules";
import { Form, Input, Select, Space } from "antd";

type Props = {
  form: ReturnType<typeof Form.useForm>[0];
  fieldNames?: {
    country_code: string | string[];
    phone: string | string[];
  }
}

const defaultFieldNames = {
  country_code: 'country_code',
  phone: 'phone',
}

function PhoneField({ form, fieldNames = defaultFieldNames }: Props) {

  const watchCountryCode = Form.useWatch(fieldNames.country_code, form);
  const watchPhone = Form.useWatch(fieldNames.phone, form);

  return (
    <Form.Item
      label="Phone"
      name={fieldNames.phone}
      normalize={(value) => (value ? value.replace(/\D/g, '') : '')}
      rules={FORM_RULES.phone}
    >
      <Space.Compact
        className="w-full"
      >
        <Form.Item
          name={fieldNames.country_code}
          noStyle
        >
          <Select
            options={
              COUNTRIES.map((country) => ({
                key: country.iso,
                label: `${country.name} (${country.dialCode})`,
                value: country.dialCode,
              }))
            }
            showSearch={{
              optionFilterProp: 'label',
            }}
            labelRender={(option) => option.value}
            popupMatchSelectWidth={false}
            style={{
              width: 'max-content',
            }}
            onChange={(value) => { form.setFieldValue(fieldNames.country_code, value) }}
            value={watchCountryCode || '+1'}
          />
        </Form.Item>
        <Input
          placeholder="Enter phone number"
          value={watchPhone}
        />
      </Space.Compact>
    </Form.Item>
  )
}

export default PhoneField;
