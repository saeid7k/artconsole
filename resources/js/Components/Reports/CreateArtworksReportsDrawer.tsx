import { DEFAULT_SIZE, SIZE_OPTIONS } from "@/constants/artworksLabelReport";
import { useWindow } from "@/hooks/useWindow";
import { keyToTitle } from "@/utils/stringHelper";
import { Button, Checkbox, Divider, Drawer, Form, Input, message, Select } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import ArtworkSelector from "../Artworks/ArtworkSelector";
import FlexBox from "../Containers/FlexBox";
import StyledDivider from "../StyledDivider";

type Props = {
  type: 'artworks_label' | 'inventory_report';
  show: boolean;
  onClose: () => void;
}

function CreateArtworksReportsDrawer({ type, show, onClose }: Props) {

  const { windowWidth, breakpoint } = useWindow()
  const [form] = Form.useForm()

  const [selectedArtworkIds, setSelectedArtworkIds] = useState<number[]>([]);

  const handleClose = () => {
    onClose();
  }

  function handleSubmit() {
    form.validateFields().then(values => {
      axios.post(route('reports.store'), {
        type,
        name: values.name,
        description: values.description,
        options: {
          size: values.size,
          include_sku: values.include_sku,
          include_price: values.include_price,
        },
        artworks: selectedArtworkIds,
      })
        .then(() => {
          message.success('Report created successfully');
          form.resetFields();
          setSelectedArtworkIds([]);
          onClose();
        })
        .catch((err) => {
          message.error(err?.response?.data?.message || 'Failed to create report');
        })
    })
    .catch(e => {})
  }

  const title = (
    <div>
      <span>Create New Report</span>
      <Divider orientation="vertical" />
      <span className="text-primary-700 dark:text-primary-300">{keyToTitle(type)}</span>
    </div>
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
        >
          Create
        </Button>
      }
      styles={{
        body: {
          paddingBottom: '3rem'
        }
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          'name': `${keyToTitle(type)} - ${dayjs().format('LL')}`,
          'size': DEFAULT_SIZE.value,
          'include_sku': true,
          'include_price': true,
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

            {/* Size */}
            <Form.Item
              name="size"
              label="Size"
            >
              <Select
                options={SIZE_OPTIONS}
                optionRender={(option: any) => (
                  <FlexBox direction="col" alignItems="start" gap={0}>
                    <div>{option.label}</div>
                    <div className="text-sm font-light">{option.data.description}</div>
                  </FlexBox>
                )}
                labelRender={(props) => (
                  <FlexBox direction="col" alignItems="start" gap={0}>
                    <div>{props.label}</div>
                    <div className="text-sm font-light">{SIZE_OPTIONS.find(option => option.value === props.value)?.description}</div>
                  </FlexBox>
                )}
                placeholder="Select size"
                defaultValue={DEFAULT_SIZE.value}
              />
            </Form.Item>

            {/* SKU */}
            <Form.Item
              name="include_sku"
              valuePropName="checked"
              initialValue={true}
              className="mb-0"
            >
              <Checkbox>
                Include SKU
              </Checkbox>
            </Form.Item>

            {/* Price */}
            <Form.Item
              name="include_price"
              valuePropName="checked"
              initialValue={true}
            >
              <Checkbox>
                Include Price
              </Checkbox>
            </Form.Item>
          </div>
          <div>
            {/* Description */}
            <Form.Item
              name="description"
              label="Description"
            >
              <Input.TextArea placeholder="Enter report description" rows={5} />
            </Form.Item>
          </div>
        </div>
        <StyledDivider rootClassName="mb-3" >Select Artworks</StyledDivider>
        <div className="mb-5 w-full overflow-x-auto">
          <ArtworkSelector setSelectedIds={setSelectedArtworkIds} />
        </div>
        <Divider />
      </Form>
    </Drawer>
  )
}

export default CreateArtworksReportsDrawer
