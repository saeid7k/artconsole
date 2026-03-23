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
        <h4>Auto Change Status</h4>
        <Form.Item
          name="auto_change_status_sold"
        >
          <FlexBox>
            <Switch
              id="auto-change-status-sold"
              size="small"
              defaultChecked={gallery?.meta?.auto_change_status_sold || false}
              onChange={(checked) => setMeta("auto_change_status_sold", checked ? true : false)}
            />
            <label
              htmlFor="auto-change-status-sold"
              className="text-body cursor-pointer"
            >Automatically change artwork status to <strong>Sold</strong> when included in a <strong>paid invoice</strong></label>
          </FlexBox>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Artworks
