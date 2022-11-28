namespace Script {
    import f = FudgeCore;
    // import fAid = FudgeAid;

    f.Debug.info("Main Program Template running!");

    let viewport: f.Viewport;
    let cmpEngine: EngineScript;

    document.addEventListener("interactiveViewportStarted", <EventListener>start);

    //let rigidbodyShip: f.ComponentRigidbody;

    function start(_event: CustomEvent): void {
        viewport = _event.detail;
        viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;
        ƒ.Physics.settings.solverIterations = 300;
        let ship: ƒ.Node = viewport.getBranch().getChildrenByName("Rocket")[0];
        cmpEngine = ship.getComponent(EngineScript);
        let cmpCamera = ship.getComponent(ƒ.ComponentCamera);
        viewport.camera = cmpCamera;

        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
        ƒ.Loop.start();
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
