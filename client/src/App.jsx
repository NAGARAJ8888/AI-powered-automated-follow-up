import { useState, useEffect } from 'react'
import API from './services/Api';

function App() {

  useEffect(() => {
    API.get("/")
      .then(res => console.log(res.data))
      .catch(err => console.error(err));
  }, []);

  return <h1>Check console</h1>;
}

export default App
