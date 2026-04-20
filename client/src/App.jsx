import { useState } from "react";
import {
  BrowserRouter as Router,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Button, Layout, Menu, Typography } from "antd";
import { NavBar, SafeArea, TabBar } from "antd-mobile";
import {
  CarOutlined,
  FileSearchOutlined,
  MenuOutlined,
  LogoutOutlined,
  ScheduleOutlined,
  SearchOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { AuthProvider, useAuth } from "./modules/auth/AuthContext";
import ProtectedRoute from "./modules/auth/components/ProtectedRoute";
import LoginPage from "./modules/auth/view/LoginPage";
import RegisterPage from "./modules/auth/view/RegisterPage";
import UserList from "./modules/users/View/UserList";
import RequestList from "./modules/requests/view/RequestList";
import ParkingSpaceList from "./modules/parkinglot/view/ParkingSpaceList";
import ParkingFinderPage from "./modules/parkingfinder/view/ParkingFinderPage";
import BookedParkingsPage from "./modules/parkingfinder/view/BookedParkingsPage";
import AccountPage from "./modules/account/view/AccountPage";
import { USER_TYPES } from "./modules/users/config/userTypes";
import useIsMobile from "./hooks/useIsMobile";

const { Sider, Content, Header } = Layout;
const { Text } = Typography;

const getDefaultRouteByRole = (userTypeId) => {
  if (userTypeId === USER_TYPES.admin) {
    return "/users";
  }

  return "/find-parking-space";
};

const AppShell = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const isMobile = useIsMobile();

  const navigationItems = [
    ...(currentUser?.user_type_id === USER_TYPES.admin
      ? [
          {
            key: "/users",
            icon: <UserOutlined />,
            label: "Users",
          },
          {
            key: "/requests",
            icon: <FileSearchOutlined />,
            label: "Requests",
          },
        ]
      : []),
    ...(currentUser?.user_type_id === USER_TYPES.provider ||
    currentUser?.user_type_id === USER_TYPES.normal
      ? [
          {
            key: "/find-parking-space",
            icon: <SearchOutlined />,
            label: "Find Parking",
          },
          {
            key: "/booked-parkings",
            icon: <ScheduleOutlined />,
            label: "Bookings",
          },
        ]
      : []),
    ...(currentUser?.user_type_id === USER_TYPES.provider
      ? [
          {
            key: "/provide-parking-space",
            icon: <CarOutlined />,
            label: "My Spaces",
          },
        ]
      : []),
    ...(currentUser?.user_type_id === USER_TYPES.provider ||
    currentUser?.user_type_id === USER_TYPES.normal
      ? [
          {
            key: "/account",
            icon: <SettingOutlined />,
            label: "Account",
          },
        ]
      : []),
  ];

  const menuItems = navigationItems.map((item) => ({
    ...item,
    label: <Link to={item.key}>{item.label}</Link>,
  }));

  const appRoutes = (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={getDefaultRouteByRole(currentUser.user_type_id)} replace />}
      />

      <Route element={<ProtectedRoute allowRoles={[USER_TYPES.admin]} />}>
        <Route path="/users" element={<UserList />} />
        <Route path="/requests" element={<RequestList />} />
      </Route>

      <Route
        element={<ProtectedRoute allowRoles={[USER_TYPES.provider, USER_TYPES.normal]} />}
      >
        <Route path="/find-parking-space" element={<ParkingFinderPage />} />
        <Route path="/booked-parkings" element={<BookedParkingsPage />} />
        <Route path="/account" element={<AccountPage />} />
      </Route>

      <Route element={<ProtectedRoute allowRoles={[USER_TYPES.provider]} />}>
        <Route path="/provide-parking-space" element={<ParkingSpaceList />} />
      </Route>
    </Routes>
  );

  if (isMobile) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f0f2f5",
          paddingBottom: "76px",
        }}
      >
        <SafeArea position="top" />
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            background: "#ffffff",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <NavBar
            backArrow={false}
            right={
              <Button
                type="text"
                icon={<LogoutOutlined />}
                onClick={logout}
                style={{ paddingInline: 8 }}
              />
            }
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                maxWidth: "100%",
              }}
            >
              <MenuOutlined />
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 15,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {currentUser?.first_name} {currentUser?.last_name}
              </span>
            </div>
          </NavBar>
        </div>

        {appRoutes}

        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 30,
            background: "#ffffff",
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <SafeArea position="bottom" />
          <TabBar
            activeKey={location.pathname}
            onChange={(value) => navigate(value)}
            style={{ "--adm-color-primary": "#1677ff" }}
          >
            {navigationItems.map((item) => (
              <TabBar.Item key={item.key} icon={item.icon} title={item.label} />
            ))}
          </TabBar>
        </div>
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="dark"
      >
        <div
          style={{
            height: 32,
            margin: 16,
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: 6,
          }}
        />
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingInline: "24px",
          }}
        >
          <Text>
            {currentUser?.first_name} {currentUser?.last_name}
          </Text>
          <Button icon={<LogoutOutlined />} onClick={logout}>
            Logout
          </Button>
        </Header>
        <Content style={{ margin: 0, padding: 0 }}>{appRoutes}</Content>
      </Layout>
    </Layout>
  );
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/*"
        element={isAuthenticated ? <AppShell /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
