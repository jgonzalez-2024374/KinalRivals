import * as Phaser from "phaser";
import { Scene } from "phaser";

export class Rules extends Scene {
    constructor() {
        super("Rules");
    }

    preload() {
        this.load.image("rulesBg", "assets/Reglas.png");
    }

    create() {
        try {
            if (typeof document !== "undefined" && document && document.body) {
                document.body.style.overflow = "hidden";
            }
        } catch (e) { }

        const bg = this.add.image(0, 0, "rulesBg").setOrigin(0, 0);
        bg.setDisplaySize(this.scale.width, this.scale.height);

        const panelW = Math.min(900, Math.floor(this.scale.width * 0.9));
        const panelH = Math.min(520, Math.floor(this.scale.height * 0.7));
        const panelX = this.scale.width / 2 - panelW / 2;
        const panelY = this.scale.height / 2 - panelH / 2;

        const g = this.add.graphics();
        g.fillStyle(0x1b1b1b, 0.85);
        g.fillRoundedRect(panelX, panelY, panelW, panelH, 8);

        g.lineStyle(6, 0x8B8B8B, 1);
        g.strokeRoundedRect(panelX, panelY, panelW, panelH, 8);

        g.lineStyle(2, 0xffffff, 0.15);
        g.strokeRoundedRect(
            panelX + 4,
            panelY + 4,
            panelW - 8,
            panelH - 8,
            8
        );

        const titleText = this.add
            .text(
                this.scale.width / 2,
                panelY + 45,
                "⚔ REGLAS DEL COMBATE ⚔",
                {
                    fontFamily: "Minecraftia",
                    fontSize: 46,
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 8,
                }
            )
            .setOrigin(0.5);

        titleText.setShadow(5, 5, "#000000", 5, true, true);

        const separator = this.add.graphics();
        separator.fillStyle(0xff6a00);
        separator.fillRect(panelX + 80, panelY + 90, panelW - 160, 4);

        this.tweens.add({
            targets: titleText,
            scaleX: 1.03,
            scaleY: 1.03,
            duration: 1200,
            yoyo: true,
            repeat: -1
        });

        const rulesText = `
        - Duración: 2 minutos por partida.
        - Lucha en diferentes escenarios históricos de Kinal.
        - Elige entre personajes con distintas chumpas de promoción.
        - El jugador con más puntos al terminar el tiempo gana.`;

        const content = this.add
            .text(this.scale.width / 2, panelY + 90, rulesText, {
                fontFamily: "Minecraftia",
                fontSize: 27,
                lineSpacing: 10,
                color: "#EAEAEA",
                align: "left",
                wordWrap: { width: panelW - 40 },
                stroke: "#000000",
                strokeThickness: 3,
            })
            .setOrigin(0.5, 0);

        const backTxt = this.add
            .text(panelX + 24, panelY + panelH - 36, "Volver", {
                fontFamily: "Minecraftia, Arial Black, monospace",
                fontSize: 18,
                color: "#FFFFFF",
                backgroundColor: "#4C4C4C",
                padding: { x: 24, y: 12 },
                stroke: "#000000",
                strokeThickness: 4,
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
            } catch (e) { }
            this.scene.start("Boot");
        });

        const contTxt = this.add
            .text(panelX + panelW - 24, panelY + panelH - 36, "Continuar", {
                fontFamily: "Minecraftia, Arial Black, monospace",
                fontSize: 18,
                color: "#FFFFFF",
                backgroundColor: "#4C4C4C",
                padding: { x: 24, y: 12 },
                stroke: "#000000",
                strokeThickness: 4,
            })
            .setOrigin(1, 0.5)
            .setInteractive({ useHandCursor: true });

        contTxt.on("pointerover", () => {
            contTxt.setScale(1.08);
            contTxt.setBackgroundColor("#07305a");
        });
        contTxt.on("pointerout", () => {
            contTxt.setScale(1);
            contTxt.setBackgroundColor("#021022");
        });
        backTxt.on("pointerover", () => {
            backTxt.setScale(1.08);
            backTxt.setBackgroundColor("#07305a");
        });
        backTxt.on("pointerout", () => {
            backTxt.setScale(1);
            backTxt.setBackgroundColor("#021022");
        });

        this.tweens.add({
            targets: [backTxt, contTxt],
            alpha: 0.85,
            duration: 800,
            yoyo: true,
            repeat: -1
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
            } catch (e) { }
            this.scene.start("CharacterSelect");
        });

        this.scale.on("resize", (gameSize) => {
            const { width, height } = gameSize;
            bg.setDisplaySize(width, height);
            const newPanelW = Math.min(900, Math.floor(width * 0.9));
            const newPanelH = Math.min(520, Math.floor(height * 0.7));
            const newPanelX = width / 2 - newPanelW / 2;
            const newPanelY = height / 2 - newPanelH / 2;
            g.clear();
            g.fillStyle(0x1b1b1b, 0.85);
            g.fillRoundedRect(newPanelX, newPanelY, newPanelW, newPanelH, 8);
            g.lineStyle(6, 0x8B8B8B, 1);
            g.strokeRoundedRect(newPanelX, newPanelY, newPanelW, newPanelH, 8);
            g.lineStyle(2, 0xffffff, 0.15);
            g.strokeRoundedRect(
                newPanelX + 4,
                newPanelY + 4,
                newPanelW - 8,
                newPanelH - 8,
                8
            );

            separator.clear();
            separator.fillStyle(0xff6a00 );
            separator.fillRect(
                newPanelX + 80,
                newPanelY + 90,
                newPanelW - 160,
                4
            );

            backTxt.setPosition(newPanelX + 24, newPanelY + newPanelH - 36);
            contTxt.setPosition(newPanelX + newPanelW - 24, newPanelY + newPanelH - 36);
            content.setPosition(width / 2, newPanelY + 90);
        });
    }
}
