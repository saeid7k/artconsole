import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  label?: string
}>

function Container({ label, children }: Props) {
  return (
    <div
      className="mt-3 flex flex-col bg-white border border-dashed border-purple-300 rounded-lg p-2"
    >
      <small className="text-primary -translate-y-1">{label}</small>
      <div>
        {children}
      </div>
    </div>
  )
}

export default Container;
