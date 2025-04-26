import { useState } from 'react'
import GoalInput from './components/GoalInput'
import Timer from './components/Timer'
import SessionHistory from './components/SessionHistory'
import Login from './components/Login'
import Register from './components/Register'
import { useAuth } from './contexts/AuthContext'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'

function App() {
  const [currentGoal, setCurrentGoal] = useState('')
  const [currentTip, setCurrentTip] = useState('')
  const [authMode, setAuthMode] = useState('login')
  const { currentUser, logout } = useAuth()

  // Extract first name from displayName
  const firstName = currentUser && currentUser.displayName
    ? currentUser.displayName.split(' ')[0]
    : '';

  const handleGoalSet = (goal) => {
    setCurrentGoal(goal)
  }

  const handleSessionComplete = (tip) => {
    setCurrentTip(tip)
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

  return (
    <>
      <ToastContainer position="top-center" autoClose={3500} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="dark" />
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '20px',
        fontFamily: 'Georgia, serif',
        background: 'linear-gradient(135deg, #3d4c3d 0%, #5b6d5b 50%, #3d4c3d 100%)',
        color: '#f5f5dc'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
          position: 'relative'
        }}>
          <h1 style={{ 
            fontFamily: 'Georgia, serif',
            fontSize: '3.5rem',
            fontWeight: '700',
            color: '#fff',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
            letterSpacing: '2px',
            margin: '0',
            padding: '1rem',
            position: 'relative'
          }}>
            motivomo
          </h1>
          <div style={{
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '150px',
            height: '2px',
            background: '#8b9c8b',
            borderRadius: '2px'
          }} />
        </div>

        {currentUser ? (
          <>
            <div style={{
              textAlign: 'right',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <span style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '1.1rem'
              }}>
                Greetings {firstName}!
              </span>
              <button
                onClick={handleLogout}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'rgba(139, 156, 139, 0.2)',
                  color: '#fff',
                  border: '1px solid rgba(245, 245, 220, 0.3)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Sign Out
              </button>
            </div>
            
            <div style={{ 
              backgroundColor: 'rgba(139, 156, 139, 0.2)',
              padding: '20px 20px 24px 20px',
              borderRadius: '15px',
              marginBottom: '30px',
              border: '1px solid rgba(245, 245, 220, 0.3)',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)'
            }}>
              <GoalInput onGoalSet={handleGoalSet} />
              
              {currentGoal && (
                <>
                  <h3 style={{
                    color: '#fff',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
                    marginBottom: '20px',
                    fontFamily: 'Georgia, serif',
                    fontSize: '1.5rem'
                  }}>Current Goal: {currentGoal}</h3>
                  <Timer 
                    goal={currentGoal} 
                    onSessionComplete={handleSessionComplete} 
                  />
                </>
              )}
              
              {currentTip && (
                <div style={{
                  backgroundColor: 'rgba(139, 156, 139, 0.3)',
                  padding: '25px',
                  borderRadius: '12px',
                  marginTop: '30px',
                  border: '1px solid rgba(245, 245, 220, 0.3)',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)'
                }}>
                  <h4 style={{ 
                    color: '#fff',
                    fontFamily: 'Georgia, serif',
                    fontSize: '1.4rem',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
                    margin: '0'
                  }}>Words of Wisdom:</h4>
                  <p style={{ 
                    color: '#fff',
                    lineHeight: '1.8',
                    fontSize: '1.2rem',
                    fontStyle: 'italic',
                    margin: '0',
                    padding: '0 20px'
                  }}>{currentTip}</p>
                </div>
              )}
            </div>
            
            <SessionHistory />
          </>
        ) : (
          <>
            {authMode === 'login' ? (
              <Login onToggleAuth={setAuthMode} />
            ) : (
              <Register onToggleAuth={setAuthMode} />
            )}
          </>
        )}
      </div>
    </>
  )
}

export default App

