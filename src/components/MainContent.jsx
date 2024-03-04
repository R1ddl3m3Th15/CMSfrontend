import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MainContent() {
  const [claimHistory, setClaimHistory] = useState([]);
  const userId = localStorage.getItem('userId'); // Assuming the userId is stored in localStorage

  useEffect(() => {
    if (userId) {
      fetchClaimHistory(userId);
    }
  }, [userId]);

  const fetchClaimHistory = async (userId) => {
    try {
      const response = await axios.get(`https://bffcms.onrender.com/user/${userId}/claims/history`);
      setClaimHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch claim history:', error);
      // Handle error state appropriately
    }
  };

  return (
    <div className="flex-1 p-5">
      <h1 className="text-2xl font-bold">User Home</h1>
      <h2 className="text-xl font-semibold my-3">Claim History</h2>
      {claimHistory.length > 0 ? (
        <div>
          {claimHistory.map((item, index) => (
            <div key={index} className="mb-5 p-3 shadow rounded bg-white w-5/6">
              <div className="font-bold">Policy Details</div>
              <div>Policy ID: {item.policyDetails.policyId}</div>
              <div>Coverage Amount: {item.policyDetails.coverageAmt}</div>
              
              <div className="font-bold mt-2">Claim Details</div>
              <div>Claim ID: {item.claimDetails.claimId}</div>
              <div>Claim Reason: {item.claimDetails.claimReason}</div>
              <div>Claim Amount: {item.claimDetails.claimAmount}</div>
              <div>Status: {item.claimDetails.status}</div>
              <div>Request Date: {new Date(item.claimDetails.requestDate).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      ) : (
        <p>No claim history to display.</p>
      )}
    </div>
  );
}

export default MainContent;