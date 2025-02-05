import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function MainPage() {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  const handleLogin = (type: any) => {
    console.log("Logging in as:", type);
    navigate("/home");
    setShowDialog(false);
  };

  const openDialog = () => {
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
  };

  return (
    <div className="h-full bg-black">
      <div className="bg-opacity-75 bg-black fixed top-0 left-0 right-0 py-2 px-4 flex justify-start items-center">
        <button onClick={openDialog} className="neon-button">
          Connect Wallet
        </button>
      </div>

      {showDialog && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={closeDialog}
        >
          <div
            className="bg-gray-800 p-4 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-white text-lg mb-4">Choose Login Type</h2>
            <button
              onClick={() => handleLogin("Type1")}
              className="block text-white mb-2"
            >
              Login Type 1
            </button>
            <button
              onClick={() => handleLogin("Type2")}
              className="block text-white mb-2"
            >
              Login Type 2
            </button>
            <button
              onClick={() => handleLogin("Type3")}
              className="block text-white"
            >
              Login Type 3
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainPage;
