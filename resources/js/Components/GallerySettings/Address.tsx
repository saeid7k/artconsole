import { useGallerySettings } from "@/contexts/GallerySettingsContext"
import { formatAddress } from "@/utils/addressHelper"
import { router } from "@inertiajs/react"
import { Form, message } from "antd"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import ActionFooter from "../ActionFooter"
import AddressFields from "../FormFields/AddressFields"
import GoogleMap from "../GoogleMap"

function Address() {

  // Constants

  const { gallery, open } = useGallerySettings()
  const isInitialAddressMount = useRef(true);
  const [form] = Form.useForm()

  // Coordinates

  const watchAddress = Form.useWatch('address', form)

  const [coordinates, setCoordinates] = useState<{ lat: number | null; lng: number | null }>({
    lat: gallery.address?.coordinates?.lat || null,
    lng: gallery.address?.coordinates?.lng || null
  });

  function getCoordinates(address: string) {
    if (address.replaceAll(' ', '').replaceAll(',', '') == '') return;

    axios.get(route('geocode.coordinates'), {
      params: { address }
    })
      .then((res) => {
        let response = res.data
        setCoordinates({ lat: response.lat, lng: response.lng })

        if (form.getFieldValue('address').postal_code == '' && response.postal_code) {
          form.setFieldsValue({ address: { postal_code: response.postal_code } });
        }
      })
      .catch(() => {
        message.error("Failed to fetch coordinates for the provided address")
      });
  }

  useEffect(() => {
    if (!watchAddress) return;

    if (isInitialAddressMount.current) {
      isInitialAddressMount.current = false;
      return;
    }

    const locationTimeout = setTimeout(() => {
      getCoordinates(formatAddress(watchAddress));
    }, 3000);
    return () => clearTimeout(locationTimeout);
  }, [watchAddress]);

  // Save Changes

  const [processing, setProcessing] = useState(false);

  function handleSave() {
    form
      .validateFields()
      .then((values) => {
        setProcessing(true);
        axios.post(route('galleries.update-address', { gallery: gallery.id }), {
          ...values,
          address: {
            ...values.address,
            coordinates: coordinates
          }
        })
          .then((res) => {
            message.success(res.data.message || "Gallery address updated successfully")
            router.reload()
          })
          .catch((e) => {
            message.error(e.response?.data?.message || "Failed to update gallery address")
          })
          .finally(() => {
            setProcessing(false);
          });
      })
  }

  // Effects

  useEffect(() => {
    if (open) {
      form.resetFields()
    }
  }, [open]);

  return (
    <div className="flex flex-col gap-3">
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          address: gallery?.address || '',
        }}
        validateTrigger="onSubmit"
      >
        <AddressFields />
      </Form>
      <GoogleMap
        coordinates={coordinates}
      />
      <ActionFooter
        isProcessing={processing}
        save={handleSave}
      />
    </div>
  )
}

export default Address
