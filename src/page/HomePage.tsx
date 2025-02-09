import React, { useEffect, useState, ReactElement } from "react";
import { FaUserCircle, FaBell, FaGlobe, FaPlus, FaExchangeAlt, FaArrowUp, FaArrowDown, FaSignOutAlt } from "react-icons/fa";
import {
  AiOutlinePieChart,
  AiOutlineFileText,
  AiOutlineSetting,
} from "react-icons/ai";
import { usePrivy } from "@privy-io/react-auth";
import { useNavigate } from "react-router-dom";

const GRAPH_API_URL = "https://github.com/HiIamGaryee/commit-test-groan-graph";
const AI_REPORT_API_URL = "http://localhost:5000/generate-report";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { authenticated, logout } = usePrivy();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [smartReport, setSmartReport] = useState(MOCK_REPORT); // ✅ Default mock report
  const [loading, setLoading] = useState(true);
  const [loginMethod, setLoginMethod] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [reportLoading, setReportLoading] = useState(true);

  /** Retrieve Login Method & Wallet Address from LocalStorage */
  useEffect(() => {
    const storedLoginMethod = localStorage.getItem("loginMethod");
    const storedWalletAddress = localStorage.getItem("walletAddress");

    if (storedLoginMethod && storedWalletAddress) {
      setLoginMethod(storedLoginMethod);
      setWalletAddress(storedWalletAddress);
      setIsAuthenticated(true);
    } else {
      navigate("/"); // Redirect back to login if no valid session
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!walletAddress) return;

      try {
        // Fetch transactions from The Graph
        const query = {
          query: `{ wallet(id: "${walletAddress}") { transactions { id from to value timestamp } } }`,
        };
        const response = await axios.post(GRAPH_API_URL, query);
        const walletData = response.data?.data?.wallet;

        if (!walletData || !walletData.transactions.length) {
          throw new Error("No transactions found.");
        }

        setTransactions(walletData.transactions);
      } catch (error) {
        console.error("Transaction API Error:", error);
      }

      try {
        // Fetch AI-generated Smart Report
        setReportLoading(true);
        const reportResponse = await axios.post(AI_REPORT_API_URL, { walletAddress });
        setSmartReport(reportResponse.data.report);
      } catch (error) {
        console.error("AI Report API Error:", error);
        setReportError(true);
        setSmartReport("Error generating report.");
      } finally {
        setReportLoading(false);
      }

      setLoading(false);
    };

    fetchData();
  }, [walletAddress]);

  /** Logout Function */
  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginMethod(null);
    setWalletAddress(null);
    localStorage.removeItem("loginMethod");
    localStorage.removeItem("walletAddress");

    if (loginMethod === "Privy") {
      logout().then(() => navigate("/"));
    } else {
      navigate("/");
    }
  };

  return (
    <div className="bg-neutral-900 text-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <FaUserCircle size={28} />
          <span className="text-lg font-semibold">{walletAddress || "Not Connected"}</span>
        </div>
        <div className="flex gap-4 items-center">
          <FaGlobe size={20} />
          <FaBell size={20} />
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="neon-button bg-red-600 hover:bg-red-700 px-4 py-1 rounded"
            >
              <FaSignOutAlt size={16} className="inline-block mr-1" />
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Smart Report Section */}
      {isAuthenticated && (
        <div className="p-6 bg-gray-800 rounded-lg">
          <h2 className="text-2xl font-semibold mb-3">Smart Report</h2>
          {reportLoading ? (
            <div className="flex justify-center items-center h-24">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="p-4 bg-gray-700 rounded-md">
              <h3 className="text-xl font-semibold text-blue-400">Overall Health Score</h3>
              <p className="text-lg font-bold text-white mt-1">{smartReport.overallHealthScore} / 100</p>

              {/* Suspicious Findings */}
              {smartReport.suspiciousFindings.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-yellow-400">⚠️Suspicious Findings⚠️</h3>
                  <ul className="list-disc ml-5 text-red-300">
                    {smartReport.suspiciousFindings.map((finding, index) => (
                      <li key={index}>{finding}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Security Tips */}
              {smartReport.securityTips.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-green-400">Security Tips</h3>
                  <ul className="list-disc ml-5 text-green-300">
                    {smartReport.securityTips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* AI Insights */}
              {smartReport.aiInsights.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-blue-400">AI Insights</h3>
                  <p className="text-gray-300 italic">{smartReport.aiInsights[0]}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Transactions Section */}
      {isAuthenticated && (
        <div className="p-4">
          <h2 className="text-2xl font-semibold mb-2">Recent Transactions</h2>
          <TransactionsPage />
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="flex justify-around py-4 border-t border-gray-700 bg-gray-800 text-gray-400">
        <BottomNavButton icon={<AiOutlinePieChart size={24} />} text="Assets" />
        <BottomNavButton
          icon={<AiOutlineFileText size={24} />}
          text="Transactions"
        />
        <BottomNavButton
          icon={<AiOutlineSetting size={24} />}
          text="Settings"
        />
      </div>
    </div>
  );
};

/** Fixing missing components */
const ActionButton = ({ icon, text }: { icon: ReactElement; text: string }) => (
  <div className="flex flex-col items-center text-gray-300 hover:text-white">
    <div className="bg-gray-700 p-3 rounded-full">{icon}</div>
    <span className="mt-1 text-sm">{text}</span>
  </div>
);

const BottomNavButton = ({ icon, text }: { icon: ReactElement; text: string }) => (
  <div className="flex flex-col items-center hover:text-white">
    {icon}
    <span className="text-xs mt-1">{text}</span>
  </div>
);

export default HomePage;
