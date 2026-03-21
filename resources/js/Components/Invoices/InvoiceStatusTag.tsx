import INVOICE_STATUSES from "@/constants/invoiceStatuses";
import colors from "@/Themes/theme";
import { InvoiceProps } from "@/types/invoice";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router } from "@inertiajs/react";
import { useMutation } from "@tanstack/react-query";
import { Dropdown, Menu, Tag } from "antd";
import axios from "axios";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import FlexBox from "../Containers/FlexBox";

type Props = {
  invoice: InvoiceProps;
  variant?: 'filled' | 'outlined' | 'solid';
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  className?: string;
};

function InvoiceStatusTag({ invoice, variant = "filled", fontSize = "base", className }: Props) {

  const [optimisticStatus, setOptimisticStatus] = useState<string | null>(null);
  const displayingStatus = optimisticStatus || invoice?.status;
  const selectedStatus = INVOICE_STATUSES.find((s) => s.value === displayingStatus);
  const iconBgColor = colors[selectedStatus?.color || 'gray'][500];


  const popupRender = () => (
    <Menu
      items={INVOICE_STATUSES.map((s) => ({
        key: s.value,
        label: (
          <FlexBox>
            <span
              className='w-2 h-2 rounded-full'
              style={{
                backgroundColor: colors[s.color || 'gray'][500],
              }}
            ></span>
            {s.label}
          </FlexBox>
        ),
        onClick: () => handleChangeStatus(s.value)
      }))}
    />
  )

  // Change Status

  const changeStatusMutation = useMutation({
    mutationFn: (newStatus: string) => axios.put(route('invoices.change-status', { invoice: invoice.id }), {
      status: newStatus,
    }),
    onSuccess: () => {
      router.reload({
        onSuccess: () => {
          setOptimisticStatus(null);
        }
      });
    },
    onError: (err: any) => {
      setOptimisticStatus(null);
    },
  })

  function handleChangeStatus(newStatus: string) {
    if (newStatus === invoice?.status) return;
    setOptimisticStatus(newStatus);
    changeStatusMutation.mutate(newStatus);
  }

  return (
    <Dropdown
      trigger={['click']}
      popupRender={popupRender}
    >
      <Tag
        color={selectedStatus?.color || 'default'}
        variant={variant}
        className={twMerge(
          'font-semibold cursor-pointer',
          `text-${fontSize}`,
          className
        )}
      >
        <FlexBox>
          <span
            className='w-2 h-2 rounded-full'
            style={{
              backgroundColor: iconBgColor,
            }}
          ></span>
          {selectedStatus?.label || displayingStatus}
          <HugeiconsIcon icon={ArrowDown01Icon} size={16} />
        </FlexBox>
      </Tag>
    </Dropdown>
  );
}

export default InvoiceStatusTag;
