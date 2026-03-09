import { Tabs } from "antd"
import Currency from "./Accounting/Currency"
import Taxes from "./Accounting/Taxes"

function Accounting() {

  return (
    <div>
      <Tabs
        defaultActiveKey="taxes"
        items={[
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
