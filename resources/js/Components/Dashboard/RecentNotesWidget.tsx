import { NoteProps } from "@/types/note";
import { router } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import { Card, Empty } from "antd";
import axios from "axios";
import Note from "../Notes/Note";

function RecentNotesWidget() {

  const { data, isLoading } = useQuery({
    queryKey: ['recent-notes'],
    queryFn: () => axios.get(route('notes.recent')).then(res => res.data.notes),
    staleTime: Infinity
  });

  return (
    <Card
      title="Recent Notes"
      loading={isLoading}
      className='min-h-[240px]'
      >
      {
        data?.length == 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No notes found" />
      }

      <div className="flex flex-col gap-2"
        style={{
          maxHeight: '400px',
          overflowY: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        {data && data.length > 0 && data.map((note: NoteProps) => {
          let route = note.noteable_path;
          if (note.noteable_type?.toLowerCase().includes('artwork')) {
            route += '?tab=notes';
          }
          return (
            <Note
              key={note.id}
              note={note}
              index={note.id}
              rows={2}
              deletable={false}
              readonly={true}
              readonlyClassName="line-clamp-2"
              onClickRoot={route ? () => router.visit(route) : undefined}
            />
          )
        })}
      </div>
    </Card>
  )
}

export default RecentNotesWidget;
