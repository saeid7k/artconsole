import { createContext, use } from "react";

const SubscriptionContext = createContext<any>({})

function SubscriptionProvider({ value, children }: { value: any; children: React.ReactNode }) {
  return (
    <SubscriptionContext value={value}>
      {children}
    </SubscriptionContext>
  )
}

function useSubscription() {
  return use(SubscriptionContext);
}

export { SubscriptionProvider, useSubscription };
