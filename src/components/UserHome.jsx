import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import UserDetail from './UserDetail';
import PoliciesModal from './PoliciesModal';
// import ClaimHistoryModal from './ClaimHistoryModal'; // Import the ClaimHistoryModal component
import MakeClaimModal from './MakeClaimModal'; // Import the MakeClaimModal component

function UserHome() {
  const [showPoliciesModal, setShowPoliciesModal] = useState(false);
  // const [showClaimHistoryModal, setShowClaimHistoryModal] = useState(false);
  const [showMakeClaimModal, setShowMakeClaimModal] = useState(false);

  // Handlers for opening modals
  const openPoliciesModal = () => setShowPoliciesModal(true);
  // const openClaimHistoryModal = () => setShowClaimHistoryModal(true);
  const openMakeClaimModal = () => setShowMakeClaimModal(true);

  // Handlers for closing modals
  const closePoliciesModal = () => setShowPoliciesModal(false);
  // const closeClaimHistoryModal = () => setShowClaimHistoryModal(false);
  const closeMakeClaimModal = () => setShowMakeClaimModal(false);

   return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-green-700 p-5 text-white fixed left-0 h-full">
        <Sidebar
          openPoliciesModal={openPoliciesModal}
          openMakeClaimModal={openMakeClaimModal}
        />
      </div>

      {/* Main content + UserDetail */}
      <div className="flex-1 flex ml-64">
        {/* MainContent should scroll independently */}
        <div className="flex-1 overflow-auto">
          <MainContent />
        </div>

        {/* UserDetail */}
        <div className="w-64 bg-white p-5 fixed right-0 h-full">
          <UserDetail />
        </div>
      </div>

      {/* Modals */}
      {showPoliciesModal && <PoliciesModal onClose={closePoliciesModal} />}
      {showMakeClaimModal && <MakeClaimModal onClose={closeMakeClaimModal} />}
    </div>
  );
}

export default UserHome;