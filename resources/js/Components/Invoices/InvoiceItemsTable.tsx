import { ArtworkProps } from "@/types/artwork";
import { formatCurrency, formatDimensions } from "@/utils/formatHelper";
import { ArrowDown01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, Checkbox, Dropdown, FormInstance, Input, InputNumber, Menu, Table, Tooltip } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import ArtworkFinderModal from "../Artworks/ArtworkFinderModal";
import { usePage } from "@inertiajs/react";
import { UsePageProps } from "@/types/usePage";

type Props = {
  invoiceForm: FormInstance;
  items: any[];
  setItems: any;
}

function InvoiceItemsTable({invoiceForm, items, setItems}: Props) {

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
            <img src={record.artwork.main_image_thumb_url} alt={record.artwork.title} style={{ width: 50, height: 50, objectFit: 'cover' }} />
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
          onChange={(e) => handleChange(record.key, 'name', e.target.value)}
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
          onChange={(e) => handleChange(record.key, 'description', e.target.value)}
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
          onChange={(value) => handleChange(record.key, 'quantity', value)}
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
          onChange={(value) => handleChange(record.key, 'price', value)}
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
          onChange={(e) => handleChange(record.key, 'taxable', e.target.checked)}
        />
      )
    },
    {
      title: '',
      key: 'actions',
      render: (_: any, record: any) => (
        <Tooltip title="Remove Item" placement="topLeft" mouseEnterDelay={1}>
          <Button
            variant="text"
            color="danger"
            shape="circle"
            size="small"
            icon={<HugeiconsIcon icon={Delete02Icon} size={20} />}
            onClick={() => setItems((prevData: any[]) => prevData.filter((item) => item.key !== record.key))}
          />
        </Tooltip>
      ),
    }
  ];

  function addArtwork(artwork: ArtworkProps) {
    const newItem = {
      key: Date.now(),
      type: 'artwork',
      artwork: artwork,
      name: 'Original Artwork',
      description: artwork.title + '\n' + formatDimensions({ dimensions: artwork.dimensions, showDepth: true }) + '\n' + artwork.mediums?.join(', '),
      quantity: 1,
      price: artwork.price,
      taxable: true,
    };
    setItems((prevItems: any[]) => [...prevItems, newItem]);
  }

  function addCustomItem() {
    const newItem = {
      key: Date.now(),
      type: 'custom',
      name: '',
      description: '',
      quantity: 1,
      price: 0,
      taxable: true,
    };
    setItems((prevItems: any[]) => [...prevItems, newItem]);
  }

  function handleChange(itemKey: number, field: string, value: any) {
    setItems((prevItems: any[]) =>
      prevItems.map((item) =>
        item.key === itemKey ? { ...item, [field]: value } : item
      )
    );
  }

  return (
    <div>
      <Table
        columns={columns}
        dataSource={items}
        scroll={{ x: 'max-content' }}
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
