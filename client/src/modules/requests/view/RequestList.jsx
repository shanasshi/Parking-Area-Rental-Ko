import { message } from "antd";
import {
  getRequests,
  updateRequestStatus,
} from "../controllers/requestService";
import RequestTable from "../components/RequestTable";
import PageSection from "../../../components/PageSection";
import useAsyncList from "../../../hooks/useAsyncList";
import { REQUEST_STATUS } from "../config/requestStatus";

const RequestList = () => {
  const { items: requests, loading, reload } = useAsyncList({
    loadItems: getRequests,
    errorMessage: "Failed to fetch requests",
  });

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateRequestStatus(id, status);
      message.success(
        `Request marked as ${
          status === REQUEST_STATUS.approved ? "Approved" : "Rejected"
        }`,
      );
      reload();
    } catch (error) {
      message.error("Update failed");
      console.error(error);
    }
  };

  return (
    <PageSection title="Verification Requests">
      <RequestTable data={requests} loading={loading} onUpdate={handleStatusUpdate} />
    </PageSection>
  );
};

export default RequestList;
