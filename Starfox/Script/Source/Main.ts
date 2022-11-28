namespace Script {
    import f = FudgeCore;
    // import fAid = FudgeAid;

    f.Debug.info("Main Program Template running!");

    let viewport: f.Viewport;
    let cmpCamera: f.ComponentCamera;

    document.addEventListener("interactiveViewportStarted", <EventListener>start);

    //let rigidbodyShip: f.ComponentRigidbody;

    function start(_event: CustomEvent): void {
        viewport = _event.detail;
        let branch: f.Node = viewport.getBranch();
        branch.getChildrenByName("Rocket")[0].getComponent(f.ComponentRigidbody);

        cmpCamera = viewport.camera;
        branch.getChildrenByName("Rocket")[0].getComponent(f.ComponentCamera);

        f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
        f.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }

    function update(_event: Event): void {
        f.Physics.simulate(); // if physics is included and used
        viewport.draw();
        f.AudioManager.default.update();
    }

    // function control(): void {
    //   console.log("LEER");
    // }
}
