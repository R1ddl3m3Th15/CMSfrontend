import React from 'react';

function Sidebar({ openPoliciesModal, openClaimHistoryModal, openMakeClaimModal }) {
  return (
    <div>
      <button onClick={openPoliciesModal} className="block mb-2">Policies</button>
      <button onClick={openMakeClaimModal} className="block mb-2">Make Claim</button>
      {/* <button onClick={openClaimHistoryModal} className="block mb-2">Claim History</button> */}
      {/* Add more links or buttons as needed */}
    </div>
  );
}

export default Sidebar;