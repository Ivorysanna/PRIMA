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
    let elapsedGameTime = 0;
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
    let isSpaceKeyAlreadyPressed = false;
    // Tubes stuff
    let tubesCollection;
    let tubesTimer = 0;
    function start(_event) {
        // Get viewport and floppybird reference
        viewportRef = _event.detail;
        FloppyBird.floppyBird = viewportRef.getBranch().getChildrenByName("FloppyBirdBody")[0];
        //Initialize Camera
        let cmpCamera = new f.ComponentCamera();
        cmpCamera.mtxPivot.translateZ(3);
        cmpCamera.mtxPivot.rotateY(180);
        viewportRef.camera = cmpCamera;
        // Get tubes collection
        tubesCollection = viewportRef.getBranch().getChildrenByName("Tubes")[0];
        // Start frame loop
        f.Loop.addEventListener("loopFrame" /* f.EVENT.LOOP_FRAME */, update);
        f.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        f.Physics.simulate();
        const deltaTime = f.Loop.timeFrameGame / 1000;
        elapsedGameTime += deltaTime;
        // Wiggle FloppyBird with sine function
        // floppyBird.mtxLocal.rotateZ(180 * Math.sin(elapsedGameTime * 2));
        // floppyBird.mtxLocal.rotateX(180 * Math.sin(elapsedGameTime * 1.5));
        //Controls
        updateControls();
        // Update tubes
        updateTubes(deltaTime);
        // Draw viewport
        viewportRef.draw();
        f.AudioManager.default.update();
    }
    // Update controls
    function updateControls() {
        rigidbodyFloppyBird = FloppyBird.floppyBird.getComponent(f.ComponentRigidbody);
        if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.SPACE])) {
            if (!isSpaceKeyAlreadyPressed) {
                rigidbodyFloppyBird.applyLinearImpulse(jumpForce);
                isSpaceKeyAlreadyPressed = true;
            }
        }
        else {
            isSpaceKeyAlreadyPressed = false;
        }
    }
    // Update the tubes
    function updateTubes(deltaTime) {
        // Move Tubes to the left
        tubesCollection.getChildren().forEach((eachTubeNode) => {
            eachTubeNode.mtxLocal.translateX(-FloppyBird.Tube.tubeSpeed * deltaTime);
            // Remove tube if it's out of the viewport
            if (eachTubeNode.mtxLocal.translation.x < -3) {
                eachTubeNode.getParent().removeChild(eachTubeNode);
            }
        });
        // Increase timer and spawn new tube
        tubesTimer += deltaTime;
        if (tubesTimer > FloppyBird.Tube.tubesIntervalSeconds) {
            FloppyBird.Tube.createTubes().forEach((eachNewTube) => {
                tubesCollection.addChild(eachNewTube);
            });
            // Reset timer
            tubesTimer = 0;
        }
    }
})(FloppyBird || (FloppyBird = {}));
var FloppyBird;
(function (FloppyBird) {
    var f = FudgeCore;
    class Tube extends f.Node {
        // Constants
        static tubesIntervalSeconds = 2;
        static tubeSpeed = 0.5;
        static tubeYDeviation = 0.7;
        // Mesh and material
        tubeMesh = new f.MeshObj("TubeMesh", "Assets/tube.obj");
        tubeMaterial = new f.Material("Tubes", f.ShaderFlat);
        constructor(isRotatedDownward = false) {
            super("Tube");
            this.addComponent(new f.ComponentMesh(this.tubeMesh));
            this.addComponent(new f.ComponentMaterial(this.tubeMaterial));
            this.addComponent(new f.ComponentTransform());
            // Set pivot point
            this.getComponent(f.ComponentMesh).mtxPivot.translateY(-2.25);
            // Add Collider
            const rigidbody = new f.ComponentRigidbody(0, f.BODY_TYPE.KINEMATIC, f.COLLIDER_TYPE.CYLINDER);
            rigidbody.setScaling(new f.Vector3(0.2, 0.23, 0.1));
            rigidbody.setPosition(new f.Vector3(0, 0.9, 0));
            this.addComponent(rigidbody);
            // TODO add collider component
            if (isRotatedDownward) {
                this.mtxLocal.rotateX(180);
            }
        }
        static createTubes() {
            const tubes = [];
            // Randomize spawn position
            const randomSpawnPosition = Math.random() * 2 * this.tubeYDeviation - this.tubeYDeviation;
            // Spawn and add two new tubes
            const tubeLower = new Tube();
            tubeLower.mtxLocal.translateY(-randomSpawnPosition);
            tubes.push(tubeLower);
            // Randomize gap size
            const randomGapSize = Math.random() * 0.05 + 0.4;
            const tubeUpper = new Tube(true);
            tubeUpper.mtxLocal.translateY(randomSpawnPosition - randomGapSize);
            tubes.push(tubeUpper);
            // Move tubes to their starting position (offscreen)
            tubes.forEach((tube) => {
                tube.mtxLocal.translateX(1.8);
            });
            return tubes;
        }
    }
    FloppyBird.Tube = Tube;
})(FloppyBird || (FloppyBird = {}));
//# sourceMappingURL=Script.js.map