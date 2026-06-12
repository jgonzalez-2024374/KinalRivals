import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class CharacterSelect extends Scene {
    constructor() {
        super('CharacterSelect');
    }

    preload() {
        // load any character thumbnails if you add them later
    }

    create() {
        // simple background
        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x111111).setOrigin(0);

        this.add.text(this.scale.width / 2, 64, 'Seleccionar Personaje', { fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff' }).setOrigin(0.5);

        // Placeholder character cards
        const cols = 4;
        const padding = 24;
        const cardW = Math.min(160, Math.floor((this.scale.width - padding * (cols + 1)) / cols));
        const cardH = 220;
        const startY = 140;

        const names = ['Ixchel', 'Koj', 'Balam', 'Chac', 'Itzel', 'Kan', 'Tzul', 'Akil'];

        names.forEach((name, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = padding + col * (cardW + padding) + cardW / 2;
            const y = startY + row * (cardH + padding) + cardH / 2;

            const g = this.add.graphics();
            g.fillStyle(0x2b2b2b, 1);
            g.fillRoundedRect(x - cardW / 2, y - cardH / 2, cardW, cardH, 8);
            g.lineStyle(2, 0x444444, 1);
            g.strokeRoundedRect(x - cardW / 2, y - cardH / 2, cardW, cardH, 8);

            const t = this.add.text(x, y + cardH / 2 - 22, name, { fontFamily: 'Arial', fontSize: 18, color: '#ffffff' }).setOrigin(0.5);

            // simple select on click
            const zone = this.add.zone(x, y, cardW, cardH).setOrigin(0.5).setInteractive();
            zone.on('pointerdown', () => {
                // mark selection (simple visual)
                g.clear();
                g.fillStyle(0x4a90e2, 1);
                g.fillRoundedRect(x - cardW / 2, y - cardH / 2, cardW, cardH, 8);
                g.lineStyle(2, 0x1f4f8b, 1);
                g.strokeRoundedRect(x - cardW / 2, y - cardH / 2, cardW, cardH, 8);
            });
        });

        // Continue to Game (placeholder) button
        const startBtn = this.add.text(this.scale.width / 2, this.scale.height - 64, 'Iniciar', { fontFamily: 'Arial', fontSize: 22, color: '#222222', backgroundColor: '#dddddd', padding: { x: 12, y: 8 } }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        // Selected data
        this.selectedCharacters = [];
        this.selectedStage = null;

        startBtn.on('pointerdown', () => {
            // Emit selections so other scenes (Game) can pick them up
            EventBus.emit('selection-made', { characters: this.selectedCharacters, stage: this.selectedStage });
            this.scene.start('Game');
        });

        // resize handler
        this.scale.on('resize', (gameSize) => {
            const { width, height } = gameSize;
            startBtn.setPosition(width / 2, height - 64);
        });

        // --- Stage selection panel ---
        const stages = [
            { key: 'stage_kinal', name: 'Kinal Construcción' },
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

        stages.forEach((s, i) => {
            const x = startX + i * (thumbW + gap) + thumbW / 2;
            const y = ty + thumbH / 2;

            const img = this.add.image(x, y, s.key).setDisplaySize(thumbW, thumbH).setOrigin(0.5);
            const g = this.add.graphics();
            // border
            g.lineStyle(3, 0x666666, 1);
            g.strokeRoundedRect(x - thumbW / 2 - 4, y - thumbH / 2 - 4, thumbW + 8, thumbH + 8, 8);

            const label = this.add.text(x, y + thumbH / 2 + 18, s.name, { fontFamily: 'Arial', fontSize: 16, color: '#ffffff' }).setOrigin(0.5);

            const zone = this.add.zone(x, y, thumbW, thumbH).setOrigin(0.5).setInteractive();
            zone.on('pointerdown', () => {
                // mark selection visually
                this.stageThumbs.forEach(t => {
                    t.g.clear();
                    t.g.lineStyle(3, 0x666666, 1);
                    t.g.strokeRoundedRect(t.x - thumbW / 2 - 4, t.y - thumbH / 2 - 4, thumbW + 8, thumbH + 8, 8);
                });
                g.clear();
                g.lineStyle(4, 0x4a90e2, 1);
                g.strokeRoundedRect(x - thumbW / 2 - 4, y - thumbH / 2 - 4, thumbW + 8, thumbH + 8, 8);
                this.selectedStage = s.key;
                EventBus.emit('stage-selected', s.key);
            });

            this.stageThumbs.push({ key: s.key, x, y, g });
        });
    }
}
