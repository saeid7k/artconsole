import { ContactProps } from "@/types/contact"
import { Delete02Icon, PencilEdit02Icon, ViewIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { router } from "@inertiajs/react"
import { Button, message, Popconfirm, Tooltip } from "antd"
import axios from "axios"
import { useState } from "react"
import ContactFormDrawer from "./ContactFormDrawer"

function ContactsActions({ contact }: { contact: ContactProps }) {

  const [showEditDrawer, setShowEditDrawer] = useState(false)

  function handleDelete() {
    axios.post(route('contacts.delete', contact.id))
      .then((res) => {
        message.success(res.data.message || 'Contact deleted successfully')
        router.reload()
      })
      .catch((e) => {
        message.error(e.response?.data?.message || 'An error occurred while deleting the contact')
      })
  }

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
            onClick={() => router.get(route('contacts.show', contact.id))}
          />
        </Tooltip>
        <Tooltip title="Edit">
          <Button
            variant="text"
            color='default'
            shape="circle"
            icon={<HugeiconsIcon icon={PencilEdit02Icon} size={20} />}
            onClick={() => setShowEditDrawer(true)}
            disabled={!contact.abilities.update}
          />
        </Tooltip>
        <Tooltip title="Delete">
          <Popconfirm
            title="Delete the contact"
            description={
              <div>
                Are you sure to delete this contact?
                <div className="italic text-red-500">{contact.full_name}</div>
              </div>
            }
            onConfirm={() => handleDelete()}
            okText="Yes"
            cancelText="No"
            placement="left"
            okType="danger"
          >
            <Button
              variant="text"
              color='danger'
              shape="circle"
              icon={<HugeiconsIcon icon={Delete02Icon} size={20} />}
              disabled={!contact.abilities.delete}
            />
          </Popconfirm>
        </Tooltip>
      </div>
      <ContactFormDrawer
        mode="update"
        contact={contact}
        show={showEditDrawer}
        onClose={() => setShowEditDrawer(false)}
      />
    </>
  )
}

export default ContactsActions
