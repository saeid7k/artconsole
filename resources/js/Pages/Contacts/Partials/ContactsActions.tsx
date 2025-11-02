import { ContactProps } from "@/types/contact"
import { Delete02Icon, PencilEdit02Icon, ViewIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { router } from "@inertiajs/react"
import { Button, Tooltip } from "antd"
import { useState } from "react"
import ContactsEditDrawer from "./ContactsEditDrawer"

function ContactsActions({ contact }: { contact: ContactProps }) {

  const [showEditDrawer, setShowEditDrawer] = useState(false)

  return (
    <>
      <div
        className="flex items-center gap-1"
      >
        <Tooltip title="Contact Card">
          <Button
            variant="text"
            color='blue'
            shape="circle"
            icon={<HugeiconsIcon icon={ViewIcon} size={20} />}
            onClick={() => router.get(route('contacts.view', contact.id))}
          />
        </Tooltip>
        <Tooltip title="Edit">
          <Button
            variant="text"
            color='default'
            shape="circle"
            icon={<HugeiconsIcon icon={PencilEdit02Icon} size={20} />}
            onClick={() => setShowEditDrawer(true)}
          />
        </Tooltip>
        <Tooltip title="Delete">
          <Button
            variant="text"
            color='danger'
            shape="circle"
            icon={<HugeiconsIcon icon={Delete02Icon} size={20} />}
            onClick={() => router.post(route('contacts.remove', contact.id))}
            disabled={!contact.abilities.delete}
          />
        </Tooltip>
      </div>
      <ContactsEditDrawer
        contact={contact}
        show={showEditDrawer}
        onClose={() => setShowEditDrawer(false)}
      />
    </>
  )
}

export default ContactsActions
