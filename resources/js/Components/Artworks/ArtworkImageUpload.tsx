import { ArtworkProps } from "@/types/artwork";
import { InboxUploadIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router } from "@inertiajs/react";
import Dragger from "antd/es/upload/Dragger";
import axios from "axios";
import FlexBox from "../Containers/FlexBox";

function ArtworkImageUpload({ artwork }: { artwork?: ArtworkProps }) {

  function handleUpload(options: any) {
    const { onSuccess, onError, file, onProgress } = options;
    const formData = new FormData();
    formData.append('files[]', file);
    axios.post(route('artworks.upload-images', { artwork: artwork?.id }), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (event) => {
        const percent = Math.floor((event.loaded / (event?.total || 1)) * 100);
        onProgress({ percent });
      },
    })
      .then((res) => {
        onSuccess(res.data, file);
        router.reload();
      })
      .catch((err) => {
        onError({ err });
      });
  }

  return (
    <div
      className="max-w-[800px]"
    >
      <Dragger
        name="files"
        multiple
        accept='image/*'
        customRequest={handleUpload}
        showUploadList={{
          showDownloadIcon: false,
          showPreviewIcon: false,
          showRemoveIcon: false,
        }}
      >
        <FlexBox direction="col" className="font-light p-5" >
          <HugeiconsIcon icon={InboxUploadIcon} size={48} strokeWidth={0.5} />
          <div className="text-xl text-gray-500 mt-3" >Click or drag files here to upload</div>
          <div className="text-sm text-gray-400" >All image types are supported</div>
        </FlexBox>
      </Dragger>
    </div>
  )
}

export default ArtworkImageUpload;
