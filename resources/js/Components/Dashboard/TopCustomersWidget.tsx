import { ContactProps } from "@/types/contact";
import { router } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Empty } from "antd";
import axios from "axios";
import ContactStack from "../Contacts/ContactStack";
import FlexBox from "../Containers/FlexBox";

function TopCustomersWidget() {

  const { data, isLoading } = useQuery({
    queryKey: ['top-customers'],
    queryFn: () => axios.post(route('contacts.top-customers')).then(res => res.data),
    staleTime: Infinity
  });

  return (
    <Card
      title="Top Customers"
      loading={isLoading}
      extra={
        data && data.length > 0 && (
          <Button type="link" size="small"
            onClick={() => router.visit(route('contacts.index'))}
          >
            View All
          </Button>
        )
      }
      className={isLoading ? 'h-[295px]' : ''}
    >
      {
        data?.length == 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No purchases found" />
      }

      <div className="flex flex-col gap-1">
        {data && data.length > 0 && data.map((customer: ContactProps) => (
          <FlexBox key={customer.id}
            justifyContent="between"
            gap={2}
            className="hover:bg-gray-500/5 p-2"
          >
            <ContactStack
              contact={customer}
              rootClassName="grow"
            />
            <div className="text-lg font-light">{customer.purchased_arts_count}</div>
          </FlexBox>
        ))}
      </div>
    </Card>
  )
}

export default TopCustomersWidget;
