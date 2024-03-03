import React from 'react';

function AdminSidebar({ openAddPolicyModal, openAllPoliciesModal, openListUsersModal }) {
  return (
    <div>
      <button onClick={openAddPolicyModal} className="block mb-2">Add Policies</button>
      <button onClick={openAllPoliciesModal} className="block mb-2">List Policies</button>
      <button onClick={openListUsersModal} className="block mb-2">List All Users</button>
    </div>
  );
}

export default AdminSidebar;