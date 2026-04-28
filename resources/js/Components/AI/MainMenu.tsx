import { AiContentGenerator01Icon, Sofa01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Divider } from "antd"

function MainMenu() {

  const renderItemRow = (id: string , icon: React.ReactNode, label: string) => (
    <div
      className="flex items-center gap-1 border px-3 py-2 rounded-lg hover:bg-primary-500/5 transition duration-300 cursor-pointer"
    >
      {icon}
      <div className="self-stretch">
        <Divider orientation="vertical" className="h-[100%]" />
      </div>
      <div>{label}</div>
    </div>
  )

  return (
    <div>
      <div className="text-lg mb-3">
        How can I help you today?
      </div>
      <div className="flex flex-col gap-2">
        {renderItemRow('mockup', <HugeiconsIcon icon={Sofa01Icon} />, 'Create room mockup image')}
        {renderItemRow('artwork_description' , <HugeiconsIcon icon={AiContentGenerator01Icon} />, 'Generate artwork description')}
      </div>
    </div>
  )
}

export default MainMenu
