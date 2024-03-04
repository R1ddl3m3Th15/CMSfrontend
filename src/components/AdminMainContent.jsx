import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminMainContent() {
  const [pendingClaims, setPendingClaims] = useState([]);
  const [approvedClaims, setApprovedClaims] = useState([]);
  const [rejectedClaims, setRejectedClaims] = useState([]);
  

  useEffect(() => {
    fetchApprovedClaims();
    fetchPendingClaims();
    fetchRejectedClaims();
  }, []);

  const fetchPendingClaims = async () => {
    try {
      const response = await axios.get('https://bffcms.onrender.com/admin/claims/pending');
      setPendingClaims(response.data);
    } catch (error) {
      console.error('Failed to fetch pending claims:', error);
      // Handle error state appropriately
    }
  };

  const fetchApprovedClaims = async () => {
  try {
    const response = await axios.get('https://bffcms.onrender.com/admin/claims/approved');
    setApprovedClaims(response.data);
  } catch (error) {
    console.error('Failed to fetch approved claims:', error);
    // Handle error state appropriately
  }
};

const fetchRejectedClaims = async () => {
      try {
        const response = await axios.get('https://bffcms.onrender.com/admin/claims/rejected');
        setRejectedClaims(response.data);
      } catch (error) {
        console.error('Failed to fetch rejected claims:', error);
        // Handle error state appropriately
      }
    };

  const handleApprove = async (claimId) => {
    try {
      const response = await axios.patch(`https://bffcms.onrender.com/admin/claims/${claimId}/approve`);
      const updatedClaim = response.data.claim;

      // Add the updated claim to the approvedClaims array and filter it out from pendingClaims
      setApprovedClaims(prev => [...prev, updatedClaim]);
      setPendingClaims(prev => prev.filter(claim => claim.claimId !== claimId));
    } catch (error) {
      console.error('Failed to approve claim:', error);
      // Handle error state appropriately
    }
  };

  const handleReject = async (claimId) => {
    // Prompt for a rejection reason
    const rejectionReason = prompt("Please enter a reason for rejecting this claim:");
    if (!rejectionReason) {
        alert("Rejection reason is required to reject a claim.");
        return;
    }

    try {
        const response = await axios.patch(`https://bffcms.onrender.com/admin/claims/${claimId}/reject`, { rejectionReason });
        const updatedClaim = response.data.claim;

        // Optionally manage rejectedClaims state similar to approvedClaims if needed
        setRejectedClaims(prev => [...prev, updatedClaim]);

        // Remove the claim from pendingClaims
        setPendingClaims(prev => prev.filter(claim => claim.claimId !== claimId));

        // Optionally, refresh or update UI to reflect the claim has been moved to rejected
    } catch (error) {
        console.error('Failed to reject claim:', error);
        // Handle error state appropriately, maybe set an error message in state and display it
    }
  };

  return (
    <div className="flex-1 p-5">
      <h1 className="text-2xl font-bold">Admin Home</h1>

      {/* Pending Claims Section */}
      <h2 className="text-xl font-semibold my-3">Pending Claims</h2>
      {pendingClaims.length > 0 ? (
        <div>
          {pendingClaims.map((claim, index) => (
            <div key={index} className="mb-5 p-3 shadow rounded bg-white  w-5/6" style={{ maxHeight: '75vh', overflow: 'auto' }}>
              <h3 className="font-bold">Claim Details</h3>
              <p>Claim ID: {claim.claimId}</p>
              <p>Status: {claim.status}</p>
              <p>Request Date: {new Date(claim.requestDate).toLocaleDateString()}</p>

              <h3 className="font-bold mt-2">Claim</h3>
              <p>Claim Reason: {claim.claimDetails.claimReason}</p>
              <p>Claim Amount: {claim.claimDetails.claimAmount}</p>
              <p>Bills Approved: {claim.claimDetails.billsApproved}</p>

              <h3 className="font-bold mt-2">User Details</h3>
              <p>User ID: {claim.user.userId}</p>
              <p>Username: {claim.user.userName}</p>
              <p>User Email: {claim.user.userEmail}</p>

              <h3 className="font-bold mt-2">Policy Details</h3>
              <p>Policy ID: {claim.policy.policyId}</p>
              <p>Provider: {claim.policy.provider}</p>
              <p>Category: {claim.policy.category}</p>
              <p>Coverage Amount: {claim.policy.coverageAmount}</p>
              <p>Premium: {claim.policy.premium}</p>
              <p>Tenure: {claim.policy.tenure}</p>

              <div className="flex justify-end mt-4">
                <button 
                  onClick={() => handleApprove(claim.claimId)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleReject(claim.claimId)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No pending claims to display.</p>
      )}

      {/* Approved Claims Section */}
      <h2 className="text-xl font-semibold my-3">Approved Claims</h2>
{approvedClaims.length > 0 ? (
  <div>
    {approvedClaims.map((claim, index) => (
      <div key={index} className="mb-5 p-3 shadow rounded bg-white w-5/6" style={{ maxHeight: '75vh', overflow: 'auto' }}>
        <h3 className="font-bold">Claim Details</h3>
        <p>Claim ID: {claim.claimId}</p>
        <p>Status: {claim.status}</p>
        <p>Request Date: {new Date(claim.reqDate).toLocaleDateString()}</p>

        <h3 className="font-bold mt-2">Claim</h3>
        <p>Claim Reason: {claim.claimReason}</p>
        <p>Claim Amount: {claim.claimAmt}</p>
        <p>Bills Approved: {claim.billApp}</p>

        <h3 className="font-bold mt-2">User Details</h3>
        <p>User ID: {claim.userId}</p>
        {/* Username and User Email are not available in the approved claims response, need to fetch separately if needed */}
        
        <h3 className="font-bold mt-2">Policy Details</h3>
        <p>Policy ID: {claim.policyId}</p>
        {/* Provider, Category, Coverage Amount, Premium, Tenure are not available in the approved claims response, need to fetch separately if needed */}
      </div>
    ))}
  </div>
) : (
  <p>No approved claims to display.</p>
)}
      {/* Rejected Claims Section */}
      <h2 className="text-xl font-semibold my-3">Rejected Claims</h2>
{rejectedClaims.length > 0 ? (
  <div>
    {rejectedClaims.map((claim, index) => (
      <div key={index} className="mb-5 p-3 shadow rounded bg-white w-5/6" style={{ maxHeight: '75vh', overflow: 'auto' }}>
        <h3 className="font-bold">Claim Details</h3>
        <p>Claim ID: {claim.claimId}</p>
        <p>Status: {claim.status}</p>
        <p>Rejection Reason: {claim.rejReason}</p>
        <p>Request Date: {new Date(claim.reqDate).toLocaleDateString()}</p>

        <h3 className="font-bold mt-2">Claim</h3>
        <p>Claim Reason: {claim.claimReason}</p>
        <p>Claim Amount: {claim.claimAmt}</p>
        <p>Bills Approved: {claim.billApp}</p>

        <h3 className="font-bold mt-2">User Details</h3>
        <p>User ID: {claim.userId}</p>
        {/* Include username and email if available in the response */}
        {/* <p>Username: {claim.user.userName}</p> */}
        {/* <p>User Email: {claim.user.userEmail}</p> */}

        <h3 className="font-bold mt-2">Policy Details</h3>
        <p>Policy ID: {claim.policyId}</p>
        {/* Include provider, category, coverage amount, premium, and tenure if available */}
        {/* <p>Provider: {claim.policy.provider}</p> */}
        {/* <p>Category: {claim.policy.category}</p> */}
        <p>Coverage Amount: {claim.coverageAmt}</p>
        {/* <p>Premium: {claim.policy.premium}</p> */}
        {/* <p>Tenure: {claim.policy.tenure}</p> */}
      </div>
    ))}
  </div>
) : (
  <p>No rejected claims to display.</p>
)}
    </div>
  );
}

export default AdminMainContent;