require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const OpenAI = require("openai");

const app = express();
app.use(express.json());
app.use(cors());

const GRAPH_API_URL = "https://thegraph.com/studio/subgraph/committestgroan/";
const openai = new OpenAI({ apiKey: process.env.REACT_APP_AIBOT_API_KEY });

// Fetch wallet data from The Graph API
const fetchWalletData = async (walletAddress) => {
    try {
        const query = {
            query: `
      {
        wallet(id: "${walletAddress}") {
          transactions {
            id
            value
            gasUsed
            timestamp
          }
        }
      }
    `,
        };

        const response = await axios.post(GRAPH_API_URL, query);
        return response.data?.data?.wallet?.transactions || [];
    } catch (error) {
        console.error("Graph API request failed:", error);
        return [];
    }
};

// Generate AI-powered Smart Report
const generateSmartReport = async (transactions) => {
    try {
        if (!transactions.length) return "No transactions found.";

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content:
                        "Analyze the given wallet transaction data and generate a financial security report. Assign security marks, detect suspicious activities, and provide AI-driven recommendations.",
                },
                {
                    role: "user",
                    content: JSON.stringify(transactions),
                },
            ],
        });

        return response.choices[0]?.message?.content || "No response from AI.";
    } catch (error) {
        console.error("Error generating AI report:", error);
        return "Error generating report.";
    }
};

// Endpoint: Generate AI Smart Report
app.post("/generate-report", async (req, res) => {
    const { walletAddress } = req.body;
    if (!walletAddress) return res.status(400).json({ error: "Wallet address required" });

    try {
        const transactions = await fetchWalletData(walletAddress);
        const report = await generateSmartReport(transactions);
        res.json({ report });
    } catch (error) {
        console.error("Error generating smart report:", error);
        res.status(500).json({ error: "Failed to generate report." });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
