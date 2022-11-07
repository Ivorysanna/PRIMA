namespace Script {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    // Initialize Viewport
    let viewport: ƒ.Viewport;
    let graph: ƒ.Node;
    document.addEventListener("interactiveViewportStarted", <EventListener>start);

    function start(_event: CustomEvent): void {
        viewport = _event.detail;
        hndLoad(_event);
    }

    let animWalk: ƒAid.SpriteSheetAnimation;
    let animSprint: ƒAid.SpriteSheetAnimation;
    let animJump: ƒAid.SpriteSheetAnimation;
    let animLook: ƒAid.SpriteSheetAnimation;
    let animDeath: ƒAid.SpriteSheetAnimation;

    function initializeAnimations(coat: ƒ.CoatTextured): void {
        animWalk = new ƒAid.SpriteSheetAnimation("Walk", coat);
        animWalk.generateByGrid(ƒ.Rectangle.GET(0, 16, 16, 16), 3, 16, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(17));

        animSprint = new ƒAid.SpriteSheetAnimation("Sprint", coat);
        animSprint.generateByGrid(ƒ.Rectangle.GET(0, 16, 16, 16), 3, 16, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(17));

        animJump = new ƒAid.SpriteSheetAnimation("Jump", coat);
        animJump.generateByGrid(ƒ.Rectangle.GET(0, 16, 16, 16), 3, 16, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(17));

        animLook = new ƒAid.SpriteSheetAnimation("Look", coat);
        animLook.generateByGrid(ƒ.Rectangle.GET(0, 16, 16, 16), 3, 16, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(17));

        animDeath = new ƒAid.SpriteSheetAnimation("Death", coat);
        animDeath.generateByGrid(ƒ.Rectangle.GET(0, 16, 16, 16), 3, 16, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(17));
    }

    //Initialize Sound
    let audioJump: ƒ.Audio;
    let audioDeath: ƒ.Audio;

    function initializeSound(): void {
        audioJump = new ƒ.Audio("./Sound/jump.wav");
        audioDeath = new ƒ.Audio("./Sound/death.wav");
    }

    // Load Sprite and Sound
    let avatar: ƒAid.NodeSprite;
    let audio: ƒ.ComponentAudio;

    async function hndLoad(_event: Event): Promise<void> {
        let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
        await imgSpriteSheet.load("./Images/CharacterSheet/mario_walk.png");
        let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheet);

        initializeAnimations(coat);
        initializeSound();

        avatar = new ƒAid.NodeSprite("Avatar");
        avatar.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        avatar.setAnimation(animWalk);
        avatar.setFrameDirection(1);
        avatar.framerate = 20;

        avatar.mtxLocal.translateY(0);
        avatar.mtxLocal.translateX(-1);
        avatar.mtxLocal.translateZ(0.001);

        graph = viewport.getBranch();
        graph.addChild(avatar);

        audio = graph.getComponent(ƒ.ComponentAudio);
        audio.connect(true);
        audio.volume = 1;

        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.FRAME_REQUEST, 30);
    }

    const xSpeedDefault: number = 2.5;
    const xSpeedSprint: number = 5;
    const jumpForce: number = 0.05;
    let ySpeed: number = 0;
    let gravity: number = 0.1;

    let dead: boolean = false;

    let leftDirection: boolean = false;
    let prevSprint: boolean = false;

    function update(_event: Event): void {
        let deltaTime: number = ƒ.Loop.timeFrameGame / 1000;
        ySpeed -= gravity * deltaTime;
        avatar.mtxLocal.translateY(ySpeed);

        let pos: ƒ.Vector3 = avatar.mtxLocal.translation;
        //Check for death
        if (pos.y < -1 && !dead) {
            dead = true;
            audio.setAudio(audioDeath);
            audio.play(true);
            ySpeed = jumpForce * 0.8;
            viewport.draw();
            return;
        }

        //Reload when dead
        if (dead) {
            audio.volume = 10;
            pos.y = -1;
            ƒ.Time.game.setTimer(3000, 1, () => window.location.reload());
            viewport.draw();
            return;
        }

        //Collison with box under Avatar
        checkCollision();

        if (pos.y + ySpeed > 0) avatar.mtxLocal.translateY(ySpeed);
        else {
            ySpeed = 0;
            pos.y = 0;
            avatar.mtxLocal.translation = pos;
        }

        let speed: number = xSpeedDefault;
        if (leftDirection) speed = -xSpeedDefault;

        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT, ƒ.KEYBOARD_CODE.SHIFT_RIGHT])) {
            speed = xSpeedSprint;
            if (leftDirection) speed = -xSpeedSprint;
        }

        // Calculate (walk) speed
        const moveDistance: number = (speed * ƒ.Loop.timeFrameGame) / 1000;
        checkInput(moveDistance, speed);

        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && ySpeed === 0) {
            avatar.mtxLocal.translation = new ƒ.Vector3(pos.x, 0, 0.001);
            ySpeed = jumpForce;
            audio.volume = 6;
            audio.setAudio(audioJump);
            audio.play(true);
        }

        if (ySpeed > 0) {
            avatar.setAnimation(animJump);
            avatar.showFrame(0);
        } else if (ySpeed < 0) {
            avatar.setAnimation(animJump);
            avatar.showFrame(1);
        }

        viewport.draw();
        ƒ.AudioManager.default.update();
    }

    function checkInput(moveDistance: number, speed: number): void {
        // Check for key presses
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
            avatar.mtxLocal.translateX(-moveDistance);
            leftDirection = true;
            if (speed < -1) {
                if (!prevSprint) {
                    prevSprint = true;
                    avatar.setAnimation(animSprint);
                }
            } else {
                prevSprint = false;
            }
        } else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
            avatar.mtxLocal.translateX(moveDistance);
            leftDirection = false;
            if (speed > 1) {
                if (!prevSprint) {
                    prevSprint = true;
                    avatar.setAnimation(animSprint);
                }
            } else {
                prevSprint = false;
            }
        } else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])) {
            avatar.setAnimation(animLook);
            avatar.showFrame(1);
        } else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
            avatar.setAnimation(animLook);
            avatar.showFrame(0);
        } else {
            avatar.setAnimation(animWalk);
            avatar.showFrame(0);
        }

        // Rotate based on direction
        avatar.mtxLocal.rotation = ƒ.Vector3.Y(leftDirection ? 180 : 0);
    }

    function checkCollision(): void {
        let blocks: ƒ.Node = graph.getChildrenByName("Floor")[0];
        let pos: ƒ.Vector3 = avatar.mtxLocal.translation;
        for (let block of blocks.getChildren()) {
            let posBlock: ƒ.Vector3 = block.mtxLocal.translation;
            if (Math.abs(pos.x - posBlock.x) < 0.5) {
                if (pos.y < posBlock.y + 0.5) {
                    pos.y = posBlock.y + 0.5;
                    avatar.mtxLocal.translation = pos;
                    ySpeed = 0;
                }
            }
        }
    }
}
