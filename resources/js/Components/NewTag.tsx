import colors from "@/Themes/theme";
import { Tag } from "antd";
import dayjs from "dayjs";
import CONFIGS from "@/constants/configs.json";
import { oklchToHex } from "@/utils/colorHelper";

function NewTag({ dateRef }: { dateRef: string }) {
  return (
    <>
      {dayjs(dateRef).isAfter(dayjs().subtract(CONFIGS.new_tag_timeout, 'minutes')) && (
        <Tag color={oklchToHex(colors.sky[500])} >New</Tag>
      )}
    </>
  )
}

export default NewTag;
