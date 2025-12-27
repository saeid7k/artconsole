import ArtistStack from "@/Components/ArtistStack";
import { ARTWORK_CATEGORIES } from "@/constants/artworkCategories";
import ARTWORK_EDITIONS from "@/constants/artworkEditions";
import { ArtworkProps } from "@/types/artwork";
import { router } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import { Button, Divider, Drawer, Form, Input, message, Select } from "antd";
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

  // Watchers

  const watchArtistId = Form.useWatch('artist_id', form);
  const watchArtistDataName = Form.useWatch(['artist_data', 'firstname'], form);
  const watchEditionType = Form.useWatch(['edition', 'type'], form);
  const watchEditionNumber = Form.useWatch(['edition', 'number'], form);

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
        initialValues={artwork ? artwork : {}}
        validateTrigger="onBlur"
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[
            { required: true, message: 'Title is required' },
            { max: 255, message: 'Title cannot exceed 255 characters' }
          ]}
          className=""
        >
          <Input />
        </Form.Item>
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
          {watchArtistId && artistSelected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArtistStack
                artist={artistSelected}
                unsetFunction={clearArtist}
                className="mb-3"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Artist Selector */}
        {!watchArtistId && (
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
            {watchArtistDataName?.length > 0 && (
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

        {/* Edition */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Form.Item
            label="Edition"
            name={["edition", "type"]}
            className="sm:w-1/3"
          >
            <Select
              options={ARTWORK_EDITIONS}
            />
          </Form.Item>
          <Form.Item
            label="Work #"
            name={["edition", "number"]}
            className="sm:w-1/3"
            hidden={watchEditionType === 'unique'}
          >
            <Input
              type="number"
              min={1}
              onChange={(e) => {adjustSizeValue(Number(e.target.value))}}
            />
          </Form.Item>
          <Form.Item
            label="Size"
            name={["edition", "size"]}
            className="sm:w-1/3"
            hidden={['unique', 'open'].includes(watchEditionType)}
          >
            <Input
              type="number"
              min={watchEditionNumber || 1}
              onChange={(e) => {
                let timer = setTimeout(() => {
                  adjustSizeValue(Number(watchEditionNumber))
                  clearTimeout(timer);
                }, 2000);
              }}
            />
          </Form.Item>
        </div>

        <Form.Item
          label="Year"
          name="year"
          rules={[
            { required: false },
            { pattern: /^\d{4}$/, message: 'Year must be a 4-digit number' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Description'
          name="description"
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Divider />

        <Form.Item
          label="Medium"
          name="medium"
        >
          <Input />
        </Form.Item>

        <Divider />
        <Form.Item
          label="Category"
          name="category"
        >
          <Select
            defaultValue={ARTWORK_CATEGORIES[0].value}
            options={ARTWORK_CATEGORIES}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
}

export default ArtworkFormDrawer
