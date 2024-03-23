import React, { useEffect, useState } from "react";
import "./Chatbot.css";

function ChatBot() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [apiKey, setApiKey] = useState<string>("");

  async function sendMessage() {
    const userMessage = { content: text, type: "outgoing" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setText("");

    const url = "https://api.openai.com/v1/chat/completions";
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    headers.append("Authorization", `Bearer ${apiKey}`);

    if (!apiKey) {
      const confirmRedirect = window.confirm(
        "API key is not provided. Do you want to navigate to the settings page?"
      );
      if (confirmRedirect) {
        window.location.href = "/settings";
      }
      return;
    }
    const requestData = {
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: text,
        },
      ],
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();
      const botReply = responseData.choices[0].message.content;
      const botMessage = { content: botReply, type: "incoming" };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    // Retrieve API key from local storage when component mounts
    const storedAPIKey = localStorage.getItem("APIKey");
    if (storedAPIKey) {
      setApiKey(storedAPIKey);
    }
  }, []);

  useEffect(() => {
    const chatbotToggler = document.querySelector(".chatbot-toggler");
    const toggleChatbot = () => {
      document.body.classList.toggle("show-chatbot");
    };

    if (chatbotToggler) {
      chatbotToggler.addEventListener("click", toggleChatbot);
    }

    return () => {
      if (chatbotToggler) {
        chatbotToggler.removeEventListener("click", toggleChatbot);
      }
    };
  }, []);

  useEffect(() => {
    const chatbotCloseBtn = document.querySelector(".close-btn");
    const closechatbot = () => {
      document.body.classList.remove("show-chatbot");
    };

    if (chatbotCloseBtn) {
      chatbotCloseBtn.addEventListener("click", closechatbot);
    }

    return () => {
      if (chatbotCloseBtn) {
        chatbotCloseBtn.removeEventListener("click", closechatbot);
      }
    };
  }, []);

  return (
    <div>
      <button className="chatbot-toggler">
        <span className="material-symbols-outlined">mode_comment</span>
        <span className="material-symbols-outlined">close</span>
      </button>
      <div className="chatbot">
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <script src="script.js" defer></script>
        <header>
          <h2>Chatbot</h2>
          <span className="close-btn material-symbols-outlined">close</span>
        </header>
        <ul className="chatbox">
          <li className="chat incoming">
            <span className="material-symbols-outlined">smart_toy</span>
            <p>Hello! How can I assist you today?</p>
          </li>
          {messages.map((message, index) => (
            <li key={index} className={`chat ${message.type}`}>
              {message.type === "incoming" && (
                <span className="material-symbols-outlined">smart_toy</span>
              )}
              <p>{message.content}</p>
            </li>
          ))}
        </ul>
        <div className="chat-input">
          <textarea
            placeholder="Enter a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          ></textarea>
          <button
            id="send-btn"
            className="material-symbols-outlined"
            onClick={sendMessage}
          >
            send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
