import AppLayout from "@/Layouts/AppLayout";
import { PageProps } from "@/types";
import { router } from "@inertiajs/react";
import Search from "antd/es/input/Search";
import ContactsTable from "./Partials/ContactsTable";
import PageTitle from "@/Components/PageTitle";
import { useEffect, useState } from "react";
import ContactFormDrawer from "./Partials/ContactFormDrawer";
import { deleteQueryParam, getQueryParam } from "@/utils/urlHelper";
import { useSearch } from "@/hooks/useSearch";

function Index({ contacts }: { contacts: PageProps }) {

  const { handleSearch } = useSearch('contacts.index');

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
