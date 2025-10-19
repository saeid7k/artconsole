type Props = {
  title: string | null;
  counter?: number | null;
  toolbar?: React.ReactNode | null;
}

function PageTitle({ title = null, counter = null, toolbar = null }: Props) {
  return (
      <div
        className="flex items-center justify-between px-6 pb-3 w-full grow-0"
      >
        <div className="flex items-center gap-2">
          <h3 className="m-0">{title}</h3>
          {counter && <small className="text-muted font-light">({counter.toLocaleString()})</small>}
        </div>
        {toolbar && <div>{toolbar}</div>}
      </div>
  )
}

export default PageTitle
