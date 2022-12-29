namespace Script {
    import f = FudgeCore;
    f.Debug.info("Main Program Template running!");

    // Initialize Viewport
    let viewport: f.Viewport;
    export let floppyBird: f.Node;
    export let gravity: f.Vector3 = new f.Vector3(0, -.8, 0);
    let rigidbodyFloppyBird: f.ComponentRigidbody;
    let jumpForce: f.Vector3 = new f.Vector3(0, 1, 0);
    f.Physics.setGravity(gravity);
    document.addEventListener("interactiveViewportStarted", <EventListener>start);

    let isSpaceAlreadyPressed: boolean = false;

    function start(_event: CustomEvent): void {
        viewport = _event.detail;
        floppyBird = viewport.getBranch().getChildrenByName("FloppyBirdBody")[0];

        f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }

    function update(_event: Event): void {
        ƒ.Physics.simulate();
        // let deltaTime: number = f.Loop.timeFrameGame / 1000;
        rigidbodyFloppyBird = floppyBird.getComponent(f.ComponentRigidbody);
        //Controls
        if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.SPACE])) {
            if (!isSpaceAlreadyPressed) {
                rigidbodyFloppyBird.applyLinearImpulse(jumpForce);
                isSpaceAlreadyPressed = true;
            }
        } else {
            isSpaceAlreadyPressed = false;
        }
        viewport.draw();
        f.AudioManager.default.update();
    }
}
