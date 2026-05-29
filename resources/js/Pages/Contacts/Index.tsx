import PageSearchBox from "@/Components/PageSearchBox";
import PageTitle from "@/Components/PageTitle";
import AppLayout from "@/Layouts/AppLayout";
import { PageProps } from "@/types";
import { deleteQueryParam, getQueryParam } from "@/utils/urlHelper";
import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import ContactFormDrawer from "./Partials/ContactFormDrawer";
import ContactsFilter from "./Partials/ContactsFilter";
import ContactsTable from "./Partials/ContactsTable";

function Index({ contacts }: { contacts: PageProps }) {

  const user = usePage().props.auth.user;

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
            <ContactsFilter />
            <PageSearchBox routeName="contacts.index" placeHolder="Search contacts..." />
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
