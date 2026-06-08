import { Scene } from 'phaser';
import * as Phaser from 'phaser';

export class Game extends Scene {
    constructor () {
        super('Game');
    }

    preload () {
        this.load.image('bg', 'assets/kinal_construccion.png');
    }

    create () {
        let anchoCanvas = this.scale.width;
        let altoCanvas = this.scale.height;

        const fondo = this.add.image(anchoCanvas / 2, altoCanvas / 2, 'bg');
        if (fondo) {
            fondo.setDisplaySize(anchoCanvas, altoCanvas);
        }

        const titulo = this.add.text(anchoCanvas / 2, 40, 'Kinal Rivals', {
            fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff'
        }).setOrigin(0.5);

        // --- Suelo Firme con Físicas ---
        const altoSuelo = 40;
        const posicionYSuelo = altoCanvas - (altoCanvas * 0.18); 
        this.ground = this.add.rectangle(anchoCanvas / 2, posicionYSuelo, anchoCanvas, altoSuelo, 0x000000, 0);
        this.physics.add.existing(this.ground, true);

        // --- Jugador 1 (Rojo) ---
        const rect1 = this.add.rectangle(anchoCanvas * 0.25, posicionYSuelo - 60, 60, 90, 0xff0000);
        this.player1 = this.physics.add.existing(rect1);
        this.player1.body.setCollideWorldBounds(true);
        this.player1.body.setGravityY(1000);

        // --- Jugador 2 (Verde) ---
        const rect2 = this.add.rectangle(anchoCanvas * 0.75, posicionYSuelo - 60, 60, 90, 0x00ff00);
        this.player2 = this.physics.add.existing(rect2);
        this.player2.body.setCollideWorldBounds(true);
        this.player2.body.setGravityY(1000);

        // --- Colisiones ---
        this.physics.add.collider(this.player1, this.ground);
        this.physics.add.collider(this.player2, this.ground);
        this.physics.add.collider(this.player1, this.player2);

        // --- Controles ---
        this.keysWASD = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.cursors = this.input.keyboard.createCursorKeys();

        // --- Evento Responsive en Tiempo Real ---
        this.scale.on('resize', (gameSize) => {
            const w = gameSize.width;
            const h = gameSize.height;
            const nuevaY = h - (h * 0.18);

            this.cameras.resize(w, h);

            if (fondo) {
                fondo.setPosition(w / 2, h / 2);
                fondo.setDisplaySize(w, h);
            }
            if (titulo) {
                titulo.setPosition(w / 2, 40);
            }

            this.ground.setPosition(w / 2, nuevaY);
            this.ground.setDisplaySize(w, altoSuelo);
            this.ground.body.setSize(w, altoSuelo);
        });
    }

    update () {
        const speed = 350;
        const jumpForce = -550;

        // Movimiento Jugador 1 (WASD)
        if (this.keysWASD.left.isDown) {
            this.player1.body.setVelocityX(-speed);
        } else if (this.keysWASD.right.isDown) {
            this.player1.body.setVelocityX(speed);
        } else {
            this.player1.body.setVelocityX(0);
        }

        if (this.keysWASD.up.isDown && this.player1.body.touching.down) {
            this.player1.body.setVelocityY(jumpForce);
        }

        // Movimiento Jugador 2 (Flechas)
        if (this.cursors.left.isDown) {
            this.player2.body.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.player2.body.setVelocityX(speed);
        } else {
            this.player2.body.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.player2.body.touching.down) {
            this.player2.body.setVelocityY(jumpForce);
        }
    }
}