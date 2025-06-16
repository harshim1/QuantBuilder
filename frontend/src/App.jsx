import { useState } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [strategy, setStrategy] = useState(null);

  const handleSubmit = async () => {
    const res = await fetch('http://localhost:8000/api/parse_strategy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ natural_language: text })
    });
    const data = await res.json();
    setStrategy(data);
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">QuantBuilder MVP</h1>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Describe your strategy..."
        className="border p-2 w-full mb-4"
      ></textarea>
      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2">Generate</button>
      {strategy && (
        <div className="mt-6">
          <h2 className="font-bold">Generated Flow:</h2>
          <div><strong>Entry:</strong> {strategy.entry.join(', ')}</div>
          <div><strong>Exit:</strong> {strategy.exit.join(', ')}</div>
        </div>
      )}
    </div>
  );
}

export default App;
