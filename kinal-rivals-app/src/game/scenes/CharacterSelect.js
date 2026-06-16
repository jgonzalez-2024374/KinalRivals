import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class CharacterSelect extends Scene {
    constructor() {
        super('CharacterSelect');
    }

    preload() {
        // Cargar los recursos de selección de personajes
        this.load.setPath('assets');
        this.load.image('charactersBg', 'Personajes.png');
        this.load.image('card30', '30.png');
        this.load.image('card31', '31.png');
        this.load.image('card32', '32.png');
        this.load.image('card33', '33.png');
    }

    create() {
        // imagen de fondo a pantalla completa fija
        if (this.textures.exists('charactersBg')) {
            this.background = this.add.image(0, 0, 'charactersBg').setOrigin(0).setDisplaySize(this.scale.width, this.scale.height);
            this.background.setScrollFactor(0);
            this.background.setDepth(-1);
        } else {
            this.background = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x111111).setOrigin(0);
        }

        this.add.text(this.scale.width / 2, 64, 'Seleccionar Personaje', { fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff' }).setOrigin(0.5);

        // tarjetas de personajes
        const cols = 4;
        const padding = 24;
        const cardW = Math.min(240, Math.floor((this.scale.width - padding * (cols + 1)) / cols));
        const cardH = 320;
        const startY = 140;

        const names = ['30', '31', '32', '33'];
        this.selectedCharacters = [];
        this.cardSelections = [];

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
                card.g.strokeRoundedRect(card.x - cardW / 2, card.y - cardH / 2, cardW, cardH, 8);
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

        names.forEach((name, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = padding + col * (cardW + padding) + cardW / 2;
            const y = startY + row * (cardH + padding) + cardH / 2;

            const g = this.add.graphics();
            g.lineStyle(2, 0x444444, 1);
            g.strokeRoundedRect(x - cardW / 2, y - cardH / 2, cardW, cardH, 8);

            const textureKey = `card${name}`;
            if (this.textures.exists(textureKey)) {
                this.add.image(x, y, textureKey).setDisplaySize(cardW - 16, cardH - 16).setOrigin(0.5).setDepth(1);
            } else {
                this.add.rectangle(x, y, cardW - 16, cardH - 16, 0x2b2b2b, 1).setOrigin(0.5);
                this.add.text(x, y + cardH / 2 - 22, name, { fontFamily: 'Arial', fontSize: 18, color: '#ffffff' }).setOrigin(0.5);
            }

            const cardInfo = { name, x, y, g, selected: false };
            this.cardSelections.push(cardInfo);

            const zone = this.add.zone(x, y, cardW, cardH).setOrigin(0.5).setInteractive();
            zone.on('pointerdown', () => toggleSelection(cardInfo));
        });

        // botón Siguiente
        const startBtn = this.add.text(this.scale.width / 2, this.scale.height - 64, 'Siguiente', { fontFamily: 'Arial', fontSize: 22, color: '#222222', backgroundColor: '#dddddd', padding: { x: 12, y: 8 } }).setOrigin(0.5);

        const setStartBtnEnabled = (enabled) => {
            const canStart = enabled && this.selectedCharacters && this.selectedCharacters.length === 2;
            if (canStart) {
                startBtn.setInteractive({ useHandCursor: true });
                startBtn.setStyle({ backgroundColor: '#88cc88', color: '#061a06' });
            } else {
                startBtn.disableInteractive();
                startBtn.setStyle({ backgroundColor: '#dddddd', color: '#222222' });
            }
        };

        // inicialmente deshabilitado
        setStartBtnEnabled(false);

        startBtn.on('pointerdown', () => {
            if (!this.selectedCharacters || this.selectedCharacters.length !== 2) return;
            this.scene.start('StageSelect', { characters: this.selectedCharacters });
        });

        // manejador de redimensionamiento
        this.scale.on('resize', (gameSize) => {
            const { width, height } = gameSize;
            startBtn.setPosition(width / 2, height - 64);
            if (this.background) {
                this.background.setDisplaySize(width, height);
            }
        });

        updateCardBorders();
    }
}
