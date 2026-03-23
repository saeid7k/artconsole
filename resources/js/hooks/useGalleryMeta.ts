import { GalleryProps } from "@/types/gallery";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import axios from "axios";
import useSaveChip from "./useSaveChip";

function useGalleryMeta(gallery :GalleryProps) {

  const { setSavingStatus, saveChipNode } = useSaveChip({ topOffset: 0 });

  const setMetaMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) => {
      return axios.post(route("galleries.set-meta", { gallery: gallery.id }), { key, value });
    },
    onSuccess: () => {
      setSavingStatus("saved");
    },
    onError: (err: any) => {
      message.error(err.response.data.message || "An error occurred");
      setSavingStatus("failed");
    }
  });

  function setMeta(key: string, value: any) {
    setSavingStatus("saving");
    setMetaMutation.mutate({ key, value });
  }

  return {
    setMeta,
    saveChipNode,
  }
}

export default useGalleryMeta;
