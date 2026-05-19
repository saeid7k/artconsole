import { ContactProps } from "@/types/contact";
import { getQueryParam } from "@/utils/urlHelper";
import { Tabs, Tag } from "antd";
import ActivityLogs from "../ActivityLogs";
import FlexBox from "../Containers/FlexBox";
import NotesContainer from "../Notes/NotesContainer";
import ContactPurchases from "./ContactPurchases";

type Props = {
  contact: ContactProps;
};

function ContactTabs({ contact }: Props) {

  const activeTab = getQueryParam('tab') || 'purchases';

  const items = [
    {
      key: 'purchases',
      label: 'Purchase History',
      children: <ContactPurchases contact={contact} />,
    },
    {
      key: 'notes',
      label:
        <FlexBox>
          <div>Notes</div>
          {(contact.notes?.length && contact.notes?.length > 0) ? <Tag>{contact.notes.length}</Tag> : null}
        </FlexBox>
      ,
      children: <NotesContainer
        modelType="contact"
        modelId={contact.id}
        notes={contact.notes || []}
      />,
    },
    {
      key: 'logs',
      label: 'Logs',
      children: <ActivityLogs key={contact.updated_at} modelType="contact" modelId={contact.id} />,
    },
  ];

  return (
    <Tabs
      defaultActiveKey={activeTab}
      items={items}
    />
  )
}

export default ContactTabs;
