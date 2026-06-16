import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        this.add.image(512, 384, 'background');

        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        this.load.on('progress', (progress) => {

            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        this.load.setPath('assets');

        this.load.image('logo', 'logo.png');
        this.load.image('star', 'star.png');
        // imágenes de escenarios
        this.load.image('stage_kinal', 'Entrada_kinal.png');
        this.load.image('stage_tierra', 'Tierra.jpeg');
        this.load.image('stage_bg', 'bg.png');
        this.load.image('charactersBg', 'Personajes.png');
        this.load.image('card30', '30.png');
        this.load.image('card31', '31.png');
        this.load.image('card32', '32.png');
        this.load.image('card33', '33.png');

        const characterCodes = ['30', '31', '32', '33'];
        const armSides = ['derecho', 'izquierdo'];
        const armOrientations = ['derecha', 'frontal', 'izquierda'];

        characterCodes.forEach((code) => {
            this.load.image(code, `${code}.png`);
        });

        const fallbackArmCode = '30';
        armSides.forEach((side) => {
            armOrientations.forEach((orientation) => {
                this.load.image(`${fallbackArmCode}_brazo_${side}_${orientation}`, `${fallbackArmCode}_brazo_${side}_${orientation}.png`);
            });
        });

        this.load.image('Cabeza_frontal', 'Cabeza_frontal.png');
        this.load.image('Cabeza_izquierda', 'Cabeza_izquierda.png');
        this.load.image('Cabeza_derecha', 'Cabeza_derecha.png');
    }

    create ()
    {
        this.scene.start('MainMenu');
    }
}
