import ActivityLogs from "@/Components/ActivityLogs";
import DataCol from "@/Components/Containers/DataCol";
import DataRow from "@/Components/Containers/DataRow";
import PageTitle from "@/Components/PageTitle";
import RelationshipTag from "@/Components/RelationshipTag";
import AppLayout from "@/Layouts/AppLayout";
import { ContactProps } from "@/types/contact";
import { stringToColor } from "@/utils/colorHelper";
import { formatPhoneNumber } from "@/utils/formatter";
import { getInitials } from "@/utils/stringHelper";
import { BirthdayCakeIcon, Briefcase01Icon, Call02Icon, City03Icon, EarthIcon, Edit03Icon, Location06Icon, Mail01Icon, MapingIcon, OfficeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, router } from "@inertiajs/react";
import { Avatar, Card, Divider, Empty, message, Tabs } from "antd";
import axios from "axios";
import moment from "moment";
import { useRef } from "react";

function View({ contact }: { contact: ContactProps }) {

  const pictureUploadRef = useRef<HTMLInputElement | null>(null)

  function handleOverlayClick() {
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

  return (
    <div>
      <PageTitle
        breadcrumbItems={[
          { title: <Link href={route('contacts.index')}>Contacts</Link> },
          { title: contact.full_name }
        ]}
      />
      <div className="flex flex-col md:flex-row gap-3 w-full">

        {/* Personal Information */}
        <Card
          className="min-w-[300px] md:max-w-[400px]"
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
                onClick={() => handleOverlayClick()}
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
              <div className="flex">
                {contact.relationship.map((relation: string, index: number) => (
                  <RelationshipTag relationship={relation} key={index} />
                ))}
              </div>
            </div>
          </div>
          <DataCol title="Communication">
            <DataRow
              icon={<HugeiconsIcon icon={Call02Icon} size={18} />}
              label="Phone:"
              value={formatPhoneNumber(contact.phone)}
            />
            <DataRow
              icon={<HugeiconsIcon icon={Mail01Icon} size={18} />}
              label="Email:"
              value={contact.email}
            />
          </DataCol>
          <Divider />
          <DataCol title="Address">
            <DataRow
              icon={<HugeiconsIcon icon={Location06Icon} size={18} />}
              label="Street Address:"
              value={contact.address?.street}
            />
            <DataRow
              icon={<HugeiconsIcon icon={City03Icon} size={18} />}
              label="City:"
              value={contact.address?.city}
            />
            <DataRow
              icon={<HugeiconsIcon icon={MapingIcon} size={18} />}
              label="Province:"
              value={contact.address?.province}
            />
            <DataRow
              icon={<HugeiconsIcon icon={EarthIcon} size={18} />}
              label="Country:"
              value={contact.address?.country}
            />
          </DataCol>
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
              value={formatPhoneNumber(contact.business?.phone)}
            />
            <DataRow
              icon={<HugeiconsIcon icon={Mail01Icon} size={18} />}
              label="Email:"
              value={contact.business?.email}
            />
          </DataCol>
          <Divider />
          <DataCol title="Personal">
            <DataRow
              icon={<HugeiconsIcon icon={BirthdayCakeIcon} size={18} />}
              label="Birthday:"
              value={moment(contact.birthday).format("MMMM D, YYYY")}
            />
          </DataCol>
        </Card>

        {/* Tabs */}
        <Card
          className="grow"
        >
          <Tabs defaultActiveKey="activities">
            <Tabs.TabPane tab="Activities" key="activities">
              <ActivityLogs modelType="contact" modelId={contact.id} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Purchase History" key="purchase-history">
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No purchase history found" />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Inventory" key="inventory">
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No inventory found" />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Emails" key="emails">
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No emails found" />
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}

View.layout = (page: any) => {
  return (
    <AppLayout>
      {page}
    </AppLayout>
  )
}

export default View;
