import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

function AdminLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [backendError, setBackendError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to handle login success
  const navigate = useNavigate();

  const usernamePattern = /^[a-zA-Z0-9._]{5,}$/;
  const passwordPattern = /^[a-zA-Z0-9!@#$%^&*]{6,}$/;

  const validateForm = () => {
    const errors = {};
    if (!usernamePattern.test(formData.username)) {
      errors.username = 'Username must be at least 5 characters long and contain only letters, numbers, dots, or underscores.';
    }
    if (!passwordPattern.test(formData.password)) {
      errors.password = 'Password must be at least 6 characters long and contain a combination of letters, numbers, and special characters.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: ''
    }));
    setBackendError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    axios.post('https://bffcms.onrender.com/admin/login', formData)
      .then(response => {
         // Assuming response.data.user contains the user object
        localStorage.setItem('adminId', response.data.admin.adminId); // Store adminId in localStorage
        setIsLoggedIn(true);
        console.log(response.data);
        setTimeout(() => { // Redirect after 3 seconds
          navigate('/admin/home');
        }, 3000);
      })
      .catch(error => {
        const message = error.response && error.response.data ? error.response.data.message : 'Login failed. Please try again.';
        setBackendError(message);
      });
  };
  
  if (isLoggedIn) {
    // Display a success message and inform the user about the redirection
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-green-600 text-lg">Login successful!</p>
          <p className="text-gray-600">You will be redirected to the home page shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-green-600 mb-4">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              className="mt-1 px-3 py-2 bg-white border shadow-sm border-gray-300 
                         placeholder-gray-400 focus:outline-none focus:border-green-500 
                         block w-full rounded-md sm:text-sm focus:ring-1 focus:ring-green-500"
              value={formData.username}
              onChange={handleChange}
            />
            {formErrors.username && <p className="text-red-500 text-xs italic">{formErrors.username}</p>}
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="mt-1 px-3 py-2 bg-white border shadow-sm border-gray-300 
                         placeholder-gray-400 focus:outline-none focus:border-green-500 
                         block w-full rounded-md sm:text-sm focus:ring-1 focus:ring-green-500"
              value={formData.password}
              onChange={handleChange}
            />
            {formErrors.password && <p className="text-red-500 text-xs italic">{formErrors.password}</p>}
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent 
                       rounded-md shadow-sm text-sm font-medium text-white bg-green-500 
                       hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 
                       focus:ring-green-500"
          >
            Login
          </button>
          {backendError && <p className="text-red-500 text-center mt-2">{backendError}</p>}
        </form>
        <div className="mt-6 text-center space-y-4">
          <Link to="/" className="font-medium text-green-600 hover:text-green-500">
            Are you a user? User Login
          </Link>
          <div className="mt-6 text-center space-y-4">
             <Link to="/admin/register" className="font-medium text-green-600 hover:text-green-500">
            Don't have an Admin account? Register
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;