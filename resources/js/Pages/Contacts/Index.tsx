import AppLayout from "@/Layouts/AppLayout";
import { PageProps } from "@/types";
import { router } from "@inertiajs/react";
import Search from "antd/es/input/Search";
import ContactsTable from "./Partials/ContactsTable";
import PageTitle from "@/Components/PageTitle";
import { useEffect, useState } from "react";
import ContactFormDrawer from "./Partials/ContactFormDrawer";
import { deleteQueryParam, getQueryParam } from "@/utils/urlHelper";

function Index({ contacts }: { contacts: PageProps }) {

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

  const [showCreateDrawer, setShowCreateDrawer] = useState(false)

  useEffect(() => {
    let action = getQueryParam('action');
    if (action === 'create') {
      setShowCreateDrawer(true);
      deleteQueryParam('action');
    }
  }, [])

  return (
    <div>
      <PageTitle
        title="Contacts"
        counter={contacts.total}
        onCreateButtonClick={() => { setShowCreateDrawer(true) }}
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
      <ContactFormDrawer
        mode="create"
        show={showCreateDrawer}
        onClose={() => setShowCreateDrawer(false)}
      />
    </div>
  )
}

Index.layout = (page: any) => {
  return (
    <AppLayout>
      {page}
    </AppLayout>
  )
}

export default Index
