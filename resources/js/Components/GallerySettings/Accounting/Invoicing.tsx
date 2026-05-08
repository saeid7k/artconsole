import ProBadge from "@/Components/Subscription/ProBadge";
import CONFIGS from "@/constants/configs.json";
import { useGallerySettings } from "@/contexts/GallerySettingsContext";
import useGalleryMeta from "@/hooks/useGalleryMeta";
import { usePage } from "@inertiajs/react";
import { Form, Input, Switch } from "antd";
import TextArea from "antd/es/input/TextArea";

function Invoicing() {

  const user = usePage()?.props?.auth?.user
  const { gallery } = useGallerySettings()
  const { saveChipNode, setMeta } = useGalleryMeta(gallery)

  return (
    <div>
      {saveChipNode}
      <Form
        layout="vertical"
        className="pt-3"
      >
        <Form.Item
          label="Invoice Prefix"
        >
          <Input
            defaultValue={gallery?.invoice_prefix}
            onChange={(e) => setMeta("invoice_prefix", e.target.value)}
            maxLength={10}
          />
        </Form.Item>
        <Form.Item
          label="Default Invoice Notes"
        >
          <TextArea
            defaultValue={gallery?.meta?.default_invoice_notes || CONFIGS.defaults.invoice_notes}
            onChange={(e) => setMeta("default_invoice_notes", e.target.value)}
            maxLength={500}
          />
        </Form.Item>
        <Form.Item
          label="Invoices Footer"
          rules={[
            {
              max: 100,
              message: "Invoices Footer cannot exceed 100 characters"
            }
          ]}
        >
          <TextArea
            defaultValue={gallery?.meta?.invoice_footer || CONFIGS.defaults.invoice_footer}
            onChange={(e) => setMeta("invoice_footer", e.target.value)}
            maxLength={100}
          />
        </Form.Item>
        <Form.Item
          label={
            <div className="flex items-start gap-2">
              <div>{CONFIGS.app.name} Branding</div>
              <ProBadge />
            </div>
          }
        >
          <div className="flex gap-2">
            <Switch
              defaultChecked={gallery?.meta?.app_branding ?? true}
              onChange={(checked) => setMeta("app_branding", checked)}
              disabled={!gallery?.is_subscribed || !user?.is_demo}
            />
            <div className="text-ghost">Show "Powered by {CONFIGS.app.name}" in invoices' footer</div>
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Invoicing
