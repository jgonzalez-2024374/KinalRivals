import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class StageSelect extends Scene {
    constructor() {
        super("StageSelect");
    }

    init(data) {
        this.initialCharacters =
            data && data.characters ? data.characters.slice() : [];
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
        this.selectedCharacters = this.initialCharacters
            ? this.initialCharacters.slice()
            : [];
        const startBtn = this.add
            .text(this.scale.width / 2, this.scale.height - 64, "Iniciar", {
                fontFamily: "Arial",
                fontSize: 24,
                color: "#222222",
                backgroundColor: "#dddddd",
                padding: { x: 14, y: 10 },
            })
            .setOrigin(0.5);
        this.selectedStage = null;

        const setStartBtnEnabled = (enabled) => {
            const canStart = enabled && this.selectedCharacters && this.selectedCharacters.length === 2;
            if (canStart) {
                startBtn.setInteractive({ useHandCursor: true });
                startBtn.setStyle({
                    backgroundColor: "#88cc88",
                    color: "#061a06",
                });
            } else {
                startBtn.disableInteractive();
                startBtn.setStyle({
                    backgroundColor: "#dddddd",
                    color: "#222222",
                });
            }
        };

        setStartBtnEnabled(false);

        startBtn.on("pointerdown", () => {
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

        this.scale.on("resize", (gameSize) => {
            const { width, height } = gameSize;
            startBtn.setPosition(width / 2, height - 64);
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
