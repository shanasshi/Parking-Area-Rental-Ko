import { useState } from "react";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { AutoCenter, SafeArea } from "antd-mobile";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { loginUser } from "../controllers/authService";
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

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser, login } = useAuth();
  const isMobile = useIsMobile();

  if (currentUser) {
    return <Navigate to={getDefaultRouteByRole(currentUser.user_type_id)} replace />;
  }

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const response = await loginUser(values);
      const user = response.data.user;
      login(user);
      message.success("Login successful");
      navigate(getDefaultRouteByRole(user.user_type_id), { replace: true });
    } catch (error) {
      message.error(error?.response?.data?.error || "Login failed");
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
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <SafeArea position="top" />
        <AutoCenter>
          <Card
            style={{
              width: "100%",
              borderRadius: isMobile ? "18px" : "12px",
            }}
          >
            <Title level={2} style={{ marginBottom: "8px" }}>
              PARK Login
            </Title>
            <Text type="secondary">Use your email and password to continue.</Text>

            <Form layout="vertical" onFinish={handleLogin} style={{ marginTop: "24px" }}>
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
              >
                <Input.Password placeholder="Enter password" />
              </Form.Item>

              <Button type="primary" htmlType="submit" loading={loading} block size="large">
                Log In
              </Button>
            </Form>

            <Text type="secondary" style={{ display: "block", marginTop: "16px" }}>
              No account yet? <Link to="/register">Register here</Link>
            </Text>

            <Text type="secondary" style={{ display: "block", marginTop: "8px" }}>
              Default admin: admin@park.local / admin123
            </Text>
          </Card>
        </AutoCenter>
        <SafeArea position="bottom" />
      </div>
    </div>
  );
};

export default LoginPage;
