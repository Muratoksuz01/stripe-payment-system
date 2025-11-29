import React, { useState } from "react";
type Message = {
  sender: "user" | "ai";
  text: string;
};
function AıComponent({email}:any) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  // Mesaj gönder
  const sendMessage = async () => {
    if (!prompt.trim()) return;

    const userMessage = { sender: "user"as const, text: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");

    try {
      const res = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          email: email
        }),
      });

      const data = await res.json();
      const aiMessage = { sender: "ai"as const, text: data.data || "Boş cevap" };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      const aiMessage = { sender: "ai"as const, text: "Sunucu hatası" };
      setMessages((prev) => [...prev, aiMessage]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      <div className="relative group">
        <button
          onClick={() => setOpen(!open)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          🤖
        </button>

        {/* Tooltip */}
        <div className="absolute right-14 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition bg-black text-white px-3 py-2 rounded-md text-sm whitespace-nowrap">
          özel Aı destekçiniz — bana istediğinizi sorabilirsiniz
        </div>
      </div>

      {/* Açılır Chat Penceresi */}
      {open && (
        <div className="w-80 h-96 bg-white shadow-xl rounded-lg p-3 mt-3 flex flex-col border">
          <div className="font-semibold text-gray-700 border-b pb-2 mb-2">
            Aı Destek
          </div>

          {/* Mesajlar */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 max-w-[70%] rounded-md text-sm ${
                  msg.sender === "user"
                    ? "ml-auto bg-yellow-300"
                    : "mr-auto bg-green-300"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 border rounded-md px-2 py-1"
              placeholder="Mesaj yaz..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-3 rounded-md"
            >
              Gönder
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AıComponent;
