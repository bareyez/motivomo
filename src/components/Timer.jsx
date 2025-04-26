import { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, model } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const POMODORO_TIME = 25 * 60; // 25 minutes in seconds
const MOTIVATIONAL_TIPS = [
  "Take a moment to breathe and stretch, like a goat on a mountain peak.",
  "Remember why you started this journey, just as a goat knows its path.",
  "Every step forward, no matter how small, brings you closer to your summit.",
  "Stay focused and steady, like a goat navigating rocky terrain.",
  "Your persistence today will be your strength tomorrow."
];

const Timer = ({ goal, onSessionComplete }) => {
  const [timeLeft, setTimeLeft] = useState(POMODORO_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [isGeneratingTip, setIsGeneratingTip] = useState(false);
  const [aiError, setAiError] = useState(false);
  const { currentUser } = useAuth();

  // Request browser notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const generateAITip = async () => {
    try {
      setAiError(false);
      const prompt = `Generate a short, wise tip in the style of a confident mountain goat for someone who just completed a focus session on "${goal}". The tip should be encouraging and related to perseverance or personal growth. Keep it under 50 characters.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating tip:', error);
      setAiError(true);
      return null;
    }
  };

  const handleSessionComplete = async () => {
    setIsGeneratingTip(true);
    setCompletedSessions(prev => prev + 1);
    
    try {
      const aiTip = await generateAITip();
      const tip = aiTip || MOTIVATIONAL_TIPS[Math.floor(Math.random() * MOTIVATIONAL_TIPS.length)];
      
      await addDoc(collection(db, 'sessions'), {
        goal,
        tip,
        timestamp: new Date(),
        duration: POMODORO_TIME,
        isAITip: !!aiTip,
        userId: currentUser ? currentUser.uid : null
      });
      
      // Show toast notification
      toast.success('Session complete! 🎉');
      // Show browser notification if permitted
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification('Session Complete!', {
          body: `You finished your session: ${goal}`,
          icon: '/favicon.ico'
        });
      }
      onSessionComplete(tip);
    } catch (error) {
      console.error('Error saving session:', error);
      const randomTip = MOTIVATIONAL_TIPS[Math.floor(Math.random() * MOTIVATIONAL_TIPS.length)];
      onSessionComplete(randomTip);
    } finally {
      setIsGeneratingTip(false);
      setIsRunning(false);
      setTimeLeft(POMODORO_TIME);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <div style={{
        fontSize: '72px',
        margin: '20px 0',
        fontFamily: 'Georgia, serif',
        color: '#fff',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
        letterSpacing: '2px'
      }}>
        {formatTime(timeLeft)}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setIsRunning(!isRunning)}
          disabled={isGeneratingTip}
          style={{
            padding: '15px 30px',
            margin: '0 10px',
            backgroundColor: isRunning ? 'rgba(139, 0, 0, 0.2)' : 'rgba(139, 156, 139, 0.2)',
            color: '#fff',
            border: '1px solid',
            borderColor: isRunning ? 'rgba(139, 0, 0, 0.5)' : 'rgba(245, 245, 220, 0.5)',
            borderRadius: '8px',
            cursor: isGeneratingTip ? 'not-allowed' : 'pointer',
            opacity: isGeneratingTip ? 0.7 : 1,
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
          }}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(POMODORO_TIME);
          }}
          disabled={isGeneratingTip}
          style={{
            padding: '15px 30px',
            margin: '0 10px',
            backgroundColor: 'rgba(139, 156, 139, 0.2)',
            color: '#fff',
            border: '1px solid rgba(245, 245, 220, 0.5)',
            borderRadius: '8px',
            cursor: isGeneratingTip ? 'not-allowed' : 'pointer',
            opacity: isGeneratingTip ? 0.7 : 1,
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
          }}
        >
          Reset
        </button>
      </div>
      <div style={{
        color: '#fff',
        fontSize: '18px',
        marginTop: '20px',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
        fontFamily: 'Georgia, serif'
      }}>
        Completed Sessions Today: {completedSessions}
      </div>
      {isGeneratingTip && (
        <div style={{
          color: aiError ? '#ff4444' : '#fff',
          marginTop: '20px',
          fontSize: '18px',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
          fontStyle: 'italic',
          padding: '15px',
          backgroundColor: 'rgba(139, 156, 139, 0.3)',
          borderRadius: '8px',
          border: '1px solid rgba(245, 245, 220, 0.3)'
        }}>
          {aiError ? 'Using a wise goat tip...' : 'The wise goat is thinking...'}
        </div>
      )}
    </div>
  );
};

export default Timer; 