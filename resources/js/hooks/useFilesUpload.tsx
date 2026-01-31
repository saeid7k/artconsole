import { router } from "@inertiajs/react";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import axios from "axios";
import { ChangeEvent, useCallback, useMemo, useRef } from "react";

type Props = {
  url: string;
  reloadOnSuccess?: boolean;
}

function useFilesUpload({ url, reloadOnSuccess = true }: Props) {

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filesUploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files[]', file);
      });
      const response = await axios.post(url, formData)
      return response.data
    },
    onMutate: () => {
      message.loading({ content: 'Uploading files...', key: 'upload' });
    },
    onSuccess: (data) => {
      message.success({ content: 'Files uploaded successfully', key: 'upload' });
      if (reloadOnSuccess) {
        router.reload();
      }
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to upload files');
    },
  });

  const onFileSelect = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      filesUploadMutation.mutate(fileArray);
    }
    event.target.value = '';
  }, [filesUploadMutation])

  const triggerFilesSelect = () => {
    fileInputRef.current?.click();
  }

  const FilesInput = useMemo(() => {
    return (
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={onFileSelect}
        style={{ display: 'none' }}
        accept="image/*"
      />
    );
  }, [onFileSelect]);

  return { triggerFilesSelect, FilesInput, filesUploadMutation };
}

export default useFilesUpload;
