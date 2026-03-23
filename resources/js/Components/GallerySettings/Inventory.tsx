import { Tabs } from "antd"
import Artworks from "./Inventory/artworks"

function Inventory() {

  return (
    <div>
      <Tabs
        defaultActiveKey="artworks"
        items={[
          {
            key: 'artworks',
            label: 'Artworks',
            children: <Artworks />
          },
        ]}
      />
    </div>
  )
}

export default Inventory
