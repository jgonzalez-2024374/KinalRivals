import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class StageSelect extends Scene {
    constructor() {
        super("StageSelect");
    }

    init(data) {
        this.initialCharacters =
            data && data.characters ? data.characters.slice() : [];
        this.selectedCharacters = this.initialCharacters;
    }

    preload() {
        this.load.setPath("assets");

        this.load.image("charactersBg", "Personajes.png");
        this.load.image("stage_kinal", "Entrada_kinal.png");
        this.load.image("stage_construccion", "Construccion_kinal.png");
        this.load.image("stage_canchas", "Canchas_kinal.png");
        this.load.image("stage_bg", "bg.png");
    }

    create() {
        if (this.textures.exists("charactersBg")) {
            this.background = this.add
                .image(0, 0, "charactersBg")
                .setOrigin(0)
                .setDisplaySize(this.scale.width, this.scale.height);
            this.background.setScrollFactor(0);
            this.background.setDepth(-1);
        } else {
            this.background = this.add
                .rectangle(0, 0, this.scale.width, this.scale.height, 0x111111)
                .setOrigin(0);
        }

        this.add
            .text(
                this.scale.width / 2,
                64,
                "Seleccionar Personaje y Escenario",
                { fontFamily: "Arial Black", fontSize: 36, color: "#ffffff" },
            )
            .setOrigin(0.5);

        const padding = 32;
        const startY = 120;

        const createStyledButton = (x, y, text) => {
            const btnWidth = 180;
            const btnHeight = 50;
            const radius = 8;

            const bg = this.add.graphics();
            
            const redrawButton = (fillColor) => {
                bg.clear();
                bg.fillStyle(fillColor, 1);
                bg.fillRoundedRect(x - btnWidth / 2, y - btnHeight / 2, btnWidth, btnHeight, radius);
                bg.lineStyle(5, 0xff6a00, 1);
                bg.strokeRoundedRect(x - btnWidth / 2, y - btnHeight / 2, btnWidth, btnHeight, radius);
            };

            redrawButton(0x021022);
            bg.setDepth(1);

            const txt = this.add.text(x, y, text, {
                fontFamily: "Minecraftia",
                fontSize: 24,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 4
            }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(2);

            return { bg, txt, x, y, btnWidth, btnHeight, redrawButton };
        };

        const startBtn = createStyledButton(this.scale.width - 130, this.scale.height - 70, "Iniciar");
        const backBtn = createStyledButton(this.scale.width - 360, this.scale.height - 70, "Volver");

        this.selectedStage = null;

        const setStartBtnEnabled = (enabled) => {
            const canStart = enabled && this.selectedCharacters && this.selectedCharacters.length === 2 && this.selectedStage;
            if (canStart) {
                startBtn.redrawButton(0x041428);
            } else {
                startBtn.redrawButton(0x021022);
            }
        };

        setStartBtnEnabled(false);

        startBtn.txt.on("pointerover", () => {
            startBtn.redrawButton(0x041428);
            startBtn.txt.setScale(1.05);
        });

        startBtn.txt.on("pointerout", () => {
            if (this.selectedCharacters.length === 2 && this.selectedStage) {
                startBtn.redrawButton(0x041428);
            } else {
                startBtn.redrawButton(0x021022);
            }
            startBtn.txt.setScale(1);
        });

        startBtn.txt.on("pointerdown", () => {
            if (!this.selectedStage) return;
            if (!this.selectedCharacters || this.selectedCharacters.length !== 2) return;
            EventBus.emit("selection-made", {
                characters: this.selectedCharacters,
                stage: this.selectedStage,
            });
            this.scene.start("Game", {
                stage: this.selectedStage,
                characters: this.selectedCharacters,
            });
        });

        backBtn.txt.on("pointerdown", () => {
            this.scene.start("CharacterSelect");
        });

        backBtn.txt.on("pointerover", () => {
            backBtn.redrawButton(0x041428);
            backBtn.txt.setScale(1.05);
        });

        backBtn.txt.on("pointerout", () => {
            backBtn.redrawButton(0x021022);
            backBtn.txt.setScale(1);
        });

        this.scale.on("resize", (gameSize) => {
            const { width, height } = gameSize;
            startBtn.bg.setPosition(width - 130, height - 70);
            startBtn.txt.setPosition(width - 130, height - 70);
            backBtn.bg.setPosition(width - 360, height - 70);
            backBtn.txt.setPosition(width - 360, height - 70);
            startBtn.x = width - 130;
            startBtn.y = height - 70;
            backBtn.x = width - 360;
            backBtn.y = height - 70;
            startBtn.redrawButton(this.selectedCharacters.length === 2 && this.selectedStage ? 0x041428 : 0x021022);
            backBtn.redrawButton(0x021022);
            if (this.background) {
                this.background.setDisplaySize(width, height);
            }
        });

        const stages = [
            { key: "stage_kinal", name: "Entrada kinal" },
            { key: "stage_construccion", name: "Construcción" },
            { key: "stage_canchas", name: "Canchas" },
        ];

        const thumbW = Math.min(320, Math.floor(this.scale.width * 0.28));
        const thumbH = Math.round(thumbW * 0.55);
        const gap = 28;
        const totalW = stages.length * thumbW + (stages.length - 1) * gap;
        const startX = Math.max(
            padding,
            Math.floor((this.scale.width - totalW) / 2),
        );
        const ty = startY + 48;

        this.stageThumbs = [];

        const updateStageBorders = () => {
            this.stageThumbs.forEach((t) => {
                t.g.clear();
                if (t.selected) {
                    t.g.lineStyle(5, 0xffa500, 1);
                } else {
                    t.g.lineStyle(3, 0x666666, 1);
                }
                t.g.strokeRoundedRect(
                    t.x - thumbW / 2 - 6,
                    t.y - thumbH / 2 - 6,
                    thumbW + 12,
                    thumbH + 12,
                    10,
                );
            });
        };

        stages.forEach((s, i) => {
            const x = startX + i * (thumbW + gap) + thumbW / 2;
            const y = ty + thumbH / 2;

            const g = this.add.graphics();
            g.fillStyle(0x222222, 0.6);
            g.fillRoundedRect(
                x - thumbW / 2 - 8,
                y - thumbH / 2 - 8,
                thumbW + 16,
                thumbH + 16,
                12,
            );
            g.lineStyle(3, 0x666666, 1);
            g.strokeRoundedRect(
                x - thumbW / 2 - 8,
                y - thumbH / 2 - 8,
                thumbW + 16,
                thumbH + 16,
                12,
            );
            const img = this.add
                .image(x, y, s.key)
                .setDisplaySize(thumbW - 8, thumbH - 8)
                .setOrigin(0.5);

            const label = this.add
                .text(x, y + thumbH / 2 + 20, s.name, {
                    fontFamily: "Arial",
                    fontSize: 18,
                    color: "#ffffff",
                })
                .setOrigin(0.5);

            const stageInfo = { key: s.key, x, y, g, selected: false };
            this.stageThumbs.push(stageInfo);

            const zone = this.add
                .zone(x, y, thumbW + 16, thumbH + 36)
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true });
            zone.on("pointerdown", () => {
                this.stageThumbs.forEach((t) => (t.selected = false));
                stageInfo.selected = true;
                updateStageBorders();
                this.selectedStage = s.key;
                EventBus.emit("stage-selected", s.key);
                setStartBtnEnabled(true);
            });
        });

        updateStageBorders();
    }
}

export default StageSelect;
