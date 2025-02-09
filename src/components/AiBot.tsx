import React, { useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message as ChatMessage,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import HighlightOffRoundedIcon from "../assets/icon-nav-home.svg";

interface IMessage {
  message: string;
  sender: string;
  direction?: "incoming" | "outgoing";
}

interface AiBotProps {
  onClose: () => void;
}

const AiBotUrl = process.env.REACT_APP_AIBOT_API_KEY;

const systemMessage = {
  role: "system",
  content:
    "Explain things like you're talking to a warm and flirty finance consultant with 10 years of experience and reply with short and engaging responses.",
};

const AiBot = ({ onClose }: AiBotProps) => {
  const [messages, setMessages] = useState<IMessage[]>([
    {
      message: "Hello! Ask me anything, I’m your personal finance buddy! 💖",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message: string) => {
    const newMessage: IMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages: IMessage[]) {
    let apiMessages = chatMessages.map((messageObject) => {
      return {
        role: messageObject.sender === "ChatGPT" ? "assistant" : "user",
        content: messageObject.message,
      };
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AiBotUrl}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
          },
        ]);
        setIsTyping(false);
      });
  }

  return (
    <div className="relative p-4 bg-white shadow-lg rounded-xl w-[500px] h-[550px] border border-gray-300">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 p-2 text-gray-700 hover:text-red-500 transition"
        aria-label="Close"
      >
        <img src={HighlightOffRoundedIcon} alt="Close" className="w-6 h-6" />
      </button>
      <div className="relative h-[480px] w-full rounded-lg overflow-hidden">
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                isTyping ? (
                  <TypingIndicator content="Your finance buddy is typing... 💬" />
                ) : null
              }
              className="p-4"
            >
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  model={{
                    message: message.message,
                    direction: message.direction ?? "incoming",
                    position: "single",
                  }}
                  className={`p-2 rounded-lg shadow-md ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white self-end"
                      : "bg-gray-200 text-gray-800"
                  }`}
                />
              ))}
            </MessageList>
            <MessageInput
              placeholder="Type your message here..."
              onSend={handleSend}
              className="rounded-lg border-gray-300 focus:border-blue-500"
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
};

export default AiBot;
