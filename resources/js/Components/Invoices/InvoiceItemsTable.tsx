import { ArtworkProps } from "@/types/artwork";
import { UsePageProps } from "@/types/usePage";
import { formatCurrency } from "@/utils/formatHelper";
import { ArrowDown01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePage } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import { Button, Checkbox, Dropdown, Input, InputNumber, Menu, Table, Tooltip } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { useEffect, useState } from "react";
import ArtworkFinderModal from "../Artworks/ArtworkFinderModal";

type Props = {
  items: any[];
  setItems: any;
  selectedArtworksIds?: number[];
}

function InvoiceItemsTable({ items, setItems, selectedArtworksIds = [] }: Props) {

  const galleryCurrency = usePage<UsePageProps>().props.current_gallery?.meta?.currency
  const [showArtworkFinder, setShowArtworkFinder] = useState(false);

  const columns = [
    {
      title: '',
      dataIndex: 'type',
      key: 'type',
      render: (type: string, record: any) => {
        if (type === 'artwork') {
          return (
            <img src={record.artwork?.main_image_thumb_url} alt={record.artwork?.title} style={{ width: 50, height: 50, objectFit: 'cover' }} />
          );
        }
        return null;
      }
    },
    {
      title: 'Item',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Input
          defaultValue={text}
          placeholder="Item Name"
          onChange={(e) => handleChange(record.id, 'name', e.target.value)}
        />
      )
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string, record: any) => (
        <TextArea
          defaultValue={text}
          placeholder="Item Description"
          rows={3}
          onChange={(e) => handleChange(record.id, 'description', e.target.value)}
        />
      )
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (value: number, record: any) => (
        <InputNumber
          defaultValue={value}
          min={1}
          onChange={(value) => handleChange(record.id, 'quantity', value)}
        />
      ),
      onCell: () => ({ style: { width: '80px' } })
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (value: number, record: any) => (
        <InputNumber
          defaultValue={value}
          // min={0}
          max={99999999.99}
          step={1}
          className="w-full text-end"
          onChange={(value) => handleChange(record.id, 'price', value)}
        />
      ),
      onCell: () => ({ style: { width: '150px' } })
    },
    {
      title: 'Amount',
      key: 'amount',
      render: (record: any) => (
        <Input
          className="font-semibold cursor-default"
          value={formatCurrency(record.price * record.quantity, galleryCurrency)}
          readOnly
        />
      ),
      onCell: () => ({ style: { width: '150px' } })
    },
    {
      title: 'Tax',
      dataIndex: 'taxable',
      key: 'taxable',
      render: (value: boolean, record: any) => (
        <Checkbox
          defaultChecked={value}
          onChange={(e) => handleChange(record.id, 'taxable', e.target.checked)}
        />
      )
    },
    {
      title: '',
      key: 'actions',
      render: (_: any, record: any) => (
        <Tooltip title="Remove Item" placement="topRight" mouseEnterDelay={1}>
          <Button
            variant="text"
            color="danger"
            shape="circle"
            size="small"
            icon={<HugeiconsIcon icon={Delete02Icon} size={20} />}
            onClick={() => setItems((prevData: any[]) => prevData.filter((item) => item.id !== record.id))}
          />
        </Tooltip>
      ),
    }
  ];

  function addArtwork(artwork: ArtworkProps) {
    const newItem = {
      id: "new-" + Math.random().toString(36).substring(2),
      type: 'artwork',
      artwork: artwork,
      name: 'Original Artwork',
      description: artwork.invoice_description,
      quantity: 1,
      price: artwork.price,
      taxable: true,
    };
    setItems((prevItems: any[]) => [...prevItems, newItem]);
  }

  function addCustomItem() {
    const newItem = {
      id: "new-" + Math.random().toString(36).substring(2),
      type: 'custom',
      name: '',
      description: '',
      quantity: 1,
      price: 0,
      taxable: true,
    };
    setItems((prevItems: any[]) => [...prevItems, newItem]);
  }

  function handleChange(itemId: string, field: string, value: any) {
    setItems((prevItems: any[]) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    );
  }

  // fetch pre selected artworks

  const selectedArtworksQuery = useQuery({
    queryKey: ['invoice-selected-artworks', selectedArtworksIds],
    queryFn: () => axios.get(route('artworks.get'), { params: { ids: selectedArtworksIds.join(',') } })
      .then(res => res.data),
    enabled: selectedArtworksIds.length > 0
  });

  useEffect(() => {
    if (selectedArtworksQuery?.data?.length > 0) {
      selectedArtworksQuery.data.forEach((artwork: ArtworkProps) => {
        addArtwork(artwork);
      });
    }
  }, [selectedArtworksQuery?.data])

  return (
    <div>
      <Table
        columns={columns}
        dataSource={items}
        scroll={{ x: 'max-content', y: 400 }}
        locale={{
          emptyText: 'Add artworks and other items.'
        }}
        size="small"
        pagination={false}
        styles={{
          body: {
            cell: {
              verticalAlign: 'top',
            }
          }
        }}
      />

      {/* Add Buttons */}
      <div className="mt-3" >
        <Dropdown
          popupRender={() => (
            <Menu>
              <Menu.Item key="1" onClick={() => setShowArtworkFinder(true)}>Artwork</Menu.Item>
              <Menu.Item key="2" onClick={() => addCustomItem()}>Custom Line</Menu.Item>
            </Menu>
          )}
        >
          <Button
            icon={<HugeiconsIcon icon={ArrowDown01Icon} size={20} />}
            iconPlacement="end"
          >
            Add Item
          </Button>
         </Dropdown>
      </div>

      {/* Components */}

      <ArtworkFinderModal
        show={showArtworkFinder}
        onClose={() => setShowArtworkFinder(false)}
        onSelect={(artwork) => addArtwork(artwork)}
      />
    </div>
  );
}

export default InvoiceItemsTable;
