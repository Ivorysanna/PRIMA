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
    let isSpaceKeyAlreadyPressed: boolean = false;

    // Tubes stuff
    let tubesCollection: f.Node;
    let tubesTimer: number = 0;

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
            if (!isSpaceKeyAlreadyPressed) {
                rigidbodyFloppyBird.applyLinearImpulse(jumpForce);
                isSpaceKeyAlreadyPressed = true;
            }
        } else {
            isSpaceKeyAlreadyPressed = false;
        }

        // Move Tubes to the left
        tubesCollection.getChildren().forEach((eachTubeNode) => {
            eachTubeNode.mtxLocal.translateX(-Tube.tubeSpeed * deltaTime);

            // Remove tube if it's out of the viewport
            if (eachTubeNode.mtxLocal.translation.x < -10) {
                eachTubeNode.getParent().removeChild(eachTubeNode);
            }
        });

        // Increase timer and spawn new tube
        tubesTimer += deltaTime;
        if (tubesTimer > Tube.tubesIntervalSeconds) {
            Tube.createTubes().forEach((eachNewTube) => {
                tubesCollection.addChild(eachNewTube);
            });

            // Reset timer
            tubesTimer = 0;
        }

        // Draw viewport
        viewportRef.draw();
        f.AudioManager.default.update();
    }
}
