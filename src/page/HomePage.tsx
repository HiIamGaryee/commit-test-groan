import React, { useEffect, useState, ReactElement } from "react";
import { FaUserCircle, FaBell, FaGlobe, FaPlus, FaExchangeAlt, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { AiOutlinePieChart, AiOutlineFileText, AiOutlineSetting } from "react-icons/ai";

// Mock Data (Temporary)
const MOCK_WALLET_DATA = {
  data: {
    transfers: [
      {
        id: "0xabc123-1",
        from: "0xAnotherWalletAddress",
        to: "0xCoinbaseWalletAddress",
        value: "500000000000000000",
        timestamp: "1675560000",
      },
      {
        id: "0xdef456-2",
        from: "0xCoinbaseWalletAddress",
        to: "0xYetAnotherAddress",
        value: "1000000000000000000",
        timestamp: "1675550000",
      },
    ],
  },
};

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [walletData, setWalletData] = useState<any>(null);

  useEffect(() => {
    setTimeout(() => {
      setWalletData(MOCK_WALLET_DATA);
      setLoading(false);
    }, 2000); // Simulating API delay
  }, []);

  return (
    <div className="bg-neutral-900 text-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <FaUserCircle size={28} />
          <span className="text-lg font-semibold">earlgraceorange.cb.id</span>
        </div>
        <div className="flex gap-4">
          <FaGlobe size={20} />
          <FaBell size={20} />
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

      {/* Transactions Section */}
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-2">Recent Transactions</h2>
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <div className="w-12 h-12 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
          </div>
        ) : walletData?.data?.transfers ? (
          <ul className="mt-4 bg-gray-800 p-4 rounded-lg">
            {walletData.data.transfers.map((tx: any, index: number) => (
              <li key={index} className="border-b border-gray-700 p-2">
                <p className="text-gray-300">Tx ID: {tx.id}</p>
                <p className="text-green-400">From: {tx.from}</p>
                <p className="text-red-400">To: {tx.to}</p>
                <p className="text-gray-400">Value: {tx.value}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No transactions found.</p>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-around py-4 border-t border-gray-700 bg-gray-800 text-gray-400">
        <BottomNavButton icon={<AiOutlinePieChart size={24} />} text="Assets" />
        <BottomNavButton icon={<AiOutlineFileText size={24} />} text="Transactions" />
        <BottomNavButton icon={<AiOutlineSetting size={24} />} text="Settings" />
      </div>
    </div>
  );
};

// Action Buttons for Buy, Swap, Send, Receive
const ActionButton = ({ icon, text }: { icon: ReactElement; text: string }) => (
  <div className="flex flex-col items-center text-gray-300 hover:text-white">
    <div className="bg-gray-700 p-3 rounded-full">{icon}</div>
    <span className="mt-1 text-sm">{text}</span>
  </div>
);

// Bottom Navigation Buttons
const BottomNavButton = ({ icon, text }: { icon: ReactElement; text: string }) => (
  <div className="flex flex-col items-center hover:text-white">
    {icon}
    <span className="text-xs mt-1">{text}</span>
  </div>
);

export default HomePage;
