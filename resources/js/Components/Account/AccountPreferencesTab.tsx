import colors from "@/Themes/theme";
import { AuthProps } from "@/types/auth";
import { timeZoneOptions } from "@/utils/dateTimeHelper";
import { usePage } from "@inertiajs/react";
import { useMutation } from "@tanstack/react-query";
import { message, Select, Tag } from "antd";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import FlexBox from "../Containers/FlexBox";

function AccountPreferencesTab() {

  const { user } = usePage().props.auth as AuthProps

  const [savingStatus, setSavingStatus] = useState<null | "pending" | "saved">(null);

  const setMetaMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) => {
      return axios.post(route("profile.set-meta"), { key, value });
    },
    onSuccess: () => {
      setSavingStatus("saved");
    },
    onError: (err: any) => {
      message.error(err.response.data.message || "An error occurred");
    }
  });

  function handleChange(key: string, value: string) {
    setSavingStatus("pending");
    setMetaMutation.mutate({ key, value });
  }

  useEffect(() => {
    // clear saved status after 3 seconds
    if (savingStatus === "saved") {
      const timer = setTimeout(() => {
        setSavingStatus(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [savingStatus])

  return (
    <div>
      <AnimatePresence>
        {savingStatus && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
            style={{ position: "absolute", top: 10, right: 10 }}
          >
            <Tag
              color={savingStatus === 'saved' ? colors.green[600] : colors.blue[500]}
            >
              {savingStatus === 'saved' ? 'Saved' : savingStatus === 'pending' ? 'Saving...' : 'Idle'}
            </Tag>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="label">Timezone</div>
      <FlexBox>
        <Select
          options={timeZoneOptions}
          showSearch
          defaultValue={user.timezone}
          className="w-full md:w-1/2"
          onChange={(value) => handleChange("timezone", value)}
        />
      </FlexBox>
    </div>
  )
}

export default AccountPreferencesTab
