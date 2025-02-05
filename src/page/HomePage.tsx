import React from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  let navigate = useNavigate();

  const handleLogout = () => {
    // Placeholder for logout logic
    console.log("User logged out");
    navigate("/");
  };

  return (
    <div className="h-14 bg-gradient-to-r from-purple-500 to-pink-500">
      <h1>Home Page</h1>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}

export default HomePage;
