import { ARTWORK_CATEGORIES } from "@/constants/artworkCategories";
import ARTWORK_STATUSES from "@/constants/artworkStatuses";
import INVOICE_STATUSES from "@/constants/invoiceStatuses";
import useFilters from "@/hooks/useFilters";
import useLocations from "@/hooks/useLocations";
import useTags from "@/hooks/useTags";
import { useWindow } from "@/hooks/useWindow";
import { FilterIcon, FilterRemoveIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { Badge, Button, Drawer, Select, Tooltip } from "antd";
import axios from "axios";
import { useState } from "react";

function InvoicesFilter() {

  const { windowWidth } = useWindow();

  const { filters, setFilter, clearFilters, filteredFieldsCount } = useFilters('invoices.index');
  const isFiltered = Object.values(filters).some((vals) => Array.isArray(vals) && vals.length > 0);

  // Filters Drawer

  const [drawerOpen, setDrawerOpen] = useState(false);

  // Renders

  const renderStatusFilter = ({className = ''}) => {
    return (
      <Select
        mode="multiple"
        options={INVOICE_STATUSES}
        className={`min-w-[100px] ${className}`}
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
          {renderStatusFilter({})}
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
          className="flex flex-col gap-3"
        >
          <div>
            <div className="label">Status</div>
            {renderStatusFilter({className: 'w-full'})}
          </div>
        </div>
      </Drawer>
    </>
  )
}

export default InvoicesFilter;
