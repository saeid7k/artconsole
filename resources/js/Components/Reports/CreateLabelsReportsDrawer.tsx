import { DEFAULT_SIZE, SIZE_OPTIONS } from "@/constants/artworksLabelReport";
import { useWindow } from "@/hooks/useWindow";
import { router } from "@inertiajs/react";
import { Button, Checkbox, Divider, Drawer, Form, Input, message, Select } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import ArtworkSelector from "../Artworks/ArtworkSelector";
import FlexBox from "../Containers/FlexBox";
import StyledDivider from "../StyledDivider";

type Props = {
  show: boolean;
  onClose: () => void;
}

function CreateLabelsReportsDrawer({ show, onClose }: Props) {

  const { windowWidth, breakpoint } = useWindow()
  const [form] = Form.useForm()

  const [selectedArtworkIds, setSelectedArtworkIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    onClose();
  }

  function handleSubmit() {
    form.validateFields().then(values => {
      setSaving(true);
      axios.post(route('reports.store'), {
        type: 'artworks_label',
        name: values.name,
        description: values.description,
        options: {
          size: values.size,
          sku: values.sku,
          artist_name: values.artist_name,
          artwork_title: values.artwork_title,
          mediums: values.mediums,
          dimensions: values.dimensions,
          price: values.price,
          border: values.border,
        },
        artworks: selectedArtworkIds,
      })
        .then(() => {
          message.success('Report created successfully');
          form.resetFields();
          setSelectedArtworkIds([]);
          onClose();
          router.reload({ only: ['reports'] });
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

  // Effects

  // auto set fields by Size
  useEffect(() => {
    if (formWatch?.size === 'small') {
      form.setFieldsValue({ sku: false })
    }
  }, [formWatch?.size])

  // Render

  const title = (
    <div>
      <span>Create New Report</span>
      <Divider orientation="vertical" />
      <span className="text-primary-700 dark:text-primary-300">Artworks Label</span>
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
          'name': `Artworks Label - ${dayjs().format('LL')}`,
          'size': DEFAULT_SIZE.value,
          'sku': false,
          'artist_name': true,
          'artwork_title': true,
          'mediums': true,
          'dimensions': true,
          'price': true,
          'border': true,
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
              <Input.TextArea placeholder="Enter report description" rows={5} />
            </Form.Item>
          </div>
          <div>
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

            {/* Include Data */}
            <div>
              <div className="label">Include Data</div>
              <div className="ps-5 grid grid-cols-1 sm:grid-cols-3 gap-x-5">
                {/* SKU */}
                <Form.Item
                  name="sku"
                  valuePropName="checked"
                  initialValue={true}
                  className="mb-0"
                >
                  <Checkbox
                    disabled={formWatch?.size === 'small'}
                  >
                    SKU
                  </Checkbox>
                </Form.Item>

                {/* Artist Name */}
                <Form.Item
                  name="artist_name"
                  valuePropName="checked"
                  initialValue={true}
                  className="mb-0"
                >
                  <Checkbox>
                    Artist Name
                  </Checkbox>
                </Form.Item>

                {/* Artwork Title */}
                <Form.Item
                  name="artwork_title"
                  valuePropName="checked"
                  initialValue={true}
                  className="mb-0"
                >
                  <Checkbox>
                    Artwork Title
                  </Checkbox>
                </Form.Item>

                {/* Mediums */}
                <Form.Item
                  name="mediums"
                  valuePropName="checked"
                  initialValue={true}
                  className="mb-0"
                >
                  <Checkbox>
                    Mediums
                  </Checkbox>
                </Form.Item>

                {/* Dimensions */}
                <Form.Item
                  name="dimensions"
                  valuePropName="checked"
                  initialValue={true}
                  className="mb-0"
                >
                  <Checkbox>
                    Dimensions
                  </Checkbox>
                </Form.Item>

                {/* Price */}
                <Form.Item
                  name="price"
                  valuePropName="checked"
                  initialValue={true}
                  className="mb-0"
                >
                  <Checkbox>
                    Price
                  </Checkbox>
                </Form.Item>
              </div>
            </div>

            {/* Design */}
            <div className="mt-3">
              <div className="label">Design</div>
              <div className="ps-5 grid grid-cols-1 sm:grid-cols-3 gap-x-5">
                {/* Border */}
                <Form.Item
                  name="border"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Checkbox>
                    Print Border
                  </Checkbox>
                </Form.Item>
              </div>
            </div>

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

export default CreateLabelsReportsDrawer
