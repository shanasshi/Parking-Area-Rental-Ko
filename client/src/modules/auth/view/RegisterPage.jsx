import { useState } from "react";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { AutoCenter, SafeArea } from "antd-mobile";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { registerUser } from "../controllers/authService";
import { useAuth } from "../AuthContext";
import { USER_TYPES } from "../../users/config/userTypes";
import useIsMobile from "../../../hooks/useIsMobile";

const { Title, Text } = Typography;

const getDefaultRouteByRole = (userTypeId) => {
  if (userTypeId === USER_TYPES.admin) {
    return "/users";
  }

  return "/find-parking-space";
};

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isMobile = useIsMobile();

  if (currentUser) {
    return <Navigate to={getDefaultRouteByRole(currentUser.user_type_id)} replace />;
  }

  const handleRegister = async (values) => {
    try {
      setLoading(true);
      await registerUser({
        first_name: values.first_name,
        last_name: values.last_name,
        phone_number: values.phone_number,
        email: values.email,
        password: values.password,
      });
      message.success("Registration successful. You can now log in.");
      form.resetFields();
      navigate("/login", { replace: true });
    } catch (error) {
      message.error(error?.response?.data?.error || "Registration failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f0f2f5",
        padding: isMobile ? "16px" : "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "460px" }}>
        <SafeArea position="top" />
        <AutoCenter>
          <Card
            style={{
              width: "100%",
              borderRadius: isMobile ? "18px" : "12px",
            }}
          >
            <Title level={2} style={{ marginBottom: "8px" }}>
              Create Account
            </Title>
            <Text type="secondary">
              Register as a normal user. New accounts start unverified.
            </Text>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleRegister}
              style={{ marginTop: "24px" }}
            >
              <Form.Item
                name="first_name"
                label="First Name"
                rules={[{ required: true, message: "Please enter your first name" }]}
              >
                <Input placeholder="Enter first name" />
              </Form.Item>

              <Form.Item
                name="last_name"
                label="Last Name"
                rules={[{ required: true, message: "Please enter your last name" }]}
              >
                <Input placeholder="Enter last name" />
              </Form.Item>

              <Form.Item
                name="phone_number"
                label="Phone Number"
                rules={[{ required: true, message: "Please enter your phone number" }]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input placeholder="Enter email" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Please enter your password" }]}
                hasFeedback
              >
                <Input.Password placeholder="Enter password" />
              </Form.Item>

              <Form.Item
                name="confirm_password"
                label="Confirm Password"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }

                      return Promise.reject(new Error("Passwords do not match"));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm password" />
              </Form.Item>

              <Button type="primary" htmlType="submit" loading={loading} block size="large">
                Register
              </Button>
            </Form>

            <Text type="secondary" style={{ display: "block", marginTop: "16px" }}>
              Already have an account? <Link to="/login">Log in</Link>
            </Text>
          </Card>
        </AutoCenter>
        <SafeArea position="bottom" />
      </div>
    </div>
  );
};

export default RegisterPage;
