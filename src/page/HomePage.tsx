import React, { useEffect, useState, ReactElement } from "react";
import {
  FaUserCircle,
  FaBell,
  FaGlobe,
  FaPlus,
  FaExchangeAlt,
  FaArrowUp,
  FaArrowDown,
  FaSignOutAlt,
} from "react-icons/fa";
import {
  AiOutlinePieChart,
  AiOutlineFileText,
  AiOutlineSetting,
} from "react-icons/ai";
import { usePrivy } from "@privy-io/react-auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AiBot from "../components/AiBot";
import TailwindDialog from "../components/TailwindDialog";

const GRAPH_API_URL = "https://thegraph.com/studio/subgraph/committestgroan/";
const AI_REPORT_API_URL = "http://localhost:5000/generate-report";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { authenticated, logout } = usePrivy();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [smartReport, setSmartReport] = useState<string>("Loading report...");
  const [loading, setLoading] = useState(true);
  const [reportError, setReportError] = useState(false);
  const [loginMethod, setLoginMethod] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [reportLoading, setReportLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

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
        const reportResponse = await axios.post(AI_REPORT_API_URL, {
          walletAddress,
        });
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
    // Clear authentication state
    setIsAuthenticated(false);
    setLoginMethod(null);
    setWalletAddress(null);

    // Clear stored session
    localStorage.removeItem("loginMethod");
    localStorage.removeItem("walletAddress");

    // If logged in with Privy, log out properly
    if (loginMethod === "Privy") {
      logout().then(() => {
        navigate("/"); // Ensure redirect happens after logout is completed
      });
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
          <span className="text-lg font-semibold">
            {walletAddress || "Not Connected"}
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={handleOpen} className="neon-button bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded">
            Open AiBot
          </button>
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

        <TailwindDialog open={isOpen} onClose={handleClose}>
          <AiBot onClose={handleClose} />
        </TailwindDialog>
      </div>

      {/* Balance Section */}
      <div className="text-center py-6 border-b border-gray-700">
        <h1 className="text-4xl font-bold">$0.00</h1>
        <div className="flex justify-center gap-6 mt-4">
          <ActionButton icon={<FaPlus size={22} />} text="Buy" />
          <ActionButton icon={<FaExchangeAlt size={22} />} text="Swap" />
          <ActionButton icon={<FaArrowUp size={22} />} text="Send" />
          <ActionButton icon={<FaArrowDown size={22} />} text="Receive" />
        </div>
      </div>

      {/* Smart Report Section */}
      {isAuthenticated && (
        <div className="p-4 bg-gray-800 rounded-lg">
          <h2 className="text-2xl font-semibold">Smart Report</h2>
          {reportLoading ? (
            <div className="flex justify-center items-center h-24">
              <div className="loader"></div>
            </div>
          ) : reportError ? (
            <p className="text-red-500">{smartReport}</p>
          ) : (
            <div className="p-3 bg-gray-700 rounded-md mt-2">
              <p className="text-gray-300">{smartReport}</p>
            </div>
          )}
        </div>
      )}

      {/* Transactions Section */}
      {isAuthenticated && (
        <div className="p-4">
          <h2 className="text-2xl font-semibold mb-2">Recent Transactions</h2>
          {loading ? (
            <div className="flex justify-center items-center h-24">
              <div className="w-12 h-12 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
            </div>
          ) : transactions.length > 0 ? (
            <ul className="mt-4 bg-gray-800 p-4 rounded-lg">
              {transactions.map((tx: any, index: number) => (
                <li key={index} className="border-b border-gray-700 p-2">
                  <p className="text-gray-300">Tx ID: {tx.id}</p>
                  <p className="text-green-400">From: {tx.from}</p>
                  <p className="text-red-400">To: {tx.to}</p>
                  <p className="text-gray-400">
                    Value: {parseFloat(tx.value) / 1e18} ETH
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No transactions found.</p>
          )}
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

const BottomNavButton = ({
  icon,
  text,
}: {
  icon: ReactElement;
  text: string;
}) => (
  <div className="flex flex-col items-center hover:text-white">
    {icon}
    <span className="text-xs mt-1">{text}</span>
  </div>
);

export default HomePage;
