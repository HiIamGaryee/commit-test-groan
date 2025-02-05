import React from "react";
import { useNavigate } from "react-router-dom";
import walletData from "../walletData.json";

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
      <div className="bg-black text-white min-h-screen p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Smart Wallet Health Monitor</h1>
          <div className="grid grid-cols-2 gap-4">
            <div>
              {" "}
              {/* Column 1 */}
              <p>
                <strong>Wallet Address:</strong> {walletData.walletAddress}
              </p>
              <p>
                <strong>Overall Health Score:</strong>{" "}
                {walletData.overallHealthScore}/100
              </p>
              <h2 className="text-xl mt-4 mb-2">Recent Transactions:</h2>
              {walletData.recentTransactions.map((tx, index) => (
                <div key={index} className="p-2 border border-gray-700 rounded">
                  <p>Tx Hash: {tx.hash}</p>
                  <p>Value: {tx.value}</p>
                  <p>Date: {tx.date}</p>
                  <p>Status: {tx.status}</p>
                </div>
              ))}
            </div>

            <div>
              {" "}
              {/* Column 2 */}
              <h2 className="text-xl mt-4 mb-2">Suspicious Findings:</h2>
              {walletData.suspiciousFindings.map((finding, index) => (
                <p key={index}>{finding}</p>
              ))}
              <h2 className="text-xl mt-4 mb-2">Security Tips:</h2>
              {walletData.securityTips.map((tip, index) => (
                <p key={index}>{tip}</p>
              ))}
              <h2 className="text-xl mt-4 mb-2">AI Insights:</h2>
              {walletData.aiInsights.map((insight, index) => (
                <p key={index}>{insight}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
