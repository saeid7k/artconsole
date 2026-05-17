import { ContactProps } from "@/types/contact";
import { ViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router } from "@inertiajs/react";
import { Tooltip } from "antd";
import NewTag from "../NewTag";
import ContactAvatar from "./ContactAvatar";

type Props = {
  contact: ContactProps;
  rootClassName?: string;
}

function ContactStack({contact, rootClassName}: Props) {

  return (
    <div
      className={`relative flex items-center gap-2 cursor-pointer group ${rootClassName}`}
      onClick={() => router.get(route('contacts.show', contact.id))}
    >
      <ContactAvatar contact={contact} />
      <div>
        <div className="leading-tight">{contact.full_name}</div>
        <div className="text-ghost leading-tight">{contact.business?.name}</div>
      </div>
      <NewTag dateRef={contact.created_at} />
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
