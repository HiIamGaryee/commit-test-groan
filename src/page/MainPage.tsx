import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { usePrivy } from "@privy-io/react-auth";
import walletImg from "../assets/wallet-img.png";

function MainPage() {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [isConnected, setIsConnected] = useState(false); // Track WalletConnect status

  // Get Privy authentication state
  const { ready, authenticated, login, logout } = usePrivy();

  // Initialize WalletConnect
  const initializeWalletConnect = useCallback(() => {
    const newConnector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org",
      qrcodeModal: QRCodeModal,
    });

    if (!newConnector.connected) {
      newConnector.createSession();
    }

    newConnector.on("connect", (error: Error | null, payload: any) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Wallet connected:", payload);
        setIsConnected(true);
      }
    });

    newConnector.on("disconnect", (error: Error | null) => {
      if (error) {
        console.error(error);
      }
      setIsConnected(false);
    });
  }, []);

  // Handle Login/Logout Actions
  const handleLogin = (type: string) => {
    console.log("Logging in as:", type);
    if (type === "walletconnect") {
      initializeWalletConnect();
    } else if (type === "privy") {
      if (authenticated) {
        logout(); // If already logged in, log out instead
      } else {
        login();
      }
    } else {
      navigate("/home");
    }
    setShowDialog(false);
  };

  // Open & Close Dialog
  const openDialog = () => setShowDialog(true);
  const closeDialog = () => setShowDialog(false);

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
            <h2 className="text-white text-lg mb-4">Connect Wallet Now</h2>
            <div>
              <img
                src={walletImg}
                alt="Wallet"
                className="full-width-centered-image"
              />
            </div>
            <div className="flex-col gap-4 flex">
              <button
                onClick={() => handleLogin("privy")}
                className="neon-button"
              >
                {authenticated ? "Logout from Privy" : "Login with Privy"}
              </button>
              <button
                onClick={() => handleLogin("walletconnect")}
                className="neon-button"
              >
                WalletConnect
              </button>
              <button
                onClick={() => handleLogin("Type3")}
                className="neon-button"
              >
                Login Type 3
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainPage;
