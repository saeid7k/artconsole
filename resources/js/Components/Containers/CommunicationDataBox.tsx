import { formatPhoneNumber } from "@/utils/formatHelper";
import { Call02Icon, InternetIcon, Mail01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import DataCol from "./DataCol";
import DataRow from "./DataRow";

type Props = {
  showTitle?: boolean;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
}

function CommunicationDataBox({ showTitle = true, phone, email, website }: Props) {
  return (
    <DataCol title={showTitle ? "Communication" : undefined}>
      <DataRow
        icon={<HugeiconsIcon icon={Call02Icon} size={18} />}
        label="Phone:"
        value={formatPhoneNumber(phone ?? '')}
      />
      <DataRow
        icon={<HugeiconsIcon icon={Mail01Icon} size={18} />}
        label="Email:"
        value={email}
      />
      <DataRow
        icon={<HugeiconsIcon icon={InternetIcon} size={18} />}
        label="Website:"
        value={website}
        hideIfNoValue
      />
    </DataCol>
  );
}

export default CommunicationDataBox;
