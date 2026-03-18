import InvoiceFormDrawer from "@/Components/Invoices/InvoiceFormDrawer";
import InvoiceTable from "@/Components/Invoices/InvoiceTable";
import PageTitle from "@/Components/PageTitle";
import AppLayout from "@/Layouts/AppLayout";
import { PageProps } from "@/types";
import { usePage } from "@inertiajs/react";
import { useState } from "react";

function Index({ invoices }: { invoices: PageProps }) {

  const user = usePage().props.auth.user;

  const [ showInvoiceFormDrawer, setShowInvoiceFormDrawer ] = useState(false);

  return (
    <div>
      <PageTitle title="Invoices"
        counter={invoices?.total || 0}
        createButtonDisabled={!user.has_edit_access}
        onCreateButtonClick={() => setShowInvoiceFormDrawer(true)}
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
