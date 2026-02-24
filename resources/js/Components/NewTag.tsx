import colors from "@/Themes/theme";
import { Tag } from "antd";
import dayjs from "dayjs";
import CONFIGS from "~/resources/configs.json";

function NewTag({ dateRef }: { dateRef: string }) {
  return (
    <>
      {dayjs(dateRef).isAfter(dayjs().subtract(CONFIGS.new_tag_timeout, 'minutes')) && (
        <Tag color={colors.sky[500]} >New</Tag>
      )}
    </>
  )
}

export default NewTag;
