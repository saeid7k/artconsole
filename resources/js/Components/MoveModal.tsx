import { useArtworkShow } from "@/contexts/ArtworkShowContext";
import { LocationProps } from "@/types/location";
import { router } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import { Form, Input, message, Modal, Select } from "antd";
import axios from "axios";
import { useEffect } from "react";

type Props = {
  open?: boolean;
  setOpen: (open: boolean) => void;
}

function MoveModal({ open = false, setOpen }: Props) {

  const { artwork } = useArtworkShow();
  const [moveForm] = Form.useForm()

  // Fetch Locations & Options

  const { data: locations } = useQuery<LocationProps[]>({
    queryKey: ['locations-query'],
    queryFn: () =>
      axios.get(route('locations.options'))
        .then(response => response.data.locations),
    enabled: open,
  });

  const locationsOptions = locations?.map((loc) => ({
    label: loc.name + (loc.is_primary ? ' (Primary)' : ''),
    value: loc.id,
  })) || [];
  const defaultLocationValue = locations?.find(l => l.is_primary)?.id;

  useEffect(() => {
    if (open && locations && locations.length > 0) {
      moveForm.setFieldsValue({
        new_location: defaultLocationValue,
      });
    }
  }, [open, locations]);

  // Handle Move

  function handleMove() {
    moveForm.validateFields()
    .then(() => {
      axios.post(route('artworks.move', { artwork: artwork?.id }), {
        location_id: moveForm.getFieldValue('new_location'),
        reason: moveForm.getFieldValue('reason'),
      })
      .then(() => {
        message.success('Location moved successfully.');
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
