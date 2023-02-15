"use strict";
var FloppyBird;
(function (FloppyBird) {
    var f = FudgeCore;
    // https://refactoring.guru/design-patterns/singleton/typescript/example
    class AudioManager {
        static instance;
        cmpAudio;
        masterVolume = 1;
        audioFileFlap;
        audioFileCollision;
        cmpAudioFileFlap;
        cmpAudioFileCollision;
        /**
         * The Singleton's constructor should always be private to prevent direct
         * construction calls with the `new` operator.
         */
        constructor() { }
        /**
         * The static method that controls the access to the singleton instance.
         *
         * This implementation let you subclass the Singleton class while keeping
         * just one instance of each subclass around.
         */
        static getInstance() {
            if (!AudioManager.instance) {
                AudioManager.instance = new AudioManager();
            }
            return AudioManager.instance;
        }
        initializeAudio() {
            this.audioFileFlap = new f.Audio("Sounds/wing.wav");
            this.audioFileCollision = new f.Audio("Sounds/collision.wav");
            this.cmpAudioFileFlap = new f.ComponentAudio(this.audioFileFlap, false, false);
            this.cmpAudioFileFlap.connect(true);
            this.cmpAudioFileFlap.volume = 1 * this.masterVolume;
            this.cmpAudioFileCollision = new f.ComponentAudio(this.audioFileCollision, false, false);
            this.cmpAudioFileCollision.connect(true);
            this.cmpAudioFileCollision.volume = 1 * this.masterVolume;
        }
        playFlapSound() {
            this.cmpAudioFileFlap.play(true);
        }
        playCollisionSound() {
            this.cmpAudioFileCollision.play(true);
        }
    }
    FloppyBird.AudioManager = AudioManager;
})(FloppyBird || (FloppyBird = {}));
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
    class ContinuousTubeMovement extends f.ComponentScript {
        constructor() {
            super();
            this.addEventListener("componentAdd" /* f.EVENT.COMPONENT_ADD */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* f.EVENT.COMPONENT_ADD */:
                    this.node.addEventListener("renderPrepare" /* f.EVENT.RENDER_PREPARE */, this.update);
                    break;
            }
        };
        update = (_event) => {
            const deltaTime = f.Loop.timeFrameGame / 1000;
            const tubeNode = this.node;
            tubeNode.mtxLocal.translateX(-FloppyBird.Tube.tubeSpeed * deltaTime);
            // Remove tube if it's out of the viewport
            if (tubeNode.mtxLocal.translation.x < -3) {
                tubeNode.getParent().removeChild(tubeNode);
            }
        };
    }
    FloppyBird.ContinuousTubeMovement = ContinuousTubeMovement;
})(FloppyBird || (FloppyBird = {}));
var FloppyBird;
(function (FloppyBird) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(FloppyBird); // Register the namespace to FUDGE for serialization
    class FloppyBirdPlayer extends f.ComponentScript {
        static iSubclass = f.Component.registerSubclass(FloppyBirdPlayer);
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
                    // f.Debug.log(this.message, this.node);
                    this.node.addEventListener("renderPrepare" /* f.EVENT.RENDER_PREPARE */, this.update);
                    break;
                case "componentRemove" /* f.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* f.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* f.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* f.EVENT.NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    this.node.addEventListener("renderPrepare" /* f.EVENT.RENDER_PREPARE */, this.update);
                    break;
            }
        };
        update = (_event) => { };
    }
    FloppyBird.FloppyBirdPlayer = FloppyBirdPlayer;
})(FloppyBird || (FloppyBird = {}));
var FloppyBird;
(function (FloppyBird) {
    var f = FudgeCore;
    f.Debug.info("Main Program Template running!");
    FloppyBird.EASY_MODE = true;
    let elapsedGameTime = 0;
    let backGroundNode = new f.Node("Background");
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
    // Game flow
    FloppyBird.isGameOver = false;
    function start(_event) {
        // Get viewport and floppybird reference
        viewportRef = _event.detail;
        viewportRef.physicsDebugMode = f.PHYSICS_DEBUGMODE.COLLIDERS;
        FloppyBird.floppyBird = viewportRef.getBranch().getChildrenByName("FloppyBirdBody")[0];
        rigidbodyFloppyBird = FloppyBird.floppyBird.getComponent(f.ComponentRigidbody);
        viewportRef.getBranch().appendChild(backGroundNode);
        backGroundNode.appendChild(new FloppyBird.ScrollingBackground(0));
        backGroundNode.appendChild(new FloppyBird.ScrollingBackground(8));
        backGroundNode.appendChild(new FloppyBird.ScrollingBackground(16));
        //Initialize Camera
        let cmpCamera = new f.ComponentCamera();
        cmpCamera.mtxPivot.translateZ(3);
        cmpCamera.mtxPivot.rotateY(180);
        viewportRef.camera = cmpCamera;
        // Initialize Audio
        FloppyBird.AudioManager.getInstance().initializeAudio();
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
        FloppyBird.floppyBird.mtxLocal.rotateZ(180 * Math.sin(elapsedGameTime * 2));
        FloppyBird.floppyBird.mtxLocal.rotateX(180 * Math.sin(elapsedGameTime * 1.5));
        if (!FloppyBird.isGameOver) {
            //Controls
            updateControls();
            // Update tubes
            updateTubes(deltaTime);
            checkFloppyBirdCollision();
            // Move the backgrounds
            moveBackgrounds();
        }
        // Draw viewport
        viewportRef.draw();
        f.AudioManager.default.update();
    }
    // Update controls
    // TODO: Das hier vllt noch in eine FloppyBird.ts auslagern oder so
    function updateControls() {
        if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.SPACE])) {
            if (!isSpaceKeyAlreadyPressed) {
                rigidbodyFloppyBird.applyLinearImpulse(jumpForce);
                FloppyBird.AudioManager.getInstance().playFlapSound();
                isSpaceKeyAlreadyPressed = true;
            }
        }
        else {
            isSpaceKeyAlreadyPressed = false;
        }
    }
    function checkFloppyBirdCollision() {
        rigidbodyFloppyBird.collisions.forEach((eachCollision) => {
            const collidedNode = eachCollision.node;
            if (!collidedNode) {
                return null;
            }
            switch (collidedNode.name) {
                case FloppyBird.Tube.TUBE_COLLIDER_NODE_NAME:
                    console.log("Adding point!");
                    FloppyBird.UIManager.getInstance().incrementScore();
                    collidedNode.removeComponent(collidedNode.getComponent(f.ComponentRigidbody));
                    break;
            }
        });
    }
    // Update the tubes
    function updateTubes(deltaTime) {
        tubesTimer += deltaTime;
        if (tubesTimer > FloppyBird.Tube.tubesIntervalSeconds) {
            console.log("Spawning tube!");
            tubesCollection.addChild(FloppyBird.Tube.createSetOfTubes());
            // Reset the tube spawn timer
            tubesTimer = 0;
        }
    }
    function moveBackgrounds() {
        // TODO: Move the background images
        const backgrounds = backGroundNode.getChildren();
        backgrounds.forEach((eachBackground) => {
            eachBackground.moveBackground(-FloppyBird.ScrollingBackground.backgroundVelocity);
            if (eachBackground.mtxLocal.translation.x <= -8) {
                backGroundNode.removeChild(eachBackground);
                backGroundNode.appendChild(new FloppyBird.ScrollingBackground(16));
            }
        });
    }
})(FloppyBird || (FloppyBird = {}));
var FloppyBird;
(function (FloppyBird) {
    var f = FudgeCore;
    class ScrollingBackground extends f.Node {
        static backgroundVelocity = 0.5;
        constructor(xOffset) {
            super("Background");
            this.addComponent(new f.ComponentTransform());
            this.mtxLocal.translateZ(-2);
            this.mtxLocal.translateY(0);
            this.mtxLocal.translateX(xOffset);
            let backgroundMesh = new f.MeshSprite("BackgroundMesh");
            let backgroundMaterial = new f.Material("BackgroundMaterial", f.ShaderLitTextured, new f.CoatTextured(f.Color.CSS("WHITE"), new f.TextureImage("Assets/background.png")));
            let cmpMesh = new f.ComponentMesh(backgroundMesh);
            this.addComponent(cmpMesh);
            this.addComponent(new f.ComponentMaterial(backgroundMaterial));
            this.getComponent(f.ComponentMesh).mtxPivot.scaleX(8);
            this.getComponent(f.ComponentMesh).mtxPivot.scaleY(3);
        }
        moveBackground(amountToMove) {
            let timeSinceLastFrame = f.Loop.timeFrameReal / 1000;
            this.mtxLocal.translateX(amountToMove * timeSinceLastFrame);
        }
    }
    FloppyBird.ScrollingBackground = ScrollingBackground;
})(FloppyBird || (FloppyBird = {}));
var FloppyBird;
(function (FloppyBird) {
    var f = FudgeCore;
    // import fAid = FudgeAid;
    class Tube extends f.Node {
        // Constants
        static TUBE_COLLIDER_NODE_NAME = "TubeCollider";
        static TUBE_NODE_NAME = "Tube";
        static tubesIntervalSeconds = 2;
        static tubeSpeed = 0.5;
        static tubeYDeviation = 0.7;
        static tubeTexture = new f.TextureImage("Assets/brushed-metal_albedo.jpg");
        // Mesh and material
        tubeMesh = new f.MeshObj("TubeMesh", "Assets/tube.obj");
        // private readonly tubeMaterial = new f.Material("Tube", f.ShaderFlatTextured, new f.CoatTextured(f.Color.CSS("White"), Tube.tubeTexture));
        tubeMaterial = new f.Material("Tubes", f.ShaderFlat);
        // private readonly tube: fAid.Node = new fAid.Node("Tube", f.Matrix4x4.IDENTITY(), this.tubeMaterial, this.tubeMesh);
        constructor(isRotatedDownward = false) {
            super(Tube.TUBE_NODE_NAME);
            this.addComponent(new f.ComponentMesh(this.tubeMesh));
            this.addComponent(new f.ComponentMaterial(this.tubeMaterial));
            this.addComponent(new f.ComponentTransform());
            this.addComponent(new FloppyBird.ContinuousTubeMovement());
            // Set pivot point
            this.getComponent(f.ComponentMesh).mtxPivot.translateY(-2.25);
            // Add Collider
            let rigidbody = new f.ComponentRigidbody(0, f.BODY_TYPE.KINEMATIC, f.COLLIDER_TYPE.CYLINDER, f.COLLISION_GROUP.DEFAULT, new f.Matrix4x4());
            rigidbody.addEventListener("ColliderEnteredCollision" /* f.EVENT_PHYSICS.COLLISION_ENTER */, this.handleTubeCollision);
            // let oldCollider: OIMO.Shape = rigidbody.getShapeList();
            rigidbody.mtxPivot.scale(new f.Vector3(0.22, 2.234, 1));
            rigidbody.mtxPivot.translate(new f.Vector3(0.01, -0.53, 0));
            this.addComponent(rigidbody);
            // TODO add collider component
            if (isRotatedDownward) {
                this.mtxLocal.rotateX(180);
            }
        }
        /**
         * Creates a set of tube inside another node that acts as a container.
         * This container node also contains the trigger collider between the tubes to use for score incrementing.
         */
        static createSetOfTubes() {
            const tubeContainerNode = new f.Node(this.TUBE_COLLIDER_NODE_NAME);
            tubeContainerNode.addComponent(new f.ComponentTransform());
            // Randomize spawn position
            const randomSpawnPosition = Math.random() * 2 * this.tubeYDeviation - this.tubeYDeviation;
            // Spawn and add two new tubes
            const tubeLower = new Tube();
            tubeLower.mtxLocal.translateY(-randomSpawnPosition);
            tubeContainerNode.addChild(tubeLower);
            //Add Collider for point scoring
            const colliderNode = new f.Node("TubeCollider");
            tubeContainerNode.addChild(colliderNode);
            const rigidbodyCollider = new f.ComponentRigidbody(0, f.BODY_TYPE.KINEMATIC, f.COLLIDER_TYPE.CYLINDER, f.COLLISION_GROUP.DEFAULT, new f.Matrix4x4());
            rigidbodyCollider.mtxPivot.scale(new f.Vector3(0.1, 10, 4));
            rigidbodyCollider.isTrigger = true;
            colliderNode.addComponent(new f.ComponentTransform());
            colliderNode.addComponent(rigidbodyCollider);
            // Randomize gap size
            const randomGapSize = Math.random() * 0.05 + (FloppyBird.EASY_MODE ? 1 : 0.4);
            const tubeUpper = new Tube(true);
            tubeUpper.mtxLocal.translateY(randomSpawnPosition - randomGapSize);
            tubeContainerNode.addChild(tubeUpper);
            // Move tubes to their starting position (offscreen)
            tubeContainerNode.mtxLocal.translateX(1.8);
            return tubeContainerNode;
        }
        handleTubeCollision(_event) {
            let collider = _event.cmpRigidbody;
            let colNode = collider.node;
            if (colNode.name == "FloppyBirdBody") {
                FloppyBird.AudioManager.getInstance().playCollisionSound();
                FloppyBird.isGameOver = true;
                alert("GAME OVER");
                // TODO: Better Game Over Screen maybe?
            }
        }
    }
    FloppyBird.Tube = Tube;
})(FloppyBird || (FloppyBird = {}));
var FloppyBird;
(function (FloppyBird) {
    // https://refactoring.guru/design-patterns/singleton/typescript/example
    class UIManager {
        static UI_ID = "UI";
        static SCORE_ID = "score";
        static instance;
        _currentScore = 0;
        constructor() { }
        static getInstance() {
            if (!UIManager.instance) {
                UIManager.instance = new UIManager();
            }
            return UIManager.instance;
        }
        // Set only privately
        set currentScore(score) {
            this._currentScore = score;
            document.getElementById(UIManager.SCORE_ID).innerHTML = score.toString();
        }
        get currentScore() {
            return this._currentScore;
        }
        incrementScore() {
            this.currentScore++;
        }
        resetScore() {
            this.currentScore = 0;
        }
        hideUI() {
            document.getElementById(UIManager.UI_ID).style.display = "none";
        }
        showUI() {
            document.getElementById(UIManager.UI_ID).style.display = "block";
        }
    }
    FloppyBird.UIManager = UIManager;
})(FloppyBird || (FloppyBird = {}));
//# sourceMappingURL=Script.js.map