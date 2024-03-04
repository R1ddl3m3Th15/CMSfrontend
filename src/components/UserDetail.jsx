import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserDetail() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userId = localStorage.getItem('userId'); // Replace with your actual logic for getting the logged-in user's ID
      if (!userId) return;
      try {
        const response = await axios.get('https://cmsbackendnew.onrender.com/admin/listusers', {
          headers: {
            // Include the API key in the request headers
            'x-api-key': process.env.REACT_APP_API_KEY,
          },
        });
        const userDetail = response.data.find(user => user.userId === userId);
        setUserInfo(userDetail);
      }
       catch (error) {
        console.error('Error fetching user details:', error);
        // Handle error state appropriately
      }
    };

    fetchUserInfo();
  }, []);

  if (!userInfo) {
    return <div>Loading...</div>; // or any other loading state representation
  }

  const handleLogout = () => {
    // Clear the userId from localStorage
    localStorage.removeItem('userId');

    // Optionally redirect to login page or home page
    // Adjust the redirection based on your app's routing
    window.location.href = '/user/login';
  };

  return (
    <div>
      <h3 className="font-bold mb-3">User Details</h3>
      <ul>
        <li><strong>Name:</strong> {userInfo.fullName}</li>
        <li><strong>Aadhar:</strong> {userInfo.aadharId}</li>
        <li><strong>Email:</strong> {userInfo.email}</li>
        {/* Add more details as required */}
      </ul>
      <button onClick={handleLogout} className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
        Logout
      </button>
    </div>
  );
}

export default UserDetail;