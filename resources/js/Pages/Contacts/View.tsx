import DataCol from "@/Components/Containers/DataCol";
import DataRow from "@/Components/Containers/DataRow";
import PageTitle from "@/Components/PageTitle";
import RelationshipTag from "@/Components/RelationshipTag";
import AppLayout from "@/Layouts/AppLayout";
import { ContactProps } from "@/types/contact";
import { stringToColor } from "@/utils/colorHelper";
import { formatPhoneNumber } from "@/utils/formatter";
import { getInitials } from "@/utils/stringHelper";
import { BirthdayCakeIcon, Briefcase01Icon, Call02Icon, City03Icon, EarthIcon, Location06Icon, Mail01Icon, MapingIcon, OfficeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@inertiajs/react";
import { Avatar, Card, Divider } from "antd";
import moment from "moment";

function View({ contact }: { contact: ContactProps }) {
  return (
    <div>
      <PageTitle
        breadcrumbItems={[
          { title: <Link href={route('contacts.index')}>Contacts</Link> },
          { title: contact.full_name }
        ]}
      />
      <div className="flex flex-col md:flex-row gap-3 w-full">
        <Card
          className="min-w-[300px] md:max-w-[400px]"
        >
          <div className="flex gap-2 mb-5">
            <Avatar
              size={64}
              shape="square"
              style={{ backgroundColor: stringToColor(getInitials(contact.full_name)) }}
            >
              {getInitials(contact.full_name)}
            </Avatar>
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
        <Card
          className="grow"
        >
          details
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
