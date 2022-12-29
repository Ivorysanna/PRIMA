namespace Script {
    import f = FudgeCore;
    f.Debug.info("Main Program Template running!");

    // Initialize Viewport
    let viewport: f.Viewport;
    export let floppyBird: f.Node;
    export let gravity: f.Vector3 = new f.Vector3(0, -1, 0);
    f.Physics.setGravity(gravity);
    document.addEventListener("interactiveViewportStarted", <EventListener>start);

    function start(_event: CustomEvent): void {
        viewport = _event.detail;
        floppyBird = viewport.getBranch().getChildrenByName("FloppyBirdBody")[0];

        f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }

    function update(_event: Event): void {
        ƒ.Physics.simulate(); // if physics is included and used
        // let deltaTime: number = f.Loop.timeFrameGame / 1000;
        //let rigidBodyComponent: f.ComponentRigidbody = floppyBird.getComponent(f.ComponentRigidbody);

        viewport.draw();
        f.AudioManager.default.update();
    }
}
