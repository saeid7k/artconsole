import { ucFirst } from "@/utils/stringHelper";
import { Delete02Icon, FloppyDiskIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Input, message, Modal, Space } from "antd";
import axios from "axios";
import { useState } from "react";

type Props = {
  open?: boolean;
  setOpen: (open: boolean) => void;
  type?: 'tag' | 'subject' | 'medium' | 'style';
}

function ManageTagsModal({ open , setOpen, type = 'tag' }: Props) {

  function handleClose() {
    setOpen(false);
  }

  // Fetch all tags

  const tagsQuery = useQuery({
    queryKey: ['all-tags', type],
    queryFn: () => {
      return axios.get(route('tags.get-all', { type }))
        .then(res => res.data)
        .catch(err => {
          throw err;
        })
    },
    enabled: open ? true : false,
  })

  // Add new tag

  const [newTag, setNewTag] = useState<string | null>(null);

  const addTagMutation = useMutation({
    mutationFn: (newTag: string) => axios.post(route('tags.store'), {
        type,
        value: newTag,
      }),
    onSuccess: () => {
      tagsQuery.refetch();
      setNewTag(null);
      message.success(`New ${type} added successfully`);
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || `Failed to add new ${type}`);
    }
  })

  // Delete tag

  const deleteTagMutation = useMutation({
    mutationFn: (tagId: number) => axios.delete(route('tags.destroy', { tag: tagId })),
    onSuccess: () => {
      tagsQuery.refetch();
      message.success(`${ucFirst(type)} deleted successfully`);
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || `Failed to delete ${type}`);
    }
  })

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title={`Manage ${ucFirst(type)}s`}
      footer={null}
    >
      <div className="flex flex-col gap-3 my-3">
        <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto" >
          {tagsQuery.isFetched && tagsQuery.data.length > 0 && (
            tagsQuery.data.map((tag: any) => (
              <div
                key={tag.id}
                className="flex items-center justify-between p-2 bg-light border rounded-lg"
              >
                {tag.value}
                <div>
                  {tag.gallery_id && (
                    <Button
                      type="text"
                      danger
                      shape="circle"
                      size="small"
                      onClick={() => deleteTagMutation.mutate(tag.id)}
                    >
                      <HugeiconsIcon icon={Delete02Icon} size={16} />
                    </Button>
                  )}
                  {!tag.gallery_id && (
                    <div className="text-ghost ">System Default</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <Space.Compact>
          <Input
            placeholder={`Add new ${type}...`}
            size="large"
            value={newTag || ''}
            onChange={(e) => setNewTag(e.target.value)}
          />
          <Button
            size="large"
            onClick={() => {
              if (newTag && newTag.trim() !== '') {
                addTagMutation.mutate(newTag);
              }
            }}
          >
            <HugeiconsIcon icon={FloppyDiskIcon} size={20} />
          </Button>
        </Space.Compact>
      </div>
    </Modal>
  )
}

export default ManageTagsModal;
