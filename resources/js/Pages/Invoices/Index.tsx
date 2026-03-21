import InvoiceFormDrawer from "@/Components/Invoices/InvoiceFormDrawer";
import InvoicesFilter from "@/Components/Invoices/InvoicesFilter";
import InvoiceTable from "@/Components/Invoices/InvoiceTable";
import PageTitle from "@/Components/PageTitle";
import { useSearch } from "@/hooks/useSearch";
import AppLayout from "@/Layouts/AppLayout";
import { PageProps } from "@/types";
import { usePage } from "@inertiajs/react";
import Search from "antd/es/input/Search";
import { useState } from "react";

function Index({ invoices }: { invoices: PageProps }) {

  const user = usePage().props.auth.user;
  const { debouncedSearch } = useSearch('invoices.index');

  const [ showInvoiceFormDrawer, setShowInvoiceFormDrawer ] = useState(false);

  const renderToolbar = () => (
    <div className="flex items-start gap-2 flex-wrap">
      <InvoicesFilter />
      <Search
        placeholder="search invoices..."
        style={{ width: 200 }}
        size="middle"
        allowClear
        onChange={(e) => debouncedSearch(e.target.value, 1000)}
      />

    </div>
  )

  return (
    <div>
      <PageTitle title="Invoices"
        counter={invoices?.total || 0}
        createButtonDisabled={!user.has_edit_access}
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
