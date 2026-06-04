"use client";
import { useState, useRef } from "react";
import { Mic, MicOff } from "lucide-react";
import { useLang } from "./LanguageContext";
import clsx from "clsx";

interface Props {
  onResult: (amount: number | null, text: string) => void;
}

// Try to extract amount from spoken text (Thai & English)
function extractAmount(text: string): number | null {
  // Match patterns like "50 บาท", "50.5", "ห้าสิบ"
  const match = text.match(/(\d[\d,]*\.?\d*)/);
  if (match) return parseFloat(match[1].replace(",", ""));
  return null;
}

export default function VoiceInput({ onResult }: Props) {
  const { t, lang } = useLang();
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recRef = useRef<SpeechRecognition | null>(null);

  const supported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const toggle = () => {
    if (!supported) return;

    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }

    const SR =
      (window as unknown as { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition })
        .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognition })
        .webkitSpeechRecognition;

    if (!SR) return;

    const rec = new SR();
    rec.lang = lang === "th" ? "th-TH" : "en-US";
    rec.continuous = false;
    rec.interimResults = true;

    rec.onresult = (e: SpeechRecognitionEvent) => {
      const result = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join(" ");
      setTranscript(result);

      if (e.results[e.results.length - 1].isFinal) {
        const amount = extractAmount(result);
        onResult(amount, result);
        setListening(false);
      }
    };

    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);

    rec.start();
    recRef.current = rec;
    setListening(true);
    setTranscript("");
  };

  if (!supported) {
    return (
      <p className="text-sm text-gray-400 text-center py-4">{t("voiceNotSupported")}</p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <p className="text-sm text-gray-500 text-center">{t("voiceHint")}</p>

      <button
        onClick={toggle}
        className={clsx(
          "w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95",
          listening
            ? "bg-red-500 text-white animate-pulse"
            : "bg-green-500 text-white hover:bg-green-600"
        )}
      >
        {listening ? <MicOff size={32} /> : <Mic size={32} />}
      </button>

      <p className="text-xs text-gray-400">
        {listening ? t("stopRecording") : t("startRecording")}
      </p>

      {transcript && (
        <div className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-sm text-gray-700">
          &ldquo;{transcript}&rdquo;
        </div>
      )}
    </div>
  );
}
