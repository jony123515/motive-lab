'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAppState } from '@/lib/store/appState';
import { generateCoachResponse, ChatMessage } from '@/lib/engines/coachBotEngine';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  Flame, 
  Dumbbell, 
  Apple, 
  RotateCcw,
  Minimize2,
  Maximize2,
  ChevronDown
} from 'lucide-react';

export function FloatingCoachBot() {
  const { currentUser, assessment, workoutPlan, nutritionPlan } = useAppState();

  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Inicializar con mensaje de bienvenida personalizado
  useEffect(() => {
    if (messages.length === 0) {
      const welcome = generateCoachResponse(
        'hola',
        currentUser,
        assessment,
        workoutPlan,
        nutritionPlan
      );
      setMessages([welcome]);
    }
  }, [currentUser, assessment, workoutPlan, nutritionPlan]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    // Simular tiempo de análisis biomecánico/nutricional
    setTimeout(() => {
      const botResponse = generateCoachResponse(
        query,
        currentUser,
        assessment,
        workoutPlan,
        nutritionPlan
      );
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 450);
  };

  const handleReset = () => {
    const welcome = generateCoachResponse(
      'hola',
      currentUser,
      assessment,
      workoutPlan,
      nutritionPlan
    );
    setMessages([welcome]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Botón Flotante Omnipresente (cuando está cerrado) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center space-x-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-motive-red via-motive-redDark to-motive-red text-white shadow-2xl shadow-motive-red/40 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20"
          aria-label="Abrir Coach IA"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-motive-surface" />
          </div>

          <div className="text-left hidden sm:block">
            <span className="block text-[10px] font-black uppercase tracking-wider text-white/80">Coach Experto 24/7</span>
            <span className="block text-xs font-display font-bold text-white">Pregúntame lo que sea</span>
          </div>

          <span className="sm:hidden text-xs font-bold uppercase tracking-wider">Coach IA</span>

          {/* Halo brillante */}
          <span className="absolute -inset-1 rounded-full bg-motive-red/30 blur-md -z-10 group-hover:bg-motive-red/50 transition-colors" />
        </button>
      )}

      {/* Ventana de Chat Flotante (cuando está abierto) */}
      {isOpen && (
        <div className="w-[94vw] sm:w-[440px] h-[590px] max-h-[85vh] bg-motive-surface border border-motive-surfaceBorder rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Header del Chat */}
          <div className="bg-gradient-to-r from-motive-surface via-motive-surfaceLight to-motive-surface border-b border-motive-surfaceBorder px-5 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-motive-red to-motive-redDark flex items-center justify-center text-white shadow-lg shadow-motive-red/30">
                  <Bot className="w-6 h-6" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-motive-surface" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-display font-black text-white uppercase tracking-tight">
                    MOTIVE Coach IA
                  </h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-motive-red/20 text-motive-redBright border border-motive-red/30">
                    Experto
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>En línea • Fisiología, Nutrición & Biomecánica</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1 text-zinc-400">
              <button
                onClick={handleReset}
                title="Reiniciar conversación"
                className="p-2 rounded-xl hover:bg-motive-surface hover:text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Cerrar chat"
                className="p-2 rounded-xl hover:bg-motive-surface hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Shortcuts Bar */}
          <div className="bg-motive-surfaceLight/50 border-b border-motive-surfaceBorder/40 px-3 py-2 flex items-center space-x-2 overflow-x-auto text-[11px]">
            <button
              onClick={() => handleSend('¿Cuál es el mejor cardio para perder grasa?')}
              className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-motive-surface border border-motive-surfaceBorder text-zinc-300 hover:text-white hover:border-motive-red transition-all flex items-center space-x-1 font-semibold"
            >
              <Flame className="w-3 h-3 text-amber-400" />
              <span>Cardio Quema Grasa</span>
            </button>
            <button
              onClick={() => handleSend('¿Qué rutina de abdomen debo hacer para marcar los cuadritos?')}
              className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-motive-surface border border-motive-surfaceBorder text-zinc-300 hover:text-white hover:border-motive-red transition-all flex items-center space-x-1 font-semibold"
            >
              <Dumbbell className="w-3 h-3 text-motive-redBright" />
              <span>Rutina de Abdomen</span>
            </button>
            <button
              onClick={() => handleSend('Explícame mis calorías y macros asignados')}
              className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-motive-surface border border-motive-surfaceBorder text-zinc-300 hover:text-white hover:border-motive-red transition-all flex items-center space-x-1 font-semibold"
            >
              <Apple className="w-3 h-3 text-emerald-400" />
              <span>Mis Calorías & SMAE</span>
            </button>
          </div>

          {/* Cuerpo de Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                >
                  <div className="flex items-center space-x-2 px-1 text-[10px] text-zinc-500 font-semibold">
                    <span>{isUser ? 'Tú' : 'Coach IA'}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[90%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-gradient-to-r from-motive-red to-motive-redDark text-white rounded-tr-none shadow-md'
                        : 'bg-motive-surfaceLight border border-motive-surfaceBorder text-zinc-200 rounded-tl-none shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap space-y-2">
                      {msg.text.split('\n\n').map((paragraph, pIdx) => {
                        // Formatear encabezados de nivel 3 si existen
                        if (paragraph.startsWith('### ')) {
                          return (
                            <h4 key={pIdx} className="font-display font-bold text-white text-sm text-motive-redBright mt-2">
                              {paragraph.replace('### ', '')}
                            </h4>
                          );
                        }
                        return <p key={pIdx}>{paragraph}</p>;
                      })}
                    </div>
                  </div>

                  {/* Sugerencias Rápidas que acompañan al mensaje del bot */}
                  {!isUser && msg.quickActions && (
                    <div className="flex flex-wrap gap-1.5 pt-1 pl-1">
                      {msg.quickActions.map((qa, qIdx) => (
                        <button
                          key={qIdx}
                          onClick={() => handleSend(qa.prompt)}
                          className="px-2.5 py-1 rounded-full bg-motive-surface border border-motive-surfaceBorder hover:border-motive-red text-[10px] text-zinc-300 hover:text-white transition-all text-left"
                        >
                          {qa.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center space-x-2 text-xs text-zinc-400 p-2">
                <div className="w-6 h-6 rounded-lg bg-motive-surfaceLight flex items-center justify-center text-motive-redBright animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                </div>
                <span>El Coach está formulando tu respuesta fisiológica...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-motive-surface border-t border-motive-surfaceBorder">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Pregúntame de cardio, abdomen, calorías o rutina..."
                className="flex-1 bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-motive-red"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-motive-red to-motive-redDark text-white disabled:opacity-40 hover:scale-105 active:scale-95 transition-all shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}
