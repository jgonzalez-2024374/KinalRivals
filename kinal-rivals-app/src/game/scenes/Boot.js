import * as Phaser from 'phaser';
import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        this.load.image('background', 'assets/Inicio.png');
    }

    create ()
    {
        try {
            if (typeof document !== 'undefined' && document && document.body) {
                document.body.style.overflow = 'hidden';
            }
        } catch (e) {
        }

        const bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
        bg.setDisplaySize(this.scale.width, this.scale.height);

        this.scale.on('resize', (gameSize) => {
            const { width, height } = gameSize;
            bg.setDisplaySize(width, height);
            if (this.startButton) {
                this.startButton.setPosition(width / 2, height * 0.9);
            }
        });

        const sampleColorFromImage = (img) => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const x = Math.floor(img.width / 2);
                const y = Math.floor(img.height / 2);
                const data = ctx.getImageData(x, y, 1, 1).data;
                const toHex = (n) => n.toString(16).padStart(2, '0');
                return `#${toHex(data[0])}${toHex(data[1])}${toHex(data[2])}`;
            } catch (e) {
                return '#bebebe'; 
            }
        };

        let btnColor = '#bebebe';
        try {
            const img = this.textures.get('background').getSourceImage();
            if (img) {
                btnColor = sampleColorFromImage(img);
            }
        } catch (e) {
        }

        const btnWidth = Math.min(360, Math.floor(this.scale.width * 0.6));
        const btnHeight = 72;
        const x = this.scale.width / 2;
        const y = this.scale.height * 0.9;

        const graphics = this.add.graphics();
        const radius = 14;

        const drawButton = (g, w, h, hover = false) => {
            g.clear();
            const topColor = hover ? 0xffe77d : 0xffd15b;
            const midColor = hover ? 0xffb74c : 0xf7a900;
            const bottomColor = hover ? 0xd18f08 : 0xd27600;
            g.fillGradientStyle(topColor, midColor, bottomColor, 0xffd45a, 1);
            g.fillRoundedRect(-w / 2, -h / 2, w, h, radius);
            g.fillStyle(0xffffff, hover ? 0.25 : 0.16);
            g.fillRoundedRect(-w / 2 + 10, -h / 2 + 10, w - 20, h / 2 - 14, radius / 1.5);
            g.lineStyle(6, 0xf5bb30, 1);
            g.strokeRoundedRect(-w / 2, -h / 2, w, h, radius);
            g.lineStyle(2, 0xfff5c3, 0.7);
            g.strokeRoundedRect(-w / 2 + 4, -h / 2 + 4, w - 8, h - 8, radius - 2);
            g.lineStyle(1, 0xffffff, 0.3);
            g.strokeRoundedRect(-w / 2 + 8, -h / 2 + 8, w - 16, h - 16, radius - 4);
        };

        drawButton(graphics, btnWidth, btnHeight, false);

        const icon = this.add.text(-btnWidth * 0.18, 0, '▶', { fontFamily: 'Arial Black', fontSize: '26px', color: '#ffffff', stroke: '#7f4508', strokeThickness: 5 }).setOrigin(0.5);
        const txt = this.add.text(btnWidth * 0.08, 0, 'JUGAR', { fontFamily: 'Arial Black', fontSize: '28px', color: '#ffffff', stroke: '#7f4508', strokeThickness: 6 }).setOrigin(0.5);

        const container = this.add.container(x, y, [graphics, icon, txt]);
        container.setSize(btnWidth, btnHeight);
        container.setDepth(10);

        const hitArea = this.add.zone(x, y, btnWidth, btnHeight).setOrigin(0.5).setInteractive();

        const setHover = (over) => {
            container.setScale(over ? 1.03 : 1);
            drawButton(graphics, btnWidth, btnHeight, over);
        };

        hitArea.on('pointerover', () => setHover(true));
        hitArea.on('pointerout', () => setHover(false));
            hitArea.on('pointerdown', () => {
            try {
                if (typeof document !== 'undefined' && document && document.body) {
                    document.body.style.overflow = '';
                }
            } catch (e) {}
                // Abrir primero la escena Rules, luego el jugador continuará a selección de personaje
                this.scene.start('Rules');
        });

        this.startButton = container;

        this.scale.on('resize', (gameSize) => {
            const { width, height } = gameSize;
            const newBtnW = Math.min(360, Math.floor(width * 0.6));
            drawButton(graphics, newBtnW, btnHeight, false);
            container.setSize(newBtnW, btnHeight);
            container.setPosition(width / 2, height * 0.9);
            hitArea.setSize(newBtnW, btnHeight);
            hitArea.setPosition(width / 2, height * 0.9);
            this.startButton = container;
        });
    }
}
