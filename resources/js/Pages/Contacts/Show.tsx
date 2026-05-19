import ActivityLogs from "@/Components/ActivityLogs";
import ContactPurchases from "@/Components/Contacts/ContactPurchases";
import AddressDataBox from "@/Components/Containers/AddressDataBox";
import CommunicationDataBox from "@/Components/Containers/CommunicationDataBox";
import DataCol from "@/Components/Containers/DataCol";
import DataRow from "@/Components/Containers/DataRow";
import PageTitle from "@/Components/PageTitle";
import RelationshipTags from "@/Components/RelationshipTags";
import { ContactProvider } from "@/contexts/ContactContext";
import AppLayout from "@/Layouts/AppLayout";
import { ContactProps } from "@/types/contact";
import { stringToColor } from "@/utils/colorHelper";
import { formatPhoneNumber } from "@/utils/formatHelper";
import { getInitials } from "@/utils/stringHelper";
import { BirthdayCakeIcon, Briefcase01Icon, Call02Icon, Edit03Icon, InternetIcon, Mail01Icon, OfficeIcon, PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, router } from "@inertiajs/react";
import { Avatar, Button, Card, Divider, Empty, message, Tabs, Tooltip } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import ContactFormDrawer from "./Partials/ContactFormDrawer";
import ContactTabs from "@/Components/Contacts/ContactTabs";

function Show({ contact }: { contact: ContactProps }) {

  // Picture Upload

  const pictureUploadRef = useRef<HTMLInputElement | null>(null)

  function handlePictureClick() {
    pictureUploadRef.current?.click()
  }

  function updatePhoto (e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    axios.post(route('contacts.update-photo'), {
      contact_id: contact.id,
      photo: file
    }, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((res) => {
      message.success(res.data.message || "Photo updated successfully")
    }).catch((e) => {
      message.error(e.response?.data?.message || "Failed to update photo")
    }).finally(() => {
      router.reload()
    })
  }

  // Edit Drawer

  const [showEditDrawer, setShowEditDrawer] = useState(false)

  return (
    <ContactProvider value={{}}>
      <PageTitle
        breadcrumbItems={[
          { title: <Link href={route('contacts.index')}>Contacts</Link> },
          { title: contact.full_name }
        ]}
        toolbar={
          <div>
            <Tooltip title="Edit Contact" mouseEnterDelay={1} >
              <Button
                type="text"
                shape="square"
                onClick={() => setShowEditDrawer(true)}
                disabled={!contact.abilities.update}
                icon={<HugeiconsIcon icon={PencilEdit02Icon} size={20} />}
              >
                Edit
              </Button>
            </Tooltip>
          </div>
        }
      />
      <div className="flex flex-col lg:flex-row gap-3 w-full">

        {/* Personal Information */}
        <Card
          className="min-w-[250px] lg:min-w-[300px] lg:max-w-[400px] overflow-hidden"
        >
          <div className="flex gap-2 mb-5">
            <div className="relative rounded-md overflow-hidden">
              <Avatar
                size={64}
                shape="square"
                style={{ backgroundColor: stringToColor(getInitials(contact.full_name)) }}
                src={contact.photo}
                className="border-none"
              >
                {getInitials(contact.full_name)}
              </Avatar>
              <div
                tabIndex={0}
                onClick={() => handlePictureClick()}
                className="bg-black text-white opacity-0 w-full h-full absolute top-0 left-0 hover:opacity-50 cursor-pointer grid place-content-center transition-all"
              >
                <HugeiconsIcon icon={Edit03Icon} size={32} />
              </div>
              <input
                ref={pictureUploadRef}
                type="file"
                accept="image/*"
                onChange={(e) => updatePhoto(e)}
                style={{ display: "none" }}
              />
            </div>
            <div className="flex flex-col justify-between items-start">
              <div className="text-xl">{contact.full_name}</div>
              <RelationshipTags contact={contact} />
            </div>
          </div>
          <CommunicationDataBox phone={contact.phone} email={contact.email} website={contact.website} />
          <Divider />
          <AddressDataBox address={contact.address} />
          <Divider />
          <DataCol title="Business">
            <DataRow
              icon={<HugeiconsIcon icon={OfficeIcon} size={18} />}
              label="Name:"
              value={contact.business?.name}
            />
            <DataRow
              icon={<HugeiconsIcon icon={Briefcase01Icon} size={18} />}
              label="Title:"
              value={contact.business?.title}
            />
            {/* <DataRow
              icon={<HugeiconsIcon icon={Location06Icon} size={18} />}
              label="Address:"
              value={contact.business_formatted_address}
              /> */}
            <DataRow
              icon={<HugeiconsIcon icon={Call02Icon} size={18} />}
              label="Phone:"
              value={contact.business?.phone ? formatPhoneNumber(contact.business?.phone) : ''}
            />
            <DataRow
              icon={<HugeiconsIcon icon={Mail01Icon} size={18} />}
              label="Email:"
              value={contact.business?.email}
            />
            <DataRow
              icon={<HugeiconsIcon icon={InternetIcon} size={18} />}
              label="Website:"
              value={contact.business?.website}
              hideIfNoValue
            />
          </DataCol>
          <Divider />
          <DataCol title="Personal">
            <DataRow
              icon={<HugeiconsIcon icon={BirthdayCakeIcon} size={18} />}
              label="Birthday:"
              value={dayjs(contact.birthday).isValid() ? dayjs(contact.birthday).format("MMMM D, YYYY") : ''}
            />
          </DataCol>
        </Card>

        {/* Tabs */}
        <Card
          className="grow overflow-x-auto"
        >
          <ContactTabs contact={contact} />
        </Card>
      </div>
      <ContactFormDrawer
        mode="update"
        contact={contact}
        show={showEditDrawer}
        onClose={() => {setShowEditDrawer(false); router.reload()}}
      />
    </ContactProvider>
  )
}

Show.layout = (page: any) => {
  return (
    <AppLayout>
      {page}
    </AppLayout>
  )
}

export default Show;
