import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminMainContent from './AdminMainContent';
import AdminDetail from './AdminDetail';
import AddPolicyModal from './AddPolicyModal';
import AllPoliciesModal from './AllPoliciesModal';
import ListUsersModal from './ListUsersModal';

function AdminHome() {
  const [showAddPolicyModal, setShowAddPolicyModal] = useState(false);
  const [showAllPoliciesModal, setShowAllPoliciesModal] = useState(false);
  const [showListUsersModal, setShowListUsersModal] = useState(false);

  // Handlers for modals
  const openAddPolicyModal = () => setShowAddPolicyModal(true);
  const openAllPoliciesModal = () => setShowAllPoliciesModal(true);
  const openListUsersModal = () => setShowListUsersModal(true);

  const closeAddPolicyModal = () => setShowAddPolicyModal(false);
  const closeAllPoliciesModal = () => setShowAllPoliciesModal(false);
  const closeListUsersModal = () => setShowListUsersModal(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-green-700 p-5 text-white fixed left-0 h-full">
      <AdminSidebar
        openAddPolicyModal={openAddPolicyModal}
        openAllPoliciesModal={openAllPoliciesModal}
        openListUsersModal={openListUsersModal}
      />
      </div>

      {/* Main content + AdminDetail */}
      <div className="flex-1 flex ml-64">
        {/* MainContent should scroll independently */}
        <div className="flex-1 overflow-auto">
          <AdminMainContent />
        </div>

      {/* AdminDetail */}
        <div className="w-64 bg-white p-5 fixed right-0 h-full">
          <AdminDetail /> 
        </div>
      </div>
      

       {/* Modals */}
      {showAddPolicyModal && <AddPolicyModal onClose={closeAddPolicyModal} />}
      {showAllPoliciesModal && <AllPoliciesModal onClose={closeAllPoliciesModal} />}
      {showListUsersModal && <ListUsersModal onClose={closeListUsersModal} />}
    </div>
  );
}

export default AdminHome;