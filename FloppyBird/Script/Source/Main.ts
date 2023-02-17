namespace FloppyBird {
    import f = FudgeCore;
    f.Debug.info("Main Program FloppyBird running!");

    let backgroundNode: f.Node = new f.Node("Background");

    // Global components
    let viewportRef: f.Viewport;

    // Physics Settings
    export let gravity: f.Vector3 = new f.Vector3(0, -0.8, 0);
    f.Physics.setGravity(gravity);

    // Add EventListener
    document.addEventListener("interactiveViewportStarted", <EventListener>(<unknown>start));

    // Tubes stuff
    export let tubesCollection: f.Node;
    let tubesTimer: number = 0;

    export let tubeSpeedVui: TubeSpeedUIHandler;

    async function start(_event: CustomEvent): Promise<void> {
        tubeSpeedVui = new TubeSpeedUIHandler();

        // Load external json data tube config values
        console.debug("Loading tube config file...");
        let tubeConfigFileJsonResponse: Response = await fetch("tubeConfig.json");
        let tubeConfig = await tubeConfigFileJsonResponse.json();
        Tube.tubesIntervalSeconds = tubeConfig.tubesIntervalSeconds;
        tubeSpeedVui.tubeSpeed = tubeConfig.tubeSpeed;
        console.debug("Tube config file loaded!");

        // Get viewport and floppybird reference
        viewportRef = _event.detail;
        // viewportRef.physicsDebugMode = f.PHYSICS_DEBUGMODE.COLLIDERS;

        viewportRef.getBranch().appendChild(backgroundNode);

        backgroundNode.appendChild(new ScrollingBackground(0));
        backgroundNode.appendChild(new ScrollingBackground(8));
        backgroundNode.appendChild(new ScrollingBackground(16));

        //Initialize Camera
        let cmpCamera: f.ComponentCamera = new f.ComponentCamera();
        cmpCamera.mtxPivot.translateZ(3);
        cmpCamera.mtxPivot.rotateY(180);
        viewportRef.camera = cmpCamera;

        // Initialize Audio
        PlaySoundManager.getInstance().initializeAudio();

        // Set tubes collection reference
        tubesCollection = viewportRef.getBranch().getChildrenByName("Tubes")[0];

        // Start frame loop
        f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
        f.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }

    function update(_event: Event): void {
        if (!GameStateManager.getInstance().isGameOver) {
            // Update tubes
            spawnTubes();

            // Move the backgrounds
            moveBackgrounds();

            // Draw viewport
            viewportRef.draw();
            f.AudioManager.default.update();

            f.Physics.simulate();
        }
    }

    // Update the tubes
    function spawnTubes(): void {
        const deltaTime: number = f.Loop.timeFrameGame / 1000;
        tubesTimer += deltaTime;
        if (tubesTimer > Tube.tubesIntervalSeconds) {
            console.log("Spawning tube!");
            tubesCollection.addChild(Tube.createSetOfTubes());

            // Reset the tube spawn timer
            tubesTimer = 0;
        }
    }

    function moveBackgrounds() {
        const backgrounds: ScrollingBackground[] = <ScrollingBackground[]>backgroundNode.getChildren();
        backgrounds.forEach((eachBackground) => {
            eachBackground.moveBackground(-ScrollingBackground.backgroundVelocity);

            if (eachBackground.mtxLocal.translation.x <= -8) {
                backgroundNode.removeChild(eachBackground);
                backgroundNode.appendChild(new ScrollingBackground(16));
            }
        });
    }

    export function resetTubes() {
        tubesTimer = 0;
        tubesCollection.getChildren().forEach((eachTubeContainer) => {
            tubesCollection.removeChild(eachTubeContainer);
        });
    }
}
