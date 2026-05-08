import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Loader2, X, Play, Square, MessageSquare, Send, Bot, User } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

const SYSTEM_INSTRUCTION = `You are the AI Assistant for Parth K. Pandya, an MCA Operations specialist. 
Your goal is to answer questions about Parth's services, experience, and contact information.
Parth manages full-cycle operations for MCA and commercial lending firms, covering pre-underwriting to collections in US and Canada.
Key stats: 100+ deals managed/month live, 500+ commercial files processed, 10 years experience in MCA & alt-lending ops, 2 markets (US & Canada).
Tools/Systems: LendSaaS, Datamerch, Ocrolus, Encompass.
Contact info: 
- Email: workwithpaarthpandya@gmail.com
- WhatsApp/Phone: +91 909 969 0220
- LinkedIn: https://www.linkedin.com/in/parthpandya28/
- Calendly: https://calendly.com/workwithpaarthpandya/30min
Be concise, professional, and friendly, representing Parth's brand.`;

function base64ToFloat32(base64: string): Float32Array {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const pcm16 = new Int16Array(bytes.buffer);
  const float32 = new Float32Array(pcm16.length);
  for (let i = 0; i < pcm16.length; i++) {
    float32[i] = pcm16[i] / (pcm16[i] < 0 ? 0x8000 : 0x7fff);
  }
  return float32;
}

function convertFloat32ToPCM16Base64(float32Array: Float32Array): string {
  const pcm16 = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    let s = Math.max(-1, Math.min(1, float32Array[i]));
    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  const bytes = new Uint8Array(pcm16.buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function VoiceAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'voice'>('text');

  // Text Chat State
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: "Hi! I'm Parth's AI Assistant. How can I help you today?" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Voice State
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [agentSpeaking, setAgentSpeaking] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);

  const sessionRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  
  // Audio playback queue
  const nextPlayTimeRef = useRef<number>(0);

  // Scroll to bottom of chat
  useEffect(() => {
    if (activeTab === 'text') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  const handleSendText = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isTyping) return;

    const userMsg = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY is not defined");
      
      const ai = new GoogleGenAI({ apiKey });
      
      const historyMsg = messages.filter(m => m.text).map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const chat = ai.chats.create({
        model: "gemini-3.1-flash-preview",
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        }
      });
      
      // Simulate history by doing a single generateContent call if chats.create history isn't populated this way
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-preview',
        contents: [...historyMsg, { role: 'user', parts: [{ text: userMsg }] }],
        config: { systemInstruction: SYSTEM_INSTRUCTION }
      });
      
      if (response.text) {
        setMessages(prev => [...prev, { role: 'model', text: response.text! }]);
      }
    } catch (err) {
      console.error("Text chat error:", err);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const connectVoice = async () => {
    setIsConnecting(true);
    setMicError(null);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
         throw new Error("GEMINI_API_KEY is not defined");
      }
      
      const ai = new GoogleGenAI({ apiKey });

      // Init Web Audio
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioCtxRef.current = audioCtx;
      nextPlayTimeRef.current = audioCtx.currentTime;

      // Make connection
      const sessionPromise = ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        callbacks: {
          onopen: async () => {
            setIsConnected(true);
            setIsConnecting(false);
            
            // start mic capture
            try {
              const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: { sampleRate: 16000, channelCount: 1, echoCancellation: true, noiseSuppression: true } 
              });
              mediaStreamRef.current = stream;
              const source = audioCtx.createMediaStreamSource(stream);
              const processor = audioCtx.createScriptProcessor(4096, 1, 1);
              processorRef.current = processor;

              processor.onaudioprocess = (e) => {
                if (isMuted) return;
                const inputData = e.inputBuffer.getChannelData(0);
                const base64Data = convertFloat32ToPCM16Base64(inputData);
                
                sessionPromise.then(session => {
                  session.sendRealtimeInput({
                    audio: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
                  });
                });
              };

              source.connect(processor);
              processor.connect(audioCtx.destination);
              
              } catch (err: any) {
                console.error("Mic error:", err);
                if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                  setMicError("Microphone access denied. Please grant permission in your browser.");
                } else {
                  setMicError("Could not access microphone.");
                }
                if (sessionRef.current) {
                  sessionRef.current.close();
                  sessionRef.current = null;
                }
                setIsConnected(false);
                setIsConnecting(false);
              }
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              setAgentSpeaking(true);
              const audioCtx = audioCtxRef.current;
              if (audioCtx) {
                const float32Data = base64ToFloat32(base64Audio);
                // The output sample rate from model is 24000
                const audioBuffer = audioCtx.createBuffer(1, float32Data.length, 24000);
                audioBuffer.copyToChannel(float32Data, 0);
                
                const source = audioCtx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioCtx.destination);
                
                const time = Math.max(audioCtx.currentTime, nextPlayTimeRef.current);
                source.start(time);
                nextPlayTimeRef.current = time + audioBuffer.duration;
                
                source.onended = () => {
                   if (audioCtx.currentTime >= nextPlayTimeRef.current - 0.1) {
                     setAgentSpeaking(false);
                   }
                };
              }
            }
            if (message.serverContent?.interrupted) {
               // Stop playback logic 
               nextPlayTimeRef.current = audioCtxRef.current ? audioCtxRef.current.currentTime : 0;
               setAgentSpeaking(false);
            }
          },
          onclose: () => {
            setIsConnected(false);
            cleanupVoice();
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: SYSTEM_INSTRUCTION + " Keep responses very short for voice.",
        },
      });

      sessionRef.current = await sessionPromise;

    } catch (err) {
      console.error("Connection error:", err);
      setIsConnecting(false);
      setIsConnected(false);
    }
  };

  const cleanupVoice = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    setIsConnected(false);
    setAgentSpeaking(false);
    setIsConnecting(false);
  };

  const toggleVoiceConnection = () => {
    if (isConnected || isConnecting) {
      cleanupVoice();
    } else {
      connectVoice();
    }
  };

  useEffect(() => {
    if (activeTab === 'text') {
      cleanupVoice();
    }
  }, [activeTab]);

  useEffect(() => {
    return () => {
      cleanupVoice(); // on unmount
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="bg-white border border-brand-dark/10 rounded-2xl shadow-2xl w-[340px] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-brand-dark text-white p-4 flex justify-between items-center relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-display font-bold">AI Assistant</h3>
            </div>
            <button onClick={() => { setIsOpen(false); cleanupVoice(); }} className="text-white/70 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-brand-dark/10 bg-brand-bg/50">
            <button 
              onClick={() => setActiveTab('text')}
              className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'text' ? 'text-brand-accent border-b-2 border-brand-accent' : 'text-brand-dark/50 hover:text-brand-dark/80'}`}
            >
              <MessageSquare className="w-4 h-4" /> Text
            </button>
            <button 
              onClick={() => setActiveTab('voice')}
              className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'voice' ? 'text-brand-accent border-b-2 border-brand-accent' : 'text-brand-dark/50 hover:text-brand-dark/80'}`}
            >
              <Mic className="w-4 h-4" /> Voice
            </button>
          </div>
          
          {/* Content Area */}
          <div className="bg-white h-[360px] flex flex-col">
            {activeTab === 'text' ? (
              <>
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-brand-dark text-white' : 'bg-brand-accent text-white'}`}>
                        {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                      </div>
                      <div className={`text-[13px] px-3.5 py-2.5 rounded-2xl max-w-[80%] leading-relaxed ${msg.role === 'user' ? 'bg-brand-dark text-white rounded-tr-none' : 'bg-brand-bg text-brand-dark rounded-tl-none'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-brand-accent text-white flex items-center justify-center flex-shrink-0">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-[13px] px-4 py-3 rounded-2xl bg-brand-bg text-brand-dark rounded-tl-none flex items-center gap-1.5">
                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-brand-dark/40" />
                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-brand-dark/40" />
                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-brand-dark/40" />
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                
                {/* Text Input */}
                <form onSubmit={handleSendText} className="p-3 border-t border-brand-dark/10 flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-1 bg-brand-bg border border-brand-dark/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-accent"
                  />
                  <button 
                    type="submit" 
                    disabled={!inputText.trim() || isTyping}
                    className="bg-brand-accent text-white w-9 h-9 rounded-lg flex items-center justify-center disabled:opacity-50 hover:bg-[#a37c44] transition-colors"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </form>
              </>
            ) : (
              // Voice UI
              <div className="flex-1 flex flex-col items-center justify-center p-6 bg-brand-bg/30">
                <div className="flex-1 flex flex-col items-center justify-center w-full relative overflow-hidden rounded-xl bg-white border border-brand-dark/10 mb-6 py-8">
                  {isConnecting ? (
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 text-brand-accent animate-spin" />
                      <span className="text-sm font-medium text-brand-dark/70">Connecting...</span>
                    </div>
                  ) : isConnected ? (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          {/* Visualizer circles */}
                          {agentSpeaking && (
                            <>
                              <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                                className="absolute w-24 h-24 rounded-full bg-brand-primary"
                              />
                              <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: [1, 2.0, 1], opacity: [0.3, 0, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                                className="absolute w-24 h-24 rounded-full bg-brand-accent"
                              />
                              <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: [1, 2.4, 1], opacity: [0.2, 0, 0.2] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                                className="absolute w-24 h-24 rounded-full bg-brand-primary"
                              />
                            </>
                          )}
                      </div>
                      <div className="flex flex-col items-center gap-4 relative z-10">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${agentSpeaking ? 'bg-brand-primary text-white shadow-lg delay-100' : 'bg-brand-bg border border-brand-dark/10 text-brand-dark/50 transition-colors'}`}>
                          {agentSpeaking ? <Play fill="currentColor" className="w-6 h-6 ml-1" /> : <Mic className="w-6 h-6" />}
                        </div>
                        <span className="text-sm font-medium text-brand-dark/70">
                          {agentSpeaking ? 'Agent Speaking...' : 'Listening...'}
                        </span>
                      </div>
                    </>
                  ) : micError ? (
                    <div className="text-sm font-medium text-red-500 text-center flex flex-col items-center gap-2 px-4">
                      <MicOff className="w-6 h-6" />
                      {micError}
                    </div>
                  ) : (
                    <div className="text-sm font-medium text-brand-dark/50 text-center px-6">
                      Click the button below to start a live voice conversation.
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={toggleVoiceConnection}
                  className={`w-full h-12 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all ${isConnected || isConnecting ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100' : 'bg-brand-primary hover:bg-brand-primary-dark text-white shadow-md'}`}
                >
                  {isConnecting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Connecting...</>
                  ) : isConnected ? (
                    <><Square className="w-4 h-4" /> End Call</>
                  ) : (
                    <><Mic className="w-4 h-4" /> Start Voice Call</>
                  )}
                </button>
                {isConnected && (
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className={`mt-3 text-sm font-medium flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full transition-colors ${isMuted ? 'bg-red-50 text-red-600' : 'text-brand-dark/50 hover:bg-brand-dark/5'}`}
                  >
                    {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    {isMuted ? 'Unmute Mic' : 'Mute Mic'}
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-brand-accent text-white shadow-[0_8px_30px_rgb(163,124,68,0.4)] flex items-center justify-center hover:bg-[#a37c44] transition-colors border-2 border-white"
        >
          <Bot className="w-7 h-7" />
        </motion.button>
      )}
    </div>
  );
}
