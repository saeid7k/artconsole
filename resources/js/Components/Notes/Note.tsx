import { NoteOrNew } from "@/types/note";
import { dayjsUserTz } from "@/utils/dateTimeHelper";
import { getInitials } from "@/utils/stringHelper";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router } from "@inertiajs/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Avatar, Button, Card, Input, Popover } from "antd";
import axios from "axios";
import { twMerge } from "tailwind-merge";
import FlexBox from "../Containers/FlexBox";

type Props = {
  index: number;
  note: NoteOrNew;
  onChange: (index: number, newContent: string|null) => void;
}

function Note({ index, note, onChange }: Props) {

  // Handle content change

  const handleChange = (newContent: string|null) => {
    onChange(index, newContent);
  }

  // Get Collaborators

  const CollaboratorsQuery = useQuery({
    queryKey: ['note-collaborators', note.id],
    queryFn: () => axios.get(route('notes.collaborators', {note: note.id}))
      .then(res => res.data.collaborators),
    enabled: !!note.id,
  });

  // Delete Note

  const deleteNoteMutation = useMutation({
    mutationFn: () => axios.delete(route('notes.destroy', {note: note.id})),
    onSuccess: () => {
      router.reload();
    },
  });

  return (
    <Card
      className="bg-yellow-500/20 hover:shadow-lg transition-all h-max"
      styles={{
        body: { padding: '1rem' },
      }}
    >
      <Input.TextArea
        className={twMerge(
          "mb-2 p-1 border-none focus:!shadow-none focus:!bg-transparent hover:!bg-transparent",
          note.content ? "!bg-transparent" : "bg-yellow-500/10"
        )}
        autoSize={{ minRows: 3 }}
        onChange={(e) => handleChange(e.target.value)}
        defaultValue={note.content ?? undefined}
      />
      {note.id && (
        <FlexBox direction="col" alignItems="start" >
          <FlexBox justifyContent="between" >
            <Avatar.Group max={{count: 5}} size="small">
              {CollaboratorsQuery.data?.map((item: any) => (
                <Popover
                  key={item.id}
                  content={item.full_name}
                  placement="bottomLeft"
                >
                  <Avatar
                    src={item.photo}
                    size='small'
                  >
                    {getInitials(item.full_name || '')}
                  </Avatar>
                </Popover>
              ))}
            </Avatar.Group>
            <div className="text-ghost">
              {note.updated_at && dayjsUserTz(note.updated_at).format('MMM D, YYYY h:mm A')}
            </div>
          </FlexBox>
          <FlexBox justifyContent="end" >
            <Button
              type="text"
              shape="circle"
              size="small"
              onClick={() => deleteNoteMutation.mutate()}
            >
              <HugeiconsIcon icon={Delete02Icon} size={16} />
            </Button>
          </FlexBox>
        </FlexBox>
      )}
    </Card>
  );
}

export default Note;
