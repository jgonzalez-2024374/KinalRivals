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
        this.load.image('background', 'assets/Inicio.jpg');
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

        const drawButton = (g, w, h, baseColor = 0xdddddd) => {
            g.clear();
            g.fillStyle(baseColor, 1);
            g.fillRoundedRect(-w / 2, -h / 2, w, h, radius);
            g.fillStyle(0xf3f3f3, 1);
            g.fillRoundedRect(-w / 2 + 2, -h / 2 + 2, w - 4, Math.floor(h / 2), radius / 1.5);
            g.lineStyle(1, 0x9a9a9a, 1);
            g.strokeRoundedRect(-w / 2, -h / 2, w, h, radius);
            g.lineStyle(1, 0x999999, 0.25);
            g.strokeRoundedRect(-w / 2 + 1, -h / 2 + 1, w - 2, h - 2, radius - 1);
        };

        const mixedBase = 0xdddddd;
        drawButton(graphics, btnWidth, btnHeight, mixedBase);

        const txt = this.add.text(0, 0, 'Jugar', { fontFamily: 'Arial', fontSize: '20px', color: '#222222' }).setOrigin(0.5);

        const container = this.add.container(x, y, [graphics, txt]);
        container.setSize(btnWidth, btnHeight);
        container.setDepth(10);

        const hitArea = this.add.zone(x, y, btnWidth, btnHeight).setOrigin(0.5).setInteractive();

        const setHover = (over) => {
            container.setScale(over ? 1.02 : 1);
            drawButton(graphics, btnWidth, btnHeight, over ? 0xcccccc : mixedBase);
        };

        hitArea.on('pointerover', () => setHover(true));
        hitArea.on('pointerout', () => setHover(false));
            hitArea.on('pointerdown', () => {
            try {
                if (typeof document !== 'undefined' && document && document.body) {
                    document.body.style.overflow = '';
                }
            } catch (e) {}
                // Open the Rules scene first, then the player will continue to character selection
                this.scene.start('Rules');
        });

        this.startButton = container;

        this.scale.on('resize', (gameSize) => {
            const { width, height } = gameSize;
            const newBtnW = Math.min(360, Math.floor(width * 0.6));
            drawButton(graphics, newBtnW, btnHeight, mixedBase);
            container.setSize(newBtnW, btnHeight);
            container.setPosition(width / 2, height * 0.9);
            hitArea.setSize(newBtnW, btnHeight);
            hitArea.setPosition(width / 2, height * 0.9);
            this.startButton = container;
        });
    }
}
