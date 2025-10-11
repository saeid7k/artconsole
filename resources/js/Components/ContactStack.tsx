import { Contact } from "@/types/contact";
import { stringToColor } from "@/utils/colorHelper";
import { Avatar } from "antd";

function ContactStack({contact}: {contact: Contact}) {

  const initials = `${contact.firstname.charAt(0)}${contact.lastname.charAt(0)}`
  return (
    <div className="flex items-center gap-2">
      <Avatar
        className="tracking-wider min-w-8"
        style={{ backgroundColor: stringToColor(initials) }}
      >
        {initials}
      </Avatar>
      <div>
        <div className="leading-tight">{contact.full_name}</div>
        <div className="light-small leading-tight">{contact.business?.name}</div>
      </div>
    </div>
  );
}

export default ContactStack;
