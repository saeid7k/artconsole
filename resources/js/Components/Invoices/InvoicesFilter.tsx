import INVOICE_STATUSES from "@/constants/invoiceStatuses";
import useFilters from "@/hooks/useFilters";
import { useWindow } from "@/hooks/useWindow";
import { FilterIcon, FilterRemoveIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { Badge, Button, DatePicker, Drawer, Select, Tooltip } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";

function InvoicesFilter() {

  const { windowWidth } = useWindow();

  const { filters, setFilter, setFilters, clearFilters, filteredFieldsCount } = useFilters('invoices.index');
  const isFiltered = Object.values(filters).some((vals) => Array.isArray(vals) && vals.length > 0);

  // Filters Drawer

  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fetch Customers

  const customersQuery = useQuery({
    queryKey: ['invoice-customers'],
    queryFn: () => axios.get('/invoices/get-customers').then(res => res.data),
    enabled: true,
    retry: false,
  })

  // Renders

  const renderDateFilter = () => {
    return (
      <DatePicker.RangePicker
        onChange={(dates, dateStrings) => {
          if (!dates) {
            setFilters({
              date_from: [],
              date_to: [],
            });
            return;
          }
          setFilters({
            date_from: dateStrings[0] ? [dateStrings[0]] : [],
            date_to: dateStrings[1] ? [dateStrings[1]] : [],
          });
        }}
        presets={[
          { label: 'Last 7 Days', value: [dayjs().add(-7, 'd'), dayjs()] },
          { label: 'Last 14 Days', value: [dayjs().add(-14, 'd'), dayjs()] },
          { label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()] },
          { label: 'Last Week', value: [dayjs().add(-1, 'week').startOf('week'), dayjs().add(-1, 'week').endOf('week')] },
          { label: 'This Week', value: [dayjs().startOf('week'), dayjs().endOf('week')] },
          { label: 'This Month', value: [dayjs().startOf('month'), dayjs().endOf('month')] },
          { label: 'Last Month', value: [dayjs().add(-1, 'month').startOf('month'), dayjs().add(-1, 'month').endOf('month')] },
          { label: 'This Year', value: [dayjs().startOf('year'), dayjs().endOf('year')] },
          { label: 'Last Year', value: [dayjs().add(-1, 'year').startOf('year'), dayjs().add(-1, 'year').endOf('year')] },
        ]}
        allowEmpty={[true, true]}
        value={[filters.date_from[0] ? dayjs(filters.date_from[0]) : null, filters.date_to[0] ? dayjs(filters.date_to[0]) : null]}
        className='min-w-[240px]'
      />
    )
  }

  const renderCustomerFilter = () => {
    return (
      <Select
        mode="multiple"
        options={customersQuery.data?.map((customer: any) => ({
          label: customer.full_name,
          value: customer.id.toString(),
        })) || []}
        className='min-w-[120px]'
        popupMatchSelectWidth={false}
        placeholder="Customer"
        optionLabelProp="label"
        showSearch={{
          optionFilterProp: 'label',
        }}
        onChange={(value: string[]) => setFilter('customer', value ?? [])}
        value={filters.customer?.map(String) || []}
        loading={customersQuery.isLoading}
      />
    )
  }

  const renderStatusFilter = () => {
    return (
      <Select
        mode="multiple"
        options={INVOICE_STATUSES}
        className='min-w-[100px]'
        popupMatchSelectWidth={false}
        placeholder="Status"
        optionLabelProp="label"
        showSearch={{
          optionFilterProp: 'label',
        }}
        onChange={(value: string[]) => setFilter('status', value ?? [])}
        value={filters.status.map(String) || []}
      />
    )
  }

  return (
    <>
      {windowWidth > 1024 && (
        <>
          {windowWidth > 1280 && (
            <>
              {renderDateFilter()}
            </>
          )}
          {renderCustomerFilter()}
          {renderStatusFilter()}
        </>
      )}

      <Tooltip
        title={filteredFieldsCount > 0 ? `${filteredFieldsCount} Fields are filtered` : "Filters"}
      >
        <Badge
          count={filteredFieldsCount}
          size="small"
          color='blue'
          offset={[-4,6]}
        >
          <Button
            type="text"
            shape="circle"
            icon={<HugeiconsIcon icon={FilterIcon} size={20} />}
            onClick={() => setDrawerOpen(true)}
          />
        </Badge>
      </Tooltip>

      {isFiltered && (
        <Tooltip title="Clear Filters">
          <Button
            variant="text"
            shape="circle"
            color="red"
            icon={<HugeiconsIcon icon={FilterRemoveIcon} size={20} />}
            onClick={clearFilters}
          />
        </Tooltip>
      )}

      <Drawer
        title="Filters"
        placement="right"
        onClose={() => { setDrawerOpen(false) }}
        open={drawerOpen}
      >
        <div
          className="flex flex-col gap-3 [&_.ant-select]:w-full [&_.ant-picker]:w-full"
        >
          <div>
            <div className="label">Date Range</div>
            {renderDateFilter()}
          </div>
          <div>
            <div className="label">Customer</div>
            {renderCustomerFilter()}
          </div>
          <div>
            <div className="label">Status</div>
            {renderStatusFilter()}
          </div>
        </div>
      </Drawer>
    </>
  )
}

export default InvoicesFilter;
