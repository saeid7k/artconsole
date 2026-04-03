import ACCESS_LEVELS from "@/constants/accessLevels"
import { useGallerySettings } from "@/contexts/GallerySettingsContext"
import { InviteLinkProps } from "@/types/inviteLink"
import { UserProps } from "@/types/user"
import { dayjsUserTz } from "@/utils/dateTimeHelper"
import { ucFirst } from "@/utils/stringHelper"
import { RemoveCircleIcon, SentIcon, UserMinus01Icon, UserMultipleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button, message, Popconfirm, Select, Table, TableProps, Tooltip } from "antd"
import axios from "axios"
import dayjs from "dayjs"
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { JSX, useEffect, useState } from "react"
import UserStack from "../UserStack"
import AddMemberModal from "./AddMemberModal"
import { usePage } from "@inertiajs/react"
dayjs.extend(localizedFormat);

function Members() {

  const { gallery, open } = useGallerySettings()
  const user = usePage()?.props?.auth?.user

  const [members, setMembers] = useState<UserProps[]>([])
  const [invitations, setInvitations] = useState<InviteLinkProps[]>([])
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)

  function fetchMembers() {
    axios.get(route('members.all', { gallery: gallery.id }))
      .then(response => {
        setMembers(response.data.members);
        setInvitations(response.data.invitations);
      })
      .catch(error => {
        message.error(error.response?.data?.message || 'Failed to load members.');
      });
  }

  function handleDeleteInvitation(inviteLink: InviteLinkProps) {
    axios.post(route('invite-links.delete', { invite_link: inviteLink.id }))
      .then((response) => {
        message.success(response.data.message || 'Invitation deleted successfully.');
        fetchMembers();
      })
      .catch((error) => {
        message.error(error.response?.data?.message || 'Failed to delete invitation.');
      });
  }

  function changeAccessLevel(userId: number, accessLevel: string) {
    axios.post(route('members.change-access-level', { gallery: gallery.id }), {
      member_id: userId,
      access: accessLevel,
    })
      .then((response) => {
        message.success(response.data.message || 'Member access level updated successfully.');
        fetchMembers();
      })
      .catch((error) => {
        message.error(error.response?.data?.message || 'Failed to update member access level.');
      });
  }

  function removeMember(userId: number) {
    axios.post(route('members.remove', {
        gallery: gallery.id,
        member: userId,
      })
    )
      .then((response) => {
        message.success(response.data.message || 'Member removed successfully.');
        fetchMembers();
      })
      .catch((error) => {
        message.error(error.response?.data?.message || 'Failed to remove member.');
      });
  }

  useEffect(() => {
    if (open) {
      fetchMembers();
    }
  }, [open, gallery.id]);

  useEffect(() => {
    if (!showAddMemberModal) {
      fetchMembers();
    }
  }, [showAddMemberModal]);

  const columns: TableProps['columns'] = [
    {
      title: 'Name',
      dataIndex: 'full_name',
      key: 'full_name',
      sorter: (a, b) => a.full_name.localeCompare(b.full_name),
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      render: (text, record): JSX.Element => (<UserStack user={record as UserProps} />),
      width: 200,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      width: 250,
    },
    {
      title: 'Access',
      dataIndex: ['pivot', 'access'],
      key: 'access',
      sorter: (a, b) => a.pivot.access.localeCompare(b.pivot.access),
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      render: (text, record) => (
        <>
          {gallery.abilities.manage_members ? (
            <Select
              placeholder="Select access level"
              defaultValue={text}
              value={text}
              onChange={(value) => changeAccessLevel((record as UserProps).id, value)}
              disabled={gallery.user_id == record.id || user.id == record.id}
              options={
                ACCESS_LEVELS.filter(level => level.name !== 'owner' || gallery.user_id == user.id).map(level => ({
                  value: level.name,
                  label: ucFirst(level.name),
                }))
              }
            />
          ) : (
            <>{ucFirst(text)}</>
          )}
        </>
      ),
      width: 150,
    },
    {
      title: '',
      key: 'actions',
      render: (_, record) => (
        <div className="flex justify-end">
          {gallery.user_id !== record.id && user.id !== record.id && gallery.abilities.manage_members && (
            <Tooltip title="Remove Member">
              <Popconfirm
                title="Remove the member"
                description={
                  <div>
                    Are you sure to remove this member?
                    <div className="italic text-red-500">{record.full_name}</div>
                  </div>
                }
                onConfirm={() => removeMember(record.id)}
                okText="Yes"
                cancelText="No"
                placement="left"
                okType="danger"
              >
                <Button
                  variant="text"
                  color='danger'
                  shape="circle"
                  icon={<HugeiconsIcon icon={UserMinus01Icon} size={20} />}
                />
              </Popconfirm>
            </Tooltip>
          )}
        </div>
      ),
    }
  ]

  const invitationColumns: TableProps['columns'] = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      // width: 250,
    },
    {
      title: 'Access',
      dataIndex: ['settings', 'access'],
      key: 'access',
      sorter: (a, b) => a.settings.access.localeCompare(b.settings.access),
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      render: (text) => (<>{ucFirst(text)}</>),
      width: 100,
    },
    {
      title: 'Expiration',
      dataIndex: 'expires_at',
      key: 'expiration',
      sorter: (a, b) => {
        const dateA = a.expires_at ? new Date(a.expires_at).getTime() : 0;
        const dateB = b.expires_at ? new Date(b.expires_at).getTime() : 0;
        return dateA - dateB;
      },
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      render: (text): string => text ? dayjsUserTz(text).format('LL') : 'Never',
      width: 160,
    },
    {
      title: '',
      key: 'actions',
      render: (_, record) => (
        <div className="flex justify-end">
          {gallery.abilities.update && (
            <Tooltip title="Cancel Invitation">
              <Popconfirm
                title="Delete the invitation"
                description={
                  <div>
                    Are you sure to delete this invitation?
                    <div className="italic text-red-500">{record.email}</div>
                  </div>
                }
                onConfirm={() => handleDeleteInvitation(record as InviteLinkProps)}
                okText="Yes"
                cancelText="No"
                placement="left"
                okType="danger"
              >
                <Button
                  variant="text"
                  color='danger'
                  shape="circle"
                  icon={<HugeiconsIcon icon={RemoveCircleIcon} size={20} />}
                />
              </Popconfirm>
            </Tooltip>
          )}
        </div>
      ),
    }
  ]

  return (
    <>
      <div className="flex flex-col gap-3">
        {gallery.abilities.manage_members && (
          <div className="flex justify-end">
            <Button
              type="primary"
              onClick={() => setShowAddMemberModal(true)}
            >
              Add Member
            </Button>
          </div>
        )}
        <div className="flex items-center gap-1 text-primary-700 dark:text-primary-300">
          <HugeiconsIcon icon={UserMultipleIcon} size={20} />
          <div>Members</div>
        </div>
        <Table
          dataSource={members}
          columns={columns}
          pagination={false}
          size="small"
          scroll={{
            x: 'min-content',
            y: 400
          }}
        />
        {invitations.length > 0 && (
          <>
            <div className="flex items-center gap-1 text-primary-700 dark:text-primary-300 mt-5">
              <HugeiconsIcon icon={SentIcon} size={20} />
              <div>Pending Invitations</div>
            </div>
            <Table
              dataSource={invitations}
              columns={invitationColumns}
              pagination={false}
              size="small"
              scroll={{ x: 'min-content' }}
            />
          </>
        )}
      </div>
      <AddMemberModal
        open={showAddMemberModal}
        setOpen={setShowAddMemberModal}
        gallery={gallery}
      />
    </>
  )
}

export default Members
