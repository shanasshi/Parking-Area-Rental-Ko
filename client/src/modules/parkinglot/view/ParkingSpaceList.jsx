import { useMemo, useState } from "react";
import { Alert, Button, Modal, message } from "antd";
import PageSection from "../../../components/PageSection";
import useAsyncList from "../../../hooks/useAsyncList";
import {
  createParkingSpace,
  deleteParkingSpace,
  getParkingSpaces,
  updateParkingSpace,
} from "../controllers/parkingSpaceService";
import ParkingSpaceForm from "../components/ParkingSpaceForm";
import ParkingSpaceTable from "../components/ParkingSpaceTable";
import { useAuth } from "../../auth/AuthContext";

const ParkingSpaceList = () => {
  const [submitting, setSubmitting] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingParkingSpace, setEditingParkingSpace] = useState(null);
  const { currentUser } = useAuth();
  const { items: parkingSpaces, loading, reload } = useAsyncList({
    loadItems: getParkingSpaces,
    errorMessage: "Failed to load parking spaces",
  });
  const myParkingSpaces = useMemo(
    () => parkingSpaces.filter((parkingSpace) => parkingSpace.user_id === currentUser.id),
    [currentUser.id, parkingSpaces],
  );

  const buildParkingSpaceFormData = (values) => {
    const formData = new FormData();
    formData.append("user_id", currentUser.id);
    formData.append("space_name", values.space_name);
    formData.append("location", values.location);
    formData.append("latitude", values.latitude);
    formData.append("longitude", values.longitude);
    formData.append("price_per_hour", values.price_per_hour);
    formData.append("slots_available", values.slots_available);
    formData.append("description", values.description || "");

    (values.images || []).forEach((image) => {
      formData.append("images", image);
    });

    return formData;
  };

  const handleCreateParkingSpace = async (values) => {
    try {
      setSubmitting(true);
      await createParkingSpace(buildParkingSpaceFormData(values));
      message.success("Parking space added successfully");
      await reload();
      setIsCreateModalOpen(false);
      return true;
    } catch (error) {
      message.error(
        error?.response?.data?.error || "Failed to create parking space",
      );
      console.error(error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateParkingSpace = async (values) => {
    try {
      setSubmitting(true);
      await updateParkingSpace(
        editingParkingSpace.id,
        buildParkingSpaceFormData(values),
      );
      message.success("Parking space updated successfully");
      await reload();
      setEditingParkingSpace(null);
      return true;
    } catch (error) {
      message.error(
        error?.response?.data?.error || "Failed to update parking space",
      );
      console.error(error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteParkingSpace = async (parkingSpace) => {
    try {
      await deleteParkingSpace(parkingSpace.id, {
        user_id: currentUser.id,
      });
      message.success("Parking space deleted successfully");
      await reload();
    } catch (error) {
      message.error(
        error?.response?.data?.error || "Failed to delete parking space",
      );
      console.error(error);
    }
  };

  return (
    <PageSection
      title="Provide Parking Space"
      extra={
        <Button type="primary" onClick={() => setIsCreateModalOpen(true)}>
          Add Parking Space
        </Button>
      }
    >
      <Alert
        type="info"
        showIcon
        message="Provider access required"
        description="Only approved providers can add parking spaces."
        style={{ marginBottom: "24px" }}
      />

      <ParkingSpaceTable
        data={myParkingSpaces}
        loading={loading}
        onEdit={setEditingParkingSpace}
        onDelete={handleDeleteParkingSpace}
        showActions
      />

      <Modal
        title="Add Parking Space"
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <ParkingSpaceForm
          initialValues={null}
          onSubmit={handleCreateParkingSpace}
          submitting={submitting}
          submitLabel="Add Parking Space"
        />
      </Modal>

      <Modal
        title="Edit Parking Space"
        open={Boolean(editingParkingSpace)}
        onCancel={() => setEditingParkingSpace(null)}
        footer={null}
        destroyOnHidden
      >
        <ParkingSpaceForm
          initialValues={editingParkingSpace}
          onSubmit={handleUpdateParkingSpace}
          submitting={submitting}
          submitLabel="Save Changes"
        />
      </Modal>
    </PageSection>
  );
};

export default ParkingSpaceList;
