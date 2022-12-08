namespace Script {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!");

  let viewport: f.Viewport;
  let cmpEngine: EngineScript;
  let vctMouse: f.Vector2 = f.Vector2.ZERO();
  export let cmpTerrain: f.ComponentMesh;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  window.addEventListener("mousemove", hndMouse);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    viewport.physicsDebugMode = f.PHYSICS_DEBUGMODE.COLLIDERS;
    f.Physics.settings.solverIterations = 300;
    
    let ship: f.Node = viewport.getBranch().getChildrenByName("Rocket")[0];
    cmpEngine = ship.getComponent(EngineScript);
    let cmpCamera = ship.getComponent(f.ComponentCamera);
    viewport.camera = cmpCamera;

    cmpTerrain = viewport.getBranch().getChildrenByName("Terrain")[0].getComponent(f.ComponentMesh);

    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    control();
    f.Physics.simulate();  // if physics is included and used
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
}