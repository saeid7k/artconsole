import { Avatar, Card, Input, Popover } from "antd";
import { twMerge } from "tailwind-merge";
import FlexBox from "../Containers/FlexBox";
import { getInitials } from "@/utils/stringHelper";
import { NoteProps } from "@/types/note";

type Props = {
  index: number;
  note: NoteProps;
  onChange: (index: number, newContent: string|null) => void;
}

function Note({ index, note, onChange }: Props) {

  const handleChange = (newContent: string|null) => {
    onChange(index, newContent);
  }

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
        <FlexBox className="cursor-default">
          <Popover
            content={note.creator?.full_name}
            placement="bottomLeft"
          >
            <Avatar
              src={note.creator?.photo}
              size='small'
            >
              {getInitials(note.creator?.full_name || '')}
            </Avatar>
          </Popover>
        </FlexBox>
      )}
    </Card>
  );
}

export default Note;
