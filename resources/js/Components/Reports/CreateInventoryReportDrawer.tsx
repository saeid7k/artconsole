import { useWindow } from "@/hooks/useWindow";
import { router } from "@inertiajs/react";
import { Button, Checkbox, Divider, Drawer, Form, Input, message } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import ArtworkSelector from "../Artworks/ArtworkSelector";
import FlexBox from "../Containers/FlexBox";
import StyledDivider from "../StyledDivider";

type Props = {
  show: boolean;
  onClose: () => void;
  preSelectedArtworkIds?: number[];
}

function CreateInventoryReportDrawer({ show, onClose, preSelectedArtworkIds = [] }: Props) {

  const { windowWidth, breakpoint } = useWindow()
  const [form] = Form.useForm()

  const [selectedArtworkIds, setSelectedArtworkIds] = useState<number[]>(preSelectedArtworkIds);
  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    onClose();
  }

  function handleSubmit() {
    form.validateFields().then(values => {
      setSaving(true);
      axios.post(route('reports.store'), {
        type: 'inventory',
        name: values.name,
        description: values.description,
        options: {
          show_header: values.show_header,
        },
        artworks: selectedArtworkIds,
      })
        .then(() => {
          message.success('Report created successfully');
          form.resetFields();
          setSelectedArtworkIds([]);
          onClose();
          router.visit(route('reports.index'), { preserveState: false })
        })
        .catch((err) => {
          message.error(err?.response?.data?.message || 'Failed to create report');
        })
        .finally(() => {setSaving(false)})
    })
    .catch(e => {})
  }

  // Watchers

  const formWatch = Form.useWatch([], form) ?? {}

  // Render

  const title = (
    <FlexBox>
      <span>Create New Report</span>
      <Divider orientation="vertical" />
      <span className="text-primary-700 dark:text-primary-300">Inventory Report</span>
      <Divider orientation="vertical" />
      <div className="text-ghost">{selectedArtworkIds.length} selected</div>
    </FlexBox>
  )

  return (
    <Drawer
      title={title}
      placement="right"
      size={ breakpoint == "xs" ? windowWidth : (Math.min(windowWidth * 0.9, 1024))}
      onClose={handleClose}
      open={show}
      keyboard={false}
      extra={
        <Button
          type="primary"
          onClick={() => form.submit()}
          disabled={selectedArtworkIds.length === 0}
          loading={saving}
        >
          Create
        </Button>
      }
      styles={{
        body: {
          paddingBottom: '3rem'
        }
      }}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          'name': `Inventory Report - ${dayjs().format('LL')}`,
          'description': '',
        }}
        onFinish={handleSubmit}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6">
          <div>
            {/* Report Name */}
            <Form.Item
              name="name"
              label="Report Name"
              rules={[{ required: true, message: 'Please input the report name!' }]}
            >
              <Input
                placeholder="Enter report name"
              />
            </Form.Item>

            {/* Description */}
            <Form.Item
              name="description"
              label="Description"
              rules={[
                { max: 255, message: 'Report description cannot be longer than 255 characters' }
              ]}
            >
              <Input.TextArea placeholder="Enter report description" rows={3} />
            </Form.Item>
          </div>
          <div>
            <div>
              <div className="label">Options</div>
              <div className="ps-5 grid grid-cols-1 sm:grid-cols-3 gap-x-5">
                {/* Header */}
                <Form.Item
                  name="show_header"
                  valuePropName="checked"
                  initialValue={true}
                  className="mb-0"
                >
                  <Checkbox
                    disabled={formWatch?.size === 'small'}
                  >
                    Show Header
                  </Checkbox>
                </Form.Item>
              </div>
            </div>
          </div>
        </div>
        {preSelectedArtworkIds.length === 0 && (
          <>
            <StyledDivider rootClassName="mb-3" >Select Artworks</StyledDivider>
            <div className="mb-5 w-full overflow-x-auto">
              <ArtworkSelector setSelectedIds={setSelectedArtworkIds} />
            </div>
          </>
        )}
        <Divider />
      </Form>
    </Drawer>
  )
}

export default CreateInventoryReportDrawer
