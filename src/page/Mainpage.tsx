import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const StepHeader: React.FC<{ index: number }> = ({ index }) => {
  return (
    <div className="bg-rose-200 text-neutral-950 px-4 py-1 rounded-full text-sm font-medium">
      Step {index + 1}
    </div>
  );
};

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

  const steps = [
    {
      title: "Connect Wallet",
      tests: "Immediate connection",
      description:
        "Connect your Web3 wallet securely to start the process. Establishes a secure link between your wallet and our platform.",
      icon: "/path-to-wallet-icon.svg", // Path to your wallet icon
    },
    {
      title: "Retrieve Data",
      tests: "Quick data sync",
      description:
        "Retrieve comprehensive transaction data in real-time. Pulls all relevant data from your connected wallet for analysis.",
      icon: "/path-to-data-icon.svg", // Path to your data retrieval icon
    },
    {
      title: "Generate Report",
      tests: "Customizable reports",
      description:
        "Generate a detailed audit report of your wallet transactions. Compiles data into an easy-to-understand report.",
      icon: "/path-to-report-icon.svg", // Path to your report icon
    },
  ];

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
      <div className="bg-neutral-950 text-white min-h-screen flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-bold mb-4">What's Included</h1>
        <p className="text-xl mb-6">
          Get a continuous, deep-level picture of your wallet activities.
        </p>
        <div className="flex space-x-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-neutral-800 p-4 rounded-lg shadow-lg text-center"
              style={{ zIndex: steps.length - index }}
            >
              <StepHeader index={index} />
              <div className="absolute -top-10 bg-neutral-700 p-2 rounded-full w-20 h-20 flex items-center justify-center">
                <img src={step.icon} alt={step.title} className="h-10 w-10" />
              </div>
              <div className="mt-12 text-left">
                <h2 className="text-xl font-semibold mb-2">{step.title}</h2>
                <p className="mb-2">{step.description}</p>
              </div>
            </div>
          ))}
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
            <h2 className="text-white text-lg mb-4">Select Wallet Type</h2>
            <div className="flex flex-col items-center mb-4">
              <img
                src="/path-to-your-wallet-connect-image.png"
                alt="Wallet Connection"
                className="mb-2"
              />
              <p className="text-center text-white">
                Connect your wallet to access personalized wallet analytics and
                insights.
              </p>
            </div>{" "}
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
