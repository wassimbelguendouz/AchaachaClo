import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const BackButton = ({ onClick, label }) => {
  const { t, language } = useApp();
  const isRtl = language === 'ar';

  return (
    <button
      type="button"
      onClick={onClick}
      className="btn-secondary"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        borderRadius: '12px',
        fontWeight: 700,
        fontSize: '0.85rem',
        background: 'rgba(255, 255, 255, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
    >
      {isRtl ? <ArrowRight size={16} color="#38bdf8" /> : <ArrowLeft size={16} color="#38bdf8" />}
      <span>{label || t.backBtn}</span>
    </button>
  );
};
