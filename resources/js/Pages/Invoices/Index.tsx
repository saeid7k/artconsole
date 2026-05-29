import InvoiceFormDrawer from "@/Components/Invoices/InvoiceFormDrawer";
import InvoicesFilter from "@/Components/Invoices/InvoicesFilter";
import InvoiceTable from "@/Components/Invoices/InvoiceTable";
import PageSearchBox from "@/Components/PageSearchBox";
import PageTitle from "@/Components/PageTitle";
import AppLayout from "@/Layouts/AppLayout";
import { PageProps } from "@/types";
import { deleteQueryParam, getQueryParam } from "@/utils/urlHelper";
import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

function Index({ invoices }: { invoices: PageProps }) {

  const user = usePage().props.auth.user;

  const [ showInvoiceFormDrawer, setShowInvoiceFormDrawer ] = useState(false);

  useEffect(() => {
    let action = getQueryParam('action');
    if (action === 'create') {
      setShowInvoiceFormDrawer(true);
      deleteQueryParam('action');
    }
  }, [])

  const renderToolbar = () => (
    <div className="flex items-start gap-2 flex-wrap">
      <InvoicesFilter />
      <PageSearchBox routeName="invoices.index" placeHolder="Search invoices..." />

    </div>
  )

  return (
    <div>
      <PageTitle title="Invoices"
        counter={invoices?.total || 0}
        createButtonDisabled={!user?.has_edit_access}
        onCreateButtonClick={() => setShowInvoiceFormDrawer(true)}
        toolbar={renderToolbar()}
      />

      <InvoiceTable invoices={invoices} />

      {/* Components */}

      <InvoiceFormDrawer
        show={showInvoiceFormDrawer}
        onClose={() => setShowInvoiceFormDrawer(false)}
      />
    </div>
  )
}

Index.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;

export default Index;
