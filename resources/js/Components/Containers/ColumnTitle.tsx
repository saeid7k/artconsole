import colors from "@/Themes/theme";

type Props = {
  className?: string;
  children: React.ReactNode;
}

function ColumnTitle({ className, children }: Props) {
  return (
    <div
      className={`text-center bg-light p-1 mb-3 ${className}`}
      style={{ borderBottom: `1px solid ${colors.primary[300]}` }}
    >
      {children}
    </div>
  )
}

export default ColumnTitle;
