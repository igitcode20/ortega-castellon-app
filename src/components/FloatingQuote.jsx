// src/components/FloatingQuote.jsx

import { useState, useEffect } from 'react';
import { Heart, Sparkles, Star, Cross, Church, BookOpen } from 'lucide-react';

const quotes = [
  { text: "La fe mueve montañas", icon: <Cross size={16} /> },
  { text: "Dios es nuestro refugio y fortaleza", icon: <Church size={16} /> },
  { text: "La salud es el mayor regalo de Dios", icon: <Heart size={16} /> },
  { text: "Confía en el Señor con todo tu corazón", icon: <Star size={16} /> },
  { text: "El amor de Dios sana todas las heridas", icon: <Heart size={16} /> },
  { text: "La oración del justo puede mucho", icon: <BookOpen size={16} /> },
  { text: "Dios te da fuerzas para cada día", icon: <Sparkles size={16} /> },
  { text: "La paz de Dios guarda tu corazón", icon: <Star size={16} /> },
  { text: "El Señor es mi pastor, nada me faltará", icon: <Cross size={16} /> },
  { text: "Dios tiene un plan perfecto para ti", icon: <Sparkles size={16} /> },
  { text: "La fe es la certeza de lo que se espera", icon: <BookOpen size={16} /> },
  { text: "El amor de Dios es inagotable", icon: <Heart size={16} /> },
];

// Frases motivadoras adicionales
const motivationalQuotes = [
  { text: "Cada día es una nueva oportunidad", icon: <Sparkles size={16} /> },
  { text: "La perseverancia lleva al éxito", icon: <Star size={16} /> },
  { text: "Sé la luz que ilumine el camino", icon: <Sparkles size={16} /> },
  { text: "Pequeños pasos, grandes logros", icon: <Heart size={16} /> },
  { text: "La esperanza es el motor del alma", icon: <Sparkles size={16} /> },
  { text: "Sonríe, la vida es bella", icon: <Star size={16} /> },
  { text: "Eres más fuerte de lo que crees", icon: <Heart size={16} /> },
  { text: "La actitud lo es todo", icon: <Sparkles size={16} /> },
  { text: "Nunca es tarde para empezar", icon: <Star size={16} /> },
  { text: "Confía en tu proceso", icon: <Heart size={16} /> },
];

const allQuotes = [...quotes, ...motivationalQuotes];

export default function FloatingQuote() {
  const [currentQuote, setCurrentQuote] = useState(allQuotes[0]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * allQuotes.length);
        setCurrentQuote(allQuotes[randomIndex]);
        setIsVisible(true);
      }, 300);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="floating-quote" 
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(10px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease'
      }}
    >
      <span className="quote-icon">{currentQuote.icon}</span>
      <strong>{currentQuote.text}</strong>
    </div>
  );
}