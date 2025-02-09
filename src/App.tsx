import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./global.css";
import HomePage from "./page/HomePage";
import TransactionsPage from "./page/TransactionsPage"; // ✅ Import TransactionsPage
import MainPage from "./page/MainPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;

// function App() {
// return (
//   <div className="App">
//     <header className="App-header">
//       <img src={logo} className="App-logo" alt="logo" />
//       <p className="text-rose-500">
//         Edit <code>src/App.tsx</code> and save to reload.
//       </p>
//       <p className="text-rose-500 bg-blue-200 p-5 border-4 border-gray-600">
//         Edit <code>src/App.tsx</code> and save to reload.
//       </p>
//       <a
//         className="App-link"
//         href="https://reactjs.org"
//         target="_blank"
//         rel="noopener noreferrer"
//       >
//         Learn React
//       </a>
//     </header>
//   </div>
// );
// }
