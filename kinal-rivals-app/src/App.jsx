import { useRef, useState } from 'react';
import { PhaserGame } from './game/PhaserGame';

function App() {
    // Referencia crítica para comunicar React con el Canvas de Phaser
    const phaserRef = useRef(null);
    const [currentSceneName, setCurrentSceneName] = useState('Game');

    // Callback que se ejecuta cada vez que Phaser cambia de escena
    const onSceneActive = (scene) => {
        setCurrentSceneName(scene.scene.key);
    };

    return (
        <div id="app">
            {/* Contenedor del Canvas de Phaser */}
            <PhaserGame ref={phaserRef} currentActiveScene={onSceneActive} />

            {/* Interfaz de usuario (UI) nativa en React sobrepuesta */}
            <div className="ui-container" style={{ position: 'absolute', top: '10px', left: '10px', color: '#fff', fontFamily: 'Arial' }}>
                <h2>Kinal Rivals — Arena de Batalla</h2>
                <p>Escena Actual: <strong>{currentSceneName}</strong></p>
            </div>
        </div>
    );
}

export default App;