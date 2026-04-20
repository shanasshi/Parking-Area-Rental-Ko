import { Table } from "antd";
import { createUserTableColumns } from "../config/userTableColumns";

const UserTable = ({ users, loading, onRequestProvider, requestingUserId }) => {
  const columns = createUserTableColumns({
    onRequestProvider,
    requestingUserId,
  });

  return (
    <Table
      columns={columns}
      dataSource={users}
      loading={loading}
      rowKey="id"
      scroll={{ x: "max-content" }}
      pagination={{
        pageSize: 8,
        showTotal: (total) => `Total ${total} users`,
      }}
      size="middle" // Makes the rows feel less cramped
    />
  );
};

export default UserTable;
