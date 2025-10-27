import PageTitle from "@/Components/PageTitle";
import RelationshipTag from "@/Components/RelationshipTag";
import AppLayout from "@/Layouts/AppLayout";
import { ContactProps } from "@/types/contact";
import { getInitials } from "@/utils/stringHelper";
import { Link } from "@inertiajs/react";
import { Avatar, Card } from "antd";

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
          className="min-w-[300px]"
        >
          <div className="flex gap-2">
            <Avatar
              size={64}
              shape="square"
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
