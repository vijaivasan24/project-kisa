import { useState, useCallback, useEffect } from 'react';

interface UseSpeechSynthesisOptions {
  voice?: SpeechSynthesisVoice;
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
}

export function useSpeechSynthesis(options: UseSpeechSynthesisOptions = {}) {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      
      const updateVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        setVoices(availableVoices);
      };
      
      updateVoices();
      speechSynthesis.addEventListener('voiceschanged', updateVoices);
      
      return () => {
        speechSynthesis.removeEventListener('voiceschanged', updateVoices);
      };
    }
  }, []);

  const speak = useCallback((text: string, customOptions?: UseSpeechSynthesisOptions) => {
    if (!isSupported) {
      console.warn('Speech synthesis is not supported');
      return;
    }

    // Stop any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply options
    const finalOptions = { ...options, ...customOptions };
    
    if (finalOptions.voice) {
      utterance.voice = finalOptions.voice;
    } else if (finalOptions.lang) {
      // Find a voice that matches the language
      const matchingVoice = voices.find(voice => voice.lang.startsWith(finalOptions.lang!));
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }
    }
    
    utterance.rate = finalOptions.rate ?? 1;
    utterance.pitch = finalOptions.pitch ?? 1;
    utterance.volume = finalOptions.volume ?? 1;
    utterance.lang = finalOptions.lang ?? 'en-IN';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  }, [isSupported, voices, options]);

  const stop = useCallback(() => {
    if (isSupported) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  const pause = useCallback(() => {
    if (isSupported) {
      speechSynthesis.pause();
    }
  }, [isSupported]);

  const resume = useCallback(() => {
    if (isSupported) {
      speechSynthesis.resume();
    }
  }, [isSupported]);

  return {
    isSupported,
    isSpeaking,
    voices,
    speak,
    stop,
    pause,
    resume,
  };
}
