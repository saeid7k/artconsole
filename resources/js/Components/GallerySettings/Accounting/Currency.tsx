import CONFIGS from "@/constants/configs.json";
import { CURRENCIES_OPTIONS } from "@/constants/currencies";
import { useGallerySettings } from "@/contexts/GallerySettingsContext";
import useGalleryMeta from "@/hooks/useGalleryMeta";
import { Select } from "antd";

function Currency() {

  const { gallery } = useGallerySettings()
  const { saveChipNode, setMeta } = useGalleryMeta(gallery)

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
        defaultValue={gallery?.currency}
        onChange={(value) => setMeta("currency", value)}
      />
    </div>
  )
}

export default Currency
