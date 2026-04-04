import AnimatedContainer from "@/Components/AnimatedContainer";
import colors from "@/Themes/theme";
import { oklchToHex } from "@/utils/colorHelper";
import { ucWords } from "@/utils/formatHelper";
import { Tag } from "antd";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  topOffset?: number;
}

function useSaveChip({ topOffset = 2 }: Props = {} ) {

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
    saving: oklchToHex(colors.blue[500]),
    saved: oklchToHex(colors.green[500]),
    failed: oklchToHex(colors.red[500]),
    default: oklchToHex(colors.gray[500])
  }

  const offsetClass = `top-${topOffset}`

  const saveChipNode = (
    <AnimatedContainer
      condition={!!savingStatus}
      type="slideRight"
      speed="slow"
      className={twMerge(
        "absolute top-2 right-2 z-10",
        offsetClass
      )}
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
