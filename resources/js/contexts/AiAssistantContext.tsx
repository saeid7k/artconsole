import { createContext, use } from "react";

const AiAssistantContext = createContext<any>({})

function AiAssistantProvider({ value, children }: { value: any; children: React.ReactNode }) {
  return (
    <AiAssistantContext value={value}>
      {children}
    </AiAssistantContext>
  )
}

function useAiAssistant() {
  return use(AiAssistantContext);
}

export { AiAssistantProvider, useAiAssistant };
