type Props = {
  number: number;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

function NumberedSection({ number, title, description, children }: Props) {
  return (
    <div>
      <div className="text-lg">
        <span className="text-2xl text-primary font-bold">{number}. </span>
        <span>{title}</span>
      </div>
      {description && (
        <div className="text-muted">
          {description}
        </div>
      )}
      {children}
    </div>
  )
}

export default NumberedSection
