import FlexBox from "@/Components/Containers/FlexBox"
import LoadingSpinner from "@/Components/LoadingSpinner"
import { TaxProps } from "@/types/tax"
import { AddIcon, Delete02Icon, Edit03Icon, StarIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Button, Empty, message, Tag, Tooltip } from "antd"
import axios from "axios"
import { useEffect, useState } from "react"
import TaxFormModal from "./TaxFormModal"

function Taxes() {

  const [ showTaxFormModal, setShowTaxFormModal ] = useState(false)
  const [ selectedTax, setSelectedTax ] = useState<TaxProps | null>(null)
  const [ optimisticDefaultTaxId, setOptimisticDefaultTaxId ] = useState<number | null>(null)

  const taxesQuery = useQuery({
    queryKey: ['taxes'],
    queryFn: () => axios.get(route('taxes.index'))
      .then(res => res.data),
  })

  const deleteTaxMutation = useMutation({
    mutationFn: (taxId: number) => axios.delete(route('taxes.delete', { tax: taxId })),
    onSuccess: () => {
      message.success('Tax deleted successfully')
      taxesQuery.refetch()
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to delete tax')
    }
  })

  const setDefaultTaxMutation = useMutation({
    mutationFn: (taxId: number) => axios.post(route('taxes.set-default', { tax: taxId })),
    onMutate: (taxId: number) => {
      setOptimisticDefaultTaxId(taxId)
    },
    onSuccess: async () => {
      await taxesQuery.refetch()
      setOptimisticDefaultTaxId(null)
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to update default tax')
      setOptimisticDefaultTaxId(null)
    }
  })

  useEffect(() => {
    taxesQuery.refetch()
  }, [showTaxFormModal])

  return (
    <>
      <div>
        <div>
          <FlexBox justifyContent="between" alignItems="center" className="mb-3" >
            <div>
            </div>
            <div>
            <Button
              variant="solid"
              color="primary"
              icon={<HugeiconsIcon icon={AddIcon} size={20} />}
              onClick={() => {
                setSelectedTax(null)
                setShowTaxFormModal(true)
              }}
            >
              Add Tax
            </Button>
            </div>
          </FlexBox>
        </div>
        <div className="flex flex-col gap-2">
          {taxesQuery.isLoading && <LoadingSpinner size="large" />}
          {taxesQuery.data?.map((tax: TaxProps) => {
            const isDefault = optimisticDefaultTaxId ? tax.id === optimisticDefaultTaxId : tax.default
            return (
              <div key={tax.id} className="flex justify-between items-center gap-3 p-2 border rounded-lg">
                <div>
                  <div className="flex flex-col" >
                    <FlexBox gap={3}>
                      <div>{tax.name} ({tax.abbreviation})</div>
                      <strong>{Intl.NumberFormat().format(tax.rate)}%</strong>
                      {isDefault && <Tag variant="outlined" color="green">Default</Tag>}
                    </FlexBox>
                    <div className="text-ghost line-clamp-1">
                      {tax.description}
                    </div>
                  </div>
                </div>
                <FlexBox gap={1} >
                  {!isDefault && (
                    <Tooltip title="Set as Default">
                      <Button
                        variant="text"
                        shape="circle"
                        color="purple"
                        icon={<HugeiconsIcon icon={StarIcon} size={20} />}
                        onClick={() => setDefaultTaxMutation.mutate(tax.id)}
                      />
                    </Tooltip>
                  )}
                  <Tooltip title="Edit">
                    <Button
                      variant="text"
                      shape="circle"
                      color="default"
                      icon={<HugeiconsIcon icon={Edit03Icon} size={20} />}
                      onClick={() => {
                        setSelectedTax(tax)
                        setShowTaxFormModal(true)
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="Delete">
                    <Button
                      variant="text"
                      shape="circle"
                      color="danger"
                      icon={<HugeiconsIcon icon={Delete02Icon} size={20} />}
                      onClick={() => deleteTaxMutation.mutate(tax.id)}
                    />
                  </Tooltip>
                </FlexBox>
              </div>
            )
          })}
          {taxesQuery.isFetched && taxesQuery.data?.length === 0 && (<Empty description="No taxes created yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />)}
        </div>
      </div>

      {/* Components */}

      <TaxFormModal
        show={showTaxFormModal}
        selectedTax={selectedTax}
        onClose={() => setShowTaxFormModal(false)}
      />
    </>
  )
}

export default Taxes
