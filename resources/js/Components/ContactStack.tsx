import { ContactProps } from "@/types/contact";
import { stringToColor } from "@/utils/colorHelper";
import { getInitials } from "@/utils/stringHelper";
import { router } from "@inertiajs/react";
import { Avatar } from "antd";

function ContactStack({contact}: {contact: ContactProps}) {

  return (
    <div
      className="flex items-center gap-2 cursor-pointer"
      onClick={() => router.get(route('contacts.view', contact.id))}
    >
      <Avatar
        shape="square"
        className="tracking-wider min-w-8"
        style={{ backgroundColor: stringToColor(getInitials(contact.full_name)) }}
      >
        {getInitials(contact.full_name)}
      </Avatar>
      <div>
        <div className="leading-tight">{contact.full_name}</div>
        <div className="text-ghost leading-tight">{contact.business?.name}</div>
      </div>
    </div>
  );
}

export default ContactStack;
