import { useGallerySettings } from "@/contexts/GallerySettingsContext";
import useGalleryMeta from "@/hooks/useGalleryMeta";
import { Form, Input } from "antd";

function Invoicing() {

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
      </Form>
    </div>
  )
}

export default Invoicing
