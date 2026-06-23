import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    logoTween;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.add.image(512, 384, 'background');

        this.logo = this.add.image(512, 300, 'logo').setDepth(100);

        this.add.text(512, 460, 'Main Menu', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setDepth(100).setOrigin(0.5);

        const rulesBtnBg = this.add.graphics();
        const drawRulesButton = () => {
            rulesBtnBg.clear();
            rulesBtnBg.fillStyle(0x021022);
            rulesBtnBg.fillRoundedRect(437, 495, 150, 50, 8);
            rulesBtnBg.lineStyle(4, 0xff6a00);
            rulesBtnBg.strokeRoundedRect(437, 495, 150, 50, 8);
        };
        drawRulesButton();

        const rulesBtn = this.add.text(512, 520, 'REGLAS', {
            fontFamily: 'Minecraftia',
            fontSize: 20,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        rulesBtn.on('pointerover', () => {
            rulesBtnBg.setFillStyle(0x041428);
            rulesBtn.setScale(1.05);
        });

        rulesBtn.on('pointerout', () => {
            rulesBtnBg.setFillStyle(0x021022);
            rulesBtn.setScale(1);
        });

        rulesBtn.on('pointerdown', () => {
            this.scene.start('Rules');
        });
        
        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        if (this.logoTween)
        {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start('MainMenu');
    }

    moveLogo (reactCallback)
    {
        if (this.logoTween)
        {
            if (this.logoTween.isPlaying())
            {
                this.logoTween.pause();
            }
            else
            {
                this.logoTween.play();
            }
        }
        else
        {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: 'Back.easeInOut' },
                y: { value: 80, duration: 1500, ease: 'Sine.easeOut' },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (reactCallback)
                    {
                        reactCallback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y)
                        });
                    }
                }
            });
        }
    }
}
