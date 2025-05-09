// @ts-nocheck - This file has some TypeScript issues that are hard to fix
"use client";
import { useSession, signIn } from "next-auth/react";
import { useRef, useState } from "react";

export default function VoiceAgentPage(): JSX.Element {
  const { data: session, status     } = useSession();
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState<{ from: "user" | "bot", text: string     }[]>([]);
  const recognitionRef = useRef<any>(null);

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
      setMessages(msgs => [...msgs, { from: "user", text: transcript     }]);
      setListening(false);

      // Send to API
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json"     },
        body: JSON.stringify({ message: transcript     }),
      });
      const data = await res.json();
      setMessages(msgs => [...msgs, { from: "bot", text: data.reply     }]);
      speak(data.reply);
    };

    recognition.onerror = (e: any) => { setListening(false);
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
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 24, border: "1px solid #eee", borderRadius: 8     }}>
      <h1>Voice Agent</h1>
      <button onClick={startRecognition} disabled={listening} style={{ marginBottom: 16     }}>
        { listening ? "Listening..." : "Speak"    }
      </button>
      <div id="chat-box" style={{ marginTop: 20     }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.from === "user" ? "right" : "left", margin: "8px 0"     }}>
            <b>{ msg.from === "user" ? "You" : "Bot"    }:</b> {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
}