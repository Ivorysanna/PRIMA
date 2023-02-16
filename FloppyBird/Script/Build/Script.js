"use strict";
var FloppyBird;
(function (FloppyBird) {
    var f = FudgeCore;
    class ContinuousTubeMovement extends f.ComponentScript {
        constructor() {
            super();
            this.addEventListener("componentAdd" /* f.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* f.EVENT.COMPONENT_REMOVE */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* f.EVENT.COMPONENT_ADD */:
                    this.node.addEventListener("renderPrepare" /* f.EVENT.RENDER_PREPARE */, this.update);
                    break;
                case "componentRemove" /* f.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* f.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* f.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    this.node.removeEventListener("renderPrepare" /* f.EVENT.RENDER_PREPARE */, this.update);
                    break;
            }
        };
        update = (_event) => {
            if (!FloppyBird.GameStateManager.getInstance().isGameOver) {
                const deltaTime = f.Loop.timeFrameGame / 1000;
                const tubeContainerNode = this.node;
                tubeContainerNode.mtxLocal.translateX(-FloppyBird.tubeSpeedVui.tubeSpeed * deltaTime);
                // Remove tube if it's out of the viewport
                if (tubeContainerNode.mtxLocal.translation.x < -3) {
                    console.log("Tubes removed");
                    FloppyBird.tubesCollection.removeChild(tubeContainerNode);
                }
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
        isSpaceKeyAlreadyPressed = false;
        rigidbody;
        jumpForce = new f.Vector3(0, 1, 0);
        constructor() {
            super();
            // Don't start when running in editor
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            this.addEventListener("componentAdd" /* f.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* f.EVENT.COMPONENT_REMOVE */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* f.EVENT.COMPONENT_ADD */:
                    this.addHnd();
                    break;
                case "componentRemove" /* f.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* f.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* f.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    this.node.removeEventListener("renderPrepare" /* f.EVENT.RENDER_PREPARE */, this.update);
                    this.rigidbody.removeEventListener("ColliderEnteredCollision" /* f.EVENT_PHYSICS.COLLISION_ENTER */, this.collisionHandler);
                    break;
            }
        };
        addHnd() {
            this.node.addEventListener("renderPrepare" /* f.EVENT.RENDER_PREPARE */, this.update);
            this.rigidbody = this.node.getComponent(f.ComponentRigidbody);
            this.rigidbody.addEventListener("ColliderEnteredCollision" /* f.EVENT_PHYSICS.COLLISION_ENTER */, this.collisionHandler);
        }
        collisionHandler(_event) {
            const otherCollider = _event.cmpRigidbody;
            const collidedNode = otherCollider.node;
            if (!collidedNode) {
                return null;
            }
            switch (collidedNode.name) {
                case FloppyBird.Tube.TUBE_COLLIDER_NODE_NAME:
                    console.log("Adding point!");
                    FloppyBird.UIManager.getInstance().incrementScore();
                    collidedNode.removeComponent(collidedNode.getComponent(f.ComponentRigidbody));
                    break;
                case "BorderBottom":
                case FloppyBird.Tube.TUBE_NODE_NAME:
                    FloppyBird.PlaySoundManager.getInstance().playCollisionSound();
                    FloppyBird.GameStateManager.getInstance().isGameOver = true;
                    const currentScore = FloppyBird.UIManager.getInstance().currentScore;
                    alert(`GAME OVER ${currentScore} Tubes passed`);
                    // TODO: Better Game Over Screen maybe?
                    break;
                default:
                    break;
            }
        }
        update = (_event) => {
            if (!FloppyBird.GameStateManager.getInstance().isGameOver) {
                //Controls
                this.updateControls();
            }
        };
        // Controls
        updateControls() {
            if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.SPACE])) {
                if (!this.isSpaceKeyAlreadyPressed) {
                    this.rigidbody.applyLinearImpulse(this.jumpForce);
                    FloppyBird.PlaySoundManager.getInstance().playFlapSound();
                    this.isSpaceKeyAlreadyPressed = true;
                }
            }
            else {
                this.isSpaceKeyAlreadyPressed = false;
            }
        }
    }
    FloppyBird.FloppyBirdPlayer = FloppyBirdPlayer;
})(FloppyBird || (FloppyBird = {}));
var FloppyBird;
(function (FloppyBird) {
    // https://refactoring.guru/design-patterns/singleton/typescript/example
    class GameStateManager {
        static instance;
        _isGameOver = false;
        EASY_MODE = true;
        constructor() {
        }
        static getInstance() {
            if (!GameStateManager.instance) {
                GameStateManager.instance = new GameStateManager();
            }
            return GameStateManager.instance;
        }
        set isGameOver(value) {
            this._isGameOver = value;
        }
        get isGameOver() {
            return this._isGameOver;
        }
        get isEasyMode() {
            return this.EASY_MODE;
        }
    }
    FloppyBird.GameStateManager = GameStateManager;
})(FloppyBird || (FloppyBird = {}));
var FloppyBird;
(function (FloppyBird) {
    var f = FudgeCore;
    f.Debug.info("Main Program FloppyBird running!");
    let backgroundNode = new f.Node("Background");
    // Global components
    let viewportRef;
    // Physics Settings
    FloppyBird.gravity = new f.Vector3(0, -0.8, 0);
    f.Physics.setGravity(FloppyBird.gravity);
    // Add EventListener
    document.addEventListener("interactiveViewportStarted", start);
    let tubesTimer = 0;
    async function start(_event) {
        FloppyBird.tubeSpeedVui = new FloppyBird.TubeSpeedUIHandler();
        // Load external json data tube config values
        console.debug("Loading tube config file...");
        let tubeConfigFileJsonResponse = await fetch("tubeConfig.json");
        let tubeConfig = await tubeConfigFileJsonResponse.json();
        FloppyBird.Tube.tubesIntervalSeconds = tubeConfig.tubesIntervalSeconds;
        FloppyBird.tubeSpeedVui.tubeSpeed = tubeConfig.tubeSpeed;
        console.debug("Tube config file loaded!");
        // Get viewport and floppybird reference
        viewportRef = _event.detail;
        //TODO: Remove Debug Collider when done
        viewportRef.physicsDebugMode = f.PHYSICS_DEBUGMODE.COLLIDERS;
        viewportRef.getBranch().appendChild(backgroundNode);
        backgroundNode.appendChild(new FloppyBird.ScrollingBackground(0));
        backgroundNode.appendChild(new FloppyBird.ScrollingBackground(8));
        backgroundNode.appendChild(new FloppyBird.ScrollingBackground(16));
        //Initialize Camera
        let cmpCamera = new f.ComponentCamera();
        cmpCamera.mtxPivot.translateZ(3);
        cmpCamera.mtxPivot.rotateY(180);
        viewportRef.camera = cmpCamera;
        // Initialize Audio
        FloppyBird.PlaySoundManager.getInstance().initializeAudio();
        // Get tubes collection
        FloppyBird.tubesCollection = viewportRef.getBranch().getChildrenByName("Tubes")[0];
        // Start frame loop
        f.Loop.addEventListener("loopFrame" /* f.EVENT.LOOP_FRAME */, update);
        f.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        f.Physics.simulate();
        if (!FloppyBird.GameStateManager.getInstance().isGameOver) {
            // Update tubes
            spawnTubes();
            // Move the backgrounds
            moveBackgrounds();
        }
        // Draw viewport
        viewportRef.draw();
        f.AudioManager.default.update();
    }
    // Update the tubes
    function spawnTubes() {
        const deltaTime = f.Loop.timeFrameGame / 1000;
        tubesTimer += deltaTime;
        if (tubesTimer > FloppyBird.Tube.tubesIntervalSeconds) {
            console.log("Spawning tube!");
            FloppyBird.tubesCollection.addChild(FloppyBird.Tube.createSetOfTubes());
            // Reset the tube spawn timer
            tubesTimer = 0;
        }
    }
    function moveBackgrounds() {
        // TODO das hier als custom component auf die backgrounds selbst
        // TODO: Move the background images
        const backgrounds = backgroundNode.getChildren();
        backgrounds.forEach((eachBackground) => {
            eachBackground.moveBackground(-FloppyBird.ScrollingBackground.backgroundVelocity);
            if (eachBackground.mtxLocal.translation.x <= -8) {
                backgroundNode.removeChild(eachBackground);
                backgroundNode.appendChild(new FloppyBird.ScrollingBackground(16));
            }
        });
    }
})(FloppyBird || (FloppyBird = {}));
var FloppyBird;
(function (FloppyBird) {
    var f = FudgeCore;
    // https://refactoring.guru/design-patterns/singleton/typescript/example
    class PlaySoundManager {
        static instance;
        cmpAudio;
        masterVolume = 1;
        audioFileFlap;
        audioFileCollision;
        // private audioFilePoint: f.Audio;
        cmpAudioFileFlap;
        cmpAudioFileCollision;
        // private cmpAudioFilePoint: f.ComponentAudio;
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
            if (!PlaySoundManager.instance) {
                PlaySoundManager.instance = new PlaySoundManager();
            }
            return PlaySoundManager.instance;
        }
        initializeAudio() {
            this.audioFileFlap = new f.Audio("Sounds/wing.wav");
            this.audioFileCollision = new f.Audio("Sounds/collision.wav");
            // this.audioFilePoint = new f.Audio("Sounds/point.wav");
            this.cmpAudioFileFlap = new f.ComponentAudio(this.audioFileFlap, false, false);
            this.cmpAudioFileFlap.connect(true);
            this.cmpAudioFileFlap.volume = 1 * this.masterVolume;
            this.cmpAudioFileCollision = new f.ComponentAudio(this.audioFileCollision, false, false);
            this.cmpAudioFileCollision.connect(true);
            this.cmpAudioFileCollision.volume = 1 * this.masterVolume;
            // this.cmpAudioFilePoint = new f.ComponentAudio(this.audioFilePoint, false, false);
            // this.cmpAudioFilePoint.connect(true);
            // this.cmpAudioFilePoint.volume = 1 * this.masterVolume;
        }
        playFlapSound() {
            this.cmpAudioFileFlap.play(true);
        }
        playCollisionSound() {
            this.cmpAudioFileCollision.play(true);
        }
    }
    FloppyBird.PlaySoundManager = PlaySoundManager;
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
        static tubeYDeviation = 0.7;
        static tubeTexture = new f.TextureImage("Assets/brushed-metal_albedo.jpg");
        // Mesh and material
        tubeMesh = new f.MeshObj("TubeMesh", "Assets/tube.obj");
        // Settings colors for the tubes with flat shading and textures didn't work
        // private readonly tubeMaterial = new f.Material("Tube", f.ShaderFlat, new f.CoatColored(new f.Color(0.9, 0.9, 0.9, 1)));
        tubeMaterial = new f.Material("Tubes", f.ShaderFlat);
        // private readonly tube: fAid.Node = new fAid.Node("Tube", f.Matrix4x4.IDENTITY(), this.tubeMaterial, this.tubeMesh);
        constructor(isRotatedDownward = false) {
            super(Tube.TUBE_NODE_NAME);
            this.addComponent(new f.ComponentMesh(this.tubeMesh));
            this.addComponent(new f.ComponentMaterial(this.tubeMaterial));
            this.addComponent(new f.ComponentTransform());
            // Set pivot point
            this.getComponent(f.ComponentMesh).mtxPivot.translateY(-2.25);
            // Add Collider
            let rigidbody = new f.ComponentRigidbody(0, f.BODY_TYPE.KINEMATIC, f.COLLIDER_TYPE.CYLINDER, f.COLLISION_GROUP.DEFAULT, new f.Matrix4x4());
            rigidbody.mtxPivot.scale(new f.Vector3(0.22, 2.234, 1));
            rigidbody.mtxPivot.translate(new f.Vector3(0.01, -0.53, 0));
            this.addComponent(rigidbody);
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
            tubeContainerNode.addComponent(new FloppyBird.ContinuousTubeMovement());
            // Randomize spawn position
            const randomSpawnPosition = Math.random() * 2 * this.tubeYDeviation - this.tubeYDeviation;
            const tubeLower = new Tube();
            tubeLower.mtxLocal.translateY(-randomSpawnPosition);
            tubeContainerNode.addChild(tubeLower);
            // Randomize gap size
            const constantGapSize = FloppyBird.GameStateManager.getInstance().isEasyMode ? 0.8 : 0.4;
            const randomGapSize = Math.random() * 0.05 + constantGapSize;
            const tubeUpper = new Tube(true);
            tubeUpper.mtxLocal.translateY(randomSpawnPosition - randomGapSize);
            tubeContainerNode.addChild(tubeUpper);
            //Add Collider for point scoring
            const colliderNode = new f.Node("TubeCollider");
            tubeContainerNode.addChild(colliderNode);
            const rigidbodyCollider = new f.ComponentRigidbody(0, f.BODY_TYPE.KINEMATIC, f.COLLIDER_TYPE.CYLINDER, f.COLLISION_GROUP.DEFAULT, new f.Matrix4x4());
            rigidbodyCollider.mtxPivot.scale(new f.Vector3(0.1, 10, 4));
            // Triggers don't influence anything, but they still trigger collision events
            rigidbodyCollider.isTrigger = true;
            colliderNode.addComponent(new f.ComponentTransform());
            colliderNode.addComponent(rigidbodyCollider);
            // Move tubes to their starting position (offscreen)
            tubeContainerNode.mtxLocal.translateX(1.8);
            return tubeContainerNode;
        }
    }
    FloppyBird.Tube = Tube;
})(FloppyBird || (FloppyBird = {}));
var FloppyBird;
(function (FloppyBird) {
    var fui = FudgeUserInterface;
    var f = FudgeCore;
    class TubeSpeedUIHandler extends f.Mutable {
        tubeSpeed = 0.5;
        constructor() {
            super();
            let tubeSpeedVui = document.querySelector("div#tubeSpeed");
            console.log(new fui.Controller(this, tubeSpeedVui));
        }
        reduceMutator(_mutator) {
            /* */
        }
    }
    FloppyBird.TubeSpeedUIHandler = TubeSpeedUIHandler;
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