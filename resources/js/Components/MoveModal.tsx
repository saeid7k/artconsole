import useLocations from "@/hooks/useLocations";
import { ArtworkProps } from "@/types/artwork";
import { router } from "@inertiajs/react";
import { Form, Input, message, Modal, Select } from "antd";
import axios from "axios";
import { useEffect } from "react";

type Props = {
  open?: boolean;
  setOpen: (open: boolean) => void;
  artwork: ArtworkProps | number[] | null;
}

function MoveModal({ open = false, setOpen, artwork }: Props) {

  const [moveForm] = Form.useForm()

  // Fetch Locations & Options

  const {  locationsOptions, defaultLocationValue } = useLocations({ enableQuery: open });

  useEffect(() => {
    if (open && locationsOptions && locationsOptions.length > 0) {
      moveForm.setFieldsValue({
        new_location: defaultLocationValue,
      });
    }
  }, [open, locationsOptions]);

  // Handle Move

  function handleMove() {
    moveForm.validateFields()
    .then(() => {
      let apiRequest;
      if (Array.isArray(artwork)) {
        apiRequest = axios.post(route('artworks.mass-move'), {
          artwork_ids: artwork,
          location_id: moveForm.getFieldValue('new_location'),
          reason: moveForm.getFieldValue('reason'),
        });
      } else {
        if (moveForm.getFieldValue('new_location') == artwork?.location_id) {
          message.info('Artwork is already in the selected location.');
          return;
        }
        apiRequest = axios.post(route('artworks.move', { artwork: artwork?.id }), {
          location_id: moveForm.getFieldValue('new_location'),
          reason: moveForm.getFieldValue('reason'),
        });
      }
      apiRequest
      .then(() => {
        message.success('Location changed successfully.');
        moveForm.resetFields();
        setOpen(false);
        router.reload();
      })
      .catch((error) => {
        message.error(error.response?.data?.message || 'Failed to move location.');
      });
    })
  }

  // Handle Close

  function handleClose() {
    moveForm.resetFields();
    setOpen(false);
  }

  return (
    <Modal
      title="Move Location"
      open={open}
      onCancel={handleClose}
      okText="Move"
      onOk={handleMove}
    >
      {Array.isArray(artwork) ? (
        <blockquote>Moving <span className="text-blue-500 font-bold">{artwork.length}</span> artworks</blockquote>
      ) : (
        <blockquote>Moving artwork <span className="text-blue-500 font-bold">{artwork?.title}</span></blockquote>
      )}
      <Form
        layout="vertical"
        form={moveForm}
        onFinish={handleMove}
        initialValues={{
          new_location: defaultLocationValue,
        }}
        className="mt-5"
      >
        <Form.Item
          label="Where to?"
          name="new_location"
          rules={[{ required: true, message: 'Please select a new location.' }]}
        >
          <Select
            placeholder="Select a location"
            options={locationsOptions}
          />
        </Form.Item>
        <Form.Item
          label="Reason"
          name="reason"
          rules={[{ max: 200, message: 'Reason cannot exceed 200 characters.' }]}
        >
          <Input
            placeholder="Optional reason for moving (e.g., exhibition, sale, storage)"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MoveModal;
