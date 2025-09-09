import React, { useCallback } from 'react';
import { useVoice } from '@/hooks/use-voice';
import { useSpeechSynthesis } from '@/hooks/use-speech-synthesis';
import { processVoiceCommand } from '@/lib/speech';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

export function FloatingVoiceButton() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { speak } = useSpeechSynthesis();

  const handleVoiceResult = useCallback((transcript: string) => {
    const command = processVoiceCommand(transcript);
    handleVoiceCommand(command, transcript);
  }, []);

  const handleVoiceError = useCallback((error: string) => {
    toast({
      title: "Voice Error",
      description: `Speech recognition error: ${error}`,
      variant: "destructive",
    });
  }, [toast]);

  const { isListening, isSupported, toggleListening } = useVoice({
    onResult: handleVoiceResult,
    onError: handleVoiceError,
  });

  const handleVoiceCommand = (command: any, transcript: string) => {
    speak(`I heard: ${transcript}`);
    
    switch (command.intent) {
      case 'scan_disease':
        setLocation('/scan');
        speak('Opening disease scanner');
        break;
      case 'market_price':
        setLocation('/market');
        if (command.entity) {
          speak(`Checking ${command.entity} prices`);
        } else {
          speak('Opening market prices');
        }
        break;
      case 'government_scheme':
        setLocation('/schemes');
        speak('Opening government schemes');
        break;
      case 'weather':
        setLocation('/weather');
        speak('Checking weather information');
        break;
      default:
        speak('I can help you with crop scanning, market prices, government schemes, or weather information. What would you like to know?');
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <button
      onClick={toggleListening}
      className={`fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-50 transition-all duration-200 ${
        isListening 
          ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
          : 'bg-harvest-orange hover:bg-orange-600'
      } text-white`}
    >
      <i className={`fas ${isListening ? 'fa-stop' : 'fa-microphone'} text-xl`}></i>
    </button>
  );
}
