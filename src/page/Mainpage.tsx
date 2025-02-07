import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePrivy } from '@privy-io/react-auth';

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

  function LoginButton() {
    const { ready, authenticated, login } = usePrivy();
    // Disable login when Privy is not ready or the user is already authenticated
    const disableLogin = !ready || (ready && authenticated);

    return (
      <button className="neon-button" disabled={disableLogin} onClick={login}>
        Log in with Privy
      </button>
    );
  }

  return (
    <div className="h-full bg-neutral-950">
      <div className="bg-opacity-75 bg-neutral-950 fixed top-0 left-0 right-0 py-2 px-4 flex justify-start items-center">
        {LoginButton()}
        <button onClick={openDialog} className="neon-button">
          Connect Wallet
        </button>
      </div>
      <div className="bg-neutral-950 text-white min-h-screen p-4">
        <div className="container mx-auto items-center justify-center">
          <h1 className="text-6xl text-center">Wallet Analytics Platform</h1>
          <p className="text-2xl text-center">
            Log in with your wallet to access and visualize your transaction
            history with detailed graphs.
          </p>
        </div>
      </div>
      {showDialog && (
        <div
          className="fixed inset-0 bg-neutral-950	 bg-opacity-50 flex justify-center items-center"
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
