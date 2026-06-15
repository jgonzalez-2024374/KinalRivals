import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class CharacterSelect extends Scene {
    constructor() {
        super('CharacterSelect');
    }

    preload() {
        // Cargar los recursos de selección de personajes desde la misma carpeta assets que el resto del juego.
        this.load.setPath('assets');
        this.load.image('charactersBg', 'Personajes.png');
        this.load.image('card30', '30.png');
        this.load.image('card31', '31.png');
        this.load.image('card32', '32.png');
        this.load.image('card33', '33.png');
        this.load.image('stage_kinal', 'Entrada_kinal.png');
        this.load.image('stage_tierra', 'Tierra.jpeg');
        this.load.image('stage_bg', 'bg.png');
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

        // tarjetas de personajes temporales
        const cols = 4;
        const padding = 24;
        const cardW = Math.min(160, Math.floor((this.scale.width - padding * (cols + 1)) / cols));
        const cardH = 220;
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

        // botón Continuar al Juego (temporal)
        const startBtn = this.add.text(this.scale.width / 2, this.scale.height - 64, 'Iniciar', { fontFamily: 'Arial', fontSize: 22, color: '#222222', backgroundColor: '#dddddd', padding: { x: 12, y: 8 } }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        // datos seleccionados
        this.selectedStage = null;

        startBtn.on('pointerdown', () => {
            // emitir selecciones para que otras escenas (Game) las reciban
            EventBus.emit('selection-made', { characters: this.selectedCharacters, stage: this.selectedStage });
            this.scene.start('Game', {
                stage: this.selectedStage || 'stage_kinal',
                characters: this.selectedCharacters,
            });
        });

        // manejador de redimensionamiento
        this.scale.on('resize', (gameSize) => {
            const { width, height } = gameSize;
            startBtn.setPosition(width / 2, height - 64);
            if (this.background) {
                this.background.setDisplaySize(width, height);
            }
        });

        // --- panel de selección de escenario ---
        const stages = [
            { key: 'stage_kinal', name: 'Entrada kinal' },
            { key: 'stage_tierra', name: 'Tierra' },
            { key: 'stage_bg', name: 'Plaza' }
        ];

        const thumbW = 200;
        const thumbH = 120;
        const gap = 24;
        const totalW = stages.length * thumbW + (stages.length - 1) * gap;
        const startX = Math.max(padding, Math.floor((this.scale.width - totalW) / 2));
        const ty = startY + (Math.ceil(names.length / cols) * (cardH + padding)) + 36;

        this.stageThumbs = [];

        const updateStageBorders = () => {
            this.stageThumbs.forEach((t) => {
                t.g.clear();
                if (t.selected) {
                    t.g.lineStyle(4, 0xffa500, 1);
                } else {
                    t.g.lineStyle(3, 0x666666, 1);
                }
                t.g.strokeRoundedRect(t.x - thumbW / 2 - 4, t.y - thumbH / 2 - 4, thumbW + 8, thumbH + 8, 8);
            });
        };

        stages.forEach((s, i) => {
            const x = startX + i * (thumbW + gap) + thumbW / 2;
            const y = ty + thumbH / 2;

            const img = this.add.image(x, y, s.key).setDisplaySize(thumbW, thumbH).setOrigin(0.5);
            const g = this.add.graphics();
            g.lineStyle(3, 0x666666, 1);
            g.strokeRoundedRect(x - thumbW / 2 - 4, y - thumbH / 2 - 4, thumbW + 8, thumbH + 8, 8);

            const label = this.add.text(x, y + thumbH / 2 + 18, s.name, { fontFamily: 'Arial', fontSize: 16, color: '#ffffff' }).setOrigin(0.5);

            const stageInfo = { key: s.key, x, y, g, selected: false };
            this.stageThumbs.push(stageInfo);

            const zone = this.add.zone(x, y, thumbW, thumbH).setOrigin(0.5).setInteractive();
            zone.on('pointerdown', () => {
                this.stageThumbs.forEach((t) => t.selected = false);
                stageInfo.selected = true;
                updateStageBorders();
                this.selectedStage = s.key;
                EventBus.emit('stage-selected', s.key);
            });
        });

        updateStageBorders();
    }
}
