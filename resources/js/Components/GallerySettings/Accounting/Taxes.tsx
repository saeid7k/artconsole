import FlexBox from "@/Components/Containers/FlexBox"
import { Delete02Icon, Edit03Icon, StarIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button, Tag, Tooltip } from "antd"

function Taxes() {

  // Temporary Sample Records
  const taxes = [
    {
      id: 1,
      name: "HST/GST",
      abbreviation: "HST",
      description: "Harmonized Sales Tax / Goods and Services Tax",
      tax_number: "123456789RT0001",
      rate: 13,
      default: true,
    },
    {
      id: 2,
      name: "PST",
      abbreviation: "PST",
      description: "Provincial Sales Tax",
      tax_number: "1122334455",
      rate: 8,
      default: false,
    },
    {
      id: 3,
      name: "Indian Act Tax Exemption",
      abbreviation: "IAT",
      description: "Tax exemption for sales to Indigenous peoples under the Indian Act",
      tax_number: null,
      rate: 0,
      default: false,
    },
  ]

  return (
    <div>
      <div className="flex flex-col gap-2">
        {taxes.map((tax) => (
          <div key={tax.id} className="flex justify-between items-center gap-3 p-2 border rounded-lg">
            <div>
              <div className="flex flex-col" >
                <FlexBox gap={3}>
                  <div>{tax.name} ({tax.abbreviation})</div>
                  <strong>{tax.rate}%</strong>
                  {tax.default && <Tag variant="outlined" color="green">Default</Tag>}
                </FlexBox>
                <div className="text-ghost line-clamp-1">
                  {tax.description}
                </div>
              </div>
            </div>
            <FlexBox gap={1} >
              {!tax.default && (
                <Tooltip title="Set as Default">
                  <Button
                    variant="text"
                    shape="circle"
                    color="purple"
                    icon={<HugeiconsIcon icon={StarIcon} size={20} />}
                  />
                </Tooltip>
              )}
              <Tooltip title="Edit">
                <Button
                  variant="text"
                  shape="circle"
                  color="default"
                  icon={<HugeiconsIcon icon={Edit03Icon} size={20} />}
                />
              </Tooltip>
              <Tooltip title="Delete">
                <Button
                  variant="text"
                  shape="circle"
                  color="danger"
                  icon={<HugeiconsIcon icon={Delete02Icon} size={20} />}
                />
              </Tooltip>
            </FlexBox>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Taxes
