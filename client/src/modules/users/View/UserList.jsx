import { useState } from "react";
import { getUsers } from "../controllers/userService";
import { getRequests } from "../../requests/controllers/requestService";
import Header from "../components/Header";
import UserTable from "../components/UserTable";
import UserFormModal from "../components/UserFormModal";
import PageSection from "../../../components/PageSection";
import useAsyncList from "../../../hooks/useAsyncList";
import { filterUsers } from "../utils/userFilters";
import { decorateUsers } from "../utils/decorateUsers";

const UserList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { items: users, loading, reload } = useAsyncList({
    loadItems: async () => {
      const [usersResponse, requestsResponse] = await Promise.all([
        getUsers(),
        getRequests(),
      ]);

      return {
        data: decorateUsers(usersResponse.data || [], requestsResponse.data || []),
      };
    },
    errorMessage: "Failed to fetch users",
  });

  const filteredUsers = filterUsers(users, searchTerm);

  return (
    <>
      <PageSection
        title="User Management"
        extra={
          <Header
            onAddClick={() => setIsModalOpen(true)}
            onSearch={setSearchTerm}
          />
        }
      >
        <UserTable users={filteredUsers} loading={loading} />
      </PageSection>

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUserAdded={reload}
      />
    </>
  );
};

export default UserList;
