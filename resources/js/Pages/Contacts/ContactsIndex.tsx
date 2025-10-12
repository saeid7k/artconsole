import AppLayout from "@/Layouts/AppLayout";
import ContactsTable from "./Partials/ContactsTable";
import Search from "antd/es/input/Search";
import { router } from "@inertiajs/react";
import { PageProps } from "@/types";

function ContactsIndex({ contacts }: { contacts: PageProps }) {

  function handleSearch(value: string) {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.set('search', value);

    router.get(
      route('contacts.index'),
      Object.fromEntries(params.entries()),
      { preserveScroll: true, preserveState: true }
    );
  }

  return (
    <AppLayout
      title={
        <div className="flex items-center gap-2">
          <div>Contacts</div>
          <small className="text-muted font-light">({contacts.total?.toLocaleString()})</small>
        </div>
      }
      actionsBar={
        <Search
          placeholder="search contacts..."
          style={{ width: 200 }}
          allowClear
          onSearch={handleSearch}
        />
      }
    >
      <ContactsTable contacts={contacts} />
    </AppLayout>
  )
}

export default ContactsIndex;
