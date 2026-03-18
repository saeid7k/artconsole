import CONFIGS from "@/constants/configs.json";
import { CURRENCIES_OPTIONS } from "@/constants/currencies";
import { useGallerySettings } from "@/contexts/GallerySettingsContext";
import useSaveChip from "@/hooks/useSaveChip";
import { useMutation } from "@tanstack/react-query";
import { message, Select } from "antd";
import axios from "axios";

function Currency() {

  const { gallery } = useGallerySettings()
  const { setSavingStatus, saveChipNode } = useSaveChip();

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

  function handleChange(key: string, value: string) {
    setSavingStatus("saving");
    setMetaMutation.mutate({ key, value });
  }

  return (
    <div>
      {saveChipNode}
      <p className="label pe-20">
        Set the currency to use for all financial transactions in this gallery. This will not convert existing amounts, so make sure to update any existing financial data accordingly.
      </p>
      <Select
        options={CURRENCIES_OPTIONS}
        popupMatchSelectWidth={false}
        showSearch
        defaultValue={gallery?.meta?.currency || CONFIGS.defaults.currency}
        onChange={(value) => handleChange("currency", value)}
      />
    </div>
  )
}

export default Currency
