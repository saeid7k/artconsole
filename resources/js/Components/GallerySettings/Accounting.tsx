import { Tabs } from "antd"
import Currency from "./Accounting/Currency"
import Taxes from "./Accounting/Taxes"
import Invoicing from "./Accounting/Invoicing"

function Accounting() {

  return (
    <div>
      <Tabs
        defaultActiveKey="invoicing"
        items={[
          {
            key: 'invoicing',
            label: 'Invoicing',
            children: <Invoicing />
          },
          {
            key: 'taxes',
            label: 'Taxes',
            children: <Taxes />
          },
          {
            key: 'currency',
            label: 'Currency',
            children: <Currency />
          },
        ]}
      />
    </div>
  )
}

export default Accounting
