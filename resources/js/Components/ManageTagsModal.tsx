import { ucFirst } from "@/utils/stringHelper";
import { useQuery } from "@tanstack/react-query";
import { Button, Input, Modal, Space } from "antd";
import axios from "axios";
import FlexBox from "./Containers/FlexBox";
import { Group } from "antd/es/radio";
import { HugeiconsIcon } from "@hugeicons/react";
import { FloppyDiskIcon } from "@hugeicons/core-free-icons";

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

  return (
    <Modal open={open} onCancel={handleClose} title={`Manage ${ucFirst(type)}s`}>
      <div className="flex flex-col gap-3 my-3">
        <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto" >
          {tagsQuery.isFetched && tagsQuery.data.length > 0 && (
            tagsQuery.data.map((tag: any) => (
              <div className="p-2 bg-light border rounded-lg">
                {tag.value}
              </div>
            ))
          )}
        </div>
        <Space.Compact>
          <Input
            placeholder={`Add new ${type}...`}
            size="large"
          />
          <Button
            size="large"
          >
            <HugeiconsIcon icon={FloppyDiskIcon} size={20} />
          </Button>
        </Space.Compact>
      </div>


        <pre className="bg-yellow-100">
          {JSON.stringify(tagsQuery.data, null, 2)}
        </pre>
    </Modal>
  )
}

export default ManageTagsModal;
