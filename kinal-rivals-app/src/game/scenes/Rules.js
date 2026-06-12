import * as Phaser from "phaser";
import { Scene } from "phaser";

export class Rules extends Scene {
    constructor() {
        super("Rules");
    }

    preload() {
        // Load a background for the rules screen
        this.load.image("rulesBg", "assets/Reglas.jpg");
    }

    create() {
        // Prevent page scrolling while rules are visible
        try {
            if (typeof document !== "undefined" && document && document.body) {
                document.body.style.overflow = "hidden";
            }
        } catch (e) {}

        // background full screen
        const bg = this.add.image(0, 0, "rulesBg").setOrigin(0, 0);
        bg.setDisplaySize(this.scale.width, this.scale.height);

        // semi-transparent panel for text
        const panelW = Math.min(900, Math.floor(this.scale.width * 0.9));
        const panelH = Math.min(520, Math.floor(this.scale.height * 0.7));
        const panelX = this.scale.width / 2 - panelW / 2;
        const panelY = this.scale.height / 2 - panelH / 2;

        const g = this.add.graphics();
        g.fillStyle(0x000000, 0.6);
        g.fillRoundedRect(panelX, panelY, panelW, panelH, 12);

        // Title
        this.add
            .text(this.scale.width / 2, panelY + 34, "Reglas del Juego", {
                fontFamily: "Arial Black",
                fontSize: 32,
                color: "#ffffff",
            })
            .setOrigin(0.5);

        // Body text
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
                fontFamily: "Arial",
                fontSize: 20,
                color: "#ffffff",
                align: "left",
                wordWrap: { width: panelW - 40 },
            })
            .setOrigin(0.5, 0);

        // Back button (placed bottom-left inside the panel)
        const backTxt = this.add
            .text(panelX + 24, panelY + panelH - 36, "Volver", {
                fontFamily: "Arial",
                fontSize: 20,
                color: "#222222",
                backgroundColor: "#dddddd",
                padding: { x: 14, y: 8 },
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
            // Return to Boot screen as requested
            this.scene.start("Boot");
        });

        // Continuar button (same style/size as 'Volver', placed bottom-right inside panel)
        const contTxt = this.add
            .text(panelX + panelW - 24, panelY + panelH - 36, "Continuar", {
                fontFamily: "Arial",
                fontSize: 20,
                color: "#222222",
                backgroundColor: "#dddddd",
                padding: { x: 14, y: 8 },
            })
            .setOrigin(1, 0.5)
            .setInteractive({ useHandCursor: true });

        contTxt.on("pointerover", () => contTxt.setScale(1.02));
        contTxt.on("pointerout", () => contTxt.setScale(1));
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

        // handle resize
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
