import React from "react";
import { useNavigate } from "react-router-dom";
// import logo from "./../logo.svg";

function MainPage() {
  let navigate = useNavigate();

  const handleLogin = (type: any) => {
    console.log("Logging in as:", type);
    navigate("/home");
  };

  return (
    <div className="h-14 bg-gradient-to-r from-purple-500 to-pink-500">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header> */}
      <h1>Main Page</h1>
      <button onClick={() => handleLogin("Type1")}>Login Type 1</button>
      <button onClick={() => handleLogin("Type2")}>Login Type 2</button>
      <button onClick={() => handleLogin("Type3")}>Login Type 3</button>
    </div>
  );
}

export default MainPage;
