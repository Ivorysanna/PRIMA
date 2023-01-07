namespace FloppyBird {
    import f = FudgeCore;
    f.Debug.info("Main Program Template running!");

    // Global components
    let viewportRef: f.Viewport;
    export let floppyBird: f.Node;
    let rigidbodyFloppyBird: f.ComponentRigidbody;

    // Physics Settings
    export let gravity: f.Vector3 = new f.Vector3(0, -0.8, 0);
    let jumpForce: f.Vector3 = new f.Vector3(0, 1, 0);
    f.Physics.setGravity(gravity);

    // Add EventListener
    document.addEventListener("interactiveViewportStarted", <EventListener>start);

    // Controls
    let isSpaceAlreadyPressed: boolean = false;

    // Tubes stuff
    let tubesCollection: f.Node;
    let tubesTimer: number = 0;
    const tubesIntervalSeconds: number = 1;
    const tubeSpeed = 1;

    function start(_event: CustomEvent): void {
        // Get viewport and floppybird reference
        viewportRef = _event.detail;
        floppyBird = viewportRef.getBranch().getChildrenByName("FloppyBirdBody")[0];

        // Get tubes collection
        tubesCollection = viewportRef.getBranch().getChildrenByName("Tubes")[0];

        // Start frame loop
        f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
        f.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }

    function update(_event: Event): void {
        f.Physics.simulate();
        const deltaTime: number = f.Loop.timeFrameGame / 1000;

        //Controls
        rigidbodyFloppyBird = floppyBird.getComponent(f.ComponentRigidbody);
        if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.SPACE])) {
            if (!isSpaceAlreadyPressed) {
                rigidbodyFloppyBird.applyLinearImpulse(jumpForce);
                isSpaceAlreadyPressed = true;
            }
        } else {
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
            let tube: f.Node = new Tube();
            tubesCollection.addChild(tube);

            // Reset timer
            tubesTimer = 0;
        }

        // Draw viewport
        viewportRef.draw();
        f.AudioManager.default.update();
    }
}
