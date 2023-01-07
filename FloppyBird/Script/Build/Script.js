"use strict";
var FloppyBird;
(function (FloppyBird) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(FloppyBird);
    class Avatar extends f.ComponentScript {
        static iSubclass = f.Component.registerSubclass(Avatar);
    }
    FloppyBird.Avatar = Avatar;
})(FloppyBird || (FloppyBird = {}));
var FloppyBird;
(function (FloppyBird) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(FloppyBird); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends f.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = f.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* f.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* f.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* f.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* f.EVENT.COMPONENT_ADD */:
                    f.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* f.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* f.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* f.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* f.EVENT.NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    FloppyBird.CustomComponentScript = CustomComponentScript;
})(FloppyBird || (FloppyBird = {}));
var FloppyBird;
(function (FloppyBird) {
    var f = FudgeCore;
    f.Debug.info("Main Program Template running!");
    // Global components
    let viewportRef;
    let rigidbodyFloppyBird;
    // Physics Settings
    FloppyBird.gravity = new f.Vector3(0, -0.8, 0);
    let jumpForce = new f.Vector3(0, 1, 0);
    f.Physics.setGravity(FloppyBird.gravity);
    // Add EventListener
    document.addEventListener("interactiveViewportStarted", start);
    // Controls
    let isSpaceAlreadyPressed = false;
    // Tubes stuff
    let tubesCollection;
    let tubesTimer = 0;
    const tubesIntervalSeconds = 1;
    const tubeSpeed = 1;
    function start(_event) {
        // Get viewport and floppybird reference
        viewportRef = _event.detail;
        FloppyBird.floppyBird = viewportRef.getBranch().getChildrenByName("FloppyBirdBody")[0];
        // Get tubes collection
        tubesCollection = viewportRef.getBranch().getChildrenByName("Tubes")[0];
        // Start frame loop
        f.Loop.addEventListener("loopFrame" /* f.EVENT.LOOP_FRAME */, update);
        f.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        f.Physics.simulate();
        const deltaTime = f.Loop.timeFrameGame / 1000;
        //Controls
        rigidbodyFloppyBird = FloppyBird.floppyBird.getComponent(f.ComponentRigidbody);
        if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.SPACE])) {
            if (!isSpaceAlreadyPressed) {
                rigidbodyFloppyBird.applyLinearImpulse(jumpForce);
                isSpaceAlreadyPressed = true;
            }
        }
        else {
            isSpaceAlreadyPressed = false;
        }
        // Move Tubes to the left
        tubesCollection.getChildren().forEach((eachTubeNode) => {
            eachTubeNode.mtxLocal.translateX(-tubeSpeed * deltaTime);
        });
        // Increase timer and spawn new tube
        tubesTimer += deltaTime;
        if (tubesTimer > tubesIntervalSeconds) {
            // Spawn and add new tube
            let tube = new FloppyBird.Tube();
            tubesCollection.addChild(tube);
            // Reset timer
            tubesTimer = 0;
        }
        // Draw viewport
        viewportRef.draw();
        f.AudioManager.default.update();
    }
})(FloppyBird || (FloppyBird = {}));
var FloppyBird;
(function (FloppyBird) {
    var f = FudgeCore;
    class Tube extends f.Node {
        mesh = new f.MeshObj("TubeMesh", "Assets/tube.obj");
        mat = new f.Material("Tubes", f.ShaderFlat);
        constructor() {
            super("Tube");
            this.addComponent(new f.ComponentMesh(this.mesh));
            this.addComponent(new f.ComponentMaterial(this.mat));
            this.addComponent(new f.ComponentTransform());
        }
    }
    FloppyBird.Tube = Tube;
})(FloppyBird || (FloppyBird = {}));
//# sourceMappingURL=Script.js.map