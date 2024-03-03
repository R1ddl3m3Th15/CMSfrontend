import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

function UserRegister() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    aadharId: '',
    email: ''
  });

  const [errors, setErrors] = useState({});
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  const regexValidations = {
    username: /^[A-Za-z][A-Za-z0-9_]{5,29}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    fullName: /^[A-Za-z]+(\s[A-Za-z]+)*$/,
    aadharId: /^\d{12}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Perform validation checks for each field
    let errorMessage = "";
    if (value === "") {
      errorMessage = "This field is required.";
    } else if (!regexValidations[name].test(value)) {
      switch (name) {
        case 'username':
          errorMessage = "Invalid username format. Must start with a letter, and can include numbers and underscores.";
          break;
        case 'password':
          errorMessage = "Password must have at least one lower and one upper case letter, one special character, and one number.";
          break;
        case 'fullName':
          errorMessage = "Full name must only contain English alphabets.";
          break;
        case 'aadharId':
          errorMessage = "Aadhar ID must be 12 digits.";
          break;
        case 'email':
          errorMessage = "Invalid email format.";
          break;
        default:
          break;
      }
    }

    // Set form data and error messages
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setErrors(prevState => ({
      ...prevState,
      [name]: errorMessage
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasErrors = Object.values(errors).some(error => error.length > 0);

    if (!hasErrors) {
      // Send a POST request to the backend to register the user
      axios.post('http://localhost:4000/user/register', formData)
        .then(response => {
          setIsRegistered(true);
          // Wait for 2 seconds before redirecting to the login page
          setTimeout(() => {
            navigate('/user/login');
          }, 3000);
        })
        .catch(error => {
          // Display the error message from the backend
          if (error.response && error.response.data) {
            setErrors({ form: error.response.data.message });
          } else {
            setErrors({ form: 'There was an error!' });
          }
        });
    }
  };

  if (isRegistered) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-green-600 text-lg">Registration successful!</p>
          <p className="text-gray-600">You will be redirected to the login page shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-green-600 mb-4">User Registration</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { label: "Username", type: "text", name: "username" },
            { label: "Password", type: "password", name: "password" },
            { label: "Full Name", type: "text", name: "fullName" },
            { label: "Aadhar ID", type: "text", name: "aadharId" },
            { label: "Email", type: "email", name: "email" },
          ].map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                {field.label} <span className="text-red-500">*</span>
              </label>
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                required
                className={`mt-1 px-3 py-2 bg-white border shadow-sm border-gray-300 
                           placeholder-gray-400 focus:outline-none focus:border-green-500 
                           block w-full rounded-md sm:text-sm focus:ring-1 focus:ring-green-500 ${errors[field.name] ? 'border-red-500' : ''}`}
                value={formData[field.name]}
                onChange={handleChange}
              />
              {errors[field.name] && <p className="text-red-500 text-xs italic">{errors[field.name]}</p>}
            </div>
          ))}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent 
                       rounded-md shadow-sm text-sm font-medium text-white bg-green-600 
                       hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                       focus:ring-green-500"
          >
            Register
          </button>
        </form>
        {/* Display the error message from the backend here */}
        {errors.form && <p className="text-center text-red-500">{errors.form}</p>}
        <div className="mt-6 text-center">
          <Link to="/user/login" className="font-medium text-green-600 hover:text-green-500">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UserRegister;