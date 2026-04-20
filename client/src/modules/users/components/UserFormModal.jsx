import { Modal, Form, Input, Select, message } from "antd";
import { useState } from "react";
import { addUser } from "../controllers/userService";
import { USER_TYPES } from "../config/userTypes";

const UserFormModal = ({ isOpen, onClose, onUserAdded }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
        await addUser({
          first_name: values.first_name,
          last_name: values.last_name,
          phone_number: values.phone_number,
          email: values.email,
          password: values.password,
          user_type_id: values.user_type_id,
      });
      message.success("User added successfully!");
      form.resetFields();
      onUserAdded();
      onClose();
    } catch (error) {
      if (error?.errorFields) {
        return;
      }

      message.error("Failed to add user");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Create New User"
      open={isOpen}
      onOk={handleOk}
      onCancel={onClose}
      okText="Submit"
      confirmLoading={submitting}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" name="userForm">
        <Form.Item
          name="first_name"
          label="First Name"
          rules={[{ required: true, message: "Please enter a first name" }]}
        >
          <Input placeholder="Enter first name" />
        </Form.Item>
        <Form.Item
          name="last_name"
          label="Last Name"
          rules={[{ required: true, message: "Please enter a last name" }]}
        >
          <Input placeholder="Enter last name" />
        </Form.Item>
        <Form.Item
          name="phone_number"
          label="Phone Number"
          rules={[{ required: true, message: "Please enter a phone number" }]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter an email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please enter a password" }]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>
        <Form.Item
          name="user_type_id"
          label="Role"
          initialValue={USER_TYPES.normal}
          rules={[{ required: true, message: "Please select a role" }]}
        >
          <Select
            options={[
              { value: USER_TYPES.admin, label: "Admin" },
              { value: USER_TYPES.normal, label: "Normal User" },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserFormModal;
