import { HugeiconsIcon } from "@hugeicons/react";
import DataCol from "./DataCol";
import DataRow from "./DataRow";
import { City03Icon, EarthIcon, Location06Icon, MapingIcon } from "@hugeicons/core-free-icons";
import { Address } from "@/types/commonObjects";

type Props = {
  address?: Address | null;
}

function AddressDataBox({ address }: Props) {
  return (
    <DataCol title="Address">
      <DataRow
        icon={<HugeiconsIcon icon={Location06Icon} size={18} />}
        label="Street Address:"
        value={address?.street}
      />
      <DataRow
        icon={<HugeiconsIcon icon={City03Icon} size={18} />}
        label="City:"
        value={address?.city}
      />
      <DataRow
        icon={<HugeiconsIcon icon={MapingIcon} size={18} />}
        label="Province:"
        value={address?.province}
      />
      <DataRow
        icon={<HugeiconsIcon icon={EarthIcon} size={18} />}
        label="Country:"
        value={address?.country}
      />
    </DataCol>
  );
}

export default AddressDataBox;
