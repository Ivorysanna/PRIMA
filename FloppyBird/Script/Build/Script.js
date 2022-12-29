"use strict";
var Script;
(function (Script) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(Script);
    class Avatar extends f.ComponentScript {
        static iSubclass = f.Component.registerSubclass(Avatar);
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
    var f = FudgeCore;
    f.Debug.info("Main Program Template running!");
    // Initialize Viewport
    let viewport;
    Script.gravity = new f.Vector3(0, -.8, 0);
    let rigidbodyFloppyBird;
    let jumpForce = new f.Vector3(0, 1, 0);
    f.Physics.setGravity(Script.gravity);
    document.addEventListener("interactiveViewportStarted", start);
    let isSpaceAlreadyPressed = false;
    function start(_event) {
        viewport = _event.detail;
        Script.floppyBird = viewport.getBranch().getChildrenByName("FloppyBirdBody")[0];
        f.Loop.addEventListener("loopFrame" /* f.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        ƒ.Physics.simulate();
        // let deltaTime: number = f.Loop.timeFrameGame / 1000;
        rigidbodyFloppyBird = Script.floppyBird.getComponent(f.ComponentRigidbody);
        //Controls
        if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.SPACE])) {
            if (!isSpaceAlreadyPressed) {
                rigidbodyFloppyBird.applyLinearImpulse(jumpForce);
                isSpaceAlreadyPressed = true;
            }
        }
        else {
            isSpaceAlreadyPressed = false;
        }
        viewport.draw();
        f.AudioManager.default.update();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map