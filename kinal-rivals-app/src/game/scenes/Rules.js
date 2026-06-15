import * as Phaser from "phaser";
import { Scene } from "phaser";

export class Rules extends Scene {
    constructor() {
        super("Rules");
    }

    preload() {
        // Cargar un fondo para la pantalla de reglas
        this.load.image("rulesBg", "assets/Reglas.png");
    }

    create() {
        // Evitar el desplazamiento de la página mientras se muestran las reglas
        try {
            if (typeof document !== "undefined" && document && document.body) {
                document.body.style.overflow = "hidden";
            }
        } catch (e) {}

        // fondo a pantalla completa
        const bg = this.add.image(0, 0, "rulesBg").setOrigin(0, 0);
        bg.setDisplaySize(this.scale.width, this.scale.height);

        // panel semitransparente para el texto
        const panelW = Math.min(900, Math.floor(this.scale.width * 0.9));
        const panelH = Math.min(520, Math.floor(this.scale.height * 0.7));
        const panelX = this.scale.width / 2 - panelW / 2;
        const panelY = this.scale.height / 2 - panelH / 2;

        const g = this.add.graphics();
        g.fillStyle(0x000000, 0.6);
        g.fillRoundedRect(panelX, panelY, panelW, panelH, 12);

        // Título
        const titleText = this.add
            .text(this.scale.width / 2, panelY + 34, "Reglas del Juego", {
                fontFamily: "Minecraftia, Arial Black, monospace",
                fontSize: 36,
                color: "#ffff00",
                stroke: "#000000",
                strokeThickness: 4,
            })
            .setOrigin(0.5);
        titleText.setShadow(3, 3, "#000000", 3, true, true);

        // Texto principal
        const rulesText = `- Duración: 2 minutos por partida.
- Lucha en diferentes escenarios históricos de Kinal.
- Elige entre personajes con distintas chumpas de promoción y habilidades únicas.
- Usa ataques y potenciadores para derrotar a tu oponente.
- El jugador con más puntos al terminar el tiempo gana.

Consejos:
- Aprovecha el escenario para obtener ventajas.
- Combina movimientos y chumpa para sacar mayor provecho.`;

        const content = this.add
            .text(this.scale.width / 2, panelY + 90, rulesText, {
                fontFamily: "Courier New, monospace",
                fontSize: 18,
                color: "#00ff00",
                align: "left",
                wordWrap: { width: panelW - 40 },
                stroke: "#000000",
                strokeThickness: 2,
            })
            .setOrigin(0.5, 0);

        // Botón Volver (colocado abajo a la izquierda dentro del panel)
        const backTxt = this.add
            .text(panelX + 24, panelY + panelH - 36, "Volver", {
                fontFamily: "Minecraftia, Arial Black, monospace",
                fontSize: 18,
                color: "#ffffff",
                backgroundColor: "#aa0000",
                padding: { x: 16, y: 10 },
                stroke: "#000000",
                strokeThickness: 3,
            })
            .setOrigin(0, 0.5)
            .setInteractive({ useHandCursor: true });

        backTxt.on("pointerdown", () => {
            try {
                if (
                    typeof document !== "undefined" &&
                    document &&
                    document.body
                ) {
                    document.body.style.overflow = "";
                }
            } catch (e) {}
            // Volver a la pantalla Boot cuando se solicite
            this.scene.start("Boot");
        });

        // Botón Continuar (mismo estilo/tamaño que 'Volver', ubicado abajo a la derecha en el panel)
        const contTxt = this.add
            .text(panelX + panelW - 24, panelY + panelH - 36, "Continuar", {
                fontFamily: "Minecraftia, Arial Black, monospace",
                fontSize: 18,
                color: "#ffffff",
                backgroundColor: "#00aa00",
                padding: { x: 16, y: 10 },
                stroke: "#000000",
                strokeThickness: 3,
            })
            .setOrigin(1, 0.5)
            .setInteractive({ useHandCursor: true });

        contTxt.on("pointerover", () => {
            contTxt.setScale(1.08);
            contTxt.setBackgroundColor("#00dd00");
        });
        contTxt.on("pointerout", () => {
            contTxt.setScale(1);
            contTxt.setBackgroundColor("#00aa00");
        });
        backTxt.on("pointerover", () => {
            backTxt.setScale(1.08);
            backTxt.setBackgroundColor("#dd0000");
        });
        backTxt.on("pointerout", () => {
            backTxt.setScale(1);
            backTxt.setBackgroundColor("#aa0000");
        });
        contTxt.on("pointerdown", () => {
            try {
                if (
                    typeof document !== "undefined" &&
                    document &&
                    document.body
                ) {
                    document.body.style.overflow = "";
                }
            } catch (e) {}
            this.scene.start("CharacterSelect");
        });

        // manejar el redimensionamiento
        this.scale.on("resize", (gameSize) => {
            const { width, height } = gameSize;
            bg.setDisplaySize(width, height);
            const newPanelW = Math.min(900, Math.floor(width * 0.9));
            const newPanelH = Math.min(520, Math.floor(height * 0.7));
            const newPanelX = width / 2 - newPanelW / 2;
            const newPanelY = height / 2 - newPanelH / 2;
            g.clear();
            g.fillStyle(0x000000, 0.6);
            g.fillRoundedRect(newPanelX, newPanelY, newPanelW, newPanelH, 12);
            backTxt.setPosition(newPanelX + 24, newPanelY + newPanelH - 36);
            contTxt.setPosition(newPanelX + newPanelW - 24, newPanelY + newPanelH - 36);
            content.setPosition(width / 2, newPanelY + 90);
        });
    }
}
