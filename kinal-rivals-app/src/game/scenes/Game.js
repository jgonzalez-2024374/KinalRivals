import { Scene } from 'phaser';
import * as Phaser from 'phaser';

export class Game extends Scene {
    constructor () {
        super('Game');
    }

    init(data) {
        this.selectedStage = data.stage || 'stage_kinal';
    }

    preload () {
        const stageImage = this.selectedStage === 'stage_kinal' ? 'Entrada_kinal.png' :
            this.selectedStage === 'stage_tierra' ? 'Tierra.jpeg' :
            'bg.png';
        this.load.image('bg', `assets/${stageImage}`);
    }

    create () {
        let anchoCanvas = this.scale.width;
        let altoCanvas = this.scale.height;

        const fondo = this.add.image(anchoCanvas / 2, altoCanvas / 2, 'bg');
        if (fondo) fondo.setDisplaySize(anchoCanvas, altoCanvas);

        const altoSuelo = 100;
        const posicionYSuelo = altoCanvas - (altoCanvas * 0.25); 
        this.ground = this.add.rectangle(anchoCanvas / 2, posicionYSuelo, anchoCanvas, altoSuelo, 0x000000, 0);
        this.physics.add.existing(this.ground, true);
        this.ground.body.setSize(anchoCanvas, altoSuelo - 20);

        if (!this.textures.exists('txt_rojo')) {
            const canvasRojo = this.textures.createCanvas('txt_rojo', 60, 90);
            canvasRojo.context.fillStyle = '#ff0000';
            canvasRojo.context.fillRect(0, 0, 60, 90);
            canvasRojo.refresh();
        }

        if (!this.textures.exists('txt_verde')) {
            const canvasVerde = this.textures.createCanvas('txt_verde', 60, 90);
            canvasVerde.context.fillStyle = '#00ff00';
            canvasVerde.context.fillRect(0, 0, 60, 90);
            canvasVerde.refresh();
        }

        const playerOffsetY = 95;
        this.player1 = this.physics.add.sprite(anchoCanvas * 0.25, posicionYSuelo - playerOffsetY, 'txt_rojo');
        this.player1.setCollideWorldBounds(true);
        this.player1.body.setGravityY(1200);
        this.player1.body.setBounce(0);

        this.player2 = this.physics.add.sprite(anchoCanvas * 0.75, posicionYSuelo - playerOffsetY, 'txt_verde');
        this.player2.setCollideWorldBounds(true);
        this.player2.body.setGravityY(1200);
        this.player2.body.setBounce(0);

        this.physics.add.collider(this.player1, this.ground);
        this.physics.add.collider(this.player2, this.ground);

        this.keysWASD = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update () {
        const speed = 350;
        const jumpForce = -650; 

        if (this.keysWASD.left.isDown) this.player1.setVelocityX(-speed);
        else if (this.keysWASD.right.isDown) this.player1.setVelocityX(speed);
        else this.player1.setVelocityX(0);
        if (this.keysWASD.up.isDown && this.player1.body.touching.down) this.player1.setVelocityY(jumpForce);

        if (this.cursors.left.isDown) this.player2.setVelocityX(-speed);
        else if (this.cursors.right.isDown) this.player2.setVelocityX(speed);
        else this.player2.setVelocityX(0);
        if (this.cursors.up.isDown && this.player2.body.touching.down) this.player2.setVelocityY(jumpForce);

        let distY = Math.abs(this.player1.y - this.player2.y);
        let distX = Math.abs(this.player1.x - this.player2.x);

        if (distX < 55 && distY < 80) {
            let repulsion = 5;
            if (this.player1.x < this.player2.x) {
                this.player1.x -= repulsion;
                this.player2.x += repulsion;
            } else {
                this.player1.x += repulsion;
                this.player2.x -= repulsion;
            }
        }
    }
}