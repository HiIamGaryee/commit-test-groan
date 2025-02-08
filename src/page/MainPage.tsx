import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";

function MainPage() {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const { ready, authenticated, login, logout } = usePrivy(); // ✅ Include logout

  const handleLogin = (type: string) => {
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
    <div className="h-full bg-neutral-950">
      {/* Navbar */}
      <div className="bg-opacity-75 bg-neutral-950 fixed top-0 left-0 right-0 py-2 px-4 flex justify-start items-center">
        <button onClick={openDialog} className="neon-button">
          Connect Wallet
        </button>
      </div>

      {/* Page Content */}
      <div className="bg-neutral-950 text-white min-h-screen p-4 flex items-center justify-center">
        <div className="container text-center">
          <h1 className="text-6xl">Wallet Analytics Platform</h1>
          <p className="text-2xl mt-2">
            Log in with your wallet to access and visualize your transaction
            history with detailed graphs.
          </p>
        </div>
      </div>

      {/* Dialog for Login Options */}
      {showDialog && (
        <div
          className="fixed inset-0 bg-neutral-950 bg-opacity-50 flex justify-center items-center"
          onClick={closeDialog}
        >
          <div
            className="bg-gray-800 p-4 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-white text-lg mb-4">Choose Login Type</h2>

            {/* If already logged in, show Logout button instead */}
            {authenticated ? (
              <button
                onClick={logout}
                className="block text-red-400 mb-2 hover:text-red-300"
              >
                Log out of Privy
              </button>
            ) : (
              <button
                onClick={login}
                disabled={!ready}
                className={`block text-white mb-2 ${!ready ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                Log in with Privy
              </button>
            )}

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
