import React, { useState } from "react";
import "./Settings.css";
import ChatBot from "../../components/chat/Chatbot";
import { useNavigate } from "react-router-dom";
import Nav from "../../components/navbar/Navbar";

const Settings = () => {
  const navigate = useNavigate();
  const [APIKey, setAPIKey] = useState<string>("");
  const [apiKeyValid, setApiKeyValid] = useState<boolean>(false);

  // Function to handle opening chatbot and storing API key
  function openChatbot() {
    if (APIKey.trim() !== "") {
      setApiKeyValid(true);
      // Store API key in local storage
      localStorage.setItem("APIKey", APIKey);
    } else {
      alert("Please enter a valid API key.");
    }
  }

  // Function to handle input change for API key
  function handleAPIKeyInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setAPIKey(event.target.value);
  }

  return (
    <>
    <Nav/>
    <div className="settings">
      <h3>Enter your API key</h3>
      <div className="API-key-input-and-submit-button">
        <input
          type="text"
          value={APIKey}
          onChange={handleAPIKeyInputChange}
        />
        <button
          onClick={openChatbot}
        >
          Submit
        </button>
      </div>
      {apiKeyValid && <ChatBot apikey={APIKey} />}
    </div>
    </>
  );
};

export default Settings;
