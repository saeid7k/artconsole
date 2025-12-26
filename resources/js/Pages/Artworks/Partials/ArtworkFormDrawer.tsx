import ArtistStack from "@/Components/ArtistStack";
import { ArtworkProps } from "@/types/artwork";
import { router } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import { Button, Divider, Drawer, Form, Input, message } from "antd";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

type Props = {
  mode?: 'create' | 'update';
  artwork?: ArtworkProps|null;
  show: boolean;
  onClose: () => void;
}

function ArtworkFormDrawer({ mode = 'create', artwork = null, show, onClose }: Props) {

  const [form] = Form.useForm();

  function handleClose() {
    form.resetFields()
    onClose()
  }

  function handleSave() {
    form
    .validateFields()
    .then((values) => {
        console.log(values);
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

  function clearArtist() {
    form.setFieldsValue({
      artist_id: null,
      artist_data: {
        firstname: '',
        lastname: '',
        bio: '',
      },
    });
    message.info('Artist cleared');
  }

  const { isPending, error, data: artists } = useQuery({
    queryKey: ['artists'],
    queryFn: () =>
      axios
        .get(route('artists'))
        .then(res => res.data),
    enabled: show,
  })

  const watchArtistId = Form.useWatch('artist_id', form);

  return (
    <Drawer
      title={`${mode === 'update' ? 'Edit' : 'Create'} Artwork`}
      placement="right"
      size="large"
      onClose={handleClose}
      open={show}
      extra={
        <div>
          <Button type="primary" onClick={handleSave}>Save</Button>
          <Button
            onClick={() => message.info(form.getFieldValue('artist_id'))}
          >
            Show Artist ID
          </Button>
        </div>
      }
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
        <AnimatePresence>
          {watchArtistId && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArtistStack
                artist={artwork?.artist}
                clearFunction={clearArtist}
                className="mb-3"
              />
            </motion.div>
          )}
        </AnimatePresence>
        {!watchArtistId && (
          <Form.Item
            label='Artist Name'
            name={['artist_data', 'firstname']}
          >
            <Input />
          </Form.Item>
        )}
        <Divider />
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
      </Form>
    </Drawer>
  );
}

export default ArtworkFormDrawer
