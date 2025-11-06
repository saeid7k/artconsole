import RELATIONSHIPS from "@/constants/relationships";
import { useWindow } from "@/hooks/useWindow";
import { ContactProps } from "@/types/contact";
import { MoreHorizontalCircle01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router } from "@inertiajs/react";
import { Button, Card, Checkbox, Dropdown, message, Tag, Tooltip } from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

function RelationshipTags({ contact, manageButtonDelay = 2000 }: { contact: ContactProps, manageButtonDelay?: number }) {

  const { windowWidth } = useWindow()

  const [relationships, setRelationships] = useState<Array<string>>(contact.relationship || []);
  const [changed, setChanged] = useState(false)
  const [showManageButton, setShowManageButton] = useState(false)
  const hideManageButtonTimer = useRef<NodeJS.Timeout | null>(null);

  const RelationTag = ({ relation, ...props }: { relation: string } & any) => {
    let color = RELATIONSHIPS.find(rel => rel.value === relation)?.color || 'default';

    return (
      <Tag color={color} className="capitalize" {...props}>
        {relation}
      </Tag>
    )
  }

  function handleChange(id: string, checked: boolean) {
    let newValues = [...relationships];
    if (checked) {
      newValues.push(id);
    } else {
      newValues = newValues.filter((value) => value !== id);
    }
    setRelationships(newValues)
    setChanged(true)
  }

  function updateRelationships() {
    axios.post(route('contacts.update-relationships', { contact: contact.id }), {
      relationships: relationships
    }).then(() => {
      router.reload()
    }).catch((error) => {
      message.error(error.response?.data?.message || 'Failed to update relationships');
    }).finally(() => {
      setChanged(false)
    })
  }

  useEffect(() => {
    setRelationships(contact.relationship || []);
  }, [contact.relationship]);

  return (
    <div
      className="flex items-center"
      onMouseEnter={() => {
        setShowManageButton(true)
        if (hideManageButtonTimer.current) {
          clearTimeout(hideManageButtonTimer.current)
        }
      }}
      onMouseLeave={() => {
        hideManageButtonTimer.current = setTimeout(() => {
          setShowManageButton(false)
        }, manageButtonDelay)
      }}
    >
      {relationships.map((relation: string, index: number) => (
        <RelationTag key={index} relation={relation} />
      ))}
      {(showManageButton || windowWidth <= 768 || relationships.length == 0) && (
        <Tooltip title="Manage Relationships" mouseEnterDelay={1}>
          <Dropdown
            popupRender={() => {
              return (
                <Card size="small" className="shadow-lg">
                  <div className="flex flex-col gap-2">
                    {RELATIONSHIPS.map((relation) => (
                      <Checkbox
                        key={relation.value}
                        defaultChecked={relationships.includes(relation.value)}
                        onChange={(e) => handleChange(relation.value, e.target.checked)}
                      >
                        {relation.label}
                      </Checkbox>
                    ))}
                  </div>
                </Card>
              )
            }}
            trigger={['click']}
            onOpenChange={(open) => {
              if (!open && changed) {
                updateRelationships()
              }
            }}
          >
            <Button
              type="default"
              className="px-1 h-full"
            >
              <HugeiconsIcon icon={MoreHorizontalCircle01Icon} size={16} />
            </Button>
          </Dropdown>
        </Tooltip>
      )}
    </div>
  );
}

export default RelationshipTags;
