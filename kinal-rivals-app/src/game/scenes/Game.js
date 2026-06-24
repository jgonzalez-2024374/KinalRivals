import { Scene } from 'phaser';
import * as Phaser from 'phaser';

export class Game extends Scene {
    constructor () {
        super('Game');
    }

    createHeartString(count) {
        return '♥'.repeat(Math.max(0, count));
    }

    createHud(anchoCanvas, altoCanvas) {
        const nameStyle = {
            fontFamily: 'Minecraftia',
            fontSize: 28,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        };

        const heartsStyle = {
            fontFamily: 'Arial',
            fontSize: 26,
            color: '#ff4d4d',
            stroke: '#000000',
            strokeThickness: 3
        };

        this.player1NameText = this.add.text(24, 14, 'Jugador 1', nameStyle)
            .setScrollFactor(0)
            .setDepth(100);

        this.player1HeartsText = this.add.text(24, 44, this.createHeartString(this.player1Health), heartsStyle)
            .setScrollFactor(0)
            .setDepth(100);

        this.player2NameText = this.add.text(anchoCanvas - 24, 14, 'Jugador 2', nameStyle)
            .setOrigin(1, 0)
            .setScrollFactor(0)
            .setDepth(100);

        this.player2HeartsText = this.add.text(anchoCanvas - 24, 44, this.createHeartString(this.player2Health), heartsStyle)
            .setOrigin(1, 0)
            .setScrollFactor(0)
            .setDepth(100);

        this.createInventoryRow(24, altoCanvas - 34, 'left');
        this.createInventoryRow(anchoCanvas - 24, altoCanvas - 34, 'right');
    }

    createInventoryRow(anchorX, anchorY, side) {
        const slotSize = 42;
        const gap = 6;
        const slots = 5;
        const totalWidth = (slotSize * slots) + (gap * (slots - 1));
        const startX = side === 'left' ? anchorX : anchorX - totalWidth;

        for (let index = 0; index < slots; index++) {
            const x = startX + (index * (slotSize + gap)) + (slotSize / 2);
            const slot = this.add.rectangle(x, anchorY, slotSize, slotSize, 0x8a8a8a, 1)
                .setStrokeStyle(2, 0x2f2f2f, 1)
                .setScrollFactor(0)
                .setDepth(100);

            slot.setAlpha(0.95);
        }
    }

    refreshHealthHud() {
        if (this.player1HeartsText) {
            this.player1HeartsText.setText(this.createHeartString(this.player1Health));
        }

        if (this.player2HeartsText) {
            this.player2HeartsText.setText(this.createHeartString(this.player2Health));
        }
    }

    endMatch() {
        if (this.matchEnded) return;

        this.matchEnded = true;
        this.gameStarted = false;

        if (this.player1?.body) {
            this.player1.body.setVelocity(0, 0);
            this.player1.body.allowGravity = false;
        }

        if (this.player2?.body) {
            this.player2.body.setVelocity(0, 0);
            this.player2.body.allowGravity = false;
        }

        this.timeOverImage = this.add.image(this.scale.width / 2, this.scale.height / 2, 'tiempo')
            .setOrigin(0.5)
            .setDepth(200);

        const maxWidth = this.scale.width * 0.7;
        const targetScale = this.timeOverImage.width > maxWidth ? maxWidth / this.timeOverImage.width : 1;

        this.timeOverImage.setAlpha(0);
        this.timeOverImage.setScale(targetScale * 0.6);

        this.tweens.add({
            targets: this.timeOverImage,
            alpha: 1,
            scaleX: targetScale,
            scaleY: targetScale,
            duration: 450,
            ease: 'Back.Out'
        });
    }

    init(data) {
        this.selectedStage = data.stage || 'stage_kinal';
        this.selectedCharacters = Array.isArray(data.characters) && data.characters.length >= 2
            ? data.characters.slice(0, 2)
            : ['30', '31'];
        this.redCharacter = this.selectedCharacters[0] || '30';
        this.greenCharacter = this.selectedCharacters[1] || '31';
        this.player1Health = 8;
        this.player2Health = 8;
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
        this.load.image('tiempo', 'Tiempo.png');

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

        this.timeRemaining = 120;
        this.gameStarted = false;
        this.matchEnded = false;
        this.countdownValue = 3;
        this.createHud(anchoCanvas, altoCanvas);
        this.timerText = this.add.text(anchoCanvas / 2, 50, '3', {
            fontFamily: 'Minecraftia',
            fontSize: 64,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(100);
        this.lastTimeUpdate = 0;

        this.time.delayedCall(1000, () => {
            this.countdownValue = 2;
            this.timerText.setText('2');
        });

        this.time.delayedCall(2000, () => {
            this.countdownValue = 1;
            this.timerText.setText('1');
        });

        this.time.delayedCall(3000, () => {
            this.gameStarted = true;
            this.countdownValue = 0;
            this.timerText.setText('02:00');
            this.timerText.setFontSize(48);
            this.lastTimeUpdate = this.game.getTime();
        });
    }

    update () {
        const speed = 350;
        const jumpForce = -650;

        if (this.gameStarted && this.timeRemaining > 0 && this.game.getTime() - this.lastTimeUpdate >= 1000) {
            this.timeRemaining--;
            this.lastTimeUpdate = this.game.getTime();
            const minutes = Math.floor(this.timeRemaining / 60);
            const seconds = this.timeRemaining % 60;
            this.timerText.setText(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
            
            if (this.timeRemaining <= 0) {
                this.timerText.setColor('#ff0000');
                this.timerText.setText('00:00');
                this.endMatch();
                return;
            }
        }

        if (this.matchEnded) {
            return;
        }

        if (this.gameStarted) {
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