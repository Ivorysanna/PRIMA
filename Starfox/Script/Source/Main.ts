namespace Script {
    import f = FudgeCore;
    f.Debug.info("Main Program Template running!");

    export let viewport: f.Viewport;
    let cmpEngine: EngineScript;
    let vctMouse: f.Vector2 = f.Vector2.ZERO();
    export let cmpTerrain: f.ComponentMesh;
    export let gameState: GameState;

    document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);
    window.addEventListener("mousemove", hndMouse);

    async function start(_event: CustomEvent): Promise <void> {
        //let response : Response = await fetch("config.json");
        //console.log(config.fuel);

        gameState = new GameState();
        viewport = _event.detail;
        viewport.physicsDebugMode = f.PHYSICS_DEBUGMODE.COLLIDERS;
        f.Physics.settings.solverIterations = 300;

        let ship: f.Node = viewport.getBranch().getChildrenByName("Rocket")[0];
        cmpEngine = ship.getComponent(EngineScript);
        let cmpCamera = ship.getComponent(f.ComponentCamera);
        viewport.camera = cmpCamera;

        cmpTerrain = viewport.getBranch().getChildrenByName("Terrain")[0].getComponent(f.ComponentMesh);
        initAnim();

        f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
        f.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }

    function update(_event: Event): void {
        control();
        f.Physics.simulate(); // if physics is included and used
        viewport.draw();
        f.AudioManager.default.update();
    }

    function hndMouse(e: MouseEvent): void {
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
        let time0: number = 0;
        let time1: number = 2000;
        let value0: number = 0;
        let value1: number = 90;
        let fps: number = 30;
        let cube: f.Node = viewport.getBranch().getChildrenByName("Cube")[0];

        let animseq: f.AnimationSequence = new f.AnimationSequence();
        animseq.addKey(new f.AnimationKey(time0, value0));
        animseq.addKey(new f.AnimationKey(time1, value1));

        let animStructure: f.AnimationStructure = {
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

        let animation: f.Animation = new f.Animation("testAnimation", animStructure, fps);
        animation.setEvent("event", 300);

        let cmpAnimator: ƒ.ComponentAnimator = new ƒ.ComponentAnimator(animation, ƒ.ANIMATION_PLAYMODE.LOOP, ƒ.ANIMATION_PLAYBACK.TIMEBASED_CONTINOUS);
        cmpAnimator.scale = 1;
        cmpAnimator.addEventListener("event", (_event: Event) => {
            // let time: number = (<ƒ.ComponentAnimator>_event.target).time;
            // console.log(`Event fired at ${time}`, _event);
            console.log("Event reached");
        });

        cube.addComponent(cmpAnimator);
        cmpAnimator.activate(true);
    }
}
