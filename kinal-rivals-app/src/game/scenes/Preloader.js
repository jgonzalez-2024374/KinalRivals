import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  Cargamos esta imagen en la escena Boot, así que la mostramos aquí
        this.add.image(512, 384, 'background');

        //  Barra de progreso sencilla. Este es el contorno de la barra.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  Esta es la propia barra de progreso. Aumentará de ancho según el % de carga.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Usar el evento 'progress' emitido por LoaderPlugin para actualizar la barra.
        this.load.on('progress', (progress) => {

            //  Actualizar la barra de progreso (nuestra barra tiene 464px, así que 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Cargar los recursos del juego - reemplaza por tus propios recursos
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
    }

    create ()
    {
        //  Cuando todos los recursos estén cargados, suele ser útil crear objetos globales aquí para el resto del juego.
        //  Por ejemplo, puedes definir animaciones globales aquí para usarlas en otras escenas.

        //  Ir al MainMenu. También podrías cambiar esto por una transición de escena, como un fundido de cámara.
        this.scene.start('MainMenu');
    }
}
