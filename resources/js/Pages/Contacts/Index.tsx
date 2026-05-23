import PageTitle from "@/Components/PageTitle";
import { useSearch } from "@/hooks/useSearch";
import AppLayout from "@/Layouts/AppLayout";
import { PageProps } from "@/types";
import { deleteQueryParam, getQueryParam } from "@/utils/urlHelper";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";
import ContactFormDrawer from "./Partials/ContactFormDrawer";
import ContactsFilter from "./Partials/ContactsFilter";
import ContactsTable from "./Partials/ContactsTable";
import { usePage } from "@inertiajs/react";

function Index({ contacts }: { contacts: PageProps }) {

  const user = usePage().props.auth.user;
  const { handleSearch, debouncedSearch } = useSearch('contacts.index');

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
        createButtonDisabled={!user?.has_edit_access}
        onCreateButtonClick={() => { setShowCreateDrawer(true) }}
        toolbar={
          <div className="flex items-start gap-2 flex-wrap">
            <Search
              placeholder="search contacts..."
              style={{ width: 200 }}
              allowClear
              onSearch={handleSearch}
              onChange={(e) => debouncedSearch(e.target.value, 1000)}
            />
            <ContactsFilter />
          </div>
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
