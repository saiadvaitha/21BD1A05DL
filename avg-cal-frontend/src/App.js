import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [type, setType] = useState('even');
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:9876/numbers/${type}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <h1>Average Calculator</h1>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="primes">Prime</option>
        <option value="fibo">Fibonacci</option>
        <option value="even">Even</option>
        <option value="rand">Random</option>
      </select>
      <button onClick={fetchData}>Fetch Numbers</button>
      {data && (
        <div>
          <h2>Previous State:</h2>
          <pre>{JSON.stringify(data.windowPrevState, null, 2)}</pre>
          <h2>Current State:</h2>
          <pre>{JSON.stringify(data.windowCurrState, null, 2)}</pre>
          <h2>Numbers:</h2>
          <pre>{JSON.stringify(data.numbers, null, 2)}</pre>
          <h2>Average:</h2>
          <p>{data.avg}</p>
        </div>
      )}
    </div>
  );
}

export default App;
