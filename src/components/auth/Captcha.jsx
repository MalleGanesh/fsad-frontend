import React, { useState, useEffect } from 'react';
import './auth.css';

const COLORS = ['#5a67d8', '#d53f8c', '#2b6cb0', '#276749', '#b7450f', '#702459'];

export default function Captcha({ onVerify }) {
  const [captchaStr, setCaptchaStr] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [rotations, setRotations] = useState([]);

  const generateCaptcha = () => {
    // Exclude visually ambiguous characters: 0, O, 1, l, I
    const chars = '23456789ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const rots = Array.from({ length: 6 }, () => Math.floor(Math.random() * 21) - 10);
    setCaptchaStr(result);
    setRotations(rots);
    setInputValue('');
    onVerify(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    onVerify(val === captchaStr);
  };

  const isError = inputValue.length > 0 && inputValue !== captchaStr;
  const isSuccess = inputValue.length > 0 && inputValue === captchaStr;

  return (
    <div className="auth-captcha-container">
      <label style={{ fontSize: '13px', fontWeight: '600', color: '#4a5568', display: 'block', marginBottom: '8px' }}>
        CAPTCHA Verification
      </label>
      <div className="auth-captcha-box">
        <div
          className="auth-captcha-chars"
          onCopy={(e) => e.preventDefault()}
          style={{ display: 'flex', gap: '4px', alignItems: 'center' }}
        >
          {captchaStr.split('').map((char, i) => (
            <span
              key={i}
              style={{
                color: COLORS[i % COLORS.length],
                display: 'inline-block',
                transform: `rotate(${rotations[i] || 0}deg)`,
                fontSize: '24px',
                fontWeight: '900',
                fontFamily: "'Courier New', monospace",
                userSelect: 'none',
              }}
            >
              {char}
            </span>
          ))}
        </div>
        <button
          type="button"
          className="auth-captcha-refresh"
          onClick={generateCaptcha}
          title="Get a new CAPTCHA"
        >
          &#x21bb;
        </button>
      </div>
      <input
        type="text"
        placeholder="Type the characters shown above"
        value={inputValue}
        onChange={handleChange}
        className="auth-input"
        style={{
          marginTop: '10px',
          borderColor: isError ? '#e53e3e' : isSuccess ? '#38a169' : undefined,
          boxShadow: isError
            ? '0 0 0 3px rgba(229,62,62,0.2)'
            : isSuccess
            ? '0 0 0 3px rgba(56,161,105,0.2)'
            : undefined,
        }}
        autoComplete="off"
        required
      />
      {isError && (
        <p style={{ color: '#e53e3e', fontSize: '13px', marginTop: '6px', fontWeight: '500' }}>
          ❌ CAPTCHA is incorrect. Please try again.
        </p>
      )}
      {isSuccess && (
        <p style={{ color: '#38a169', fontSize: '13px', marginTop: '6px', fontWeight: '500' }}>
          ✅ CAPTCHA verified!
        </p>
      )}
    </div>
  );
}
