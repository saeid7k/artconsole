import { ContactProps } from "@/types/contact";
import { stringToColor } from "@/utils/colorHelper";
import { getInitials } from "@/utils/stringHelper";
import { Avatar } from "antd";

function ContactAvatar({ contact }: { contact: ContactProps }) {
  return (
    <Avatar
      shape="square"
      className="tracking-wider min-w-8 border-none"
      style={{ backgroundColor: stringToColor(getInitials(contact.full_name)) }}
      src={contact.photo}
    >
      {getInitials(contact.full_name)}
    </Avatar>
  )
}

export default ContactAvatar;
