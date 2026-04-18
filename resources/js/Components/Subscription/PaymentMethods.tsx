import { useSubscription } from '@/contexts/SubscriptionContext'
import { useMutation } from '@tanstack/react-query'
import { Button, Popconfirm, Tag } from 'antd'
import useMessage from 'antd/es/message/useMessage'
import axios from 'axios'
import amexLogo from '~/resources/images/payment-methods/amex.svg'
import discoverLogo from '~/resources/images/payment-methods/discover.svg'
import masterCardLogo from '~/resources/images/payment-methods/mastercard.svg'
import visaLogo from '~/resources/images/payment-methods/visa.svg'

function PaymentMethods({ paymentMethods }: { paymentMethods: any[] }) {

  const { subscriptionData, refetchData } = useSubscription();
  const [messageApi, messageContextHolder] = useMessage();

  const setDefaultPaymentMethodMutation = useMutation({
    mutationFn: (paymentMethodId: string) => axios.post(route('subscription.default-payment-method'), {
      payment_method_id: paymentMethodId
    }),
    onSuccess: () => {
      messageApi.success('Default payment method updated successfully!');
      refetchData();
    },
    onError: (error: any) => {
      messageApi.error(error.response?.data?.message || 'Failed to update default payment method');
    },
  })

  const deletePaymentMethodMutation = useMutation({
    mutationFn: (paymentMethodId: string) => axios.post(route('subscription.delete-payment-method'), {
      payment_method_id: paymentMethodId
    }),
    onSuccess: () => {
      messageApi.success('Payment method deleted successfully!');
      refetchData();
    },
    onError: (error: any) => {
      messageApi.error(error.response?.data?.message || 'Failed to delete payment method');
    },
  })

  const cardLogo = {
    visa: visaLogo,
    mastercard: masterCardLogo,
    amex: amexLogo,
    discover: discoverLogo,
  }

  return (
    <div className="flex flex-col gap-5 overflow-x-auto pb-3">
      {messageContextHolder}
      {paymentMethods.map((method) => (
        <div
          key={method.id}
          className="flex justify-between items-start gap-3 border p-2 rounded-lg group flex-wrap min-w-[300px]"
        >
          <div className="flex items-center gap-5">
            <img
              src={cardLogo[method.card.brand as keyof typeof cardLogo] || ''}
              alt={method.card.brand}
              className="w-10 h-10"
            />
            <div>
              <div className="font-mono whitespace-nowrap">{`**** ${method.card.last4}`}</div>
              <div className="text-muted">{`Expires ${method.card.exp_month}/${method.card.exp_year}`}</div>
            </div>
            {method.billing_details.name && (
              <div className='font-mono text-muted'>
                {method.billing_details.name}
              </div>
            )}
          </div>
          {subscriptionData?.defaultPaymentMethod?.id === method.id ? (
            <Tag color="blue" className='text-sm'>Default</Tag>
          ) : (
            <div className='flex gap-1'>
              <Button
                size="small"
                variant='outlined'
                color='blue'
                className='mouse:opacity-0 group-hover:opacity-100'
                onClick={() => setDefaultPaymentMethodMutation.mutate(method.id)}
                loading={setDefaultPaymentMethodMutation.isPending && setDefaultPaymentMethodMutation.variables === method.id}
              >
                Set as Default
              </Button>
              <Popconfirm
                title="Delete payment method"
                description='Are you sure you want to delete this payment method?'
                onConfirm={() => deletePaymentMethodMutation.mutate(method.id)}
                okText="Yes"
                cancelText="No"
                placement="left"
                okType="danger"
                arrow={false}
              >
                <Button
                  size="small"
                  variant='outlined'
                  color='danger'
                  className='mouse:opacity-0 group-hover:opacity-100'
                  loading={deletePaymentMethodMutation.isPending && deletePaymentMethodMutation.variables === method.id}
                >
                  Delete
                </Button>
              </Popconfirm>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default PaymentMethods;
