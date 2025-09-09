export interface SpeechConfig {
  language: string;
  rate: number;
  pitch: number;
  volume: number;
}

export const defaultSpeechConfig: SpeechConfig = {
  language: 'en-IN',
  rate: 1,
  pitch: 1,
  volume: 1,
};

export const languageVoiceMap: Record<string, string> = {
  'en': 'en-IN',
  'hi': 'hi-IN',
  'kn': 'kn-IN',
  'te': 'te-IN',
};

export function getVoiceForLanguage(language: string): string {
  return languageVoiceMap[language] || 'en-IN';
}

export function processVoiceCommand(transcript: string): {
  intent: string;
  entity?: string;
  confidence: number;
} {
  const lowerTranscript = transcript.toLowerCase();
  
  // Disease scanning intents
  if (lowerTranscript.includes('scan') || lowerTranscript.includes('disease') || lowerTranscript.includes('crop')) {
    return { intent: 'scan_disease', confidence: 0.9 };
  }
  
  // Market price intents
  if (lowerTranscript.includes('price') || lowerTranscript.includes('market') || lowerTranscript.includes('rate')) {
    const crops = ['tomato', 'onion', 'rice', 'wheat', 'maize'];
    const foundCrop = crops.find(crop => lowerTranscript.includes(crop));
    return { 
      intent: 'market_price', 
      entity: foundCrop,
      confidence: foundCrop ? 0.9 : 0.7 
    };
  }
  
  // Scheme intents
  if (lowerTranscript.includes('scheme') || lowerTranscript.includes('subsidy') || lowerTranscript.includes('government')) {
    return { intent: 'government_scheme', confidence: 0.8 };
  }
  
  // Weather intents
  if (lowerTranscript.includes('weather') || lowerTranscript.includes('rain') || lowerTranscript.includes('temperature')) {
    return { intent: 'weather', confidence: 0.8 };
  }
  
  // General query
  return { intent: 'general_query', confidence: 0.5 };
}
