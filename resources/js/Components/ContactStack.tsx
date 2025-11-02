import { ContactProps } from "@/types/contact";
import { stringToColor } from "@/utils/colorHelper";
import { getInitials } from "@/utils/stringHelper";
import { EyeIcon, ViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router } from "@inertiajs/react";
import { Avatar, Tooltip } from "antd";

function ContactStack({contact}: {contact: ContactProps}) {

  return (
    <div
      className="flex items-center gap-1 cursor-pointer group"
      onClick={() => router.get(route('contacts.view', contact.id))}
    >
      <Avatar
        shape="square"
        className="tracking-wider min-w-8 border-none"
        style={{ backgroundColor: stringToColor(getInitials(contact.full_name)) }}
        src={contact.photo}
      >
        {getInitials(contact.full_name)}
      </Avatar>
      <div>
        <div className="leading-tight">{contact.full_name}</div>
        <div className="text-ghost leading-tight">{contact.business?.name}</div>
      </div>
      <div
        className="absolute right-1 hidden group-hover:block text-blue-500"
      >
        <Tooltip title="Contact Card" >
          <HugeiconsIcon
            icon={ViewIcon}
            size={20}
          />
        </Tooltip>
      </div>
    </div>
  );
}

export default ContactStack;
