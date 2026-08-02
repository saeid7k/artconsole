import { AiMessage } from "@/types/aiMessage";
import { message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

function usePollAssistantMessage(conversationId: string | null) {

  const [result, setResult] = useState<{ status: 'pending' | 'success' | 'error' | null, assistantMessage?: AiMessage }>({
    status: null,
    assistantMessage: undefined,
  })

  function pollForResult() {
    if (!conversationId) return;

    setResult(prev => ({ ...prev, status: 'pending' }))
    const interval = setInterval(() => {
      axios.get(route('ai.assistant-message', { conversationId }))
        .then(res => {
          if (res.status === 200) {
            message.success('AI response received successfully!')
            setResult({
              status: 'success',
              assistantMessage: res.data,
            })
            clearInterval(interval)
          }
        })
        .catch(err => {
          if (err.response?.status === 202) {
          } else {
            message.error(err?.response?.data?.message || 'Failed to get AI response')
            setResult(prev => ({ ...prev, status: 'error' }))
            clearInterval(interval)
          }
        })
    }, 5000)

    return () => clearInterval(interval)
  }

  useEffect(pollForResult, [conversationId])

  return result
}

export default usePollAssistantMessage
