import { Boot } from "./scenes/Boot";
import { Game } from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";
import { Rules } from "./scenes/Rules";
import { CharacterSelect } from "./scenes/CharacterSelect";
import StageSelect from "./scenes/StageSelect";
import * as Phaser from "phaser";

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: "game-container",
    backgroundColor: "#028af8",
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 100 },
            debug: false,
        },
    },
    scene: [Boot, Preloader, MainMenu, Rules, CharacterSelect, StageSelect, Game, GameOver],
};

export default function StartGame(parent) {
    return new Phaser.Game({ ...config, parent });
}
