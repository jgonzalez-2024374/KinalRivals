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

        this.load.image('30_Torso_CaraFrontal', '30_Torso_CaraFrontal.png');
        this.load.image('30_Torso_CaraIzquierda', '30_Torso_CaraIzquierda.png');
        this.load.image('30_Torso_CaraDerecha', '30_Torso_CaraDerecha.png');

        this.load.image('30_BrazoIzquierdo_CaraFrontal', '30_BrazoIzquierdo_CaraFrontal.png');
        this.load.image('30_BrazoIzquierdo_CaraIzquierda', '30_BrazoIzquierdo_CaraIzquierda.png');
        this.load.image('30_BrazoIzquierdo_CaraDerecha', '30_BrazoIzquierdo_CaraDerecha.png');
        this.load.image('30_BrazoDerecho_CaraFrontal', '30_BrazoDerecho_CaraFrontal.png');
        this.load.image('30_BrazoDerecho_CaraIzquierda', '30_BrazoDerecho_CaraIzquierda.png');
        this.load.image('30_BrazoDerecho_CaraDerecha', '30_BrazoDerecho_CaraDerecha.png');

        this.load.image('PiernaIzquierda_CaraFrontal', 'PiernaIzquierda_CaraFrontal.png');
        this.load.image('PiernaIzquierda_CaraIzquierda', 'PiernaIzquierda_CaraIzquierda.png');
        this.load.image('PiernaIzquierda_CaraDerecha', 'PiernaIzquierda_CaraDerecha.png');
        this.load.image('PiernaDerecha_CaraFrontal', 'PiernaDerecha_CaraFrontal.png');
        this.load.image('PiernaDerecha_CaraIzquierda', 'PiernaDerecha_CaraIzquierda.png');
        this.load.image('PiernaDerecha_CaraDerecha', 'PiernaDerecha_CaraDerecha.png');

        this.load.image('Cabeza_CaraFrontal', 'Cabeza_CaraFrontal.png');
        this.load.image('Cabeza_CaraIzquierda', 'Cabeza_CaraIzquierda.png');
        this.load.image('Cabeza_CaraDerecha', 'Cabeza_CaraDerecha.png');

        this.load.image('Cabeza_frontal', 'Cabeza_CaraFrontal.png');
        this.load.image('Cabeza_izquierda', 'Cabeza_CaraIzquierda.png');
        this.load.image('Cabeza_derecha', 'Cabeza_CaraDerecha.png');
    }

    create ()
    {
        this.scene.start('MainMenu');
    }
}
