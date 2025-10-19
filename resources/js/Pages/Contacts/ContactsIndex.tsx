import AppLayout from "@/Layouts/AppLayout";
import { PageProps } from "@/types";
import { router } from "@inertiajs/react";
import Search from "antd/es/input/Search";
import ContactsTable from "./Partials/ContactsTable";
import PageTitle from "@/Components/PageTitle";

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
    <div>
      <PageTitle
        title="Contacts"
        counter={contacts.total}
        toolbar={
          <Search
            placeholder="search contacts..."
            style={{ width: 200 }}
            allowClear
            onSearch={handleSearch}
          />
        }
      />
      <ContactsTable contacts={contacts} />
    </div>
  )
}

ContactsIndex.layout = (page: any) => {
  return (
    <AppLayout>
      {page}
    </AppLayout>
  )
}

export default ContactsIndex
