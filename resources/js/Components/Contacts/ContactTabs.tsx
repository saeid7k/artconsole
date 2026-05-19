import { ContactProps } from "@/types/contact";
import { Tabs } from "antd";
import ContactPurchases from "./ContactPurchases";
import ActivityLogs from "../ActivityLogs";
import NotesContainer from "../Notes/NotesContainer";

type Props = {
  contact: ContactProps;
};

function ContactTabs({ contact }: Props) {

  const items = [
    {
      key: 'purchases',
      label: 'Purchase History',
      children: <ContactPurchases contact={contact} />,
    },
    {
      key: 'notes',
      label: 'Notes',
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
      defaultActiveKey="purchases"
      items={items}
    />
  )
}

export default ContactTabs;
