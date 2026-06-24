import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class CharacterSelect extends Scene {
    constructor() {
        super('CharacterSelect');
    }

    preload() {
        this.load.setPath('assets');
        this.load.image('charactersBg', 'Pasillo.png');
        this.load.image('card26', '26.png');
        this.load.image('card28', '28.png');
        this.load.image('card29', '29.png');
        this.load.image('card30', '30.png');
        this.load.image('card31', '31.png');
        this.load.image('card32', '32.png');
        this.load.image('card33', '33.png');
        this.load.image('Azul', 'Azul.png');
        this.load.image('Corinto', 'Corinto.png');
    }

    create() {
        if (this.textures.exists('charactersBg')) {
            this.background = this.add.image(0, 0, 'charactersBg').setOrigin(0).setDisplaySize(this.scale.width, this.scale.height);
            this.background.setScrollFactor(0);
            this.background.setDepth(-1);
        } else {
            this.background = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x111111).setOrigin(0);
        }

        const title = this.add.text(
            this.scale.width / 2,
            70,
            '⚔ SELECCIONA TU PROMOCIÓN ⚔',
            {
                fontFamily: 'Minecraftia',
                fontSize: 42,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 6
            }
        ).setOrigin(0.5);

        this.tweens.add({
            targets: title,
            scale: 1.04,
            duration: 1200,
            yoyo: true,
            repeat: -1
        });

        const cols = 5;
        const padding = 24;
        const cardW = Math.min(240, Math.floor((this.scale.width - padding * (cols + 1)) / cols));
        const cardH = 320;
        const startY = 70;
        const footerHeight = 100;
        
        const visibleRows = 2;
        const visibleHeight = visibleRows * (cardH + padding) + padding;
        const totalHeight = this.scale.height - startY - footerHeight;
        const containerHeight = Math.min(visibleHeight, totalHeight);

        const names = ['26', '28', '29', '30', '31', '32', '33', 'Azul', 'Corinto'];
        this.selectedCharacters = [];
        this.cardSelections = [];

        const cardsContainer = this.add.container(0, 0);
        
        const maskGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        maskGraphics.fillStyle(0xffffff);
        maskGraphics.fillRect(0, startY, this.scale.width, containerHeight);
        const mask = maskGraphics.createGeometryMask();
        cardsContainer.setMask(mask);

        let scrollOffset = 0;

        const updateCardBorders = () => {
            this.cardSelections.forEach((card) => {
                card.g.clear();
                const selectionIndex = this.selectedCharacters.indexOf(card.name);
                if (selectionIndex !== -1) {
                    const borderColor = selectionIndex === 0 ? 0x00ffff : 0xff0000;
                    card.g.lineStyle(4, borderColor, 1);
                } else {
                    card.g.lineStyle(2, 0x444444, 1);
                }
                card.g.strokeRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 8);
            });
        };

        const toggleSelection = (card) => {
            const index = this.selectedCharacters.indexOf(card.name);
            if (index !== -1) {
                this.selectedCharacters.splice(index, 1);
                card.selected = false;
            } else if (this.selectedCharacters.length < 2) {
                this.selectedCharacters.push(card.name);
                card.selected = true;
            }
            updateCardBorders();
            setStartBtnEnabled(true);
        };

        const contentHeight = Math.ceil(names.length / cols) * (cardH + padding) + padding;
        const maxScroll = Math.max(0, contentHeight - containerHeight);

        const cardObjects = [];

        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            scrollOffset = Phaser.Math.Clamp(scrollOffset + deltaY * 0.5, 0, maxScroll);
            cardObjects.forEach(obj => {
                obj.y = obj.originalY - scrollOffset;
            });
        });

        names.forEach((name, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = padding + col * (cardW + padding) + cardW / 2;
            const y = padding + row * (cardH + padding) + cardH / 2;

            const g = this.add.graphics();
            g.lineStyle(2, 0x444444, 1);
            g.strokeRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 8);
            g.x = x;
            g.y = startY + y;
            g.originalY = g.y;
            cardsContainer.add(g);
            cardObjects.push(g);

            const cardTextureKey = `card${name}`;
            const textureKey = this.textures.exists(cardTextureKey) ? cardTextureKey : name;
            if (this.textures.exists(textureKey)) {
                const img = this.add.image(x, startY + y, textureKey).setDisplaySize(cardW - 16, cardH - 16).setOrigin(0.5).setDepth(1);
                img.originalY = img.y;
                cardsContainer.add(img);
                cardObjects.push(img);
            } else {
                const rect = this.add.rectangle(x, startY + y, cardW - 16, cardH - 16, 0x2b2b2b, 1).setOrigin(0.5);
                const txt = this.add.text(x, startY + y + cardH / 2 - 22, name, { fontFamily: 'Arial', fontSize: 18, color: '#ffffff' }).setOrigin(0.5);
                rect.originalY = rect.y;
                txt.originalY = txt.y;
                cardsContainer.add(rect);
                cardsContainer.add(txt);
                cardObjects.push(rect);
                cardObjects.push(txt);
            }

            const cardInfo = { name, x, y: startY + y, g, selected: false };
            this.cardSelections.push(cardInfo);

            const zone = this.add.zone(x, startY + y, cardW, cardH).setOrigin(0.5).setInteractive();
            zone.originalY = zone.y;
            zone.on('pointerdown', () => toggleSelection(cardInfo));
            cardsContainer.add(zone);
            cardObjects.push(zone);
        });

        const createStyledButton = (x, y, text) => {
            const btnWidth = 180;
            const btnHeight = 50;
            const radius = 8;

            const bg = this.add.graphics();
            
            const redrawButton = (fillColor) => {
                bg.clear();
                bg.fillStyle(fillColor, 1);
                bg.fillRoundedRect(x - btnWidth / 2, y - btnHeight / 2, btnWidth, btnHeight, radius);
                bg.lineStyle(5, 0xff6a00, 1);
                bg.strokeRoundedRect(x - btnWidth / 2, y - btnHeight / 2, btnWidth, btnHeight, radius);
            };

            redrawButton(0x021022);
            bg.setDepth(1);

            const txt = this.add.text(x, y, text, {
                fontFamily: 'Minecraftia',
                fontSize: 24,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(2);

            return { bg, txt, x, y, btnWidth, btnHeight, redrawButton };
        };

        const startBtn = createStyledButton(this.scale.width - 130, this.scale.height - 70, 'CONTINUAR');
        const backBtn = createStyledButton(this.scale.width - 360, this.scale.height - 70, 'VOLVER');

        const setStartBtnEnabled = (enabled) => {
            const canStart = enabled && this.selectedCharacters && this.selectedCharacters.length === 2;
            if (canStart) {
                startBtn.redrawButton(0x041428);
            } else {
                startBtn.redrawButton(0x021022);
            }
        };

        setStartBtnEnabled(false);

        startBtn.txt.on('pointerdown', () => {
            if (!this.selectedCharacters || this.selectedCharacters.length !== 2) return;
            this.scene.start('StageSelect', { characters: this.selectedCharacters });
        });

        startBtn.txt.on('pointerover', () => {
            startBtn.redrawButton(0x041428);
            startBtn.txt.setScale(1.05);
        });

        startBtn.txt.on('pointerout', () => {
            if (this.selectedCharacters.length === 2) {
                startBtn.redrawButton(0x041428);
            } else {
                startBtn.redrawButton(0x021022);
            }
            startBtn.txt.setScale(1);
        });

        backBtn.txt.on('pointerdown', () => {
            this.scene.start('Rules');
        });

        backBtn.txt.on('pointerover', () => {
            backBtn.redrawButton(0x041428);
            backBtn.txt.setScale(1.05);
        });

        backBtn.txt.on('pointerout', () => {
            backBtn.redrawButton(0x021022);
            backBtn.txt.setScale(1);
        });

        this.scale.on('resize', (gameSize) => {
            const { width, height } = gameSize;
            startBtn.bg.setPosition(width - 130, height - 70);
            startBtn.txt.setPosition(width - 130, height - 70);
            backBtn.bg.setPosition(width - 360, height - 70);
            backBtn.txt.setPosition(width - 360, height - 70);
            startBtn.x = width - 130;
            startBtn.y = height - 70;
            backBtn.x = width - 360;
            backBtn.y = height - 70;
            startBtn.redrawButton(this.selectedCharacters.length === 2 ? 0x041428 : 0x021022);
            backBtn.redrawButton(0x021022);
            if (this.background) {
                this.background.setDisplaySize(width, height);
            }
        });

        updateCardBorders();
    }
}
