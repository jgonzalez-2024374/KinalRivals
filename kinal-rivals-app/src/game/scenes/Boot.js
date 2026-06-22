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
        this.load.image('mojang', 'assets/Mojang.png');
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

        const FORCE_BG_SIZE = true;
        const TARGET_BG_W = 1980;
        const TARGET_BG_H = 1080;

        const globalState = typeof window !== 'undefined' ? window : typeof globalThis !== 'undefined' ? globalThis : {};
        const shouldShowMojangSplash = !globalState.bootSplashShown;

        let bg = null;
        const applyBgSize = (img) => {
            try {
                if (!img) return;
                if (img === bg) {
                    img.setDisplaySize(this.scale.width, this.scale.height);
                    img.setOrigin(0, 0);
                    img.setPosition(0, 0);
                    return;
                }
                if (FORCE_BG_SIZE) {
                    img.setDisplaySize(TARGET_BG_W, TARGET_BG_H);
                } else {
                    const iw = img.width || img.naturalWidth || 1;
                    const ih = img.height || img.naturalHeight || 1;
                    const sw = this.scale.width;
                    const sh = this.scale.height;
                    const scale = Math.max(sw / iw, sh / ih);
                    img.setDisplaySize(Math.round(iw * scale), Math.round(ih * scale));
                }
                img.setOrigin(0.5);
                img.setPosition(this.scale.width / 2, this.scale.height / 2);
            } catch (e) {
                try { img.setDisplaySize(this.scale.width, this.scale.height); img.setPosition(this.scale.width/2, this.scale.height/2); } catch (e) {}
            }
        };

        const mojang = shouldShowMojangSplash
            ? this.add.image(this.scale.width / 2, this.scale.height / 2, 'mojang').setOrigin(0.5).setDepth(50)
            : null;
        if (mojang) {
            applyBgSize(mojang);
        }

        bg = this.add.image(this.scale.width / 2, this.scale.height / 2, 'background').setOrigin(0.5).setDepth(10);
        bg.setVisible(false);

        this.scale.on('resize', (gameSize) => {
            const { width, height } = gameSize;
            if (mojang) {
                applyBgSize(mojang);
            }
            applyBgSize(bg);
            if (this.startButton) {
                this.startButton.setPosition(width / 2, height * 0.9);
            }
        });

        function sampleColorFromImage(img) {
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
        }

        const createStartButton = () => {
            let btnColor = '#bebebe';
            try {
                const img = this.textures.get('background').getSourceImage();
                if (img) {
                    btnColor = sampleColorFromImage(img);
                }
            } catch (e) {}

            const btnWidth = Math.min(360, Math.floor(this.scale.width * 0.6));
            const btnHeight = 72;
            const x = this.scale.width / 2;
            const y = this.scale.height * 0.9;

            const graphics = this.add.graphics();
            const radius = 14;

            const hexToRgb = (hex) => {
                const h = (hex || '#bebebe').replace('#', '');
                const n = parseInt(h, 16);
                return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
            };
            const rgbToNum = (r, g, b) => (r << 16) | (g << 8) | b;
            const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
            const tintChannel = (c, amt) => clamp(c + amt);

            const drawButton = (g, w, h, hover = false) => {
                g.clear();
                const topColor = hover ? 0x041428 : 0x021022;
                const midColor = hover ? 0x03182b : 0x021125;
                const bottomColor = hover ? 0x01121f : 0x000d1a;
                g.fillGradientStyle(topColor, midColor, bottomColor, midColor, 1);
                g.fillRoundedRect(-w / 2, -h / 2, w, h, radius);
                g.fillStyle(0xffffff, hover ? 0.06 : 0.04);
                g.fillRoundedRect(-w / 2 + 10, -h / 2 + 10, w - 20, h / 2 - 14, radius / 1.5);
                g.lineStyle(6, 0xff6a00, 1);
                g.strokeRoundedRect(-w / 2, -h / 2, w, h, radius);
                g.lineStyle(3, 0x031a2b, 1);
                g.strokeRoundedRect(-w / 2 + 4, -h / 2 + 4, w - 8, h - 8, radius - 2);
                g.lineStyle(1, 0x05283a, 0.8);
                g.strokeRoundedRect(-w / 2 + 8, -h / 2 + 8, w - 16, h - 16, radius - 4);
            };

            drawButton(graphics, btnWidth, btnHeight, false);

            const icon = this.add.text(-btnWidth * 0.18, 0, '▶', { fontFamily: 'Arial Black', fontSize: '26px', color: '#ffffff', stroke: '#021022', strokeThickness: 5 }).setOrigin(0.5);
            const txt = this.add.text(btnWidth * 0.08, 0, 'JUGAR', { fontFamily: 'Arial Black', fontSize: '28px', color: '#ffffff', stroke: '#021022', strokeThickness: 6 }).setOrigin(0.5);

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
                this.scene.start('Rules');
            });

            this.startButton = container;
        };

        const showBootScreen = () => {
            bg.setVisible(true);
            applyBgSize(bg);
            createStartButton();
            globalState.bootSplashShown = true;
        };

        if (shouldShowMojangSplash) {
            this.tweens.add({
                targets: mojang,
                alpha: 0,
                duration: 5000,
                ease: 'Linear',
                onComplete: () => {
                    try { mojang.destroy(); } catch (e) {}
                    showBootScreen();
                }
            });
        } else {
            showBootScreen();
        }
    }
}
