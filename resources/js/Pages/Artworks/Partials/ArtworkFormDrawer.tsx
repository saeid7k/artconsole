import AnimatedContainer from "@/Components/AnimatedContainer";
import ContactWidget from "@/Components/Contacts/ContactWidget";
import FlexBox from "@/Components/Containers/FlexBox";
import HtmlEditor from "@/Components/HtmlEditor";
import ManageTagsModal from "@/Components/ManageTagsModal";
import { ARTWORK_CATEGORIES, DEFAULT_ARTWORK_CATEGORY } from "@/constants/artworkCategories";
import ARTWORK_EDITIONS from "@/constants/artworkEditions";
import ARTWORK_STATUSES, { DEFAULT_ARTWORK_STATUS } from "@/constants/artworkStatuses";
import CONFIGS from "@/constants/configs.json";
import { CURRENCIES } from "@/constants/currencies";
import { FORM_RULES } from "@/constants/formRules";
import { useApp } from "@/contexts/AppContext";
import useLocations from "@/hooks/useLocations";
import { ArtworkProps } from "@/types/artwork";
import { UsePageProps } from "@/types/usePage";
import { Alert02Icon, InboxUploadIcon, MagicWand05Icon, Settings01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router, usePage } from "@inertiajs/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Checkbox, DatePicker, Drawer, Form, Input, InputNumber, message, Radio, Segmented, Select, Space, Tabs, Tooltip } from "antd";
import Dragger from "antd/es/upload/Dragger";
import axios from "axios";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { serialize } from "object-to-formdata";
import { useEffect, useState } from "react";

type Props = {
  mode?: 'create' | 'update';
  artwork?: ArtworkProps|null;
  show: boolean;
  onClose: () => void;
}

function ArtworkFormDrawer({ mode = 'create', artwork = null, show, onClose }: Props) {

  const { currencySymbol } = useApp();
  const [form] = Form.useForm();
  const currency = usePage<UsePageProps>().props.current_gallery?.currency || CONFIGS.defaults.currency

  // Drawer handlers

  function handleClose() {
    form.resetFields()
    onClose()
  }

  function handleSave() {
    form
    .validateFields()
    .then((values) => {
        const imageList = values.images?.map((image: any) => image.originFileObj) || [];

        const payload = {
          ...values,
          mode: mode,
          artwork_id: mode == 'update' ? artwork?.id : null,
          images: imageList,
        }
        const formData = serialize(payload, { indices: true, booleansAsIntegers: true });

        axios.post(route('artworks.store-update'), formData)
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
        .get(route('contacts.artists'))
        .then(res => {
          let artists = res.data;
          setAllArtists(artists);
          setArtistsOptions(artists.map((artist: any) => ({
            label: artist.full_name,
            value: artist.id,
          })));
          return artists;
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
    form.setFieldValue('owner_contact_id', null);
    setOwnerSelected(null);
  }

  function onChangeOwner(value: string | number) {
    form.setFieldValue('owner_contact_id', value);
    setOwnerSelected(prev => allContacts.find((contact: any) => contact.id === value) || prev);
  }

  useEffect(() => {
    setOwnerSelected(artwork?.owner);
  }, [show])

  const contactsQuery = useQuery({
    queryKey: ['all-contacts-query'],
    queryFn: () =>
      axios
        .get(route('contacts.all'))
        .then(res =>{
          let contacts = res.data;
          setAllContacts(contacts);
          setContactsOptions(contacts.map((contact: any) => ({
            label: contact.full_name,
            value: contact.id,
          })));
          return contacts;
        }),
    enabled: show,
  })

  // Locations

  const { locationsOptions, defaultLocationValue } = useLocations({ enableQuery: show });

  // Manage Tags

  const [showManageTags, setShowManageTags] = useState(false);
  const [manageTagsType, setManageTagsType] = useState<'tag' | 'subject' | 'medium' | 'style'>('tag');

  // Watchers

  const watchForm = Form.useWatch([], form)

  const defaultArtistMode = watchForm?.artist_selection_mode ? watchForm?.artist_selection_mode : (artwork?.artist_id ? 'select' : 'add');

  // Error Watchers

  const generalTabHasError = form.getFieldsError(['title', 'status', 'artist_id', 'year', 'price', 'edition', 'signed']).some((field) => field.errors.length > 0);
  const descriptionTabHasError = form.getFieldsError(['description']).some((field) => field.errors.length > 0);
  const specificationsTabHasError = form.getFieldsError(['category', 'subjects', 'mediums', 'styles', 'dimensions']).some((field) => field.errors.length > 0);
  const inventoryTabHasError = form.getFieldsError(['location_id', 'ownership', 'owner_contact_id', 'sku', 'provenance']).some((field) => field.errors.length > 0);

  return (
    <>
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
            artist_data: {
              firstname: '',
              lastname: '',
            },
            category: DEFAULT_ARTWORK_CATEGORY.value,
            dimensions: {
              unit: 'inches',
            },
            location_id: defaultLocationValue,
            ownership: 'owned',
          }}
          validateTrigger="onBlur"
        >
          <Tabs type="card" >
            {/* General */}
            <Tabs.TabPane
              tab={
                <FlexBox>
                  General
                  {generalTabHasError ? <HugeiconsIcon icon={Alert02Icon} size={12} color="red" /> : ""}
                </FlexBox>
              }
              key="general"
            >
              {/* Title & Status */}

              <div className="flex flex-col sm:flex-row gap-x-4">
                <Form.Item
                  label="Title"
                  name="title"
                  rules={FORM_RULES.title}
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

              {/* Artist Hidden Fields */}

              <Form.Item
                label="Artist ID"
                name="artist_id"
                hidden
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item
                label="Artist Firstname"
                name={["artist_data", "firstname"]}
                hidden
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Artist Lastname"
                name={["artist_data", "lastname"]}
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
                    <label>Artist</label>
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
                <>
                  <Form.Item
                    label="Artist"
                    name='artist_selection_mode'
                    className="mb-2"
                  >
                    <Segmented
                      options={[
                        { label: 'Select from Contacts', value: 'select' },
                        { label: 'Type Name', value: 'add' },
                      ]}
                      defaultValue={defaultArtistMode}
                    />
                  </Form.Item>
                  <div className="flex gap-1">
                    {defaultArtistMode == 'select' && (
                      <Form.Item
                        className="w-full sm:w-1/2"
                      >
                        <Select
                          options={artistsOptions}
                          placeholder="Select"
                          showSearch={{ optionFilterProp: ['label', 'value'] }}
                          onChange={(value: string) => onChangeArtist(value)}
                          onDeselect={() => clearArtist()}
                        />
                      </Form.Item>
                    )}
                    {defaultArtistMode === 'add' && (
                      <Form.Item
                        name={["artist_data", "full_name"]}
                        className="w-full sm:w-1/2"
                      >
                        <Input
                          placeholder="Type"
                          defaultValue={
                            form.getFieldValue(['artist_data', 'firstname'])
                            + form.getFieldValue(['artist_data', 'lastname']) ? (' ' + form.getFieldValue(['artist_data', 'lastname'])) : ''
                          }
                          onChange={(e) => {
                            const fullName = e.target.value;
                            const [firstname, ...lastnameParts] = fullName.split(' ');
                            const lastname = lastnameParts.join(' ');
                            form.setFieldValue(['artist_data', 'firstname'], firstname);
                            form.setFieldValue(['artist_data', 'lastname'], lastname);
                          }}
                        />
                      </Form.Item>
                    )}
                    {watchForm?.artist_data?.firstname?.length > 0 && (
                      <Button
                        type="dashed"
                        size="middle"
                        className="text-xs"
                        onClick={addToContacts}
                      >
                        Add to Contacts
                      </Button>
                    )}
                  </div>
                </>
              )}

              {/* Year */}

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

              {/* Price */}

              <Form.Item
                label="Price"
                name="price"
                className="sm:w-1/4"
              >
                <Space.Compact>
                  <Space.Addon>{CURRENCIES.find(c => c.code === currency)?.symbol}</Space.Addon>
                  <InputNumber
                    min={0}
                    step={1}
                    precision={2}
                    className="w-full"
                    defaultValue={form.getFieldValue('price')}
                  />
                </Space.Compact>
              </Form.Item>

              {/* Edition */}

              <div className="flex flex-col sm:flex-row gap-2">
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

              {/* Signed */}

              <div className="flex flex-col sm:flex-row gap-x-2">
                <Form.Item
                  label="Signed"
                  name="signed"
                  valuePropName="checked"
                >
                  <Checkbox>Artwork is signed</Checkbox>
                </Form.Item>
                <Form.Item
                  label="Signature Note"
                  name="signature_note"
                  className="grow"
                  rules={[
                    { max: 1000, message: 'Signature note cannot exceed 1000 characters'}
                  ]}
                >
                  <Input.TextArea rows={1} />
                </Form.Item>
              </div>

            </Tabs.TabPane>

            {/* Images */}
            {mode === 'create' && (
              <Tabs.TabPane tab="Images" key="images">
                <Form.Item
                  // label="Upload Files"
                  name="images"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => {
                    if (Array.isArray(e)) {
                      return e;
                    }
                    return e?.fileList;
                  }}
                >
                  <Dragger
                    multiple
                    beforeUpload={() => false}
                    listType="picture"
                  >
                    <FlexBox direction="col" className="font-light p-5" >
                      <HugeiconsIcon icon={InboxUploadIcon} size={48} strokeWidth={0.5} />
                      <div className="text-xl text-gray-500 mt-3" >Click or drag files here to upload</div>
                      <div className="text-sm text-gray-400" >All image types are supported</div>
                    </FlexBox>
                  </Dragger>
                </Form.Item>
              </Tabs.TabPane>
            )}

            {/* Description */}
            <Tabs.TabPane
              tab={
                <FlexBox>
                  Description
                  {descriptionTabHasError ? <HugeiconsIcon icon={Alert02Icon} size={12} color="red" /> : ""}
                </FlexBox>
              }
              key="description"
            >
              <Form.Item
                label='Description'
                name="description"
                rules={FORM_RULES.description}
              >
                <HtmlEditor
                  showMediaToolbar={false}
                />
              </Form.Item>
              {watchForm?.description?.length > 20000 && (
                <div className="text-red-500 text-sm mt-1">Description cannot exceed 20000 characters</div>
              )}
            </Tabs.TabPane>

            {/* Specifications */}
            <Tabs.TabPane
              tab={
                <FlexBox>
                  Specifications
                  {specificationsTabHasError ? <HugeiconsIcon icon={Alert02Icon} size={12} color="red" /> : ""}
                </FlexBox>
              }
              key="specifications"
            >
              <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true, message: 'Category is required' }]}
                className="sm:w-1/2"
              >
                <Select
                  options={ARTWORK_CATEGORIES}
                />
              </Form.Item>
              <FlexBox>
                <Form.Item
                  label="Subjects"
                  name="subjects"
                  className="sm:w-1/2"
                >
                  <Select
                    mode="multiple"
                    options={tagsQuery.data ? tagsQuery.data['subject']?.map((tag: string) => ({
                      label: tag,
                      value: tag,
                    })) : []}
                    placeholder="Select subjects"
                    maxCount={10}
                    // onChange={(value) => {form.setFieldValue('subject', value.length > 0 ? stringifyArray(value) : null)}}
                    disabled={tagsQuery.isLoading}
                  />
                </Form.Item>
                <Tooltip title="Manage Subjects">
                  <Button
                    type="text"
                    className="text-ghost"
                    shape="circle"
                    onClick={() => {
                      setManageTagsType('subject');
                      setShowManageTags(true);
                    }}
                  >
                    <HugeiconsIcon icon={Settings01Icon} size={16} />
                  </Button>
                </Tooltip>
              </FlexBox>
              <FlexBox>
                <Form.Item
                  label="Mediums"
                  name="mediums"
                  className="sm:w-1/2"
                >
                  <Select
                    mode="multiple"
                    options={tagsQuery.data ? tagsQuery.data['medium']?.map((tag: string) => ({
                      label: tag,
                      value: tag,
                    })) : []}
                    placeholder="Select mediums"
                    maxCount={10}
                    // onChange={(value) => form.setFieldValue('medium', value.length > 0 ? stringifyArray(value) : null)}
                    disabled={tagsQuery.isLoading}
                  />
                </Form.Item>
                <Tooltip title="Manage Mediums">
                  <Button
                    type="text"
                    className="text-ghost"
                    shape="circle"
                    onClick={() => {
                      setManageTagsType('medium');
                      setShowManageTags(true);
                    }}
                  >
                    <HugeiconsIcon icon={Settings01Icon} size={16} />
                  </Button>
                </Tooltip>
              </FlexBox>
              <FlexBox>
                <Form.Item
                  label="Styles"
                  name="styles"
                  className="sm:w-1/2"
                >
                  <Select
                    mode="multiple"
                    options={tagsQuery.data ? tagsQuery.data['style']?.map((tag: string) => ({
                      label: tag,
                      value: tag,
                    })) : []}
                    placeholder="Select or type styles"
                    maxCount={10}
                    // onChange={(value) => form.setFieldValue('styles', stringifyArray(value))}
                    disabled={tagsQuery.isLoading}
                  />
                </Form.Item>
                <Tooltip title="Manage Styles">
                  <Button
                    type="text"
                    className="text-ghost"
                    shape="circle"
                    onClick={() => {
                      setManageTagsType('style');
                      setShowManageTags(true);
                    }}
                  >
                    <HugeiconsIcon icon={Settings01Icon} size={16} />
                  </Button>
                </Tooltip>
              </FlexBox>

              {/* Size */}

              <label className="block mb-1">Dimensions</label>
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

            </Tabs.TabPane>

            {/* Inventory */}
            <Tabs.TabPane
              tab={
                <FlexBox>
                  Inventory
                  {inventoryTabHasError ? <HugeiconsIcon icon={Alert02Icon} size={12} color="red" /> : ""}
                </FlexBox>
              }
              key="inventory"
            >

              {/* Location */}
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

              {/* SKU */}
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
                      value={watchForm?.sku || ''}
                      onChange={(e) => form.setFieldValue('sku', e.target.value)}
                    />
                    <Tooltip title="Auto Generate SKU">
                      <Button
                        color="primary"
                        variant="outlined"
                        onClick={() => generateSkuMutation.mutate()}
                        className="rounded-s-none"
                        icon={<HugeiconsIcon icon={MagicWand05Icon} size={16} />}
                        loading={generateSkuMutation.isPending}
                      />
                    </Tooltip>
                  </Form.Item>
                </Space.Compact>
              </Form.Item>

              {/* Ownership */}
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
              <AnimatedContainer condition={watchForm?.ownership === 'consigned'} speed="slow" >
                {!ownerSelected && (
                  <Form.Item
                    label='Owner'
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

                <div className="label">Gallery Commission</div>
                <FlexBox className="w-full" >
                  <Form.Item
                    name='commission_mode'
                  >
                    <Segmented
                      options={[
                        { label: '%', value: 'percentage' },
                        { label: currencySymbol, value: 'fixed' },
                      ]}
                      value={form.getFieldValue('commission_mode')}
                    />
                  </Form.Item>
                  <Form.Item
                    name='commission_value'
                    className="grow"
                  >
                    <InputNumber
                      className="w-full"
                      min={0}
                      max={watchForm?.commission_mode == 'percentage' ? 100 : undefined}
                    />
                  </Form.Item>
                </FlexBox>
              </AnimatedContainer>
              <Form.Item
                label=""
                name="owner_contact_id"
                hidden
              >
                <Input />
              </Form.Item>

              {/* Owned Fields */}

              <AnimatePresence>
                {watchForm?.ownership === 'owned' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                  >
                    <Form.Item
                      label="Acquisition Price"
                      name="acquisition_price"
                    >
                        <Space.Compact className="w-full">
                        <Space.Addon>{CURRENCIES.find(c => c.code === currency)?.symbol}</Space.Addon>
                        <InputNumber
                          min={0}
                          step={1}
                          precision={2}
                          className="w-full"
                          defaultValue={form.getFieldValue('acquisition_price')}
                        />
                      </Space.Compact>
                    </Form.Item>

                    <Form.Item
                      label="Acquisition Date"
                      name="acquisition_date"
                      getValueProps={(value) => ({
                        value: value ? dayjs(value) : null,
                      })}
                      getValueFromEvent={(date, dateString) => dateString}
                    >
                      <DatePicker
                        className="w-full"
                      />
                    </Form.Item>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Consignment Terms */}
              <Form.Item
                label="Consignment Terms"
                name="consignment_terms"
                rules={[{ max: 20000, message: 'Consignment Terms cannot exceed 20000 characters'}]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>

              {/* Provenance */}
              <Form.Item
                label="Provenance"
                name="provenance"
                rules={[{ max: 20000, message: 'Provenance cannot exceed 20000 characters'}]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
            </Tabs.TabPane>
          </Tabs>
        </Form>
      </Drawer>

      <ManageTagsModal
        open={showManageTags}
        setOpen={setShowManageTags}
        type={manageTagsType}
      />

    </>
  );
}

export default ArtworkFormDrawer
