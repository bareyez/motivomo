import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile } from 'firebase/auth';

const Register = ({ onToggleAuth }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      return setError('First and last name are required');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      const userCredential = await signup(email, password);
      await updateProfile(userCredential.user, {
        displayName: `${firstName.trim()} ${lastName.trim()}`
      });
    } catch (error) {
      setError('Failed to create account: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      maxWidth: '400px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: 'rgba(139, 156, 139, 0.2)',
      borderRadius: '12px',
      border: '1px solid rgba(245, 245, 220, 0.3)',
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)'
    }}>
      <h2 style={{
        color: '#fff',
        textAlign: 'center',
        marginBottom: '20px',
        fontSize: '1.8rem',
        fontFamily: 'Georgia, serif'
      }}>Create Account</h2>
      
      {error && (
        <div style={{
          color: '#ff4444',
          backgroundColor: 'rgba(255, 68, 68, 0.1)',
          padding: '10px',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            required
            style={{
              width: '50%',
              boxSizing: 'border-box',
              padding: '12px',
              backgroundColor: 'rgba(139, 156, 139, 0.2)',
              border: '1px solid rgba(245, 245, 220, 0.3)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '16px'
            }}
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            required
            style={{
              width: '50%',
              boxSizing: 'border-box',
              padding: '12px',
              backgroundColor: 'rgba(139, 156, 139, 0.2)',
              border: '1px solid rgba(245, 245, 220, 0.3)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '16px'
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '12px',
              backgroundColor: 'rgba(139, 156, 139, 0.2)',
              border: '1px solid rgba(245, 245, 220, 0.3)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '16px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '12px',
              backgroundColor: 'rgba(139, 156, 139, 0.2)',
              border: '1px solid rgba(245, 245, 220, 0.3)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '16px'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '12px',
              backgroundColor: 'rgba(139, 156, 139, 0.2)',
              border: '1px solid rgba(245, 245, 220, 0.3)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '16px'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: 'rgba(139, 156, 139, 0.3)',
            color: '#fff',
            border: '1px solid rgba(245, 245, 220, 0.5)',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <p style={{
        textAlign: 'center',
        marginTop: '20px',
        color: '#fff'
      }}>
        Already have an account?{' '}
        <button
          onClick={() => onToggleAuth('login')}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            textDecoration: 'underline',
            cursor: 'pointer',
            padding: 0,
            font: 'inherit'
          }}
        >
          Sign In
        </button>
      </p>
    </div>
  );
};

export default Register; 