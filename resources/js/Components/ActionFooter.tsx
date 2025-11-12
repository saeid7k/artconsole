import { Button } from "antd"

type Props = {
  isProcessing: boolean,
  save?: () => void
}

function ActionFooter({ isProcessing, save = undefined }: Props) {
  return (
    <div className="flex justify-end">
      {save && (
        <Button
          type="primary"
          onClick={save}
        >
          {isProcessing ? 'Saving...' : 'Save'}
        </Button>
      )}
    </div>
  )
}

export default ActionFooter
