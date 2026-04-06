import { LockPasswordIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router } from "@inertiajs/react";
import { Button, Form, Input, message, Modal } from "antd";
import axios from "axios";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  action?: 'change' | 'set';
}

function ChangePasswordModal({ open, setOpen, action = 'change' }: Props) {

  const [form] = Form.useForm()

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        axios.put(route(action === 'change' ? 'password.update' : 'password.set'), values)
          .then((res) => {
            message.success(`Password ${action === 'change' ? 'changed' : 'set'} successfully`)
            handleClose()
            router.reload()
          })
          .catch((e) => {
            message.error(e.response?.data?.message || `Failed to ${action === 'change' ? 'change' : 'set'} password`)
          });
      });
  }

  const handleClose = () => {
    form.resetFields()
    setOpen(false)
  }

  return (
    <Modal
      title={action === 'change' ? "Change Password" : "Set Password"}
      open={open}
      onCancel={() => handleClose()}
      footer={null}
      width={400}
    >
      <div className="flex flex-col gap-3">
        <div className="flex justify-center">
          <HugeiconsIcon icon={LockPasswordIcon} size={64} strokeWidth={1} />
        </div>
        <div className="text-center">
          Use a minimum of 8 characters password.
        </div>
        <Form
          form={form}
          layout="vertical"
          className="mt-3"
          initialValues={{}}
          onFinish={handleSubmit}
        >
          {action === 'change' && (
            <Form.Item
              name="current_password"
              label="Current Password"
              rules={[
                { required: true, message: 'Current password is required' }
              ]}
            >
              <Input.Password className="" />
            </Form.Item>
          )}
          <Form.Item
            name="password"
            label={action === 'change' ? "New Password" : "Password"}
            rules={[
              { required: true, message: 'Password is required' },
              { min: 8, message: 'Password must be at least 8 characters' }
            ]}
          >
            <Input.Password className="" />
          </Form.Item>
          <Form.Item
            name="password_confirmation"
            label="Confirm Password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password className="" />
          </Form.Item>
          <Button
            type="primary"
            className="w-full"
            onClick={() => form.submit()}
          >
            {action === 'change' ? "Change Password" : "Set Password"}
          </Button>
        </Form>
      </div>
    </Modal>
  )
}

export default ChangePasswordModal
