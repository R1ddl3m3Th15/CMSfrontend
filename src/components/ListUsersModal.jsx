import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ListUsersModal({ onClose }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://cmsbackendnew.onrender.com/admin/listusers', {
      headers: { 'x-api-key': process.env.REACT_APP_API_KEY },
    });
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
    // Confirm before deleting
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) {
      return; // Stop if the user cancels the action
    }

    await axios.delete(`https://cmsbackendnew.onrender.com/admin/users/${userId}`, {
      headers: { 'x-api-key': process.env.REACT_APP_API_KEY },
    });
    // Filter out the deleted user from the current state to update the UI
    setUsers(users.filter(user => user.userId !== userId));
    alert("User deleted successfully."); // Optional: show a success message
  } catch (error) {
    console.error('Failed to delete user:', error);
    // Optionally, inform the user that the deletion failed
    alert("Failed to delete user.");
  }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white">
        <h2 className="text-xl font-semibold text-center mb-4">All Users</h2>
        {users.length > 0 ? (
          <div className="space-y-4">
            {users.map((user, index) => (
              <div key={index} className="mb-5 p-3 shadow rounded bg-white">
                {/* User details here */}
                <div>User ID: {user.userId}</div>
                <div>Username: {user.username}</div>
                <div>Full Name: {user.fullName}</div>
                <div>Aadhar ID: {user.aadharId}</div>
                <div>Email: {user.email}</div>
                <div>Selected Policies: {user.selectedPolicies.length > 0 ? user.selectedPolicies.join(', ') : "None selected"}</div>
                <div>Selected Claims: {user.selectedClaims.length > 0 ? user.selectedClaims.join(', ') : "None selected"}</div>
                <button onClick={() => handleDelete(user.userId)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-3">
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No users to display.</p>
        )}
        <div className="flex justify-center mt-4">
          <button onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ListUsersModal;