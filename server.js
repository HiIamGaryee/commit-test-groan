import React, { useEffect, useState, ReactElement } from "react";
import {
    FaUserCircle, FaBell, FaGlobe, FaPlus, FaExchangeAlt,
    FaArrowUp, FaArrowDown, FaSignOutAlt
} from "react-icons/fa";
import { AiOutlinePieChart, AiOutlineFileText, AiOutlineSetting } from "react-icons/ai";
import { usePrivy } from "@privy-io/react-auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GRAPH_API_URL = "https://api.thegraph.com/subgraphs/name/YOUR_GRAPH";
const AI_REPORT_API_URL = "http://localhost:5000/generate-report";

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { authenticated, logout } = usePrivy();
    const [walletAddress, setWalletAddress] = useState < string | null > (null);
    const [transactions, setTransactions] = useState < any[] > ([]);
    const [smartReport, setSmartReport] = useState < string > ("Loading report...");
    const [loading, setLoading] = useState(true);
    const [reportError, setReportError] = useState(false);
    const [loginMethod, setLoginMethod] = useState < string | null > (null);
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
                const query = { query: `{ wallet(id: "${walletAddress}") { transactions { id from to value timestamp } } }` };
                const response = await axios.post(GRAPH_API_URL, query);
                let walletData = response.data?.data?.wallet;

                if (!walletData || !walletData.transactions.length) {
                    console.warn("No transactions found, using mock data.");
                    // Mock transaction data
                    walletData = {
                        transactions: [
                            { id: "0xabcd1234...", from: "0x1234...ABCD", to: "0x5678...WXYZ", value: "1.5 ETH", timestamp: "1675560000" },
                            { id: "0x9876efgh...", from: "0x5678...WXYZ", to: "0x1234...ABCD", value: "0.3 ETH", timestamp: "1675550000" },
                        ],
                    };
                }
                setTransactions(walletData.transactions);
            } catch (error) {
                console.error("Transaction API Error:", error);
            }

            // Fetch AI-generated Smart Report
            try {
                setReportLoading(true);
                const mockReportData = {
                    walletAddress,
                    overallHealthScore: 75,
                    suspiciousFindings: ["Unusual gas fees detected", "Large transaction to unknown contract"],
                    securityTips: ["Consider using a hardware wallet", "Enable two-factor authentication"],
                    aiInsights: ["Your wallet has interacted with a high-risk contract."],
                };

                const reportResponse = await axios.post(AI_REPORT_API_URL, mockReportData);
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
                        <button onClick={handleLogout} className="neon-button bg-red-600 hover:bg-red-700 px-4 py-1 rounded">
                            <FaSignOutAlt size={16} className="inline-block mr-1" />
                            Logout
                        </button>
                    )}
                </div>
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
            <div className="p-4 bg-gray-800 rounded-lg">
                <h2 className="text-2xl font-semibold">Smart Report</h2>
                {reportLoading ? <div className="loader"></div> : reportError ? <p className="text-red-500">{smartReport}</p> : <p>{smartReport}</p>}
            </div>

            {/* Transactions Section */}
            <div className="p-4">
                <h2 className="text-2xl font-semibold mb-2">Recent Transactions</h2>
                {transactions.length > 0 ? (
                    <ul className="mt-4 bg-gray-800 p-4 rounded-lg">
                        {transactions.map((tx: any, index: number) => (
                            <li key={index} className="border-b border-gray-700 p-2">
                                <p className="text-gray-300">Tx ID: {tx.id}</p>
                                <p className="text-green-400">From: {tx.from}</p>
                                <p className="text-red-400">To: {tx.to}</p>
                                <p className="text-gray-400">Value: {parseFloat(tx.value) / 1e18} ETH</p>
                            </li>
                        ))}
                    </ul>
                ) : <p className="text-gray-400">No transactions found.</p>}
            </div>
        </div>
    );
};

export default HomePage;
