import { CloudUploadIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { message, UploadProps, Image, UploadFile } from "antd"
import Dragger from "antd/es/upload/Dragger"
import { useState } from "react"

type DropzoneProps = {
  title?: string
  description?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  accept?: string
  fileName?: string
  path?: string | null
  multiple?: boolean
  showUploadList?: boolean
  onChange?: (files: any) => void
}

function Dropzone({
  title,
  description,
  size = 'md',
  className = '',
  accept = undefined,
  fileName = 'file',
  path = null,
  multiple = false,
  showUploadList = true,
  onChange = undefined
}: DropzoneProps) {

  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedList, setUploadedList] = useState<UploadFile[]>([]);

  const props: UploadProps = {
    name: fileName,
    multiple: multiple,
    action: path ?? undefined,
    headers: {
      'X-CSRF-TOKEN': csrfToken || '',
    },
    beforeUpload: () => path ? true : false,
    onChange: (info) => {
      const rawList = info.fileList.filter(f => f.originFileObj);

      const trimmedList = multiple ? rawList : rawList.slice(-1);

      const preview = trimmedList.map(f => URL.createObjectURL(f.originFileObj!));
      const files = trimmedList.map(f => f.originFileObj! as File);

      setPreviewUrls(preview);
      setUploadedFiles(files);
      setUploadedList(trimmedList);

      if (onChange) onChange(files);

      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    }
  }

  const iconSize = () => {
    switch (size) {
      case 'xs': return 16
      case 'sm': return 24
      case 'md': return 32
      case 'lg': return 64
      case 'xl': return 128
      default: return 32
    }
  }

  return (
    <Dragger
      {...props}
      className={className}
      accept={accept}
      showUploadList={showUploadList}
      fileList={uploadedList}
    >
      <div className="!min-w-[200px] !max-w-[300px] m-auto text-center">
        {previewUrls.length > 0 ? (
          <div className="flex flex-wrap justify-start gap-4">
            {previewUrls.map((url, idx) => (
              <div
                key={idx}
                onClick={(e) => e.stopPropagation()} // prevent file picker from triggering
                className="cursor-default"
              >
                <Image
                  key={idx}
                  src={url}
                  alt={`Preview ${idx + 1}`}
                  height={64}
                  className="rounded border"
                />
              </div>
            ))}
          </div>
        ) : (
          <>
            <p><HugeiconsIcon icon={CloudUploadIcon} size={iconSize()} /></p>
            <p className="ant-upload-text">{title}</p>
            <p className="ant-upload-hint">{description}</p>
          </>
        )}
      </div>
    </Dragger>
  )
}

export default Dropzone
