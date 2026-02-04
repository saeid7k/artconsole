import colors from "@/Themes/theme";
import { ArtworkProps } from "@/types/artwork";
import { AddCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router } from "@inertiajs/react";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import axios from "axios";
import { useRef, useState } from "react";
import FlexBox from "../Containers/FlexBox";
import Note from "../Notes/Note";

function ArtworkNotes({ artwork }: { artwork: ArtworkProps }) {

  const [notes, setNotes] = useState(artwork.notes || []);
  const saveTimerRef = useRef<NodeJS.Timeout[]>([]);

  // add note

  function addNote() {
    const updatedNotes = [...notes, {
      id: null,
      content: null,
    }];
    setNotes(updatedNotes);
  }

  // save note

  function handleNoteChange(index: number, newContent: string|null) {
    const updatedNotes = [...notes];
    updatedNotes[index].content = newContent;
    setNotes(updatedNotes);

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

  const saveNoteMutation = useMutation({
    mutationFn: ({ noteId = null, newContent = null }: { noteId?: number | null, newContent: string | null }) => {
      return axios.post(route('artworks.save-note', {
        artwork: artwork
      }), {
        note_id: noteId,
        content: newContent,
      })
    },
    onSuccess: () => {
      message.success('Note added successfully.');
      router.reload();
    },
    onError: (error: any) => {
      // message.error(error.response?.data?.message || 'Failed to add note.');
    },
  });

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3"
    >
      {notes.map((item, index) => (
        <div key={item.id || `new-${index}`} >
          <Note
            index={index}
            note={item}
            onChange={handleNoteChange}
          />
        </div>
      ))}

      <div
        className="flex justify-center items-center border-dashed border-2 border-light rounded-lg p-3 hover:bg-gray-500/5 cursor-pointer transition-all"
        onClick={addNote}
      >
        <FlexBox direction="col" className="text-muted" >
          <HugeiconsIcon icon={AddCircleIcon} size={64} strokeWidth={0.5} color={colors.muted.DEFAULT} />
          <div className="text-lg">Add Note</div>
        </FlexBox>
      </div>
    </div>
  );
}

export default ArtworkNotes;
