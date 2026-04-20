import { Table } from "antd";
import { createRequestTableColumns } from "../config/requestTableColumns";

const RequestTable = ({ data, loading, onUpdate }) => {
  const columns = createRequestTableColumns({ onUpdate });

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      scroll={{ x: "max-content" }}
    />
  );
};

export default RequestTable;
