import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function MakeClaimModal({ onClose }) {
  const [userDetails, setUserDetails] = useState({});
  const [policies, setPolicies] = useState([]);
  const [selectedPolicyDetails, setSelectedPolicyDetails] = useState({});
  const [formData, setFormData] = useState({
    userId: localStorage.getItem('userId') || '',
    policyId: '',
    claimReason: '',
    billsApproved: 'Yes', // Defaulting to 'Yes'
    claimAmount: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitResponse, setSubmitResponse] = useState('');

  const fetchUserDetails = useCallback(async (userId) => {
    try {
      const { data: users } = await axios.get('https://bffcms.onrender.com/admin/listusers');
      const user = users.find((u) => u.userId === userId);
      setUserDetails(user || {});

      if (user && user.selectedPolicies) {
        const policyDetailsRequests = user.selectedPolicies.map(policyId =>
          axios.get(`https://bffcms.onrender.com/user/policies/${policyId}`)
        );
        const policyDetailsResponses = await Promise.all(policyDetailsRequests);
        const policyDetails = policyDetailsResponses.map(response => response.data);
        setPolicies(policyDetails);
      } else {
        console.error('Selected policies are not available');
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      setFormErrors({ ...formErrors, fetch: 'Failed to fetch user details.' });
    }
  }, [formErrors]);

  useEffect(() => {
    const userId = formData.userId;
    if (userId) {
      fetchUserDetails(userId);
    }
  }, [formData.userId, fetchUserDetails]);

  const handlePolicyChange = (e) => {
    const policyId = e.target.value;
    const policy = policies.find((p) => p.policyId === policyId);
    setSelectedPolicyDetails(policy || {});
    setFormData({ ...formData, policyId });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: '' });
    setSubmitResponse('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://bffcms.onrender.com/user/claims/create', {
        ...formData,
        // Include additional policy details if needed by the backend
        coverageAmt: selectedPolicyDetails.coverageAmt,
      });
      setSubmitResponse(response.data.message);
    } catch (error) {
      setFormErrors({ form: error.response.data.message || 'An error occurred during claim submission.' });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-3/4 max-w-4xl shadow-lg rounded-md bg-white">
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Make Claim</h3>
          
          {/* User Details */}
          <div className="mb-4 flex items-center">
            <label className="mr-2">User ID :</label>
            <input type="text" value={formData.userId} disabled className="border-2 border-gray-300 rounded p-1 bg-gray-100 flex-grow" style={{ minWidth: '250px' }}/>
          </div>
          {userDetails && (
            <>
              <div className="mb-4 flex items-center">
                <label className="mr-2">Full Name :</label>
                <input type="text" value={userDetails.fullName || ''} disabled className="border-2 border-gray-300 rounded p-1 bg-gray-100 flex-grow" style={{ minWidth: '250px' }}/>
              </div>
              <div className="mb-4 flex items-center">
                <label className="mr-2">Aadhar ID :</label>
                <input type="text" value={userDetails.aadharId || ''} disabled className="border-2 border-gray-300 rounded p-1 bg-gray-100 flex-grow" style={{ minWidth: '250px' }} />
              </div>
            </>
          )}

          {/* Policies Dropdown */}
          <div className="mb-4">
            <label>Policy ID :</label>
            <select name="policyId" value={formData.policyId} onChange={handlePolicyChange} required className="border-2 border-gray-300 rounded p-1 bg-white">
              <option value="">Select Policy</option>
              {policies.map((policy) => (
                <option key={policy.policyId} value={policy.policyId}>
                  {policy.provider} - {policy.category} - {policy.policyId}
                </option>
              ))}
            </select>
          </div>

          {/* Auto-populated Policy Details */}
         {selectedPolicyDetails && (
        <>
          <div className="mb-4">
            <label>Provider :</label>
            <input type="text" value={selectedPolicyDetails.provider || ''} disabled className="ml-2" />
          </div>
          <div className="mb-4">
            <label>Category :</label>
            <input type="text" value={selectedPolicyDetails.category || ''} disabled className="ml-2" />
          </div>
          <div className="mb-4">
            <label>Coverage Amount :</label>
            <input type="text" value={selectedPolicyDetails.coverageAmt || ''} disabled className="ml-2" />
          </div>
          <div className="mb-4">
            <label>Premium :</label>
            <input type="text" value={selectedPolicyDetails.premium || ''} disabled className="ml-2" />
          </div>
          <div className="mb-4">
            <label>Tenure :</label>
            <input type="text" value={selectedPolicyDetails.tenure || ''} disabled className="ml-2" />
          </div>
        </>
      )}

      {/* Claim Reason */}
      <div className="mb-4">
        <label className="block mb-1">Claim Reason :</label>
        <textarea
          name="claimReason"
          value={formData.claimReason}
          onChange={handleChange}
          required
          className="ml-2 border-2 border-gray-300 rounded p-1 bg-white w-full"
        />
      </div>

      {/* Bills Approved */}
      <div className="mb-4">
        <label>Bills Approved :</label>
        <div className="ml-2">
          <input
            type="radio"
            name="billsApproved"
            value="Yes"
            checked={formData.billsApproved === 'Yes'}
            onChange={handleChange}
          />
          <label>Yes</label>
          <input
            type="radio"
            name="billsApproved"
            value="No"
            checked={formData.billsApproved === 'No'}
            onChange={handleChange}
            className="ml-4"
          />
          <label>No</label>
        </div>
      </div>

      {/* Claim Amount */}
      <div className="mb-4 flex items-center">
        <label className="mr-2">Claim Amount :</label>
        <input
          type="number"
          name="claimAmount"
          value={formData.claimAmount}
          onChange={handleChange}
          required
          className="ml-2 border-2 border-gray-300 rounded p-1 bg-white"
        />
      </div>

      {/* Form Submission Response */}
      {submitResponse && <div className="text-green-500">{submitResponse}</div>}

      {/* Form Errors */}
      {Object.keys(formErrors).length > 0 && (
        <div className="text-red-500">
          {Object.values(formErrors).map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}

      {/* Submit and Close Buttons */}
      <div className="flex justify-center mt-6">
        <button
          type="submit"
          className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 mr-4"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600"
        >
          Close
        </button>
      </div>
      </form>
      </div>
      </div>
      );
      }

      export default MakeClaimModal;