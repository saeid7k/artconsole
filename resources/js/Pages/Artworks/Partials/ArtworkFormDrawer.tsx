import ContactWidget from "@/Components/ContactWidget";
import StyledDivider from "@/Components/StyledDivider";
import { ARTWORK_CATEGORIES, DEFAULT_ARTWORK_CATEGORY } from "@/constants/artworkCategories";
import ARTWORK_EDITIONS from "@/constants/artworkEditions";
import ARTWORK_STATUSES, { DEFAULT_ARTWORK_STATUS } from "@/constants/artworkStatuses";
import useLocations from "@/hooks/useLocations";
import { ArtworkProps } from "@/types/artwork";
import { stringifyArray } from "@/utils/stringHelper";
import { MagicWand05Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router } from "@inertiajs/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Drawer, Form, Input, InputNumber, message, Radio, Select, Space, Spin, Tooltip } from "antd";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type Props = {
  mode?: 'create' | 'update';
  artwork?: ArtworkProps|null;
  show: boolean;
  onClose: () => void;
}

function ArtworkFormDrawer({ mode = 'create', artwork = null, show, onClose }: Props) {

  const [form] = Form.useForm();

  // Drawer handlers

  function handleClose() {
    form.resetFields()
    onClose()
  }

  function handleSave() {
    form
    .validateFields()
    .then((values) => {
        axios.post(route('artworks.store-update'), {
          ...values,
          mode: mode,
          artwork_id: mode == 'update' ? artwork?.id : null,
        })
          .then((res) => {
            message.success(res.data.message || `Artwork ${mode === 'update' ? 'updated' : 'created'} successfully`)
            router.reload()
            handleClose()
          })
          .catch((e) => {
            message.error(e.response?.data?.message || `Failed to ${mode === 'update' ? 'update' : 'create'} artwork`)
          });
      })
      .catch((e) => {
      })
  }

  // Artist selection

  const [allArtists, setAllArtists] = useState([]);
  const [artistsOptions, setArtistsOptions] = useState([]);
  const [artistSelected, setArtistSelected] = useState(artwork?.artist);

  const { refetch: refetchArtists } = useQuery({
    queryKey: ['artists-query'],
    queryFn: () =>
      axios
        .get(route('artists'))
        .then(res => {
          let artists = res.data;
          setAllArtists(artists);
          setArtistsOptions(artists.map((artist: any) => ({
            label: artist.full_name,
            value: artist.id,
          })));
        }),
    enabled: show,
  })

  function clearArtist() {
    form.setFieldsValue({
      artist_id: null,
      artist_data: {
        firstname: '',
        lastname: '',
        bio: '',
      },
    });
  }

  function addToContacts() {
    const artistName = form.getFieldValue(['artist_data', 'firstname']);
    axios.post(route('contacts.store'), {
      name: artistName,
      relationship: ['artist'],
    })
    .then((res) => {
      message.success('Artist added to contacts');
      let newArtist = res.data.contact;
      form.setFieldsValue({
        artist_id: newArtist.id,
        artist_data: {},
      })
      setArtistSelected(newArtist);
      refetchArtists();
    })
    .catch((e) => {
      message.error('Failed to add artist to contacts');
    });
  }

  function onChangeArtist(value: string | number) {
    if (typeof value == 'number') {
      setArtistSelected(prev => allArtists.find((artist: any) => artist.id === value) || prev);
      form.setFieldValue('artist_id', value);
      form.setFieldValue('artist_data', {});
    }
    if (typeof value == 'string') {
      form.setFieldValue('artist_data', {
        firstname: value
      });
      form.setFieldValue('artist_id', null);
    }
  }

  // Edition size adjustment

  function adjustSizeValue(min: number) {
    let value = min || 1;
    let size = form.getFieldValue(['edition', 'size']);
    if (size && size < value) {
      form.setFieldValue(['edition', 'size'], value);
    }
  }

  // Options fetching

  const tagsQuery = useQuery({
    queryKey: ['tags-grouped-query'],
    queryFn: () =>
      axios
        .get(route('tags.get-grouped'))
        .then(res => res.data),
    enabled: show,
  })

  // SKU Auto Generation

  const generateSkuMutation = useMutation({
    mutationFn: () =>
      axios
        .post(route('artworks.generate-sku'), {
          artwork: artwork ? artwork.id : null,
          category: form.getFieldValue('category') || null,
        })
        .then(res => {
          message.success('SKU generated successfully')
          form.setFieldValue('sku', res.data.sku)
          return res.data
        })
        .catch(e => {message.error(e.response?.data?.message || 'Failed to generate SKU')}),
  });

  // Owner selection

  const [ownerSelected, setOwnerSelected] = useState(artwork?.owner);
  const [allContacts, setAllContacts] = useState([]);
  const [contactsOptions, setContactsOptions] = useState([]);

  function clearOwner() {
    form.setFieldValue('owner_id', null);
    setOwnerSelected(null);
  }

  function onChangeOwner(value: string | number) {
    form.setFieldValue('owner_contact_id', value);
    setOwnerSelected(prev => allContacts.find((contact: any) => contact.id === value) || prev);
  }

  const contactsQuery = useQuery({
    queryKey: ['all-contacts-query'],
    queryFn: () =>
      axios
        .get(route('all-contacts'))
        .then(res =>{
          let contacts = res.data;
          setAllContacts(contacts);
          setContactsOptions(contacts.map((contact: any) => ({
            label: contact.full_name,
            value: contact.id,
          })));
        }),
    enabled: show,
  })

  // Locations

  const { locationsOptions, defaultLocationValue } = useLocations({ enableQuery: show });

  // Watchers

  const watchForm = Form.useWatch([], form)

  return (
    <Drawer
      title={`${mode === 'update' ? 'Edit' : 'Create'} Artwork`}
      placement="right"
      size="large"
      onClose={handleClose}
      open={show}
      extra={<Button type="primary" onClick={handleSave}>Save</Button>}
      afterOpenChange={() => form.resetFields()}
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={artwork ? artwork : {
          status: DEFAULT_ARTWORK_STATUS.value,
          category: DEFAULT_ARTWORK_CATEGORY.value,
          ownership: 'owned',
        }}
        validateTrigger="onBlur"
      >
        {/* Title & Status */}

        <div className="flex flex-col sm:flex-row gap-x-4">
          <Form.Item
            label="Title"
            name="title"
            rules={[
              { required: true, message: 'Title is required' },
              { max: 255, message: 'Title cannot exceed 255 characters' }
            ]}
            className="sm:w-3/4"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Status is required' }]}
            className="sm:w-1/4"
          >
            <Select
              defaultValue="available"
              options={ARTWORK_STATUSES}
            />
          </Form.Item>
        </div>

        {/* Artist Data */}

        <Form.Item
          label="Artist ID"
          name="artist_id"
          hidden
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="Artist Name"
          name={["artist_data", "firstname"]}
          hidden
        >
          <Input />
        </Form.Item>

        {/* Artist Stack */}

        <AnimatePresence>
          {watchForm?.artist_id && artistSelected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ContactWidget
                contact={artistSelected}
                title="Artist"
                unsetFunction={clearArtist}
                className="mb-3"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Artist Selector */}

        {!watchForm?.artist_id && (
          <div className="flex gap-1">
            <Form.Item
              label='Artist Name'
              className="lg:w-1/2"
            >
              <Select
                mode="tags"
                options={artistsOptions}
                maxCount={1}
                placeholder="Select from contacts or type a new artist name"
                showSearch={{ optionFilterProp: ['label', 'value'] }}
                onChange={(value: string[]) => onChangeArtist(value[0])}
                onDeselect={() => clearArtist()}
              />
            </Form.Item>
            {watchForm?.artist_data?.firstname?.length > 0 && (
              <Button
                type="dashed"
                size="small"
                className="self-center text-xs"
                onClick={addToContacts}
              >
                Add to Contacts
              </Button>
            )}
          </div>
        )}

        {/* Year & Edition */}

        <div className="flex flex-col sm:flex-row gap-2">
          <Form.Item
            label="Year"
            name="year"
            rules={[
              { required: false },
              { pattern: /^\d{4}$/, message: 'Year must be a 4-digit number' }
            ]}
            className="sm:w-1/4 sm:me-2"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Edition"
            name={["edition", "type"]}
            className="sm:w-1/4"
          >
            <Select
              options={ARTWORK_EDITIONS}
            />
          </Form.Item>
          <Form.Item
            label="Edition Work #"
            name={["edition", "number"]}
            className="sm:w-1/4"
            hidden={watchForm?.edition?.type === 'unique'}
          >
            <Input
              type="number"
              min={1}
              onChange={(e) => {adjustSizeValue(Number(e.target.value))}}
            />
          </Form.Item>
          <Form.Item
            label="Edition Total Size"
            name={["edition", "size"]}
            className="sm:w-1/4"
            hidden={['unique', 'open'].includes(watchForm?.edition?.type)}
          >
            <Input
              type="number"
              min={watchForm?.edition?.number || 1}
              onChange={(e) => {
                let timer = setTimeout(() => {
                  adjustSizeValue(Number(watchForm?.edition?.number))
                  clearTimeout(timer);
                }, 2000);
              }}
            />
          </Form.Item>
        </div>

        {/* Description */}

        <Form.Item
          label='Description'
          name="description"
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <StyledDivider variant="light" >Specifications</StyledDivider>

        {/* Medium & Styles */}

        <div className="flex flex-col sm:flex-row gap-4">
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: 'Category is required' }]}
            className="sm:w-1/2"
          >
            <Select
              defaultValue={ARTWORK_CATEGORIES[0].value}
              options={ARTWORK_CATEGORIES}
            />
          </Form.Item>
          <Form.Item
            label="Subject"
            name="subject"
            className="sm:w-1/2"
          >
            <Select
              mode="tags"
              options={tagsQuery.data ? tagsQuery.data['subject']?.map((tag: string) => ({
                label: tag,
                value: tag,
              })) : []}
              placeholder="Select or type a subject"
              maxCount={1}
              onChange={(value) => {form.setFieldValue('subject', value.length > 0 ? stringifyArray(value) : null)}}
              disabled={tagsQuery.isLoading || tagsQuery.isFetching}
            />
          </Form.Item>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Form.Item
            label="Medium"
            name="medium"
            className="sm:w-1/2"
          >
            <Select
              mode="tags"
              options={tagsQuery.data ? tagsQuery.data['medium']?.map((tag: string) => ({
                label: tag,
                value: tag,
              })) : []}
              placeholder="Select or type a medium"
              maxCount={1}
              onChange={(value) => form.setFieldValue('medium', value.length > 0 ? stringifyArray(value) : null)}
              disabled={tagsQuery.isLoading || tagsQuery.isFetching}
            />
          </Form.Item>
          <Form.Item
            label="Styles"
            name="styles"
            className="sm:w-1/2"
          >
            <Select
              mode="tags"
              options={tagsQuery.data ? tagsQuery.data['style']?.map((tag: string) => ({
                label: tag,
                value: tag,
              })) : []}
              placeholder="Select or type styles"
              // maxCount={1}
              // onChange={(value) => form.setFieldValue('styles', stringifyArray(value))}
              disabled={tagsQuery.isLoading || tagsQuery.isFetching}
            />
          </Form.Item>
        </div>

        {/* Size */}

        <div className="flex flex-col sm:flex-row gap-2">
          <Form.Item
            label="Width"
            name={["dimensions", "width"]}
            className="sm:w-1/4"
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>
          <Form.Item
            label="Height"
            name={["dimensions", "height"]}
            className="sm:w-1/4"
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>
          <Form.Item
            label="Depth"
            name={["dimensions", "depth"]}
            className="sm:w-1/4"
          >
            <InputNumber min={0} className="w-full" />
          </Form.Item>
          <Form.Item
            label="Unit"
            name={["dimensions", "unit"]}
            className="sm:w-1/4"
          >
            <Radio.Group
              block
              optionType="button"
              options={[
                { label: 'inches', value: 'inches' },
                { label: 'cm', value: 'cm' },
              ]}
            />
          </Form.Item>
        </div>

        {/* Price */}

        <Form.Item
          label="Price"
          name="price"
          className="sm:w-1/4"
        >
          <Space.Compact>
            <Space.Addon>$</Space.Addon>
            <InputNumber
              min={0}
              step={1}
              className="w-full"
              defaultValue={form.getFieldValue('price')}
              onChange={(value) => form.setFieldValue('price', value)}
              formatter={(value) => value ? Intl.NumberFormat('en-CA').format(value) : ''}
            />
          </Space.Compact>
        </Form.Item>

        <StyledDivider variant="light" >Inventory</StyledDivider>

        {/* Location, Ownership & SKU */}

        {mode === 'create' && (
          <Form.Item
            label="Location"
            name="location_id"
            className="sm:w-1/2"
          >
            <Select
              options={locationsOptions}
              defaultValue={defaultLocationValue}
              placeholder="Select a location"
              showSearch={{ optionFilterProp: ['label', 'value'] }}
            />
          </Form.Item>
        )}

        <div className="flex items-center gap-3">
          <Form.Item
            label='Ownership'
            name="ownership"
          >
            <Radio.Group
              optionType="button"
              options={[
                { label: 'Owned', value: 'owned' },
                { label: 'Consigned', value: 'consigned' },
              ]}
            />
          </Form.Item>
          {ownerSelected && watchForm?.ownership === 'consigned' && (
            <ContactWidget
              contact={ownerSelected}
              title="Owner"
              className="mb-3"
              unsetFunction={clearOwner}
            />
          )}
          {watchForm?.ownership === 'consigned' && !ownerSelected && (
            <Form.Item
              label='Owner'
              className="lg:w-1/3"
            >
              <Select
                options={contactsOptions}
                maxCount={1}
                placeholder="Select owner from contacts"
                showSearch={{ optionFilterProp: ['label', 'value'] }}
                onChange={(value: string) => onChangeOwner(value)}
              />
            </Form.Item>
          )}
          <Form.Item
            label=""
            name="owner_contact_id"
            hidden
          >
            <Input />
          </Form.Item>
        </div>

        <Form.Item
          label="SKU"
          className="sm:w-1/2"
          >
          <Space.Compact>
            <Form.Item
              name="sku"
              noStyle
              rules={[{ max: 100, message: 'SKU cannot exceed 100 characters' }]}
            >
              <Input
                defaultValue={form.getFieldValue('sku')}
                allowClear
                onClear={() => form.setFieldValue('sku', null)}
                className="rounded-e-none"
              />
              {!watchForm?.sku && (
                <Tooltip title="Auto Generate SKU">
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={() => generateSkuMutation.mutate()}
                    className="rounded-s-none"
                  >
                    {generateSkuMutation.isPending ? (
                      <Spin size="small" />
                    ):(
                      <HugeiconsIcon icon={MagicWand05Icon} size={20} />
                    )}
                  </Button>
                </Tooltip>
              )}
            </Form.Item>
          </Space.Compact>
        </Form.Item>

      </Form>
    </Drawer>
  );
}

export default ArtworkFormDrawer
