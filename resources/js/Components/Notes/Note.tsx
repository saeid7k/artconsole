import { NoteProps } from "@/types/note";
import { getInitials } from "@/utils/stringHelper";
import { useQuery } from "@tanstack/react-query";
import { Avatar, Card, Input, Popover } from "antd";
import axios from "axios";
import { twMerge } from "tailwind-merge";
import FlexBox from "../Containers/FlexBox";
import dayjs from "dayjs";

type Props = {
  index: number;
  note: NoteProps;
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
        defaultValue={note.content}
      />
      {note.id && (
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
            {note.updated_at && dayjs(note.updated_at).format('MMM D, YYYY h:mm A')}
          </div>
        </FlexBox>
      )}
    </Card>
  );
}

export default Note;
