import { useWindow } from "@/hooks/useWindow";
import { keyToTitle } from "@/utils/stringHelper";
import { Drawer, Form, Input } from "antd"

type Props = {
  type: 'artworks-label' | 'inventory-report';
  show: boolean;
  onClose: () => void;
}

function CreateArtworksReportsDrawer({ type, show, onClose }: Props) {

  const { windowWidth, breakpoint } = useWindow()

  const [form] = Form.useForm()

  return (
    <Drawer
      title={`Create New Report | ${keyToTitle(type)}`}
      placement="right"
      size={ breakpoint == "xs" ? windowWidth: (windowWidth * 0.9)}
      onClose={onClose}
      open={show}
      keyboard={false}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="name"
          label="Report Name"
          rules={[{ required: true, message: 'Please input the report name!' }]}
        >
          <Input placeholder="Enter report name" />
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export default CreateArtworksReportsDrawer
