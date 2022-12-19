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
    var f = FudgeCore;
    f.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class EngineScript extends f.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = f.Component.registerSubclass(EngineScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        rigidbody;
        power = 15000;
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
                    // ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* f.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* f.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* f.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* f.EVENT.NODE_DESERIALIZED */:
                    this.rigidbody = this.node.getComponent(f.ComponentRigidbody);
                    this.rigidbody.addEventListener("ColliderEnteredCollision" /* f.EVENT_PHYSICS.COLLISION_ENTER */, this.hndCollision);
                    this.node.addEventListener("renderPrepare" /* f.EVENT.RENDER_PREPARE */, this.update);
                    //this.node.addEventListener("SensorHit", this.hndCollision);
                    this.node.addEventListener("renderPrepare" /* f.EVENT.RENDER_PREPARE */, this.update);
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
        update = (_event) => {
            if (!Script.gameState) {
                return;
            }
            Script.gameState.height = this.node.mtxWorld.translation.y;
            //gameState.velocity = (this.rigidbody.getVelocity().magnitude.toFixed(3));
            // if (!cmpTerrain)
            //   return;
            // let mesh: f.MeshTerrain = (<f.MeshTerrain>cmpTerrain.mesh);
            // let info: f.TerrainInfo = mesh.getTerrainInfo(this.node.mtxLocal.translation, cmpTerrain.mtxWorld);
            //console.log(info.distance);
        };
        hndCollision = (_event) => {
            console.log("Bumm");
        };
        yaw(_value) {
            this.rigidbody.applyTorque(new f.Vector3(0, _value * -10, 0));
        }
        pitch(_value) {
            this.rigidbody.applyTorque(f.Vector3.SCALE(this.node.mtxWorld.getX(), _value * 7.5));
        }
        roll(_value) {
            this.rigidbody.applyTorque(f.Vector3.SCALE(this.node.mtxWorld.getZ(), _value));
        }
        backwards() {
            this.rigidbody.applyForce(f.Vector3.SCALE(this.node.mtxWorld.getZ(), -this.power));
        }
        thrust() {
            this.rigidbody.applyForce(f.Vector3.SCALE(this.node.mtxWorld.getZ(), this.power));
        }
    }
    Script.EngineScript = EngineScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var f = FudgeCore;
    var fui = FudgeUserInterface;
    class GameState extends f.Mutable {
        reduceMutator(_mutator) {
            /**/
        }
        height;
        velocity;
        fuel = 20;
        controller;
        constructor() {
            super();
            this.controller = new fui.Controller(this, document.querySelector("#vui"));
            console.log(this.controller);
        }
    }
    Script.GameState = GameState;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var f = FudgeCore;
    f.Debug.info("Main Program Template running!");
    let cmpEngine;
    let vctMouse = f.Vector2.ZERO();
    document.addEventListener("interactiveViewportStarted", start);
    window.addEventListener("mousemove", hndMouse);
    async function start(_event) {
        //let response : Response = await fetch("config.json");
        //console.log(config.fuel);
        Script.gameState = new Script.GameState();
        Script.viewport = _event.detail;
        Script.viewport.physicsDebugMode = f.PHYSICS_DEBUGMODE.COLLIDERS;
        f.Physics.settings.solverIterations = 300;
        let ship = Script.viewport.getBranch().getChildrenByName("Rocket")[0];
        cmpEngine = ship.getComponent(Script.EngineScript);
        let cmpCamera = ship.getComponent(f.ComponentCamera);
        Script.viewport.camera = cmpCamera;
        Script.cmpTerrain = Script.viewport.getBranch().getChildrenByName("Terrain")[0].getComponent(f.ComponentMesh);
        initAnim();
        f.Loop.addEventListener("loopFrame" /* f.EVENT.LOOP_FRAME */, update);
        f.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        control();
        f.Physics.simulate(); // if physics is included and used
        Script.viewport.draw();
        f.AudioManager.default.update();
    }
    function hndMouse(e) {
        vctMouse.x = 2 * (e.clientX / window.innerWidth) - 1;
        vctMouse.y = 2 * (e.clientY / window.innerHeight) - 1;
    }
    function control() {
        if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.W])) {
            cmpEngine.thrust();
        }
        if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.S])) {
            cmpEngine.backwards();
        }
        if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.A])) {
            cmpEngine.roll(-5);
        }
        if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.D])) {
            cmpEngine.roll(5);
        }
        cmpEngine.pitch(vctMouse.y);
        cmpEngine.yaw(vctMouse.x);
    }
    function initAnim() {
        let time0 = 0;
        let time1 = 2000;
        let value0 = 0;
        let value1 = 90;
        let fps = 30;
        let cube = Script.viewport.getBranch().getChildrenByName("Cube")[0];
        let animseq = new f.AnimationSequence();
        animseq.addKey(new f.AnimationKey(time0, value0));
        animseq.addKey(new f.AnimationKey(time1, value1));
        let animStructure = {
            components: {
                ComponentTransform: [
                    {
                        "ƒ.ComponentTransform": {
                            mtxLocal: {
                                translation: {
                                    x: animseq,
                                    //y: animseq
                                },
                            },
                        },
                    },
                ],
            },
        };
        let animation = new f.Animation("testAnimation", animStructure, fps);
        animation.setEvent("event", 300);
        let cmpAnimator = new ƒ.ComponentAnimator(animation, ƒ.ANIMATION_PLAYMODE.LOOP, ƒ.ANIMATION_PLAYBACK.TIMEBASED_CONTINOUS);
        cmpAnimator.scale = 1;
        cmpAnimator.addEventListener("event", (_event) => {
            // let time: number = (<ƒ.ComponentAnimator>_event.target).time;
            // console.log(`Event fired at ${time}`, _event);
            console.log("Event reached");
        });
        cube.addComponent(cmpAnimator);
        cmpAnimator.activate(true);
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class Sensor extends f.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = f.Component.registerSubclass(Sensor);
        // Properties may be mutated by users in the editor via the automatically created user interface
        //private rigidbody: f.ComponentRigidbody;
        power = 15000;
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
                    // ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* f.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* f.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* f.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* f.EVENT.NODE_DESERIALIZED */:
                    //this.rigidbody = this.node.getComponent(f.ComponentRigidbody);
                    //this.rigidbody.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, this.hndCollision);
                    this.node.addEventListener("renderPrepare" /* f.EVENT.RENDER_PREPARE */, this.update);
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
        update = (_event) => {
            if (!Script.cmpTerrain)
                return;
            let mesh = Script.cmpTerrain.mesh;
            let parent = this.node.getParent();
            let info = mesh.getTerrainInfo(parent.mtxWorld.translation, Script.cmpTerrain.mtxWorld);
            //console.log(info.distance);
            if (info.distance < 0) {
                this.node.dispatchEvent(new Event("SensorHit", { bubbles: true }));
            }
        };
    }
    Script.Sensor = Sensor;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var f = FudgeCore;
    var fAid = FudgeAid;
    f.Project.registerScriptNamespace(Script);
    let JOB;
    (function (JOB) {
        JOB[JOB["IDLE"] = 0] = "IDLE";
        JOB[JOB["ATTACK"] = 1] = "ATTACK";
    })(JOB || (JOB = {}));
    class StateMachine extends fAid.ComponentStateMachine {
        static iSubclass = f.Component.registerSubclass(StateMachine);
        static instructions = StateMachine.get();
        rotationIdle = 3;
        cmpBody;
        // private cmpMaterial: f.ComponentMaterial;
        constructor() {
            super();
            this.instructions = StateMachine.instructions; // setup instructions with the static set
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        static get() {
            let setup = new fAid.StateMachineInstructions();
            setup.setAction(JOB.IDLE, this.actIdle);
            return setup;
        }
        static async actIdle(_machine) {
            console.log("Acting IDLE");
            _machine.cmpBody.applyTorque(f.Vector3.Y(_machine.rotationIdle));
        }
        hndEvent = (_event) => {
            console.log("Implement");
        };
    }
    Script.StateMachine = StateMachine;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map