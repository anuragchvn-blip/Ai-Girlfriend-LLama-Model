import { useState } from "react";

export default function Home() {
  const [chatHistory, setChatHistory] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleInput = async () => {
    let localChatHistory = [...chatHistory];
    localChatHistory.push({ sender: "Me", text: inputText });
    setChatHistory(localChatHistory);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/gf-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: inputText }),
      });

      const { reply } = await response.json();
      localChatHistory.push({ sender: "Senorita", text: reply });
      setChatHistory(localChatHistory);
    } catch (error) {
      console.error("AI conversation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center ${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"}`}>
      <button
        onClick={toggleDarkMode}
        className={`absolute top-4 right-4 p-2 rounded-full ${isDarkMode ? "bg-gray-600 text-white" : "bg-gray-200 text-black"}`}
      >
        {isDarkMode ? "☀️" : "🌕"}
      </button>
      <h1 className="text-3xl font-semibold mb-6">AI Girlfriend Companion</h1>
      <div className={`chat-container ${isDarkMode ? "bg-gray-700" : "bg-white"} rounded-lg shadow-md p-4 w-80 h-96 overflow-y-auto`}>
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`chat-message mb-2 p-2 rounded ${message.sender === "Senorita" ? (isDarkMode ? "bg-blue-900" : "bg-blue-100") : (isDarkMode ? "bg-green-900 self-end" : "bg-green-100 self-end")}`}
          >
            <span className={`block font-semibold ${isDarkMode ? "text-white" : "text-black"}`}>
              {message.sender === "Senorita" ? "Senorita" : "Me"}:
            </span>{" "}
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-container mt-4 flex items-center w-80">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Start a conversation..."
          className={`flex-grow border rounded-l-md p-2 ${isDarkMode ? "bg-gray-600 text-white border-gray-500" : "bg-white text-black border-gray-300"}`}
        />
        <button
          onClick={handleInput}
          className={`bg-blue-500 text-white px-4 py-2 rounded-r-md ${isLoading ? "bg-gray-300" : "bg-blue-500"} ${isLoading ? "cursor-not-allowed" : ""}`}
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
