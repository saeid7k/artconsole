import { DownloadIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useIsFetching, useQuery } from "@tanstack/react-query";
import { Button, Card, Empty, Tooltip } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import StyledCurrency from "../StyledCurrency";
import StyledDate from "../StyledDate";
import SubscriptionInvoiceStatusTag from "./SubscriptionInvoiceStatusTag";

function InvoicesCard() {

  const activeOtherQueries = useIsFetching({
    predicate: (query) => query.queryKey[0] !== 'subscriptionInvoices'
  });

  const [isOneSecondPassed, setIsOneSecondPassed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOneSecondPassed(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getInvoicesQuery = useQuery({
    queryKey: ['subscriptionInvoices'],
    queryFn: () => axios.get(route('subscription.invoices')).then(res => res.data),
    enabled: activeOtherQueries === 0 && isOneSecondPassed,
    retry: false,
  });

  const invoices = getInvoicesQuery.data;

  return (
    <Card
      title="Invoices History"
      loading={getInvoicesQuery.isLoading || !isOneSecondPassed || activeOtherQueries > 0}
      className="overflow-x-hidden"
    >
      <div className="flex flex-col gap-1 max-h-[500px] overflow-y-auto">
        {invoices?.length === 0 && (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No invoices found" />
        )}
        {invoices?.map((invoice: any) => (
          <div key={invoice.id} className="flex justify-between items-center gap-3 border rounded-lg px-3 py-1">
            <div className="flex items-center gap-3">
              <code>{invoice.number}</code>
              <StyledDate value={invoice.created} showTime={false} />
            </div>
            <StyledCurrency value={invoice.total/100} currency={invoice.currency} minimumFractionDigits={2} />
            <div className="flex items-center gap-3">
              <SubscriptionInvoiceStatusTag status={invoice.status} />
              <div className="flex">
                <Tooltip title="Download Invoice PDF">
                  <Button
                    variant="text"
                    color="primary"
                    shape="circle"
                    icon={<HugeiconsIcon icon={DownloadIcon} size={20} />}
                    onClick={() => window.open(invoice.invoice_pdf, '_self')}
                  />
                </Tooltip>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default InvoicesCard;
