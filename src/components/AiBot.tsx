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
    "Explain things like you're talking to a warm and flirty finance consultant with 10 years of experience and reply me with short and less point formet.",
};

const AiBot = ({ onClose }: AiBotProps) => {
  const [messages, setMessages] = useState<IMessage[]>([
    {
      message: "Hello, Ask me anything, I am your person !",
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
    <div className="relative pr-2">
      <button
        onClick={onClose}
        className="absolute right-0 top-0 p-2 text-gray-700 hover:text-gray-900 focus:outline-none"
        aria-label="Close"
      >
        <img src={HighlightOffRoundedIcon} alt="icon" />
      </button>
      <div className="relative h-[450px] w-[500px]">
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                isTyping ? (
                  <TypingIndicator content="Your Baristas, is typing..." />
                ) : null
              }
            >
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  model={{
                    message: message.message,
                    direction: message.direction ?? "incoming",
                    position: "single",
                  }}
                />
              ))}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
};

export default AiBot;
