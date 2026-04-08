import React, { useState } from 'react';
import SignIn from '../components/auth/SignIn';
import SignUp from '../components/auth/SignUp';
import ForgotPassword from '../components/auth/ForgotPassword';

export default function AuthPage() {
  // 'signin', 'signup', or 'forgot'
  const [mode, setMode] = useState('signin');

  return (
    <div className="auth-page">
      <div className="auth-card">
        {mode === 'signin' && <SignIn switchMode={setMode} />}
        {mode === 'signup' && <SignUp switchMode={setMode} />}
        {mode === 'forgot' && <ForgotPassword switchMode={setMode} />}
      </div>
    </div>
  );
}
