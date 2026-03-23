import FlexBox from "@/Components/Containers/FlexBox";
import { useGallerySettings } from "@/contexts/GallerySettingsContext";
import useGalleryMeta from "@/hooks/useGalleryMeta";
import { Form, Switch } from "antd";

function Artworks() {

  const { gallery } = useGallerySettings()
  const { setMeta, saveChipNode } = useGalleryMeta(gallery)

  return (
    <div>
      {saveChipNode}
      <Form
        layout="vertical"
      >
        <h4>Auto Update Status</h4>
        <Form.Item
          name="auto_update_status_sold"
        >
          <FlexBox>
            <Switch
              id="auto-update-status-sold"
              size="small"
              defaultChecked={gallery?.meta?.auto_update_status_sold || false}
              onChange={(checked) => setMeta("auto_update_status_sold", checked ? true : false)}
            />
            <label
              htmlFor="auto-update-status-sold"
              className="text-body cursor-pointer"
            >Update artwork status to <strong>Sold</strong> when included in a <strong>paid invoice</strong></label>
          </FlexBox>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Artworks
