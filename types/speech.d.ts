declare global {
  interface SpeechRecognition {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    start(): void;
    stop(): void;
    onresult: ((e: SpeechRecognitionEvent) => any) | null;
    onerror: ((e: any) => any) | null;
    onend: (() => any) | null;
  }

  interface SpeechRecognitionStatic {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
  }

  interface SpeechRecognitionEvent extends Event {
    results: any;
  }

  var SpeechRecognition: SpeechRecognitionStatic | undefined;
  var webkitSpeechRecognition: SpeechRecognitionStatic | undefined;
}

export {};
