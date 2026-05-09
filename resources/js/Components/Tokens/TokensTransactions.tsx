import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import ItemRow from "../Containers/ItemRow";

function TokensTransactions() {

  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionsUrl, setTransactionsUrl] = useState(route('tokens.transactions'));

  const transactionsQuery = useQuery({
    queryKey: ['tokenTransactions'],
    queryFn: () => axios.get(transactionsUrl).then(res => {
      setTransactions(prev => [...prev, ...res.data.data]);
      setTransactionsUrl(res.data.next_page_url);
    }),
    enabled: true,
    retry: false,
  });

  return (
    <div className="flex flex-col">
      {transactions.map((item: any) => (
        <ItemRow key={item.id}>
          {item.description} - {item.amount}
        </ItemRow>
      ))}

      <pre>
        {JSON.stringify(transactions, null, 2)}
      </pre>
    </div>
  );
}

export default TokensTransactions;
