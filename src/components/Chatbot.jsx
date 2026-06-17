// src/components/Chatbot.jsx

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, ChevronDown, ChevronUp } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: '¡Hola! 👋 Bienvenido al asistente virtual de Consultorio Clínico y Farmacia Ortega Castellón. ¿En qué te puedo ayudar hoy?' 
    }
  ]);
  const [showFaqs, setShowFaqs] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const faqs = [
    { 
      id: '1',
      q: '¿Cuáles son los horarios de atención?', 
      a: '🕒 Atendemos de Lunes a Sábado de 8:00 AM a 6:00 PM. ¡Te esperamos!' 
    },
    { 
      id: '2',
      q: '¿Dónde están ubicados?', 
      a: '📍 Estamos ubicados en Juigalpa, Barrio San Antonio, segunda entrada, 1 Cuadra al Este.' 
    },
    { 
      id: '3',
      q: '¿Ofrecen servicio de delivery?', 
      a: '🚚 ¡Sí! Hacemos delivery de medicamentos en Juigalpa, Chontales. Los costos varían según la distancia: C$30, C$40, C$50 y C$60.' 
    },
    { 
      id: '4',
      q: '¿Qué especialidades médicas tienen?', 
      a: '🩺 Contamos con consultas en Medicina General, Pediatría, Ortopedia, Consulta General y Ginecología.' 
    },
    { 
      id: '5',
      q: '¿Cómo puedo agendar una cita?', 
      a: '📅 Regístrate en nuestra plataforma, ve a la sección "Citas" y selecciona la fecha y hora que te convenga.' 
    },
    { 
      id: '6',
      q: '¿Cómo puedo pagar mis pedidos?', 
      a: '💳 Puedes pagar a través de nuestra wallet móvil al +50584334235 (Sindy Castellón). Sube el comprobante en la plataforma.' 
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text) => {
    if (!text.trim()) return;

    // Agregar mensaje del usuario
    setMessages(prev => [...prev, { sender: 'user', text: text.trim() }]);
    setInputMessage('');
    setIsTyping(true);

    // Simular respuesta del bot
    setTimeout(() => {
      // Buscar respuesta en FAQs
      const foundFaq = faqs.find(f => 
        text.toLowerCase().includes(f.q.toLowerCase()) || 
        f.q.toLowerCase().includes(text.toLowerCase())
      );

      let botResponse;
      if (foundFaq) {
        botResponse = foundFaq.a;
      } else {
        botResponse = `🤔 No tengo una respuesta específica para eso. Pero puedo ayudarte con estas opciones:\n\n${faqs.map((f, i) => `${i + 1}. ${f.q}`).join('\n')}\n\nEscribe el número de la opción que te interesa.`;
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
      setIsTyping(false);
    }, 800);
  };

  const handleFaqClick = (faq) => {
    setMessages(prev => [
      ...prev,
      { sender: 'user', text: faq.q },
      { sender: 'bot', text: faq.a }
    ]);
    setShowFaqs(false);
  };

  // Botón flotante del chatbot
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: 'clamp(20px, 4vh, 30px)',
          right: 'clamp(12px, 5vw, 24px)',
          backgroundColor: 'var(--primary-green)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: 'clamp(56px, 11vw, 64px)',
          height: 'clamp(56px, 11vw, 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(140, 198, 63, 0.4)',
          zIndex: 998,
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.08)';
          e.target.style.boxShadow = '0 6px 30px rgba(140, 198, 63, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 4px 20px rgba(140, 198, 63, 0.4)';
        }}
      >
        <MessageSquare size={24} />
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 'clamp(20px, 4vh, 30px)',
      right: 'clamp(12px, 5vw, 24px)',
      width: 'min(92vw, 380px)',
      height: 'min(80vh, 520px)',
      backgroundColor: 'var(--bg-card)',
      borderRadius: '16px',
      border: '1px solid var(--border-color)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
      zIndex: 999,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      animation: 'slideUp 0.3s ease'
    }}>
      {/* Header */}
      <div style={{
        padding: 'clamp(12px, 2vw, 16px) clamp(16px, 3vw, 20px)',
        backgroundColor: 'var(--primary-green)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            🩺
          </div>
          <div>
            <p style={{ 
              margin: 0, 
              fontWeight: 'bold', 
              fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' 
            }}>
              Asistente Ortega
            </p>
            <p style={{ 
              margin: 0, 
              fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)', 
              opacity: 0.8 
            }}>
              Online • Responde rápido
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)} 
          style={{ 
            background: 'rgba(255,255,255,0.15)', 
            border: 'none', 
            color: 'white', 
            cursor: 'pointer', 
            padding: '6px',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        padding: 'clamp(12px, 2vw, 16px)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        backgroundColor: 'var(--bg-main)'
      }}>
        {messages.map((m, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              backgroundColor: m.sender === 'user' 
                ? 'var(--primary-blue)' 
                : 'var(--bg-card)',
              color: m.sender === 'user' 
                ? 'white' 
                : 'var(--text-main)',
              padding: 'clamp(10px, 1.5vw, 14px) clamp(12px, 2vw, 16px)',
              borderRadius: m.sender === 'user' 
                ? '16px 16px 4px 16px' 
                : '16px 16px 16px 4px',
              fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
              lineHeight: '1.5',
              boxShadow: m.sender === 'user' 
                ? '0 2px 8px rgba(0, 132, 204, 0.2)' 
                : '0 2px 8px rgba(0,0,0,0.04)',
              border: m.sender === 'bot' ? '1px solid var(--border-color)' : 'none',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap'
            }}
          >
            {m.text}
          </div>
        ))}
        {isTyping && (
          <div style={{
            alignSelf: 'flex-start',
            backgroundColor: 'var(--bg-card)',
            padding: '12px 16px',
            borderRadius: '16px 16px 16px 4px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            gap: '4px'
          }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--text-muted)',
              animation: 'bounce 1.2s infinite'
            }} />
            <span style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--text-muted)',
              animation: 'bounce 1.2s infinite 0.2s'
            }} />
            <span style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--text-muted)',
              animation: 'bounce 1.2s infinite 0.4s'
            }} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* FAQs */}
      {showFaqs && (
        <div style={{
          padding: 'clamp(10px, 1.5vw, 14px) clamp(12px, 2vw, 16px)',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-card)',
          flexShrink: 0,
          maxHeight: 'clamp(120px, 25vh, 160px)',
          overflowY: 'auto'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <span style={{ 
              fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', 
              fontWeight: 'bold', 
              color: 'var(--text-muted)' 
            }}>
              💡 Preguntas Frecuentes
            </span>
            <button
              onClick={() => setShowFaqs(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)',
                padding: '2px 6px'
              }}
            >
              ✕
            </button>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            {faqs.slice(0, 4).map((f, idx) => (
              <button
                key={idx}
                onClick={() => handleFaqClick(f)}
                style={{
                  textAlign: 'left',
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  padding: 'clamp(6px, 1vw, 10px) clamp(10px, 1.5vw, 14px)',
                  borderRadius: '8px',
                  fontSize: 'clamp(0.75rem, 1.8vw, 0.85rem)',
                  color: 'var(--primary-blue)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--primary-blue)';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--bg-main)';
                  e.target.style.color = 'var(--primary-blue)';
                }}
              >
                {f.q}
              </button>
            ))}
            {faqs.length > 4 && (
              <button
                onClick={() => setShowFaqs(false)}
                style={{
                  textAlign: 'center',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)',
                  cursor: 'pointer',
                  padding: '4px',
                  textDecoration: 'underline'
                }}
              >
                Ver más preguntas...
              </button>
            )}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: 'clamp(8px, 1.5vw, 12px) clamp(12px, 2vw, 16px)',
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-card)',
        display: 'flex',
        gap: '8px',
        flexShrink: 0
      }}>
        <input
          type="text"
          placeholder="Escribe tu pregunta..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
          style={{
            flex: 1,
            padding: 'clamp(8px, 1.5vw, 12px) clamp(12px, 2vw, 16px)',
            borderRadius: '10px',
            border: '1.5px solid var(--border-color)',
            backgroundColor: 'var(--bg-main)',
            color: 'var(--text-main)',
            fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
            outline: 'none',
            transition: 'border-color 0.2s ease'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--primary-green)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
        />
        <button
          onClick={() => handleSendMessage(inputMessage)}
          disabled={!inputMessage.trim()}
          style={{
            padding: 'clamp(8px, 1.5vw, 12px)',
            backgroundColor: inputMessage.trim() ? 'var(--primary-green)' : '#94a3b8',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: inputMessage.trim() ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 'clamp(42px, 8vw, 48px)',
            transition: 'background 0.2s ease'
          }}
        >
          <Send size={20} />
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

const clamp = (min, val, max) => Math.min(Math.max(min, val), max);