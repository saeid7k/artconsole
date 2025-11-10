import { useGallerySettings } from "@/contexts/GallerySettingsContext"
import { Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { router } from "@inertiajs/react"
import { Button, GetProp, Input, message, Tooltip, Upload, UploadProps } from "antd"
import TextArea from "antd/es/input/TextArea"
import axios from "axios"
import { useEffect, useState } from "react"
import LoadingSpinner from "../LoadingSpinner"

function General() {

  // Constants

  const { gallery, open } = useGallerySettings()
  const INITIAL_DATA = {
    logo: gallery?.logo || null,
    name: gallery?.name || '',
    description: gallery?.description || '',
  }

  // Save Changes

  const [data, setData] = useState<any>(INITIAL_DATA)
  const [processing, setProcessing] = useState(false)

  function handleChange(id: string, value: any) {
    setData((prev: any) => ({ ...prev, [id]: value }))
  }

  function save() {
    if (!validate()) return;

    setProcessing(true)
    axios.post(route('galleries.update', { gallery: gallery.id }), {
      ...data,
    }).then(() => {
      message.success('Changes saved successfully')
    }).catch(() => {
      message.error('Failed to save changes')
    }).finally(() => {
      setProcessing(false)
      router.reload()
    })
  }

  function validate() {
    if (!data?.name || data?.name.trim() === '') {
      message.error('Gallery name is required')
      return false
    }
    return true
  }

  const isDataChanged = JSON.stringify(gallery) !== JSON.stringify(data)

  // Update Logo

  const [logoLoading, setLogoLoading] = useState(false);

  type LogoType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
  const beforeUploadLogo = (file: LogoType) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image file!');
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('Image must smaller than 10MB!');
    }
    return isImage && isLt10M;
  }

  const handleChangeLogo: UploadProps['onChange'] = (info) => {
    setLogoLoading(true);

    const form = new FormData();
    const fileObj = (info.file as any).originFileObj ?? (info.file as unknown as Blob);
    if (fileObj) {
      form.append('logo', fileObj as Blob);
    }

    axios.post(route('galleries.update-logo', { gallery: gallery?.id }), form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((response) => {
      message.success('Logo updated successfully');
      setData((prev: any) => ({ ...prev, logo: response?.data?.url }));
    }).catch(() => {
      message.error('Failed to update logo');
    }).finally(() => {
      setLogoLoading(false);
    })
  }

  const uploadButton = (
    <button style={{ border: 0, background: 'none', cursor: 'pointer' }} type="button">
      {logoLoading ? <LoadingSpinner /> : <HugeiconsIcon icon={Add01Icon} />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  // Remove Logo

  function removeLogo() {
    setLogoLoading(true);

    axios.post(route('galleries.remove-logo', { gallery: gallery?.id }))
      .then(() => {
        message.success('Logo removed successfully');
        setData((prev: any) => ({ ...prev, logo: null }));
      })
      .catch(() => {
        message.error('Failed to remove logo');
      })
      .finally(() => {
        setLogoLoading(false);
      });
  }

  // Effects

  useEffect(() => {
    if (open) {
      setData(INITIAL_DATA);
    }
  }, [open]);

  return (
    <div className="flex flex-col gap-3">
      <ItemRow label="Logo">
        <div className="flex items-start gap-1">
          <Upload
            name="logo"
            listType="picture-card"
            className="avatar-uploader !cursor-pointer"
            showUploadList={false}
            beforeUpload={beforeUploadLogo}
            onChange={handleChangeLogo}
            customRequest={() => {}}
          >
            {data?.logo ? (
              <img draggable={false} src={data.logo} alt="avatar" style={{ width: '100%' }} />
            ) : (
              uploadButton
            )}
          </Upload>
          {data?.logo && (
            <div>
              <Tooltip title="Remove Logo">
                <Button
                  variant="text"
                  color="danger"
                  shape="circle"
                  onClick={removeLogo}
                >
                  <HugeiconsIcon icon={Delete02Icon} size={20}  />
                </Button>
              </Tooltip>
            </div>
          )}
        </div>
      </ItemRow>

      <ItemRow label="Name">
        <Input
          placeholder="Enter gallery name"
          value={data?.name ?? ''}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </ItemRow>

      <ItemRow label="Description">
        <TextArea
          rows={4}
          placeholder="Enter gallery description"
          value={data?.description ?? ''}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </ItemRow>
      <div className="flex justify-end">
        <Button
          type="primary"
          onClick={save}
          disabled={!isDataChanged || processing}
        >
          {processing ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  )
}

function ItemRow({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="relative flex flex-wrap md:flex-nowrap items-center gap-2">
      <label className="whitespace-nowrap min-w-[100px]">{label}</label>
      {children}
    </div>
  )
}

export default General
