import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRegister from "./components/UserRegister";
import UserLogin from "./components/UserLogin";
import AdminRegister from "./components/AdminRegister";
import AdminLogin from "./components/AdminLogin";
import UserHome from "./components/UserHome";
import AdminHome from "./components/AdminHome";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/user/home" element={<UserHome />} />
        <Route path="/admin/home" element={<AdminHome />} />
        {/* Redirect to user login as default */}
        <Route path="/" element={<UserLogin />} />
      </Routes>
    </Router>
  );
}

export default App;