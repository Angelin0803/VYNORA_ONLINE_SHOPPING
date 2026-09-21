import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X, Sparkles, Volume2 } from 'lucide-react';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({ isOpen, onClose, onSearch }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
      setTranscript('');
      setErrorNotice(null);
      return;
    }

    // Check Web Speech API support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorNotice('Voice recognition is not supported in this browser. Please try Chrome or Edge, or select a sample phrase below.');
      return;
    }

    let recognition: any;
    try {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorNotice(null);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const resultText = event.results[current][0].transcript;
        setTranscript(resultText);

        if (event.results[current].isFinal) {
          setTimeout(() => {
            onSearch(resultText);
            onClose();
          }, 800);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorNotice('Microphone access was denied. You can enable it or tap any quick suggestion below.');
        } else {
          setErrorNotice('Could not catch your voice. Please speak again or tap a suggestion.');
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setErrorNotice('Could not start microphone. You can tap a suggestion below.');
      setIsListening(false);
    }

    return () => {
      if (recognition) {
        try {
          recognition.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const quickVoicePrompts = [
    'Banarasi Silk Saree',
    'Chunky White Sneakers',
    'Niacinamide Face Serum',
    'AMOLED Smartwatch',
    'Kids Cotton T-shirt',
    'Running Shoes Under 2000'
  ];

  return (
    <div id="voice-search-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div id="voice-search-modal-card" className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 text-center border border-slate-100">
        <button
          id="btn-close-voice-search"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center mb-6 mt-2">
          <div className="relative">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
              isListening ? 'bg-rose-50 border-4 border-rose-500 shadow-xl shadow-rose-200' : 'bg-slate-100'
            }`}>
              {isListening ? (
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-28 h-28 rounded-full border border-rose-400 animate-ping opacity-50" />
                  <Mic className="w-10 h-10 text-rose-600 animate-pulse" />
                </div>
              ) : (
                <MicOff className="w-10 h-10 text-slate-400" />
              )}
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-1">
          {isListening ? 'Listening to you...' : 'Voice Search Vynora'}
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Say what you want to buy (e.g., &quot;Nike running shoes&quot; or &quot;silk kurta&quot;)
        </p>

        {transcript && (
          <div className="p-3 bg-rose-50/70 border border-rose-200/80 rounded-xl mb-4 text-slate-800 font-medium flex items-center justify-center gap-2">
            <Volume2 className="w-4 h-4 text-rose-600 shrink-0" />
            <span>&quot;{transcript}&quot;</span>
          </div>
        )}

        {errorNotice && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4 text-xs text-amber-800 text-left">
            {errorNotice}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-slate-100 text-left">
          <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Or tap a popular search</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickVoicePrompts.map(prompt => (
              <button
                key={prompt}
                id={`btn-voice-prompt-${prompt.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => {
                  onSearch(prompt);
                  onClose();
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 border border-transparent rounded-full text-xs font-medium text-slate-700 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
