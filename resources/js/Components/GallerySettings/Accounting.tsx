import { Tabs } from "antd"
import Currency from "./Accounting/Currency"

function Accounting() {

  return (
    <div>
      <Tabs
        items={[
          {
            key: 'currency',
            label: 'Currency',
            children: <Currency />
          },
          {
            key: 'taxes',
            label: 'Taxes',
          },
        ]}
      />
    </div>
  )
}

export default Accounting
