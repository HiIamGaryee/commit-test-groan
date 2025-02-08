import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

function MainPage() {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [isConnected, setIsConnected] = useState(false); // Track connection status

  // Initialize WalletConnect
  const initializeWalletConnect = useCallback(() => {
    const newConnector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org",
      qrcodeModal: QRCodeModal,
    });

    if (!newConnector.connected) {
      newConnector.createSession();
    }

    newConnector.on("connect", (error, payload) => {
      if (error) {
        console.error(error);
      } else {
        const { accounts } = payload.params[0];
        console.log("Connected:", accounts[0]);
        navigate("/home");
        setIsConnected(true);
        setShowDialog(false);
      }
    });

    newConnector.on("disconnect", (error, payload) => {
      if (error) {
        console.error(error);
      }
      setIsConnected(false); // Update connection status
    });
  }, [navigate]);

  const handleLogin = (type: any) => {
    console.log("Logging in as:", type);
    if (type === "walletconnect") {
      initializeWalletConnect();
    } else {
      navigate("/home");
    }
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
      <div className="bg-opacity-75 bg-neutral-950 fixed top-0 left-0 right-0 py-2 px-4 flex justify-start items-center">
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
          className="fixed inset-0 bg-neutral-950 bg-opacity-50 flex justify-center items-center"
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
              onClick={() => handleLogin("walletconnect")}
              className="block text-white mb-2"
            >
              WalletConnect
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
