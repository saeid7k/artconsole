import colors from "@/Themes/theme";
import { NoteOrNew } from "@/types/note";
import { AddIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import FlexBox from "../Containers/FlexBox";
import Note from "./Note";

type Props = {
  modelType: 'artwork' | 'contact';
  modelId: number;
  notes: NoteOrNew[];
};

function NotesContainer({ modelType, modelId, notes }: Props) {

  const [data, setData] = useState<NoteOrNew[]>(notes || []);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // add note

  function addNote() {
    const updatedNotes = [...data, {
      id: 'new-' + Math.random().toString(36).substring(2, 10),
      content: null,
    }];
    setData(updatedNotes);
  }

  // save note

  function handleNoteChange(index: number, newContent: string|null) {
    const updatedNotes = [...data];
    updatedNotes[index].content = newContent;
    setData(updatedNotes);

    // debounce save
    if (saveTimerRef.current[index]) {
      clearTimeout(saveTimerRef.current[index]);
    }
    saveTimerRef.current[index] = setTimeout(() => {
      saveNoteMutation.mutate({
        noteId: updatedNotes[index].id,
        newContent: newContent,
      });
    }, 2000);
  }

  const saveEndpoints: Record<string, string> = {
    artwork: route('artworks.save-note', { artwork: modelId }),
    contact: route('contacts.save-note', { contact: modelId }),
  }

  const saveNoteMutation = useMutation({
    mutationFn: ({ noteId = null, newContent = null }: { noteId?: any, newContent: string | null }) => axios.post(saveEndpoints[modelType], {
        note_id: noteId,
        content: newContent,
      })
        .then(res => {
          // Update note ID if it's a new note
          if (noteId.startsWith('new')) {
            setData(prev => prev.map(n =>
              n.id === noteId ? { ...n, id: res.data.note_id } : n
            ));
          }
        })
  });

  useEffect(() => {
    setData(notes || []);
  }, [notes]);

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 items-start"
    >
      {data.map((item, index) => (
        <div key={item.id || `new-${index}`} >
          <Note
            index={index}
            note={item}
            onChange={handleNoteChange}
          />
        </div>
      ))}

      <div
        className="flex justify-center items-center min-h-[170px] border-dashed border-2 border-light rounded-lg p-5 hover:bg-gray-500/5 cursor-pointer transition-all"
        onClick={addNote}
      >
        <FlexBox direction="col" className="text-muted" >
          <HugeiconsIcon icon={AddIcon} size={64} strokeWidth={0.5} color={colors.muted} />
          <div className="text-lg">Add Note</div>
        </FlexBox>
      </div>
    </div>
  );
}

export default NotesContainer;
