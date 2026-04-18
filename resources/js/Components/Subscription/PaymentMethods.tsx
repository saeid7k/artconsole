import masterCardLogo from '~/resources/images/payment-methods/mastercard.svg'
import visaLogo from '~/resources/images/payment-methods/visa.svg'
import amexLogo from '~/resources/images/payment-methods/amex.svg'
import { Tag } from 'antd'

function PaymentMethods({ paymentMethods }: { paymentMethods: any[] }) {

  const cardLogo = {
    visa: visaLogo,
    mastercard: masterCardLogo,
    amex: amexLogo,
  }

  return (
    <div className="flex flex-col gap-5">
      {paymentMethods.map((method) => (
        <div key={method.id} className="flex justify-between items-start gap-3 border p-2 rounded-lg">
          <div className="flex items-center gap-3">
            <img
              src={cardLogo[method.card.brand as keyof typeof cardLogo] || ''}
              alt={method.card.brand}
              className="w-8 h-8"
            />
            <div>
              <div className="font-mono">{`**** ${method.card.last4}`}</div>
              <div className="text-muted">{`Expires ${method.card.exp_month}/${method.card.exp_year}`}</div>
            </div>
          </div>
          <Tag color="blue">Default</Tag>
        </div>
      ))}
    </div>
  )
}

export default PaymentMethods;
