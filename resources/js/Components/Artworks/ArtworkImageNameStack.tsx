import { Edit02Icon, FloppyDiskIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router } from "@inertiajs/react";
import { useMutation } from "@tanstack/react-query";
import type { InputRef } from "antd";
import { Input, message, Tag, Tooltip } from "antd";
import axios from "axios";
import { useRef, useState } from "react";
import FlexBox from "../Containers/FlexBox";
import CopyToClipboard from "../CopyToClipboard";

function ArtworkImageNameStack({ media }: { media: any }) {
  const [showRenameInput, setShowRenameInput] = useState(false);
  const [newName, setNewName] = useState(media.file_name);
  const inputRef = useRef<InputRef>(null);

  const renameMutation = useMutation({
    mutationFn: (newName: string) => {
      return axios.post(`/artworks/${media.model_id}/rename-image`, {
        media_id: media.id,
        new_name: newName,
      });
    },
    onSuccess: () => {
      message.success('Image renamed successfully');
      setShowRenameInput(false);
      router.reload();
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.message || 'Failed to rename image');
    }
  });

  return (
    <FlexBox gap={2} >
      {!showRenameInput ? (
        <>
          <div
            className="max-w-[200px] truncate"
            title={media.file_name}
          >
            {media.file_name}
          </div>
          <Tooltip title='Rename' mouseEnterDelay={0.5} >
            <HugeiconsIcon
              icon={Edit02Icon}
              size={16}
              className="cursor-pointer text-muted hover:text-primary"
              onClick={() => {
                setShowRenameInput(true)
                setTimeout(() => {
                  inputRef.current?.focus();
                }, 100);
              }}
            />
          </Tooltip>
        </>
      ):(
        <>
          <Input
            ref={inputRef}
            defaultValue={media.file_name}
            className="max-w-[200px]"
            onChange={(e) => setNewName(e.target.value)}
            onPressEnter={() => renameMutation.mutate(newName)}
          />
          <Tooltip title='Save Name' mouseEnterDelay={0.5} >
            <HugeiconsIcon
              icon={FloppyDiskIcon}
              size={16}
              className="cursor-pointer text-muted hover:text-primary"
              onClick={() => renameMutation.mutate(newName)}
            />
          </Tooltip>
        </>
      )}
      <CopyToClipboard content={media.file_name} title="File Name" />
      {media.is_main && (
        <Tag variant="solid" color="blue" className="ml-2">Main</Tag>
      )}
    </FlexBox>
  )
}

export default ArtworkImageNameStack;
