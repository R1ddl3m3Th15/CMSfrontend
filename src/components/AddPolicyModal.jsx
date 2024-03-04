import React, { useState } from 'react';
import axios from 'axios';

function AddPolicyModal({ onClose }) {
  const [formData, setFormData] = useState({
    provider: '',
    coverageAmt: '',
    premium: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitResponse, setSubmitResponse] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Resetting errors and response
    setFormErrors({});
    setSubmitResponse('');

    try {
      const response = await axios.post('http://localhost:3001/admin/policies/add', formData);
      setSubmitResponse(response.data.message);
      // Reset form after successful submission
      setFormData({
        provider: '',
        coverageAmt: '',
        premium: ''
      });
    } catch (error) {
      setFormErrors({ form: error.response.data.message || 'An error occurred during the policy addition.' });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-3/4 max-w-4xl shadow-lg rounded-md bg-white">
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add Policy</h3>
          <div>
            <label htmlFor="provider">Provider:</label>
            <input
              type="text"
              id="provider"
              name="provider"
              required
              value={formData.provider}
              onChange={handleChange}
              className="border-2 border-gray-300 rounded p-1 w-full"
            />
          </div>
          <div>
            <label htmlFor="coverageAmt">Coverage Amount:</label>
            <input
              type="text"
              id="coverageAmt"
              name="coverageAmt"
              required
              value={formData.coverageAmt}
              onChange={handleChange}
              className="border-2 border-gray-300 rounded p-1 w-full"
            />
          </div>
          <div>
            <label htmlFor="premium">Premium:</label>
            <input
              type="text"
              id="premium"
              name="premium"
              required
              value={formData.premium}
              onChange={handleChange}
              className="border-2 border-gray-300 rounded p-1 w-full"
            />
          </div>
          {submitResponse && <div className="text-green-500">{submitResponse}</div>}
          {formErrors.form && <div className="text-red-500">{formErrors.form}</div>}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 mr-4"
            >
              Add Policy
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

export default AddPolicyModal;