import { TOKEN_TRANSACTION_TYPES } from "@/constants/tokenTransactionTypes";
import { TokenTransaction } from "@/types/tokenTransaction";
import { DownloadSquare01Icon, UploadSquare01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "antd";
import axios from "axios";
import { useState } from "react";
import FlexBox from "../Containers/FlexBox";
import ItemRow from "../Containers/ItemRow";
import InfoPopover from "../InfoPopover";
import StyledDate from "../StyledDate";

function TokensTransactions() {

  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [transactionsUrl, setTransactionsUrl] = useState(route('tokens.transactions'));

  const transactionsQuery = useQuery({
    queryKey: ['tokenTransactions'],
    queryFn: () => axios.get(transactionsUrl).then(res => {
      setTransactions(prev => [...prev, ...res.data.data]);
      setTransactionsUrl(res.data.next_page_url);
      return res.data;
    }),
    enabled: !!transactionsUrl ? true : false,
    retry: false,
  });

  const colorClass = (type: string) => {
    switch (type) {
      case 'top_up':
      case 'credit':
      case 'refund':
        return 'text-green-600';
      case 'usage':
        return 'text-red-600';
      default:
        return '';
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'usage':
        return <HugeiconsIcon icon={DownloadSquare01Icon} size={20} className="text-red-600" />;
      default:
        return <HugeiconsIcon icon={UploadSquare01Icon} size={20} className="text-green-600" />;
    }
  }

  return (
    <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
      {transactions.map((item: TokenTransaction) => (
        <ItemRow
          key={item.id}
          size="sm"
        >
          <FlexBox gap={2} justifyContent="between">
            <FlexBox gap={2}>
              {getIcon(item.type)}
              <div className={`font-mono ${colorClass(item.type)}`}>{item.amount}</div>
              <div>{TOKEN_TRANSACTION_TYPES[item.type]}</div>
              {item.description && (
                <InfoPopover
                  content={item.description}
                />
              )}
            </FlexBox>
            <StyledDate value={item.created_at} showIcon={false} />
          </FlexBox>
        </ItemRow>
      ))}
      <Button
        onClick={() => transactionsQuery.refetch()}
        disabled={!transactionsUrl}
        loading={transactionsQuery.isFetching}
        className="shrink-0"
      >
        Load More
      </Button>
    </div>
  );
}

export default TokensTransactions;
