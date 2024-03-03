import { useEffect, useState } from "react";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../app/api/usersApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { FaCheck, FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

function UserList() {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [editUserId, setEditUserId] = useState(null);
  const [editUserName, setEditUserName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const toggleEdit = (id, username, email) => {
    setEditUserId(id);
    setEditUserName(username);
    setEditEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editUserName,
        email: editEmail,
      });
      setEditUserId(null);
      refetch();
    } catch (error) {
      toast.error(error?.data.message || error.error);
    }
  };

  const deleteHandler = async (userId) => {
    if (window.confirm("Are you sure ?")) {
      try {
        await deleteUser(userId);
        refetch();
      } catch (error) {
        toast.error(error?.data.message || error.error);
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4 text-white">Users</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data || error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="flex flex-col md:flex-row">
          {/* AdminMenu */}
          <table className="w-full md:w-4/5 mx-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-white">ID</th>
                <th className="px-4 py-2 text-left text-white">NAME</th>
                <th className="px-4 py-2 text-left text-white">EMAIL</th>
                <th className="px-4 py-2 text-left text-white">ADMIN</th>
                <th className="px-4 py-2 text-left text-white"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-4 py-2 text-white">{user._id}</td>
                  <td className="px-4 py-2">
                    {editUserId === user._id ? (
                      <div className="flex items-center">
                        <input
                          type="text"
                          className="w-full p-2 border rounded-lg"
                          value={editUserName}
                          onChange={(e) => setEditUserName(e.target.value)}
                        />
                        <button
                          className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg"
                          onClick={() => updateHandler(user._id)}
                        >
                          <FaCheck />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center text-white">
                        {user.username} {""}
                        <button
                          onClick={() =>
                            toggleEdit(user._id, user.username, user.email)
                          }
                        >
                          <FaEdit className="ml-[1rem]" />
                        </button>
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-2">
                    {editUserId === user._id ? (
                      <div className="flex items-center">
                        <input
                          type="text"
                          className="w-full p-2 border rounded-lg"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                        />
                        <button
                          className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg"
                          onClick={() => updateHandler(user._id)}
                        >
                          <FaCheck />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center text-white">
                        {user.email} {""}
                        <button
                          onClick={() =>
                            toggleEdit(user._id, user.username, user.email)
                          }
                        >
                          <FaEdit className="ml-[1rem]" />
                        </button>
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-2">
                    {user.isAdmin ? (
                      <FaCheck style={{ color: "green" }} />
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>

                  <td className="px-4 py-2">
                    {!user.isAdmin && (
                      <div className="flex">
                        <button
                          onClick={() => deleteHandler(user._id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UserList;
