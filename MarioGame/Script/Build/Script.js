"use strict";
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
    //Viewport
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        hndLoad(_event);
    }
    //Create Mario
    let marioPos;
    async function hndLoad(_event) {
        // texture Mario
        let texture = new ƒ.TextureImage();
        await texture.load("./Images/CharacterSheet/mario_walk.png");
        let coat = new ƒ.CoatTextured(ƒ.Color.CSS("white"), texture);
        // animation
        // Walk
        let animWalk = new ƒAid.SpriteSheetAnimation("Walk", coat);
        animWalk.generateByGrid(ƒ.Rectangle.GET(0, 16, 16, 16), 3, 64, ƒ.ORIGIN2D.TOPLEFT, ƒ.Vector2.X(17));
        // Run
        // let animRun: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("Run", coat);
        // animWalk.generateByGrid(ƒ.Rectangle.GET(0, 16, 16, 16), 3, 64, ƒ.ORIGIN2D.TOPLEFT, ƒ.Vector2.X(17));
        // create Mario
        let marioNode = new ƒAid.NodeSprite("Mario");
        marioNode.addComponent(new ƒ.ComponentTransform());
        //marioPos.appendChild(marioNode);
        marioNode.setAnimation(animWalk);
        marioNode.setFrameDirection(1);
        marioNode.framerate = 12;
        let branch = viewport.getBranch();
        marioPos = branch.getChildrenByName("MarioPosition")[0];
        marioPos.addChild(marioNode);
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 30);
    }
    let walkSpeed = 1.5;
    function update(_event) {
        let amount = (walkSpeed * ƒ.Loop.timeFrameGame) / 1000;
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
            marioPos.mtxLocal.translateX(amount);
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
            marioPos.mtxLocal.translateX(-amount);
        }
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map