import React, { useState } from 'react';

function App() {
  const [text, setText] = useState('');
  const [parsed, setParsed] = useState(null);

  const handleSubmit = async () => {
    try {
      const res = await fetch('/.netlify/functions/parseList', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setParsed(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '1rem', direction: 'rtl' }}>
      <h1>רשימת קניות</h1>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="הדבק כאן את רשימת הקניות"
        style={{ width: '100%', height: '150px' }}
      />
      <button onClick={handleSubmit}>סדר לי</button>
      {parsed && (
        <div>
          {parsed.stops && parsed.stops.map((stop, idx) => (
            <div key={idx}>
              <h2>{stop.store}{stop.branch ? ` - ${stop.branch}` : ''}</h2>
              <ul>
                {stop.items.map((item, i) => (
                  <li key={i}>
                    {item.name} {item.quantity ? `x${item.quantity}` : ''} {item.unit || ''}
                    {item.notes ? ` (${item.notes})` : ''}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
