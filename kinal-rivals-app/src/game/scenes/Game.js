import { Scene } from 'phaser';
import * as Phaser from 'phaser';

export class Game extends Scene {
    constructor () {
        super('Game');
    }

    init(data) {
        this.selectedStage = data.stage || 'stage_kinal';
        this.selectedCharacters = Array.isArray(data.characters) && data.characters.length >= 2
            ? data.characters.slice(0, 2)
            : ['30', '31'];
        this.redCharacter = this.selectedCharacters[0] || '30';
        this.greenCharacter = this.selectedCharacters[1] || '31';
    }

    getStageBackgroundImage(stage) {
        switch (stage) {
            case 'stage_kinal':
                return 'Entrada_kinal.png';
            case 'stage_construccion':
                return 'Construccion_kinal.png';
            case 'stage_canchas':
                return 'Canchas_kinal.png';
            case 'stage_bg':
                return 'bg.png';
            default:
                return 'bg.png';
        }
    }

    preload () {
        this.load.setPath('assets');
        const stageImage = this.getStageBackgroundImage(this.selectedStage);
        this.load.image('bg', stageImage);
        this.load.image('blockTex', 'Tierra.jpeg');

        this.load.image(this.redCharacter, `${this.redCharacter}.png`);
        this.load.image(this.greenCharacter, `${this.greenCharacter}.png`);
    }

    create () {
        let anchoCanvas = this.scale.width;
        let altoCanvas = this.scale.height;

        const fondo = this.add.image(anchoCanvas / 2, altoCanvas / 2, 'bg');
        if (fondo) fondo.setDisplaySize(anchoCanvas, altoCanvas);

        const cmToPx = (cm) => Math.round(cm * (96 * (window.devicePixelRatio || 1) / 2.54));
        const groundShift = cmToPx(20);
        const extraGroundUpPx = cmToPx(5);
        const groundHeight = Math.max(220, Math.round(altoCanvas * 0.10));
        let posicionYSuelo = altoCanvas - (altoCanvas * 0.25) + groundShift - extraGroundUpPx;
        const maxY = altoCanvas - groundHeight / 2;
        if (posicionYSuelo > maxY) posicionYSuelo = maxY;

        this.ground = this.add.rectangle(0, posicionYSuelo, anchoCanvas, groundHeight, 0x000000, 0);
        this.ground.setOrigin(0, 0.5);
        this.physics.add.existing(this.ground, true);
        this.ground.body.setSize(anchoCanvas, groundHeight);
        this.ground.body.setOffset(0, -groundHeight / 2);

        const playerOffsetY = 95;
        const raiseY = Math.round(altoCanvas * 0.18);
        const maxRaisePossible = Math.max(0, posicionYSuelo - playerOffsetY - 50);
        const finalRaiseY = Math.min(raiseY, maxRaisePossible);
        const playerY = posicionYSuelo - playerOffsetY - finalRaiseY;

        this.player1 = this.physics.add.sprite(anchoCanvas * 0.25, playerY, this.redCharacter);
        this.player1.setCollideWorldBounds(true);
        this.player1.body.setGravityY(1200);
        this.player1.body.setBounce(0);
        this.player1.setDisplaySize(350, 350);

        this.player2 = this.physics.add.sprite(anchoCanvas * 0.75, playerY, this.greenCharacter);
        this.player2.setCollideWorldBounds(true);
        this.player2.body.setGravityY(1200);
        this.player2.body.setBounce(0);
        this.player2.setDisplaySize(350, 350);

        const p1BodyW = Math.round(this.player1.displayWidth * 0.6);
        const p1BodyH = Math.round(this.player1.displayHeight * 0.9);
        this.player1.body.setSize(p1BodyW, p1BodyH);
        const p1OffsetX = Math.round((this.player1.displayWidth - p1BodyW) / 2);
        const p1OffsetY = Math.round((this.player1.displayHeight - p1BodyH) / 2);
        this.player1.body.setOffset(p1OffsetX, p1OffsetY);

        const p2BodyW = Math.round(this.player2.displayWidth * 0.6);
        const p2BodyH = Math.round(this.player2.displayHeight * 0.9);
        this.player2.body.setSize(p2BodyW, p2BodyH);
        this.player2.body.setOffset(Math.round((this.player2.displayWidth - p2BodyW) / 2), Math.round((this.player2.displayHeight - p2BodyH) / 2));
        if (this.player1.body) {
            this.player1.body.allowGravity = false;
            this.player1.body.setVelocity(0, 0);
        }
        if (this.player2.body) {
            this.player2.body.allowGravity = false;
            this.player2.body.setVelocity(0, 0);
        }
        this.player2.setDisplaySize(this.player1.displayWidth, this.player1.displayHeight);

        this.physics.add.collider(this.player1, this.ground);
        this.physics.add.collider(this.player2, this.ground);

        this.time.delayedCall(50, () => {
            this.player2.setPosition(anchoCanvas * 0.75, this.player1.y);
            if (this.player2.body && this.player2.body.reset) this.player2.body.reset(this.player2.x, this.player2.y);
            if (this.player1.body && this.player1.body.reset) this.player1.body.reset(this.player1.x, this.player1.y);
            if (this.player1.body) {
                this.player1.body.setVelocity(0, 0);
                this.player1.body.allowGravity = true;
            }
            if (this.player2.body) {
                this.player2.body.setVelocity(0, 0);
                this.player2.body.allowGravity = true;
            }
        });

        this.blocks = this.physics.add.staticGroup();
        this.physics.add.collider(this.player1, this.blocks);
        this.physics.add.collider(this.player2, this.blocks);

        this.placeKeys = this.input.keyboard.addKeys({ p1: Phaser.Input.Keyboard.KeyCodes.F, p2: Phaser.Input.Keyboard.KeyCodes.L });
        this.input.keyboard.on('keydown-F', () => this.placeBlock(this.player1, 1));
        this.input.keyboard.on('keydown-L', () => this.placeBlock(this.player2, 2));

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

    placeBlock(player, playerIndex) {
        if (!player || !player.body) return;
        const bw = 100;
        const bh = 100;

        const offsetX = playerIndex === 1 ? Math.round(bw * 1.2) : -Math.round(bw * 1.2);
        const bx = player.x + offsetX;
        const by = player.y;

        const b = this.physics.add.staticImage(bx, by, 'blockTex').setOrigin(0.5);
        b.setDisplaySize(bw, bh);
        if (b.body) {
            if (typeof b.body.setSize === 'function') b.body.setSize(bw, bh);
            if (typeof b.body.refreshBody === 'function') b.body.refreshBody();
        }
        if (this.blocks && typeof this.blocks.add === 'function') this.blocks.add(b);
        if (this.player1) this.physics.add.collider(this.player1, b);
        if (this.player2) this.physics.add.collider(this.player2, b);
    }
}