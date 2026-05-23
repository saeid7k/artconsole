import RELATIONSHIPS from "@/constants/relationships";
import useFilters from "@/hooks/useFilters";
import { useWindow } from "@/hooks/useWindow";
import { FilterIcon, FilterRemoveIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge, Button, Drawer, Select, Tooltip } from "antd";
import { useState } from "react";

function ContactsFilter() {

  const { windowWidth } = useWindow();

  const { filters, setFilter, clearFilters, filteredFieldsCount } = useFilters('contacts.index');
  const isFiltered = Object.values(filters).some((vals) => Array.isArray(vals) && vals.length > 0);

  // Filters Drawer

  const [drawerOpen, setDrawerOpen] = useState(false);

  // Renders

  const renderRelationshipFilter = ({className = ''}) => {
    return (
      <Select
        mode="multiple"
        options={RELATIONSHIPS.map((rel) => ({ label: rel.label, value: rel.value }))}
        className={`min-w-[110px] ${className}`}
        popupMatchSelectWidth={false}
        placeholder="Relationship"
        optionLabelProp="label"
        showSearch={{
          optionFilterProp: 'label',
        }}
        onChange={(value: string[]) => setFilter('relationship', value ?? [])}
        value={filters.relationship.map(String) || []}
      />
    )
  }

  return (
    <>
      {windowWidth > 1280 && (
        <>
          {renderRelationshipFilter({})}
        </>
      )}

      <Tooltip
        title={filteredFieldsCount > 0 ? `${filteredFieldsCount} Fields are filtered` : "Filters"}
      >
        <Badge
          count={filteredFieldsCount}
          size="small"
          color="blue"
          offset={[-4, 6]}
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
            <div className="label">Relationship</div>
            {renderRelationshipFilter({className: 'w-full'})}
          </div>
        </div>
      </Drawer>
    </>
  )
}

export default ContactsFilter;
