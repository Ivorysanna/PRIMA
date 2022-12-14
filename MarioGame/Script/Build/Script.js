"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    class Avatar extends ƒAid.NodeSprite {
        animWalk;
        animSprint;
        animJump;
        animLook;
        animDeath;
        constructor() {
            super("Avatar");
            this.initializeAnimations();
            this.addComponent(new ƒ.ComponentTransform());
            this.setAnimation(this.animWalk);
            this.framerate = 20;
        }
        async initializeAnimations() {
            let imgSpriteSheet = new ƒ.TextureImage();
            await imgSpriteSheet.load("./Images/CharacterSheet/mario_walk.png");
            let coat = new ƒ.CoatTextured(undefined, imgSpriteSheet);
            this.animWalk = new ƒAid.SpriteSheetAnimation("Walk", coat);
            this.animWalk.generateByGrid(ƒ.Rectangle.GET(0, 16, 16, 16), 3, 16, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(17));
            this.animSprint = new ƒAid.SpriteSheetAnimation("Sprint", coat);
            this.animSprint.generateByGrid(ƒ.Rectangle.GET(0, 16, 16, 16), 3, 16, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(17));
            this.animJump = new ƒAid.SpriteSheetAnimation("Jump", coat);
            this.animJump.generateByGrid(ƒ.Rectangle.GET(0, 16, 16, 16), 3, 16, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(17));
            this.animLook = new ƒAid.SpriteSheetAnimation("Look", coat);
            this.animLook.generateByGrid(ƒ.Rectangle.GET(0, 16, 16, 16), 3, 16, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(17));
            this.animDeath = new ƒAid.SpriteSheetAnimation("Death", coat);
            this.animDeath.generateByGrid(ƒ.Rectangle.GET(0, 16, 16, 16), 3, 16, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(17));
        }
    }
    Script.Avatar = Avatar;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    // Initialize Viewport
    let viewport;
    let graph;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        hndLoad(_event);
    }
    let animWalk;
    let animSprint;
    let animJump;
    let animLook;
    let animDeath;
    function initializeAnimations(coat) {
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
    let audioJump;
    let audioDeath;
    function initializeSound() {
        audioJump = new ƒ.Audio("./Sound/jump.wav");
        audioDeath = new ƒ.Audio("./Sound/death.wav");
    }
    // Load Sprite and Sound
    let avatar;
    let audio;
    async function hndLoad(_event) {
        let imgSpriteSheet = new ƒ.TextureImage();
        let coat = new ƒ.CoatTextured(undefined, imgSpriteSheet);
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
        let avatarInstance = new Script.Avatar();
        avatarInstance.initializeAnimations();
        audio = graph.getComponent(ƒ.ComponentAudio);
        audio.connect(true);
        audio.volume = 1;
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.FRAME_REQUEST, 30);
    }
    const xSpeedDefault = 2.5;
    const xSpeedSprint = 5;
    const jumpForce = 0.05;
    let ySpeed = 0;
    let gravity = 0.1;
    let dead = false;
    let leftDirection = false;
    let prevSprint = false;
    function update(_event) {
        let deltaTime = ƒ.Loop.timeFrameGame / 1000;
        ySpeed -= gravity * deltaTime;
        avatar.mtxLocal.translateY(ySpeed);
        let pos = avatar.mtxLocal.translation;
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
        if (pos.y + ySpeed > 0)
            avatar.mtxLocal.translateY(ySpeed);
        else {
            ySpeed = 0;
            pos.y = 0;
            avatar.mtxLocal.translation = pos;
        }
        let speed = xSpeedDefault;
        if (leftDirection)
            speed = -xSpeedDefault;
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT, ƒ.KEYBOARD_CODE.SHIFT_RIGHT])) {
            speed = xSpeedSprint;
            if (leftDirection)
                speed = -xSpeedSprint;
        }
        // Calculate (walk) speed
        const moveDistance = (speed * ƒ.Loop.timeFrameGame) / 1000;
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
        }
        else if (ySpeed < 0) {
            avatar.setAnimation(animJump);
            avatar.showFrame(1);
        }
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function checkInput(moveDistance, speed) {
        // Check for key presses
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
            avatar.mtxLocal.translateX(-moveDistance);
            leftDirection = true;
            if (speed < -1) {
                if (!prevSprint) {
                    prevSprint = true;
                    avatar.setAnimation(animSprint);
                }
            }
            else {
                prevSprint = false;
            }
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
            avatar.mtxLocal.translateX(moveDistance);
            leftDirection = false;
            if (speed > 1) {
                if (!prevSprint) {
                    prevSprint = true;
                    avatar.setAnimation(animSprint);
                }
            }
            else {
                prevSprint = false;
            }
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])) {
            avatar.setAnimation(animLook);
            avatar.showFrame(1);
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
            avatar.setAnimation(animLook);
            avatar.showFrame(0);
        }
        else {
            avatar.setAnimation(animWalk);
            avatar.showFrame(0);
        }
        // Rotate based on direction
        avatar.mtxLocal.rotation = ƒ.Vector3.Y(leftDirection ? 180 : 0);
    }
    function checkCollision() {
        let blocks = graph.getChildrenByName("Floor")[0];
        let pos = avatar.mtxLocal.translation;
        for (let block of blocks.getChildren()) {
            let posBlock = block.mtxLocal.translation;
            if (Math.abs(pos.x - posBlock.x) < 0.5) {
                if (pos.y < posBlock.y + 0.5) {
                    pos.y = posBlock.y + 0.5;
                    avatar.mtxLocal.translation = pos;
                    ySpeed = 0;
                }
            }
        }
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map