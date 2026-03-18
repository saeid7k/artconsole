import AnimatedContainer from "@/Components/AnimatedContainer";
import colors from "@/Themes/theme";
import { ucWords } from "@/utils/formatHelper";
import { Tag } from "antd";
import { useEffect, useState } from "react";

function useSaveChip() {

  const [savingStatus, setSavingStatus] = useState<null | "saving" | "saved" | "failed">(null);

  useEffect(() => {
    // clear saved status after 3 seconds
    if (savingStatus && ["saved", "failed"].includes(savingStatus)) {
      const timer = setTimeout(() => {
        setSavingStatus(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [savingStatus])

  const textColor = {
    saving: colors.blue[500],
    saved: colors.green[500],
    failed: colors.red[500],
    default: colors.gray[500]
  }

  const saveChipNode = (
    <AnimatedContainer
      condition={!!savingStatus}
      type="slideRight"
      speed="slow"
      className="absolute top-2 right-2 z-10"
    >
      <Tag
        color={textColor[savingStatus || "default"]}
      >
        {ucWords(savingStatus)}
      </Tag>
    </AnimatedContainer>
  )

  return { savingStatus, setSavingStatus, saveChipNode };
}

export default useSaveChip;
