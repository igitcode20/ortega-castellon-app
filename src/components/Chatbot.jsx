import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '¡Hola! Bienvenido al asistente virtual de Consultorio Clínico y Farmacia Ortega Castellón. ¿En qué te puedo asesorar hoy, mae?' }
  ]);

  const faqs = [
    { q: '¿Cuáles son los horarios de atención?', a: 'Atendemos de Lunes a Sábado de 8:00 AM a 6:00 PM.' },
    { q: '¿Dónde están ubicados?', a: 'Estamos ubicados en la calle principal, contiguo a la sucursal de correos.' },
    { q: '¿Ofrecen servicio de entrega a domicilio?', a: '¡Sí, claro! Hacemos delivery de tus medicamentos en toda la zona urbana.' },
    { q: '¿Qué especialidades médicas tienen?', a: 'Contamos con consultas en Medicina General, Pediatría y Ortopedia Especializada.' },
    { q: '¿Cómo puedo agendar una cita?', a: 'Regístrate en nuestra plataforma, ve a la sección "Citas" y selecciona la fecha y hora que te convenga.' }
  ];

  const handleSelectFaq = (faq) => {
    setMessages(prev => [
      ...prev,
      { sender: 'user', text: faq.q },
      { sender: 'bot', text: faq.a }
    ]);
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      {!isOpen ? (
        <button onClick={() => setIsOpen(true)} style={{ backgroundColor: 'var(--primary-green)', color: 'white', border: 'none', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          <MessageSquare size={28} />
        </button>
      ) : (
        <div style={{ width: '320px', height: '420px', backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ backgroundColor: 'var(--primary-blue)', color: 'white', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Asistente Ortega Castellón</span>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white' }}><X size={18} /></button>
          </div>
          
          <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((m, idx) => (
              <div key={idx} style={{ alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', backgroundColor: m.sender === 'user' ? 'var(--primary-blue)' : 'var(--bg-main)', color: m.sender === 'user' ? 'white' : 'var(--text-main)', padding: '10px', borderRadius: '8px', maxWidth: '85%', fontSize: '0.85rem' }}>
                {m.text}
              </div>
            ))}
          </div>

          <div style={{ padding: '10px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '5px', backgroundColor: 'var(--bg-main)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Preguntas Frecuentes:</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '100px', overflowY: 'auto' }}>
              {faqs.map((f, idx) => (
                <button key={idx} onClick={() => handleSelectFaq(f)} style={{ textAlign: 'left', background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '6px 10px', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--primary-blue)' }}>
                  {f.q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}