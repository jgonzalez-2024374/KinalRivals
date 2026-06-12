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

           
        </div>
    );
}

export default App;