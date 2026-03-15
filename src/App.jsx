import React from 'react';
import './App.css';
import Game from './components/Game';

function App() {
  return (
    <div className="app-container">
      <Game />
      <div className="developer-watermark">
        Developed by Sasindu Rashmika
      </div>
    </div>
  );
}

export default App;
