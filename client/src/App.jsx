import { useEffect } from 'react';
import { api } from './api.js';

export default function App() {
  useEffect(() => {
    api('/health').then(console.log).catch(console.error);
  }, []);

  return <h1 className="text-3xl font-bold text-blue-600">Notes</h1>;
}
