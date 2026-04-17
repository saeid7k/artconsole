import { router } from "@inertiajs/react";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import axios from "axios";

function useSubscriptionQueries() {

  const resumeSubscriptionMutation = useMutation({
    mutationKey: ["resumeSubscription"],
    mutationFn: () => axios.post(route('subscription.resume')),
    onSuccess: () => {
      message.success('Subscription resumed successfully.');
      router.reload();
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'An error occurred while resuming the subscription.');
    }
  });

  const cancelSubscriptionMutation = useMutation({
    mutationKey: ["cancelSubscription"],
    mutationFn: () => axios.post(route('subscription.cancel')),
    onSuccess: () => {
      message.success('Subscription cancelled successfully.');
      router.reload();
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'An error occurred while cancelling the subscription.');
    }
  });

  return {
    resumeSubscriptionMutation,
    cancelSubscriptionMutation,
  }
}

export default useSubscriptionQueries;
