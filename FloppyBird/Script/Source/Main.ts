namespace FloppyBird {
    import f = FudgeCore;
    f.Debug.info("Main Program Template running!");

    let elapsedGameTime: number = 0;
    let backGroundNode: f.Node = new f.Node("Background");

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

    // Game flow
    let isGameOver: boolean = false;

    function start(_event: CustomEvent): void {
        // Get viewport and floppybird reference
        viewportRef = _event.detail;
        viewportRef.physicsDebugMode = f.PHYSICS_DEBUGMODE.COLLIDERS;
        floppyBird = viewportRef.getBranch().getChildrenByName("FloppyBirdBody")[0];
        rigidbodyFloppyBird = floppyBird.getComponent(f.ComponentRigidbody);

        viewportRef.getBranch().appendChild(backGroundNode);

        backGroundNode.appendChild(new ScrollingBackground(0));
        backGroundNode.appendChild(new ScrollingBackground(11));
        backGroundNode.appendChild(new ScrollingBackground(22));

        //Initialize Camera
        let cmpCamera: f.ComponentCamera = new f.ComponentCamera();
        cmpCamera.mtxPivot.translateZ(3);
        cmpCamera.mtxPivot.rotateY(180);
        viewportRef.camera = cmpCamera;

        // Initialize Audio
        AudioManager.getInstance().initializeAudio();

        // Get tubes collection
        tubesCollection = viewportRef.getBranch().getChildrenByName("Tubes")[0];

        // Start frame loop
        f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
        f.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }

    function update(_event: Event): void {
        f.Physics.simulate();
        const deltaTime: number = f.Loop.timeFrameGame / 1000;
        elapsedGameTime += deltaTime;

        // Wiggle FloppyBird with sine function
        floppyBird.mtxLocal.rotateZ(180 * Math.sin(elapsedGameTime * 2));
        floppyBird.mtxLocal.rotateX(180 * Math.sin(elapsedGameTime * 1.5));

        if (!isGameOver) {
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
    function updateControls(): void {
        if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.SPACE])) {
            if (!isSpaceKeyAlreadyPressed) {
                rigidbodyFloppyBird.applyLinearImpulse(jumpForce);
                AudioManager.getInstance().playFlapSound();
                isSpaceKeyAlreadyPressed = true;
            }
        } else {
            isSpaceKeyAlreadyPressed = false;
        }
    }

    function checkFloppyBirdCollision(): void {
        rigidbodyFloppyBird.collisions.forEach((eachCollision) => {
            if (eachCollision.node.name == "Tube") {
                console.log(eachCollision);
                AudioManager.getInstance().playCollisionSound();
                isGameOver = true;
                alert("GAME OVER");
                // TODO: Better Game Over Screen maybe?
            }
        });
    }

    // Update the tubes
    function updateTubes(deltaTime: number): void {
        // Move Tubes to the left
        tubesCollection.getChildren().forEach((eachTubeNode) => {
            eachTubeNode.mtxLocal.translateX(-Tube.tubeSpeed * deltaTime);

            // Remove tube if it's out of the viewport
            if (eachTubeNode.mtxLocal.translation.x < -3) {
                eachTubeNode.getParent().removeChild(eachTubeNode);
            }
        });

        tubesTimer += deltaTime;
        if (tubesTimer > Tube.tubesIntervalSeconds) {
            Tube.createSetOfTubes().forEach((eachNewTube) => {
                tubesCollection.addChild(eachNewTube);
            });

            // Reset the tube spawn timer
            tubesTimer = 0;
        }
    }

    function moveBackgrounds() {
        // TODO: Move the background images
        const backgrounds: ScrollingBackground[] = <ScrollingBackground[]>backGroundNode.getChildren();
        backgrounds.forEach((eachBackground) => {
            eachBackground.moveBackground(-ScrollingBackground.backgroundVelocity);

            if (eachBackground.mtxLocal.translation.x <= -22) {
                backGroundNode.removeChild(eachBackground);
                backGroundNode.appendChild(new ScrollingBackground(22));
            }
        });
    }
}
