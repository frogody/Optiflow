"use client";
import { useSession, signIn } from "next-auth/react";
import { useRef, useState, useEffect } from "react";
import { Room } from "livekit-client";

export default function VoiceAgentPage() {
  const { data: session, status } = useSession();
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState<{ from: "user" | "bot", text: string }[]>([]);
  const recognitionRef = useRef<any>(null);
  const [lkStatus, setLkStatus] = useState<string>("Connecting to LiveKit...");
  const [lkError, setLkError] = useState<string | null>(null);
  const [lkRoom, setLkRoom] = useState<Room | null>(null);
  const [debug, setDebug] = useState<string[]>([]);

  // LiveKit connect on mount
  useEffect(() => {
    let room: Room | null = null;
    async function connectLiveKit() {
      setLkStatus("Connecting to LiveKit...");
      setLkError(null);
      setDebug(d => [...d, `[${new Date().toISOString()}] Connecting to /api/livekit/token...`]);
      try {
        const res = await fetch("/api/livekit/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ room: "voice-agent" }),
        });
        setDebug(d => [...d, `[${new Date().toISOString()}] /api/livekit/token status: ${res.status}`]);
        if (!res.ok) {
          const errText = await res.text();
          setDebug(d => [...d, `[${new Date().toISOString()}] /api/livekit/token error: ${errText}`]);
          throw new Error(`Token error: ${res.status} - ${errText}`);
        }
        const { token, url } = await res.json();
        setDebug(d => [...d, `[${new Date().toISOString()}] Got token and url: ${!!token}, ${url}`]);
        room = new Room();
        await room.connect(url, token);
        setLkRoom(room);
        setLkStatus("Connected to LiveKit");
        setDebug(d => [...d, `[${new Date().toISOString()}] Connected to LiveKit room.`]);
      } catch (err: any) {
        setLkError(err.message || "Failed to connect to LiveKit");
        setLkStatus("LiveKit connection failed");
        setDebug(d => [...d, `[${new Date().toISOString()}] LiveKit connection error: ${err.message}`]);
      }
    }
    connectLiveKit();
    return () => {
      if (room) room.disconnect();
    };
  }, []);

  function speak(text: string) {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  }

  async function startRecognition() {
    if (typeof window === "undefined" || !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessages(msgs => [...msgs, { from: "user", text: transcript }]);
      setListening(false);

      setDebug(d => [...d, `[${new Date().toISOString()}] Sending to /api/chat: ${transcript}`]);
      // Send to API
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: transcript }),
      });
      setDebug(d => [...d, `[${new Date().toISOString()}] /api/chat status: ${res.status}`]);
      const data = await res.json();
      setMessages(msgs => [...msgs, { from: "bot", text: data.reply }]);
      setDebug(d => [...d, `[${new Date().toISOString()}] Bot reply: ${data.reply}`]);
      speak(data.reply);
    };

    recognition.onerror = (e: any) => {
      setListening(false);
      setDebug(d => [...d, `[${new Date().toISOString()}] Speech recognition error: ${e.error}`]);
      alert("Speech recognition error: " + e.error);
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <button onClick={() => signIn()}>Sign in</button>;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
      <div style={{ marginBottom: 16 }}>
        <b>LiveKit status:</b> {lkStatus}
        {lkError && <div style={{ color: 'red' }}>{lkError}</div>}
      </div>
      <h1>Voice Agent</h1>
      <button onClick={startRecognition} disabled={listening} style={{ marginBottom: 16 }}>
        {listening ? "Listening..." : "Speak"}
      </button>
      <div id="chat-box" style={{ marginTop: 20 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.from === "user" ? "right" : "left", margin: "8px 0" }}>
            <b>{msg.from === "user" ? "You" : "Bot"}:</b> {msg.text}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 32, background: '#222', color: '#fff', padding: 12, borderRadius: 8, fontSize: 12 }}>
        <b>Debug Log:</b>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{debug.join("\n")}</pre>
      </div>
    </div>
  );
}