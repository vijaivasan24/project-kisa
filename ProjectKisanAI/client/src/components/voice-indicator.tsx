interface VoiceIndicatorProps {
  isVisible: boolean;
  isListening: boolean;
}

export function VoiceIndicator({ isVisible, isListening }: VoiceIndicatorProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed top-20 right-4 z-50">
      <div className={`bg-harvest-orange text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 ${
        isListening ? 'animate-pulse' : ''
      }`}>
        <i className="fas fa-microphone"></i>
        <span className="text-sm font-medium">
          {isListening ? 'Listening...' : 'Voice Mode Active'}
        </span>
      </div>
    </div>
  );
}
