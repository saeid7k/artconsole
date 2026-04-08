import CONFIGS from "@/constants/configs.json";
import { CURRENCIES } from "@/constants/currencies";
import useSaveChip from "@/hooks/useSaveChip";
import { ArtworkProps } from "@/types/artwork";
import { UsePageProps } from "@/types/usePage";
import { router, usePage } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import { DatePicker, Form, Input, InputNumber, Radio, Select, Space } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ContactWidget from "../Contacts/ContactWidget";

function ArtworkFinancialForm({ artwork }: { artwork: ArtworkProps }) {

  const [form] = useForm();
  const watchForm = Form.useWatch([], form);
  const currency = usePage<UsePageProps>().props.current_gallery?.meta?.currency || CONFIGS.defaults.currency;
  const { savingStatus, setSavingStatus, saveChipNode } = useSaveChip();
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [ownerSelected, setOwnerSelected] = useState(artwork?.owner);
  const [allContacts, setAllContacts] = useState([]);
  const [contactsOptions, setContactsOptions] = useState([]);

  function clearOwner() {
    form.setFieldValue('owner_contact_id', null);
    setOwnerSelected(null);
  }

  function changeOwner(value: string | number) {
    form.setFieldValue('owner_contact_id', value);
    setOwnerSelected(prev => allContacts.find((contact: any) => contact.id === value) || prev);
  }

  const contactsQuery = useQuery({
    queryKey: ['all-contacts-query'],
    queryFn: () => axios.get(route('contacts.all'))
      .then(res => {
        let contacts = res.data;
        setAllContacts(contacts);
        setContactsOptions(contacts.map((contact: any) => ({
          label: contact.full_name,
          value: contact.id,
        })));
        return contacts;
      }),
    enabled: watchForm?.ownership === 'consigned',
  })

  function handleSave() {
    setSavingStatus('saving');
    form.validateFields()
      .then((values) => {
        axios.post(route('artworks.store-financial', { artwork: artwork.id }), values)
          .then(res => {
            setSavingStatus('saved');
          })
          .catch(err => {
            setSavingStatus('failed');
          })
          .finally(() => {
            router.reload({ only: ['artwork'] });
          })
      })
      .catch((err) => {
        setSavingStatus('failed');
        router.reload({ only: ['artwork'] });
      });
  }

  function debounceSave() {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      handleSave();
    }, 1000);
  }

  useEffect(() => {
    handleSave();
  }, [ownerSelected])

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={artwork}
      className="relative"
      onValuesChange={debounceSave}
    >
      {saveChipNode}
      <Form.Item
        label='Ownership'
        name="ownership"
      >
        <Radio.Group
          optionType="button"
          options={[
            { label: 'Owned', value: 'owned' },
            { label: 'Consigned', value: 'consigned' },
          ]}
        />
      </Form.Item>

      {ownerSelected && watchForm?.ownership === 'consigned' && (
        <ContactWidget
          contact={ownerSelected}
          title="Owner"
          className="mb-3"
          unsetFunction={clearOwner}
        />
      )}

      <AnimatePresence>
        {!ownerSelected && watchForm?.ownership === 'consigned' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Form.Item
              label='Owner'
            >
              <Select
                options={contactsOptions}
                maxCount={1}
                placeholder="Select owner from contacts"
                showSearch={{ optionFilterProp: ['label', 'value'] }}
                onChange={(value: string) => changeOwner(value)}
              />
            </Form.Item>
          </motion.div>
        )}
      </AnimatePresence>
      <Form.Item
        label=""
        name="owner_contact_id"
        hidden
      >
        <Input />
      </Form.Item>

      {/* Acquisition */}
      <AnimatePresence>
        {watchForm?.ownership === 'owned' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Form.Item
              label="Acquisition Price"
              name="acquisition_price"
            >
              <Space.Compact className="w-full">
                <Space.Addon>{CURRENCIES.find(c => c.code === currency)?.symbol}</Space.Addon>
                <InputNumber
                  min={0}
                  step={1}
                  precision={2}
                  defaultValue={form.getFieldValue('acquisition_price')}
                  className="w-full"
                  onChange={(value) => form.setFieldValue('acquisition_price', value)}
                  onStep={debounceSave}
                />
              </Space.Compact>
            </Form.Item>

            <Form.Item
              label="Acquisition Date"
              name="acquisition_date"
              getValueProps={(value) => ({
                value: value ? dayjs(value) : null,
              })}
              getValueFromEvent={(date, dateString) => dateString}
            >
              <DatePicker
                className="w-full"
              />
            </Form.Item>
          </motion.div>
        )}
      </AnimatePresence>
    </Form>
  );
}

export default ArtworkFinancialForm;
