import useSaveChip from "@/hooks/useSaveChip";
import { UsePageProps } from "@/types/usePage";
import { UserProps } from "@/types/user";
import { router, usePage } from "@inertiajs/react";
import { useMutation } from "@tanstack/react-query";
import { Divider, Radio } from "antd";
import axios from "axios";
import { useState } from "react";
import AddressDataBox from "../Containers/AddressDataBox";
import CommunicationDataBox from "../Containers/CommunicationDataBox";

function BillingDetails({ billing_to }: { billing_to: string }) {

  // Hooks and State

  const { props } = usePage<UsePageProps>();
  const { setSavingStatus, saveChipNode } = useSaveChip()
  const [billingTo, setBillingTo] = useState(billing_to);

  // Variables

  const gallery = props.current_gallery;
  const owner = gallery.members.find((member: UserProps) => member.access === 'owner');
  const billingTarget = (billingTo === 'owner' ? owner : gallery) ?? gallery;

  // Functions

  const setBillingToMutation = useMutation({
    mutationFn: (billing_to: string) => axios.post(route('subscription.set-billing-to'), { billing_to }),
    onSuccess: () => {
      setSavingStatus('saved');
      router.reload({only: ['billing_to']});
    },
    onError: (error: any) => {
      setSavingStatus('failed');
    },
  })

  function handleBillingToChange(e: any) {
    setBillingTo(e.target.value);
    setSavingStatus('saving');
    setBillingToMutation.mutate(e.target.value)
  }

  return (
    <div className="flex flex-col xl:flex-row gap-5">
      {saveChipNode}
      <div className="w-max">
        <Radio.Group
          orientation="vertical"
          optionType="default"
          options={[
            { label: 'Use Gallery Info', value: 'gallery' },
            { label: 'Use Personal Info', value: 'owner' },
          ]}
          defaultValue={billing_to}
          onChange={handleBillingToChange}
          className="w-max"
        />
      </div>
      <div className="hidden xl:block">
        <Divider orientation="vertical" className="h-full" size="small" />
      </div>
      <div>
        <div className="font-semibold mb-2">{billingTo === 'owner' ? owner?.full_name : gallery.name}</div>
        <CommunicationDataBox showTitle={false} phone={billingTarget.phone} email={billingTarget.email} />
        <Divider size="small" />
        <AddressDataBox address={billingTarget.address} />
      </div>
    </div>
  )
}

export default BillingDetails;
