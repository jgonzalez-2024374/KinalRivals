import { Scene } from 'phaser';
import * as Phaser from 'phaser';

export class Game extends Scene {
    constructor () {
        super('Game');
    }

    getFacingFromVelocity(velocityX) {
    if (velocityX < -10) {
        return 'izquierda';
    }

    if (velocityX > 10) {
        return 'derecha';
    }

    return 'frontal'; 
}

    getTextureKey(keys) {
        for (const key of keys) {
            if (key && this.textures.exists(key)) {
                return key;
            }
        }

        return null;
    }

    getTextureSourceSize(textureKey) {
        const texture = this.textures.get(textureKey);
        const source = texture?.source?.[0];
        const image = source?.image || source;
        const width = image?.width || source?.width || 0;
        const height = image?.height || source?.height || 0;

        if (!width || !height) {
            return null;
        }

        return { width, height };
    }

    createPartImage(x, y, keys, scale, depth, fallbackColor = null) {
        const textureKey = this.getTextureKey(keys);

        if (textureKey) {
            return this.add.image(x, y, textureKey)
                .setOrigin(0.5)
                .setScale(scale)
                .setDepth(depth);
        }

        if (fallbackColor !== null) {
            return this.add.rectangle(x, y, 10 * scale, 10 * scale, fallbackColor, 1)
                .setOrigin(0.5)
                .setDepth(depth);
        }

        return null;
    }

    ensureGeneratedTextures() {
        if (!this.textures.exists('rig_anchor')) {
            const anchorGraphics = this.add.graphics();
            anchorGraphics.fillStyle(0xffffff, 0);
            anchorGraphics.fillRect(0, 0, 8, 8);
            anchorGraphics.generateTexture('rig_anchor', 8, 8);
            anchorGraphics.destroy();
        }
    }

    getCharacterPartTexture(characterCode, part, facing) {
        const direction = facing === 'izquierda'
    ? 'CaraIzquierda'
    : facing === 'derecha'
        ? 'CaraDerecha'
        : 'CaraFrontal';

        const textureMap = {
            torso: [
                `${characterCode}_Torso_${direction}`,
                `30_Torso_${direction}`
            ],
            head: [
                `Cabeza_${direction}`,
                'Cabeza_CaraFrontal'
            ],
            leftArm: [
                `${characterCode}_BrazoIzquierdo_${direction}`,
                `30_BrazoIzquierdo_${direction}`
            ],
            rightArm: [
                `${characterCode}_BrazoDerecho_${direction}`,
                `30_BrazoDerecho_${direction}`
            ],
            leftLeg: [
                `PiernaIzquierda_${direction}`,
                `30_PiernaIzquierda_${direction}`
            ],
            rightLeg: [
                `PiernaDerecha_${direction}`,
                `30_PiernaDerecha_${direction}`
            ]
        };

        return textureMap[part] || [];
    }

    createCharacterRig(characterCode, x, y, tintColor = null) {
        const bodyTexture = 'rig_anchor';
        const anchor = this.physics.add.sprite(x, y, bodyTexture);
        anchor.setCollideWorldBounds(true);
        anchor.body.setGravityY(1200);
        anchor.body.setBounce(0);
        anchor.setVisible(false);

        const facing = 'frontal';
        const bodyScale = 0.95;
        const torsoTexture = this.getTextureKey(this.getCharacterPartTexture(characterCode, 'torso', facing));
        const headTexture = this.getTextureKey(this.getCharacterPartTexture(characterCode, 'head', facing));
        const leftArmTexture = this.getTextureKey(this.getCharacterPartTexture(characterCode, 'leftArm', facing));
        const leftLegTexture = this.getTextureKey(this.getCharacterPartTexture(characterCode, 'leftLeg', facing));

        const torsoSize = this.getTextureSourceSize(torsoTexture) || { width: 56, height: 86 };
        const headSize = this.getTextureSourceSize(headTexture) || { width: 69, height: 72 };
        const armSize = this.getTextureSourceSize(leftArmTexture) || { width: 20, height: 57 };
        const legSize = this.getTextureSourceSize(leftLegTexture) || { width: 20, height: 51 };

        const torsoWidth = Math.round(torsoSize.width * bodyScale);
        const torsoHeight = Math.round(torsoSize.height * bodyScale);
        const headWidth = Math.round(headSize.width * bodyScale);
        const headHeight = Math.round(headSize.height * bodyScale);
        const armWidth = Math.round(armSize.width * bodyScale);
        const armHeight = Math.round(armSize.height * bodyScale);
        const legScale = bodyScale * 1.08;
        const legWidth = Math.round(legSize.width * legScale);
        const legHeight = Math.round(legSize.height * legScale);

        const totalWidth = Math.round((torsoSize.width + (armSize.width * 2)) * bodyScale);
        const totalHeight = Math.round((headSize.height + torsoSize.height + (legSize.height * 1.08)) * bodyScale);
        anchor.body.setSize(totalWidth * 0.7, totalHeight * 0.9);
        anchor.body.setOffset((anchor.body.width * -0.5), (anchor.body.height * -0.5));

        const baseDepth = 10;
        const torso = this.createPartImage(x, y, this.getCharacterPartTexture(characterCode, 'torso', facing), bodyScale, baseDepth + 5, tintColor ?? 0x777777);
        const head = this.createPartImage(x, y, this.getCharacterPartTexture(characterCode, 'head', facing), bodyScale, baseDepth + 6, 0xffffff);
        const leftArm = this.createPartImage(x, y, this.getCharacterPartTexture(characterCode, 'leftArm', facing), bodyScale, baseDepth + 7, tintColor ?? 0x8f8f8f);
        const rightArm = this.createPartImage(x, y, this.getCharacterPartTexture(characterCode, 'rightArm', facing), bodyScale, baseDepth + 8, tintColor ?? 0x8f8f8f);
        const leftLeg = this.createPartImage(x, y, this.getCharacterPartTexture(characterCode, 'leftLeg', facing), legScale, baseDepth + 1, 0x666666);
        const rightLeg = this.createPartImage(x, y, this.getCharacterPartTexture(characterCode, 'rightLeg', facing), legScale, baseDepth + 2, 0x666666);
        if (leftArm) leftArm.setOrigin(0.5, 0);
        if (rightArm) rightArm.setOrigin(0.5, 0);
        if (leftLeg) leftLeg.setOrigin(0.5, 0);
        if (rightLeg) rightLeg.setOrigin(0.5, 0);
        const handItem = this.add.image(x, y, 'espada')
            .setOrigin(0.5, 0)
            .setDepth(baseDepth + 6)
            .setScrollFactor(0)
            .setDisplaySize(60, 60)
            .setVisible(false);

        const rig = {
            code: characterCode,
            anchor,
            torso,
            head,
            leftArm,
            rightArm,
            leftLeg,
            rightLeg,
            facing: 'frontal',
            walkPhase: 0,
            bodyWidth: torsoWidth,
            bodyHeight: torsoHeight,
            torsoWidth,
            torsoHeight,
            headWidth,
            headHeight,
            armWidth,
            armHeight,
            legWidth,
            legHeight,
            bodyScale,
            legScale,
            handItem,
            handItemKey: null,
            baseDepth
        };

        this.updateCharacterRig(rig, 0, true);

        return rig;
    }

    updateCharacterRig(rig, delta = 0, forceIdle = false) {
        if (!rig || !rig.anchor) {
            return;
        }

        const anchor = rig.anchor;
        const velocityX = anchor.body ? anchor.body.velocity.x : 0;
        const facing = this.getFacingFromVelocity(velocityX, rig.facing);
        const moving = !forceIdle && Math.abs(velocityX) > 10;
        const onGround = anchor.body ? anchor.body.blocked.down || anchor.body.touching.down : false;

        rig.facing = facing;

        if (moving && onGround) {
            rig.walkPhase += delta * 0.010;
        }

        const bodyX = anchor.x;
        const bodyY = anchor.y;
        const bodyLift = 22;
        const bob = moving && onGround ? Math.sin(rig.walkPhase * 2) * 4 : 0;
        const swing = moving && onGround ? Math.sin(rig.walkPhase * 4) * 14 : 0;
        const legPhase = rig.walkPhase * 1.6;
        const leftStep = moving ? Math.sin(legPhase) : 0;
        const rightStep = moving ? Math.sin(legPhase + Math.PI) : 0;
        const armSwing = moving ? Math.sin(legPhase) * 14 : 0;

        const torsoHeight = rig.torsoHeight;
        const torsoWidth = rig.torsoWidth;
        const headHeight = rig.headHeight;
        const armWidth = rig.armWidth;
        const armHeight = rig.armHeight;
        const legHeight = rig.legHeight;
        const legWidth = rig.legWidth;

        const torsoFacing = this.getCharacterPartTexture(rig.code, 'torso', facing);
        const headFacing = this.getCharacterPartTexture(rig.code, 'head', facing);
        const leftArmFacing = this.getCharacterPartTexture(rig.code, 'leftArm', facing);
        const rightArmFacing = this.getCharacterPartTexture(rig.code, 'rightArm', facing);
        const leftLegFacing = this.getCharacterPartTexture(rig.code, 'leftLeg', facing);
        const rightLegFacing = this.getCharacterPartTexture(rig.code, 'rightLeg', facing);

        if (rig.torso) {
            const torsoTexture = this.getTextureKey(torsoFacing);
            if (torsoTexture) {
                rig.torso.setTexture(torsoTexture);
            }
            rig.torso.setPosition(bodyX, bodyY + bob - bodyLift);
        }

        if (rig.head) {
            const headTexture = this.getTextureKey(headFacing);
            if (headTexture) {
                rig.head.setTexture(headTexture);
            }
            rig.head.setPosition(bodyX, bodyY - (torsoHeight * 0.71) + bob - bodyLift);
        }

        const currentArmSwing = moving ? armSwing : 0;
        const shoulderY = bodyY - (torsoHeight * 0.55) + bob - bodyLift;
        const armVerticalOffset = moving ? 6.5 - Math.abs(currentArmSwing) * 0.02 : 7;
        const idleArmSeparation = torsoWidth * 0.67;
        const movingArmSeparation = 0;
        const armShoulderOffset = moving ? movingArmSeparation : idleArmSeparation;
        const leftShoulderX = bodyX - armShoulderOffset;
        const rightShoulderX = bodyX + armShoulderOffset;
        const legXOffset = moving ? torsoWidth * 0.06 : torsoWidth * 0.25;
        let leftArmDepth = rig.baseDepth + 4;
        let rightArmDepth = rig.baseDepth + 8;
        let itemDepth = rig.baseDepth + 6;
        let torsoDepthCurrent = rig.baseDepth + 5;

        if (facing === 'izquierda') {
            leftArmDepth = rig.baseDepth + 8;
            rightArmDepth = rig.baseDepth + 4;
            itemDepth = rig.baseDepth + 5;
            torsoDepthCurrent = rig.baseDepth + 6;
        }

        if (rig.torso) {
            rig.torso.setDepth(torsoDepthCurrent);
        }

        if (rig.leftArm) {
            const leftArmTexture = this.getTextureKey(leftArmFacing);
            if (leftArmTexture) {
                rig.leftArm.setTexture(leftArmTexture);
            }
            rig.leftArm.setPosition(
                leftShoulderX,
                shoulderY + armVerticalOffset
            );
            rig.leftArm.setAngle(currentArmSwing);
            rig.leftArm.setDepth(leftArmDepth);
        }

        if (rig.rightArm) {
            const rightArmTexture = this.getTextureKey(rightArmFacing);
            if (rightArmTexture) {
                rig.rightArm.setTexture(rightArmTexture);
            }
            rig.rightArm.setPosition(
                rightShoulderX,
                shoulderY + armVerticalOffset
            );
            rig.rightArm.setAngle(-currentArmSwing);
            rig.rightArm.setDepth(rightArmDepth);
        }

            if (rig.leftLeg) {
            const leftLegTexture = this.getTextureKey(leftLegFacing);
            if (leftLegTexture) {
                rig.leftLeg.setTexture(leftLegTexture);
            }

            rig.leftLeg.setPosition(
                bodyX - legXOffset,
                bodyY + (torsoHeight * 0.45) + bob - Math.abs(leftStep) * 4 - 20
            );

            rig.leftLeg.setAngle(moving ? leftStep * 12 : 0);
        }

        if (rig.rightLeg) {
            const rightLegTexture = this.getTextureKey(rightLegFacing);
            if (rightLegTexture) {
                rig.rightLeg.setTexture(rightLegTexture);
            }

            rig.rightLeg.setPosition(
                bodyX + legXOffset,
                bodyY + (torsoHeight * 0.45) + bob - Math.abs(rightStep) * 4 - 20
            );

            rig.rightLeg.setAngle(moving ? rightStep * 12 : 0);
        }
        
        if (rig.handItem) {
            const selectedTexture = rig.handItemKey;
            const handItemShown = moving && selectedTexture && this.textures.exists(selectedTexture);
            if (handItemShown) {
                const activeArm = facing === 'derecha' ? rig.rightArm : rig.leftArm;
                const armAngleRad = Phaser.Math.DegToRad(activeArm.angle);
                const armTipDistance = Math.max(0, rig.armHeight - 12);
                const handXBase = activeArm.x + Math.sin(armAngleRad) * armTipDistance;
                const handYBase = activeArm.y + Math.cos(armAngleRad) * armTipDistance - 20;
                const itemOffset = selectedTexture === 'espada' || selectedTexture === 'pico'
                    ? { dx: 8, dy: -15 }
                    : selectedTexture === 'manzana' || selectedTexture === 'blockTex'
                        ? { dx: 0, dy: 8 }
                        : { dx: 0, dy: 0 };
                const handX = handXBase + itemOffset.dx;
                const handY = handYBase + itemOffset.dy;
                rig.handItem.setPosition(handX, handY);
                const displayAngle = facing === 'izquierda' ? activeArm.angle - 20 : activeArm.angle;
                rig.handItem.setAngle(displayAngle);
                if (rig.handItem.texture.key !== selectedTexture) {
                    rig.handItem.setTexture(selectedTexture);
                }
                const itemSize = selectedTexture === 'blockTex' ? 15 : selectedTexture === 'manzana' ? 25 : 60;
                rig.handItem.setDisplaySize(itemSize, itemSize);
                const shouldMirrorItem = facing === 'izquierda' && (selectedTexture === 'espada' || selectedTexture === 'pico');
                rig.handItem.setFlipX(shouldMirrorItem);
                rig.handItem.setVisible(true);
                rig.handItem.setDepth(itemDepth);
            } else {
                rig.handItem.setVisible(false);
            }
        }
    }

    createHeartString(count) {
        return '♥'.repeat(Math.max(0, count));
    }

    createHud(anchoCanvas, altoCanvas) {
        const nameStyle = {
            fontFamily: 'Minecraftia',
            fontSize: 28,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        };

        const heartsStyle = {
            fontFamily: 'Arial',
            fontSize: 26,
            color: '#ff4d4d',
            stroke: '#000000',
            strokeThickness: 3
        };

        this.player1NameText = this.add.text(24, 14, 'Jugador 1', nameStyle)
            .setScrollFactor(0)
            .setDepth(100);

        this.player1HeartsText = this.add.text(24, 44, this.createHeartString(this.player1Health), heartsStyle)
            .setScrollFactor(0)
            .setDepth(100);

        this.player2NameText = this.add.text(anchoCanvas - 24, 14, 'Jugador 2', nameStyle)
            .setOrigin(1, 0)
            .setScrollFactor(0)
            .setDepth(100);

        this.player2HeartsText = this.add.text(anchoCanvas - 24, 44, this.createHeartString(this.player2Health), heartsStyle)
            .setOrigin(1, 0)
            .setScrollFactor(0)
            .setDepth(100);

        this.createInventoryRow(24, altoCanvas - 34, 'left');
        this.createInventoryRow(anchoCanvas - 24, altoCanvas - 34, 'right');
    }

    createInventoryRow(anchorX, anchorY, side) {
        const slotSize = 38;
        const gap = 4;
        const slots = 4;
        const totalWidth = (slotSize * slots) + (gap * (slots - 1));
        const startX = side === 'left' ? anchorX : anchorX - totalWidth;
        const items = this.inventoryItems || ['espada', 'pico', 'manzana', 'blockTex', null];

        for (let index = 0; index < slots; index++) {
            const x = startX + (index * (slotSize + gap)) + (slotSize / 2);
            const slot = this.add.rectangle(x, anchorY, slotSize, slotSize, 0x8a8a8a, 1)
                .setStrokeStyle(2, 0x2f2f2f, 1)
                .setScrollFactor(0)
                .setDepth(100);

            slot.setAlpha(0.95);
            // add item image if available for this slot and store references
            let img = null;
            if (index < items.length) {
                const key = items[index];
                if (this.textures.exists(key)) {
                    img = this.add.image(x, anchorY, key)
                        .setOrigin(0.5)
                        .setDepth(101)
                        .setScrollFactor(0);
                    const displaySize = Math.max(8, slotSize - 8);
                    img.setDisplaySize(displaySize, displaySize);
                }
            }

            if (side === 'left') {
                this.inventoryLeftSlots.push(slot);
                this.inventoryLeftImages.push(img);
            } else {
                this.inventoryRightSlots.push(slot);
                this.inventoryRightImages.push(img);
            }
        }
    }

    refreshHealthHud() {
        if (this.player1HeartsText) {
            this.player1HeartsText.setText(this.createHeartString(this.player1Health));
        }

        if (this.player2HeartsText) {
            this.player2HeartsText.setText(this.createHeartString(this.player2Health));
        }
    }

    endMatch() {
        if (this.matchEnded) return;

        this.matchEnded = true;
        this.gameStarted = false;

        if (this.player1?.body) {
            this.player1.body.setVelocity(0, 0);
            this.player1.body.allowGravity = false;
        }

        if (this.player2?.body) {
            this.player2.body.setVelocity(0, 0);
            this.player2.body.allowGravity = false;
        }

        this.timeOverImage = this.add.image(this.scale.width / 2, this.scale.height / 2, 'tiempo')
            .setOrigin(0.5)
            .setDepth(200);

        const maxWidth = this.scale.width * 0.7;
        const targetScale = this.timeOverImage.width > maxWidth ? maxWidth / this.timeOverImage.width : 1;

        this.timeOverImage.setAlpha(0);
        this.timeOverImage.setScale(targetScale * 0.6);

        this.tweens.add({
            targets: this.timeOverImage,
            alpha: 1,
            scaleX: targetScale,
            scaleY: targetScale,
            duration: 450,
            ease: 'Back.Out'
        });
    }

    init(data) {
        this.selectedStage = data.stage || 'stage_kinal';
        this.selectedCharacters = Array.isArray(data.characters) && data.characters.length >= 2
            ? data.characters.slice(0, 2)
            : ['30', '31'];
        this.redCharacter = this.selectedCharacters[0] || '30';
        this.greenCharacter = this.selectedCharacters[1] || '31';
        this.player1Health = 8;
        this.player2Health = 8;
    }

    getStageBackgroundImage(stage) {
        switch (stage) {
            case 'stage_kinal':
                return 'Entrada_kinal.png';
            case 'stage_construccion':
                return 'Construccion_kinal.png';
            case 'stage_canchas':
                return 'Canchas_kinal.png';
            case 'stage_bg':
                return 'bg.png';
            default:
                return 'bg.png';
        }
    }

   preload () {
    this.load.setPath('assets');

    const stageImage = this.getStageBackgroundImage(this.selectedStage);
    this.load.image('bg', stageImage);
    this.load.image('blockTex', 'Tierra.jpeg');
    this.load.image('espada', 'Espada.png');
    this.load.image('pico', 'Pico.png');
    this.load.image('manzana', 'Manzana.png');
    this.load.image('tiempo', 'Tiempo.png');

    const characters = [this.redCharacter, this.greenCharacter];

    const directions = ['CaraFrontal', 'CaraIzquierda', 'CaraDerecha'];

    // =========================
    // 🧠 CABEZA (global)
    // =========================
    directions.forEach(dir => {
        this.load.image(`Cabeza_${dir}`, `Cabeza_${dir}.png`);
    });

    // =========================
    // 🔥 PARTES POR PERSONAJE
    // =========================
    characters.forEach(char => {

        // TORSO
        directions.forEach(dir => {
            this.load.image(`${char}_Torso_${dir}`, `${char}_Torso_${dir}.png`);
        });

        // BRAZOS
        directions.forEach(dir => {
            this.load.image(`${char}_BrazoDerecho_${dir}`, `${char}_BrazoDerecho_${dir}.png`);
            this.load.image(`${char}_BrazoIzquierdo_${dir}`, `${char}_BrazoIzquierdo_${dir}.png`);
        });

        // PIERNAS (si son compartidas no necesitas char)
        directions.forEach(dir => {
            this.load.image(`PiernaDerecha_${dir}`, `PiernaDerecha_${dir}.png`);
            this.load.image(`PiernaIzquierda_${dir}`, `PiernaIzquierda_${dir}.png`);
        });

    });
}

    create () {
        let anchoCanvas = this.scale.width;
        let altoCanvas = this.scale.height;

        this.ensureGeneratedTextures();

        const fondo = this.add.image(anchoCanvas / 2, altoCanvas / 2, 'bg');
        if (fondo) fondo.setDisplaySize(anchoCanvas, altoCanvas);

        const cmToPx = (cm) => Math.round(cm * (96 * (window.devicePixelRatio || 1) / 2.54));
        const groundShift = cmToPx(20);
        const extraGroundUpPx = cmToPx(5);
        const groundHeight = Math.max(220, Math.round(altoCanvas * 0.10));
        let posicionYSuelo = altoCanvas - (altoCanvas * 0.25) + groundShift - extraGroundUpPx;
        const maxY = altoCanvas - groundHeight / 2;
        if (posicionYSuelo > maxY) posicionYSuelo = maxY;

        const blockSize = 80;
        this.groundBlockSize = blockSize;
        const rows = 2;
        const desiredGroundTopY = posicionYSuelo - (rows * blockSize) / 2 + blockSize;
        const minGroundTopY = blockSize / 2;
        const maxGroundTopY = altoCanvas - (rows * blockSize) + blockSize / 2;
        const groundTopY = Phaser.Math.Clamp(desiredGroundTopY, minGroundTopY, maxGroundTopY);
        this.groundBlocks = this.physics.add.staticGroup();

        for (let row = 0; row < rows; row++) {
            const blockY = groundTopY + (row * blockSize);
            for (let x = -blockSize / 2; x <= anchoCanvas + blockSize / 2; x += blockSize) {
                const block = this.groundBlocks.create(x, blockY, 'blockTex');
                block.setDisplaySize(blockSize, blockSize);
                if (typeof block.refreshBody === 'function') {
                    block.refreshBody();
                }
            }
        }

        const playerOffsetY = 95;
        const raiseY = Math.round(altoCanvas * 0.18);
        const maxRaisePossible = Math.max(0, posicionYSuelo - playerOffsetY - 50);
        const finalRaiseY = Math.min(raiseY, maxRaisePossible);
        const initialRaiseY = posicionYSuelo - playerOffsetY - finalRaiseY - 60;

        this.player1Rig = this.createCharacterRig(this.redCharacter, anchoCanvas * 0.25, initialRaiseY, 0xff6666);
        this.player2Rig = this.createCharacterRig(this.greenCharacter, anchoCanvas * 0.75, initialRaiseY, 0x66ff66);

        const playerBlockTopY = groundTopY - blockSize / 2;
        const playerBodyHalfHeight1 = this.player1Rig.anchor.body ? this.player1Rig.anchor.body.height / 2 : 90;
        const playerBodyHalfHeight2 = this.player2Rig.anchor.body ? this.player2Rig.anchor.body.height / 2 : 90;
        const standingY1 = playerBlockTopY - playerBodyHalfHeight1 + 2;
        const standingY2 = playerBlockTopY - playerBodyHalfHeight2 + 2;
        this.player1Rig.anchor.setPosition(anchoCanvas * 0.25, standingY1);
        this.player2Rig.anchor.setPosition(anchoCanvas * 0.75, standingY2);

        this.player1 = this.player1Rig.anchor;
        this.player2 = this.player2Rig.anchor;

        if (this.player1.body) {
            this.player1.body.allowGravity = false;
            this.player1.body.setVelocity(0, 0);
        }
        if (this.player2.body) {
            this.player2.body.allowGravity = false;
            this.player2.body.setVelocity(0, 0);
        }

        this.physics.add.collider(this.player1, this.groundBlocks);
        this.physics.add.collider(this.player2, this.groundBlocks);

        this.time.delayedCall(50, () => {
            this.player2.setPosition(anchoCanvas * 0.75, this.player1.y);
            if (this.player2.body && this.player2.body.reset) this.player2.body.reset(this.player2.x, this.player2.y);
            if (this.player1.body && this.player1.body.reset) this.player1.body.reset(this.player1.x, this.player1.y);
            if (this.player1.body) {
                this.player1.body.setVelocity(0, 0);
                this.player1.body.allowGravity = true;
            }
            if (this.player2.body) {
                this.player2.body.setVelocity(0, 0);
                this.player2.body.allowGravity = true;
            }
            this.updateCharacterRig(this.player1Rig, 0, true);
            this.updateCharacterRig(this.player2Rig, 0, true);
        });

        this.blocks = this.physics.add.staticGroup();
        this.physics.add.collider(this.player1, this.blocks);
        this.physics.add.collider(this.player2, this.blocks);

        this.placeKeys = this.input.keyboard.addKeys({ p1: Phaser.Input.Keyboard.KeyCodes.F, p2: Phaser.Input.Keyboard.KeyCodes.L });
        // ataques: jugador1 usa F, jugador2 usa L (y tecla '1' como alternativa)
        
        this.input.keyboard.on('keydown-H', () => this.handleRemoveBlock(1));
        this.input.keyboard.on('keydown-I', () => this.handleRemoveBlock(2));

        this.keysWASD = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.cursors = this.input.keyboard.createCursorKeys();

        this.timeRemaining = 120;
        this.gameStarted = false;
        this.matchEnded = false;
        this.countdownValue = 3;
        // inventory state containers (used by createInventoryRow)
        this.inventoryLeftSlots = [];
        this.inventoryLeftImages = [];
        this.inventoryRightSlots = [];
        this.inventoryRightImages = [];
        this.inventoryItems = ['espada', 'pico', 'manzana', 'blockTex', null];
        this.player1SelectedSlot = 0;
        this.player2SelectedSlot = 0;

        this.createHud(anchoCanvas, altoCanvas);
        // show initial selection visuals
        if (this.updateSelectionVisuals) {
            this.updateSelectionVisuals(1);
            this.updateSelectionVisuals(2);
        }
        if (this.updateHandItem) {
            this.updateHandItem(1);
            this.updateHandItem(2);
        }
        this.timerText = this.add.text(anchoCanvas / 2, 50, '3', {
            fontFamily: 'Minecraftia',
            fontSize: 64,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(100);
        this.lastTimeUpdate = 0;

        this.time.delayedCall(1000, () => {
            this.countdownValue = 2;
            this.timerText.setText('2');
        });

        this.time.delayedCall(2000, () => {
            this.countdownValue = 1;
            this.timerText.setText('1');
        });

        this.time.delayedCall(3000, () => {
            this.gameStarted = true;
            this.countdownValue = 0;
            this.timerText.setText('02:00');
            this.timerText.setFontSize(48);
            this.lastTimeUpdate = this.game.getTime();
        });

        // selection keys: player1 -> F, player2 -> K
        this.input.keyboard.on('keydown-F', () => this.cycleSelection && this.cycleSelection(1));
        this.input.keyboard.on('keydown-K', () => this.cycleSelection && this.cycleSelection(2));
    }

    update (time, delta) {
        const speed = 350;
        const jumpForce = -650;

        if (this.gameStarted && this.timeRemaining > 0 && this.game.getTime() - this.lastTimeUpdate >= 1000) {
            this.timeRemaining--;
            this.lastTimeUpdate = this.game.getTime();
            const minutes = Math.floor(this.timeRemaining / 60);
            const seconds = this.timeRemaining % 60;
            this.timerText.setText(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
            
            if (this.timeRemaining <= 0) {
                this.timerText.setColor('#ff0000');
                this.timerText.setText('00:00');
                this.endMatch();
                return;
            }
        }

        if (this.matchEnded) {
            return;
        }

        if (this.gameStarted) {
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

            this.updateCharacterRig(this.player1Rig, delta);
            this.updateCharacterRig(this.player2Rig, delta);
        } else {
            this.updateCharacterRig(this.player1Rig, delta, true);
            this.updateCharacterRig(this.player2Rig, delta, true);
        }
    }

    handleAttack(playerIndex) {
        const now = Date.now();
        const maxDistance = 120; // un bloque ≈ 100px

        if (playerIndex === 1) {
            this.lastAttackAt1 = this.lastAttackAt1 || 0;
            if (now - this.lastAttackAt1 < 300) return; // cooldown 300ms
            this.lastAttackAt1 = now;
            this.attackPlayer(this.player1Rig, this.player2Rig, 1, maxDistance);
        } else {
            this.lastAttackAt2 = this.lastAttackAt2 || 0;
            if (now - this.lastAttackAt2 < 300) return;
            this.lastAttackAt2 = now;
            this.attackPlayer(this.player2Rig, this.player1Rig, 2, maxDistance);
        }
    }

    attackPlayer(attackerRig, targetRig, attackerIndex, maxDistance = 120) {
        if (!attackerRig || !attackerRig.anchor || !targetRig || !targetRig.anchor) return;

        const ax = attackerRig.anchor.x;
        const ay = attackerRig.anchor.y;
        const tx = targetRig.anchor.x;
        const ty = targetRig.anchor.y;

        const dist = Phaser.Math.Distance.Between(ax, ay, tx, ty);
        if (dist > maxDistance) return; // fuera de rango

        // aplicar daño de 1 corazón
        if (attackerIndex === 1) {
            this.player2Health = Math.max(0, (this.player2Health || 0) - 1);
        } else {
            this.player1Health = Math.max(0, (this.player1Health || 0) - 1);
        }

        this.refreshHealthHud();

        // efecto visual de impacto en el objetivo
        const targetSprite = targetRig.torso || targetRig.head || targetRig.anchor;
        if (targetSprite) {
            if (typeof targetSprite.setTint === 'function') targetSprite.setTint(0xff6666);
            this.time.delayedCall(120, () => {
                if (typeof targetSprite.clearTint === 'function') targetSprite.clearTint();
            });
        }

        // empujón ligero hacia afuera del atacante
        const push = 200;
        const dir = tx >= ax ? 1 : -1;
        if (targetRig.anchor.body && typeof targetRig.anchor.body.setVelocityX === 'function') {
            targetRig.anchor.body.setVelocityX(push * dir);
        }

        // comprobar muerte
        if (this.player1Health <= 0 || this.player2Health <= 0) {
            this.endMatch();
        }
    }

    handleRemoveBlock(playerIndex) {
        const player = playerIndex === 1 ? this.player1 : this.player2;
        const rig = playerIndex === 1 ? this.player1Rig : this.player2Rig;
        if (!player || !player.body || !this.groundBlocks || !rig) return;

        const verticalDirection = playerIndex === 1
            ? this.keysWASD?.up?.isDown ? -1 : this.keysWASD?.down?.isDown ? 1 : 0
            : this.cursors?.up?.isDown ? -1 : this.cursors?.down?.isDown ? 1 : 0;

        const blockSize = 100;
        const direction = verticalDirection === -1 ? 'up'
            : verticalDirection === 1 ? 'down'
            : rig.facing === 'izquierda' ? 'left' : 'right';

        let closestBlock = null;
        let closestMetric = Number.MAX_VALUE;

        this.groundBlocks.getChildren().forEach((block) => {
            if (!block || !block.body) return;
            const dx = block.x - player.x;
            const dy = block.y - player.y;
            const absDx = Math.abs(dx);
            const absDy = Math.abs(dy);

            if (direction === 'left' && dx >= 0) return;
            if (direction === 'right' && dx <= 0) return;
            if (direction === 'up' && dy >= 0) return;
            if (direction === 'down' && dy <= 0) return;

            if (direction === 'left' || direction === 'right') {
                if (absDy > blockSize * 0.8) return;
                const metric = absDx + absDy * 0.3;
                if (metric < closestMetric) {
                    closestMetric = metric;
                    closestBlock = block;
                }
            } else {
                if (absDx > blockSize * 0.8) return;
                const metric = absDy + absDx * 0.3;
                if (metric < closestMetric) {
                    closestMetric = metric;
                    closestBlock = block;
                }
            }
        });

        if (!closestBlock) {
            const maxDistance = 150;
            this.groundBlocks.getChildren().forEach((block) => {
                if (!block || !block.body) return;
                const dx = block.x - player.x;
                const dy = block.y - player.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance <= maxDistance && distance < closestMetric) {
                    closestMetric = distance;
                    closestBlock = block;
                }
            });
        }

        if (closestBlock) {
            this.groundBlocks.remove(closestBlock, true, true);
            if (closestBlock.body && typeof closestBlock.body.destroy === 'function') {
                closestBlock.body.destroy();
            }
        }
    }

    placeBlock(player, playerIndex) {
        if (!player || !player.body) return;
        const bw = 100;
        const bh = 100;

        const offsetX = playerIndex === 1 ? Math.round(bw * 1.2) : -Math.round(bw * 1.2);
        const bx = player.x + offsetX;
        const by = player.y;

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

    cycleSelection(playerIndex) {
        const slots = playerIndex === 1 ? this.inventoryLeftSlots : this.inventoryRightSlots;
        if (!slots || slots.length === 0) return;

        if (playerIndex === 1) {
            this.player1SelectedSlot = (this.player1SelectedSlot + 1) % slots.length;
        } else {
            this.player2SelectedSlot = (this.player2SelectedSlot + 1) % slots.length;
        }

        this.updateSelectionVisuals(playerIndex);
        this.updateHandItem(playerIndex);
    }

    getSelectedItemKey(playerIndex) {
        const selectedIndex = playerIndex === 1 ? this.player1SelectedSlot : this.player2SelectedSlot;
        if (!Array.isArray(this.inventoryItems)) return null;
        return this.inventoryItems[selectedIndex] || null;
    }

    updateHandItem(playerIndex) {
        const rig = playerIndex === 1 ? this.player1Rig : this.player2Rig;
        if (!rig || !rig.handItem) return;

        const itemKey = this.getSelectedItemKey(playerIndex);
        rig.handItemKey = itemKey;

        if (itemKey && this.textures.exists(itemKey)) {
            rig.handItem.setTexture(itemKey);
            rig.handItem.setVisible(true);
        } else {
            rig.handItem.setVisible(false);
        }
    }

    updateSelectionVisuals(playerIndex) {
        const leftSlots = this.inventoryLeftSlots || [];
        const rightSlots = this.inventoryRightSlots || [];
        const leftImgs = this.inventoryLeftImages || [];
        const rightImgs = this.inventoryRightImages || [];

        for (let i = 0; i < leftSlots.length; i++) {
            const s = leftSlots[i];
            if (!s) continue;
            if (i === this.player1SelectedSlot) {
                s.setStrokeStyle(3, 0xffff66, 1);
                if (leftImgs[i]) leftImgs[i].setTint(0xffffaa);
            } else {
                s.setStrokeStyle(2, 0x2f2f2f, 1);
                if (leftImgs[i]) leftImgs[i].clearTint();
            }
        }

        for (let i = 0; i < rightSlots.length; i++) {
            const s = rightSlots[i];
            if (!s) continue;
            if (i === this.player2SelectedSlot) {
                s.setStrokeStyle(3, 0xffff66, 1);
                if (rightImgs[i]) rightImgs[i].setTint(0xffffaa);
            } else {
                s.setStrokeStyle(2, 0x2f2f2f, 1);
                if (rightImgs[i]) rightImgs[i].clearTint();
            }
        }

        if (this.updateHandItem) {
            this.updateHandItem(1);
            this.updateHandItem(2);
        }
    }
}