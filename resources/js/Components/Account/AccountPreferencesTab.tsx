import useSaveChip from "@/hooks/useSaveChip";
import { AuthProps } from "@/types/auth";
import { timeZoneOptions } from "@/utils/dateTimeHelper";
import { usePage } from "@inertiajs/react";
import { useMutation } from "@tanstack/react-query";
import { message, Select } from "antd";
import axios from "axios";
import FlexBox from "../Containers/FlexBox";

function AccountPreferencesTab() {

  const { user } = usePage().props.auth as AuthProps
  const { setSavingStatus, saveChipNode } = useSaveChip();

  const setMetaMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) => {
      return axios.post(route("profile.set-meta"), { key, value });
    },
    onSuccess: () => {
      setSavingStatus("saved");
    },
    onError: (err: any) => {
      message.error(err.response.data.message || "An error occurred");
      setSavingStatus("failed");
    }
  });

  function handleChange(key: string, value: string) {
    setSavingStatus("saving");
    setMetaMutation.mutate({ key, value });
  }

  return (
    <div>
      {saveChipNode}
      <div className="label">Timezone</div>
      <FlexBox>
        <Select
          options={timeZoneOptions}
          showSearch
          defaultValue={user?.timezone}
          className="w-full md:w-1/2"
          onChange={(value) => handleChange("timezone", value)}
        />
      </FlexBox>
    </div>
  )
}

export default AccountPreferencesTab
