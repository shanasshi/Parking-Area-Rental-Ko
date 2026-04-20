import { Button, Input, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Search } = Input;

const Header = ({ onAddClick, onSearch }) => {
  return (
    <Space size="middle" wrap>
      <Search
        placeholder="Search users..."
        allowClear
        onChange={(event) => onSearch(event.target.value)}
        onSearch={onSearch}
        style={{ width: 300 }}
      />
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onAddClick}
        size="large"
      >
        Add User
      </Button>
    </Space>
  );
};

export default Header;
