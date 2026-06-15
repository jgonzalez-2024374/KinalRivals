import { Scene } from 'phaser';
import * as Phaser from 'phaser';

export class Game extends Scene {
    constructor () {
        super('Game');
    }

    init(data) {
        this.selectedStage = data.stage || 'stage_kinal';
    }

    preload () {
        const stageImage = this.selectedStage === 'stage_kinal' ? 'Entrada_kinal.png' :
            this.selectedStage === 'stage_tierra' ? 'Tierra.jpeg' :
            'bg.png';
        this.load.image('bg', `assets/${stageImage}`);
        // textura para bloques (usar Tierra.jpeg)
        this.load.image('blockTex', 'assets/Tierra.jpeg');
    }

    create () {
        let anchoCanvas = this.scale.width;
        let altoCanvas = this.scale.height;

        const fondo = this.add.image(anchoCanvas / 2, altoCanvas / 2, 'bg');
        if (fondo) fondo.setDisplaySize(anchoCanvas, altoCanvas);

        // desplazar el suelo hacia abajo ~10 cm en pantalla (convertido a píxeles según DPI)
        const cmToPx = (cm) => Math.round(cm * (96 * (window.devicePixelRatio || 1) / 2.54));
        // bajar el suelo más: usar 20 cm (aprox) en lugar de 10 cm
        const groundShift = cmToPx(20);
        // subir el suelo 5 cm para acercarlo a los jugadores
        const extraGroundUpPx = cmToPx(5);
        const groundHeight = Math.max(50, Math.round(altoCanvas * 0.10));
        let posicionYSuelo = altoCanvas - (altoCanvas * 0.25) + groundShift - extraGroundUpPx;
        // evitar que el suelo quede fuera de la pantalla
        const maxY = altoCanvas - groundHeight / 2;
        if (posicionYSuelo > maxY) posicionYSuelo = maxY;

        // crear ground ocupando todo el ancho; usar origen en la izquierda para alinear el body
        this.ground = this.add.rectangle(0, posicionYSuelo, anchoCanvas, groundHeight, 0x000000, 0);
        this.ground.setOrigin(0, 0.5);
        this.physics.add.existing(this.ground, true);
        // body debe empezar en x=0, y=posicionYSuelo - height/2
        this.ground.body.setSize(anchoCanvas, groundHeight);
        this.ground.body.setOffset(0, -groundHeight / 2);

        if (!this.textures.exists('txt_rojo')) {
            const canvasRojo = this.textures.createCanvas('txt_rojo', 60, 90);
            canvasRojo.context.fillStyle = '#ff0000';
            canvasRojo.context.fillRect(0, 0, 60, 90);
            canvasRojo.refresh();
        }

        if (!this.textures.exists('txt_verde')) {
            const canvasVerde = this.textures.createCanvas('txt_verde', 60, 90);
            canvasVerde.context.fillStyle = '#00ff00';
            canvasVerde.context.fillRect(0, 0, 60, 90);
            canvasVerde.refresh();
        }

        const playerOffsetY = 95;
        this.player1 = this.physics.add.sprite(anchoCanvas * 0.25, posicionYSuelo - playerOffsetY, 'txt_rojo');
        this.player1.setCollideWorldBounds(true);
        this.player1.body.setGravityY(1200);
        this.player1.body.setBounce(0);

        

        // ajustar tamaño del body físico para estabilidad
        const p1BodyW = Math.round(this.player1.displayWidth * 0.6);
        const p1BodyH = Math.round(this.player1.displayHeight * 0.9);
        this.player1.body.setSize(p1BodyW, p1BodyH);
        const p1OffsetX = Math.round((this.player1.displayWidth - p1BodyW) / 2);
        const p1OffsetY = Math.round((this.player1.displayHeight - p1BodyH) / 2);
        this.player1.body.setOffset(p1OffsetX, p1OffsetY);

        this.player2 = this.physics.add.sprite(anchoCanvas * 0.75, posicionYSuelo - playerOffsetY, 'txt_verde');
        this.player2.setCollideWorldBounds(true);
        this.player2.body.setGravityY(1200);
        this.player2.body.setBounce(0);

        // ajustar tamaño del body del player2
        const p2BodyW = Math.round(this.player2.displayWidth * 0.6);
        const p2BodyH = Math.round(this.player2.displayHeight * 0.9);
        this.player2.body.setSize(p2BodyW, p2BodyH);
        this.player2.body.setOffset(Math.round((this.player2.displayWidth - p2BodyW) / 2), Math.round((this.player2.displayHeight - p2BodyH) / 2));
        // asegurarse de que el player2 tenga exactamente el mismo cuerpo que player1 (mirroring)
        this.player2.body.setSize(p1BodyW, p1BodyH);
        this.player2.body.setOffset(p1OffsetX, p1OffsetY);
        // desactivar gravedad momentáneamente para evitar que alguno caiga antes de fijar posiciones
        if (this.player1.body) {
            this.player1.body.allowGravity = false;
            this.player1.body.setVelocity(0, 0);
        }
        if (this.player2.body) {
            this.player2.body.allowGravity = false;
            this.player2.body.setVelocity(0, 0);
        }
        // igualar el tamaño visual del jugador verde al rojo
        this.player2.setDisplaySize(this.player1.displayWidth, this.player1.displayHeight);

        // reposicionar jugadores: elevarlos una fracción del alto del canvas
        const groundTop = posicionYSuelo - (groundHeight / 2);
        const playerMargin = 6; // píxeles sobre el suelo
        const extraLift = Math.round(altoCanvas * 0.10); // subir jugadores 10% del alto
        // subir el jugador rojo exactamente 5 cm (convertidos a píxeles)
        const extraPxRed = cmToPx(5);
        const extraRaiseCm = 3; // subir un poco más (cm)
        const extraRaisePx = cmToPx(extraRaiseCm);
        const p1TargetY = groundTop - (this.player1.displayHeight / 2) - playerMargin - extraLift - extraPxRed - extraRaisePx;
        // poner al jugador verde a la misma altura que el rojo
        const p2TargetY = p1TargetY;
        this.player1.setPosition(this.player1.x, p1TargetY);
        // colocar el jugador verde exactamente en la misma X/Y que el rojo
        this.player2.setPosition(this.player1.x, p2TargetY);
        // asegurar que los cuerpos físicos se sincronicen con la nueva posición del GameObject
        if (this.player1.body && this.player1.body.updateFromGameObject) this.player1.body.updateFromGameObject();
        if (this.player2.body && this.player2.body.updateFromGameObject) this.player2.body.updateFromGameObject();
        // forzar posición del body (Arcade) para evitar que la gravedad los mueva antes del primer frame
        if (this.player1.body && this.player1.body.reset) this.player1.body.reset(this.player1.x, this.player1.y);
        if (this.player2.body && this.player2.body.reset) this.player2.body.reset(this.player2.x, this.player2.y);

        this.physics.add.collider(this.player1, this.ground);
        this.physics.add.collider(this.player2, this.ground);

        // Reforzar la igualación de altura tras el primer paso de física y reactivar gravedad
        this.time.delayedCall(50, () => {
            // forzar que player2 esté exactamente donde player1 (misma X/Y)
            this.player2.setPosition(this.player1.x, this.player1.y);
            if (this.player2.body && this.player2.body.reset) this.player2.body.reset(this.player1.x, this.player1.y);
            if (this.player1.body && this.player1.body.reset) this.player1.body.reset(this.player1.x, this.player1.y);
            // asegurar velocidad cero y reactivar gravedad
            if (this.player1.body) {
                this.player1.body.setVelocity(0, 0);
                this.player1.body.allowGravity = true;
            }
            if (this.player2.body) {
                this.player2.body.setVelocity(0, 0);
                this.player2.body.allowGravity = true;
            }
        });

        // grupo estático para bloques colocados
        this.blocks = this.physics.add.staticGroup();
        this.physics.add.collider(this.player1, this.blocks);
        this.physics.add.collider(this.player2, this.blocks);

        // teclas para colocar bloques: player1 -> F, player2 -> L
        this.placeKeys = this.input.keyboard.addKeys({ p1: Phaser.Input.Keyboard.KeyCodes.F, p2: Phaser.Input.Keyboard.KeyCodes.L });
        this.input.keyboard.on('keydown-F', () => this.placeBlock(this.player1, 1));
        this.input.keyboard.on('keydown-L', () => this.placeBlock(this.player2, 2));

        this.keysWASD = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update () {
        const speed = 350;
        const jumpForce = -650; 

        if (this.keysWASD.left.isDown) this.player1.setVelocityX(-speed);
        else if (this.keysWASD.right.isDown) this.player1.setVelocityX(speed);
        else this.player1.setVelocityX(0);
        if (this.keysWASD.up.isDown && this.player1.body.touching.down) this.player1.setVelocityY(jumpForce);

        if (this.cursors.left.isDown) this.player2.setVelocityX(-speed);
        else if (this.cursors.right.isDown) this.player2.setVelocityX(speed);
        else this.player2.setVelocityX(0);
        if (this.cursors.up.isDown && this.player2.body.touching.down) this.player2.setVelocityY(jumpForce);

        let distY = Math.abs(this.player1.y - this.player2.y);
        let distX = Math.abs(this.player1.x - this.player2.x);

        if (distX < 55 && distY < 80) {
            let repulsion = 5;
            if (this.player1.x < this.player2.x) {
                this.player1.x -= repulsion;
                this.player2.x += repulsion;
            } else {
                this.player1.x += repulsion;
                this.player2.x -= repulsion;
            }
        }
    }

    placeBlock(player, playerIndex) {
        if (!player || !player.body) return;
        // tamaño fijo del bloque: 100x100 píxeles
        const bw = 100;
        const bh = 100;

        // posición: al nivel vertical del jugador (centro), y un poco delante horizontalmente
        const offsetX = playerIndex === 1 ? Math.round(bw * 1.2) : -Math.round(bw * 1.2);
        const bx = player.x + offsetX;
        const by = player.y; // mismo nivel vertical que el jugador

        const b = this.physics.add.staticImage(bx, by, 'blockTex').setOrigin(0.5);
        b.setDisplaySize(bw, bh);
        if (b.body) {
            if (typeof b.body.setSize === 'function') b.body.setSize(bw, bh);
            if (typeof b.body.refreshBody === 'function') b.body.refreshBody();
        }
        if (this.blocks && typeof this.blocks.add === 'function') this.blocks.add(b);
        if (this.player1) this.physics.add.collider(this.player1, b);
        if (this.player2) this.physics.add.collider(this.player2, b);
    }
}