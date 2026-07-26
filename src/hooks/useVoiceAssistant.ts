'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface VoiceAssistantProps {
  onCommand: (command: string) => void;
  language: string;
}

export function useVoiceAssistant({ onCommand, language: initialLanguage }: Partial<VoiceAssistantProps> = {}) {
  const [language, setLanguage] = useState(initialLanguage || 'en-IN');
  const [response, setResponse] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      if (onCommand) onCommand(text.toLowerCase());
    };

    recognition.onerror = (event: any) => {
      setError(event.error);
      setIsListening(false);
    };

    recognition.start();
  }, [language, onCommand]);

  const speak = (text: string, lang: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  return { 
    isListening, 
    transcript, 
    response, 
    error, 
    startListening, 
    stopListening, 
    speak,
    language,
    setLanguage
  };
}
