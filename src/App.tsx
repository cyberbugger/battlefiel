import React, { useState, useCallback } from 'react';
import { Game, GameEntity } from './models/Game';
import { GameComponent } from './components/Game/Game'

import 'antd/dist/antd.css'; 
import './App.css';

// TODO: Structure translations across app with i18n
function App() {
  const game = new Game()
  const [mode, setMode] = useState(game.mode)
  const [entities, setEntities] = useState(game.entities)
  const [turn, setTurn] = useState(game.turn)

  const updateEntities = useCallback((updatedEntities: GameEntity[]) => {
    setEntities(updatedEntities)
  }, [])
  
  return (
    <div className="App">
      <GameComponent
        mode={mode}
        entities={entities}
        turn={turn}
        onModeChange={setMode}
        onEntitiesChange={updateEntities}
        onTurnChange={setTurn}
      />
    </div>
  );
}

export default App;
