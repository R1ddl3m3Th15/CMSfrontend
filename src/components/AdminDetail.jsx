import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function AdminDetail() {
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchAdminInfo = async () => {
      const adminId = localStorage.getItem('adminId');
      if (!adminId) {
        console.log('No admin ID found in localStorage');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('https://cmsbackendnew.onrender.com/admin/listadmins', {
          headers: { 'x-api-key': process.env.REACT_APP_API_KEY }
        });
        console.log(response.data); // Log the response to see the data structure
        const adminDetail = response.data.find(admin => admin.adminId === adminId);
        if (!adminDetail) {
          console.log(`No admin found with ID: ${adminId}`);
        }
        setAdminInfo(adminDetail);
      } catch (error) {
        console.error('Error fetching admin details:', error);
      }
      setLoading(false);
    };

    fetchAdminInfo();
  }, []);

  if (loading) {
    return <div>Loading admin details...</div>;
  }

  if (!adminInfo) {
    return <div>No admin details available.</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem('adminId');
    navigate('/user/login');
  };

  return (
    <div>
      <h3 className="font-bold mb-3">Admin Details</h3>
      <ul>
        <li><strong>Name:</strong> {adminInfo.fullName}</li>
        <li><strong>Aadhar:</strong> {adminInfo.aadharId}</li>
        <li><strong>Email:</strong> {adminInfo.email}</li>
        {/* Add more details as required */}
      </ul>
      <button onClick={handleLogout} className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
        Logout
      </button>
    </div>
    
  );
}

export default AdminDetail;