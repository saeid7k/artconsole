import { useIsFetching, useQuery } from "@tanstack/react-query";
import { Card } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

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

  return (
    <Card
      title="Invoices History"
      loading={getInvoicesQuery.isLoading || !isOneSecondPassed || activeOtherQueries > 0}
      className="overflow-x-hidden"
    >
    </Card>
  )
}

export default InvoicesCard;
