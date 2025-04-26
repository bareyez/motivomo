import { useState } from 'react';

const GoalInput = ({ onGoalSet }) => {
  const [goal, setGoal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (goal.trim()) {
      onGoalSet(goal.trim());
      setGoal('');
    }
  };

  return (
    <div style={{
      marginBottom: '30px',
      textAlign: 'center'
    }}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="What mountain will you climb today?"
          style={{
            padding: '15px 20px',
            width: '80%',
            maxWidth: '500px',
            backgroundColor: 'rgba(139, 156, 139, 0.2)',
            color: '#fff',
            border: '1px solid rgba(245, 245, 220, 0.3)',
            borderRadius: '8px',
            fontSize: '16px',
            fontFamily: 'Georgia, serif',
            outline: 'none',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            '::placeholder': {
              color: 'rgba(255, 255, 255, 0.7)'
            }
          }}
        />
        <button
          type="submit"
          style={{
            padding: '15px 30px',
            marginTop: '15px',
            backgroundColor: 'rgba(139, 156, 139, 0.2)',
            color: '#fff',
            border: '1px solid rgba(245, 245, 220, 0.5)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
          }}
        >
          Set Your Path
        </button>
      </form>
    </div>
  );
};

export default GoalInput; 