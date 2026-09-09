import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { X, Send, MessageSquare, Phone, User, CheckCheck, Clock, CheckCircle } from 'lucide-react';

export const ChatModal = () => {
  const { t, user, messages, sendMessage, activeChatReq, setActiveChatReq, setFinalAgreedTime } = useApp();
  const [text, setText] = useState('');
  const [showFinalTimePicker, setShowFinalTimePicker] = useState(false);
  const [selectedFinalTime, setSelectedFinalTime] = useState('08:30');
  const messagesEndRef = useRef(null);

  const req = activeChatReq;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (req) {
      setSelectedFinalTime(req.finalAgreedTime || req.driverDepartureTime || req.departureTime || '08:30');
    }
  }, [messages, req]);

  if (!req) return null;

  const chatMessages = messages.filter(m => m.requestId === req.id);
  const otherPartyName = user?.id === req.clientId ? `${req.driverPrenom} ${req.driverNom}` : `${req.clientPrenom} ${req.clientNom}`;
  const otherPartyPhone = user?.id === req.clientId ? req.driverPhone : req.clientPhone;

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(req.id, text);
    setText('');
  };

  const handleQuickReply = (msgText) => {
    sendMessage(req.id, msgText);
  };

  const handleConfirmFinalAgreedTime = (e) => {
    e.preventDefault();
    setFinalAgreedTime(req.id, selectedFinalTime);
    setShowFinalTimePicker(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '560px', width: '95%', padding: '0', display: 'flex', flexDirection: 'column', height: '670px', borderRadius: '24px', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ padding: '16px 20px', background: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>
              {otherPartyName.charAt(0)}
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#fff' }}>
                {otherPartyName}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#34d399', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Phone size={12} />
                <a href={`tel:${otherPartyPhone}`} style={{ color: 'inherit', textDecoration: 'underline' }}>{otherPartyPhone}</a>
              </p>
            </div>
          </div>

          <button onClick={() => setActiveChatReq(null)} className="btn-secondary" style={{ width: '36px', height: '36px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </div>

        {/* Departure Time Information Banner: Client vs Driver Proposed Times */}
        <div style={{ padding: '10px 16px', background: 'rgba(245,158,11,0.15)', borderBottom: '1px solid rgba(245,158,11,0.3)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ color: '#fbbf24', fontWeight: 700 }}>
                👤 {t.departureTimeBadge} <strong>{req.departureTime || '08:30'}</strong>
              </span>
              {req.driverDepartureTime && (
                <span style={{ color: '#38bdf8', fontWeight: 700 }}>
                  🚘 {t.driverTimeBadge} <strong>{req.driverDepartureTime}</strong>
                </span>
              )}
            </div>

            <button
              onClick={() => setShowFinalTimePicker(true)}
              className="btn-dinim3ak"
              style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '10px' }}
            >
              ⏰ {t.setFinalTimeBtn}
            </button>
          </div>

          {req.finalAgreedTime && (
            <div style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 800, background: 'rgba(16,185,129,0.2)', padding: '4px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={14} />
              {t.finalAgreedTimeLabel} <strong>{req.finalAgreedTime}</strong>
            </div>
          )}
        </div>

        {/* Message Area */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', background: 'rgba(11, 15, 25, 0.95)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {chatMessages.length === 0 ? (
            <div style={{ margin: 'auto', textAlign: 'center', color: '#9ca3af', fontSize: '0.9rem' }}>
              <MessageSquare size={36} style={{ margin: '0 auto 8px auto', opacity: 0.5 }} />
              <p>Discutez et réglez l'heure de départ finale avec {otherPartyName}</p>
            </div>
          ) : (
            chatMessages.map((m) => {
              const isMe = m.senderId === user?.id;
              return (
                <div
                  key={m.id}
                  style={{
                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    background: isMe ? 'linear-gradient(135deg, #3b82f6, #0284c7)' : 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    padding: '10px 14px',
                    borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '2px', fontWeight: 600 }}>
                    {m.senderName}
                  </div>
                  <div style={{ fontSize: '0.95rem', wordBreak: 'break-word', lineHeight: 1.4 }}>
                    {m.text}
                  </div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.7, textAlign: 'right', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                    {m.timestamp}
                    {isMe && <CheckCheck size={12} />}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Time Negotiation & Quick Replies Bar */}
        <div style={{ padding: '8px 16px', background: 'rgba(15, 23, 42, 0.9)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '8px', overflowX: 'auto' }}>
          <button onClick={() => handleQuickReply(t.quickTimeCheck)} className="btn-secondary" style={{ fontSize: '0.75rem', padding: '4px 10px', whiteSpace: 'nowrap', borderRadius: '14px', borderColor: '#f59e0b', color: '#fbbf24' }}>
            ⏰ {t.quickTimeCheck}
          </button>
          <button onClick={() => handleQuickReply(t.quickTime15Min)} className="btn-secondary" style={{ fontSize: '0.75rem', padding: '4px 10px', whiteSpace: 'nowrap', borderRadius: '14px', borderColor: '#10b981', color: '#34d399' }}>
            ⚡ {t.quickTime15Min}
          </button>
          <button onClick={() => handleQuickReply(t.quickTimeShift)} className="btn-secondary" style={{ fontSize: '0.75rem', padding: '4px 10px', whiteSpace: 'nowrap', borderRadius: '14px', borderColor: '#38bdf8', color: '#38bdf8' }}>
            ⏱️ {t.quickTimeShift}
          </button>
          <button onClick={() => handleQuickReply(t.quickOnWay)} className="btn-secondary" style={{ fontSize: '0.75rem', padding: '4px 10px', whiteSpace: 'nowrap', borderRadius: '14px' }}>
            🚀 {t.quickOnWay}
          </button>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} style={{ padding: '14px 16px', background: 'rgba(15, 23, 42, 0.98)', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '10px' }}>
          <input
            type="text"
            className="input-field"
            placeholder={t.typeMessage}
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ borderRadius: '20px', padding: '10px 16px' }}
          />
          <button type="submit" className="btn-primary" style={{ borderRadius: '50%', width: '42px', height: '42px', padding: 0, flexShrink: 0 }}>
            <Send size={18} />
          </button>
        </form>

      </div>

      {/* Final Time Settlement Dialog */}
      {showFinalTimePicker && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <form onSubmit={handleConfirmFinalAgreedTime}>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <Clock size={32} color="#f59e0b" style={{ margin: '0 auto 8px auto' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                  {t.enterFinalTimeTitle}
                </h3>
              </div>

              <div style={{ margin: '20px 0' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#fbbf24', marginBottom: '8px' }}>
                  {t.finalAgreedTimeLabel}
                </label>
                <input
                  type="time"
                  className="input-field"
                  value={selectedFinalTime}
                  onChange={(e) => setSelectedFinalTime(e.target.value)}
                  required
                  style={{ fontSize: '1.2rem', fontWeight: 800, textAlign: 'center' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowFinalTimePicker(false)} className="btn-secondary" style={{ flex: 1, padding: '10px' }}>
                  {t.cancel}
                </button>
                <button type="submit" className="btn-okrakm3aya" style={{ flex: 1, padding: '10px' }}>
                  {t.confirmFinalTime}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
