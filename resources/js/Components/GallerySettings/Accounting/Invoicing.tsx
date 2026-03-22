import CONFIGS from "@/constants/configs.json";
import { useGallerySettings } from "@/contexts/GallerySettingsContext";
import useSaveChip from "@/hooks/useSaveChip";
import { useMutation } from "@tanstack/react-query";
import { Form, Input, message } from "antd";
import axios from "axios";

function Invoicing() {

  const { gallery } = useGallerySettings()
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

  function handleChange(key: string, value: string) {
    setSavingStatus("saving");
    setMetaMutation.mutate({ key, value });
  }

  return (
    <div>
      {saveChipNode}
      <Form
        layout="vertical"
        className="pt-3"
      >
        <Form.Item
          label="Invoice Prefix"
        >
          <Input
            defaultValue={gallery?.meta?.invoice_prefix || CONFIGS.defaults.invoice_prefix}
            onChange={(e) => handleChange("invoice_prefix", e.target.value)}
            maxLength={10}
          />
        </Form.Item>
      </Form>
    </div>
  )
}

export default Invoicing
