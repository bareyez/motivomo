import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const SessionHistory = () => {
  const [sessions, setSessions] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;
    // Query sessions collection, ordered by timestamp, filtered by userId
    const q = query(
      collection(db, 'sessions'),
      where('userId', '==', currentUser.uid),
      orderBy('timestamp', 'desc')
    );
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sessionData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSessions(sessionData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleString();
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <h3 style={{
        color: '#7fffbf',
        textShadow: '0 0 5px rgba(127,255,191,0.3)',
        marginBottom: '20px',
        fontSize: '2rem',
        letterSpacing: '1px',
        fontFamily: 'Georgia, serif',
        textAlign: 'center'
      }}>Session History</h3>
      {sessions.length === 0 ? (
        <p style={{ 
          color: '#fff',
          textAlign: 'center',
          fontStyle: 'italic',
          fontSize: '1.2rem',
          margin: '40px 0'
        }}>No sessions yet, young one — take the first step!</p>
      ) : (
        <div style={{ 
          maxHeight: '400px', 
          overflowY: 'auto',
          border: '1px solid rgba(139, 156, 139, 0.2)',
          borderRadius: '12px',
          padding: '20px',
          backgroundColor: 'rgba(139, 156, 139, 0.15)',
          backdropFilter: 'blur(10px)'
        }}>
          {sessions.map((session) => (
            <div 
              key={session.id} 
              style={{
                padding: '20px',
                borderBottom: '1px solid rgba(139, 156, 139, 0.1)',
                marginBottom: '15px',
                transition: 'all 0.3s ease',
              }}
            >
              <p style={{ 
                color: '#7fffbf',
                marginBottom: '10px',
                fontSize: '18px',
                fontFamily: 'Georgia, serif'
              }}>
                <span style={{ 
                  color: '#fff',
                  marginRight: '10px'
                }}>Goal:</span>
                {session.goal}
              </p>
              <p style={{ 
                color: '#fff',
                marginBottom: '10px',
                fontSize: '14px'
              }}>
                <span style={{ 
                  color: '#7fffbf',
                  marginRight: '10px'
                }}>Completed:</span>
                {formatDate(session.timestamp)}
              </p>
              <p style={{ 
                color: '#fff',
                marginBottom: '0',
                fontSize: '16px',
                fontStyle: 'italic'
              }}>
                <span style={{ 
                  color: '#7fffbf',
                  marginRight: '10px'
                }}>Tip:</span>
                {session.tip}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionHistory; 