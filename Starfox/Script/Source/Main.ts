namespace Script {
    import f = FudgeCore;
    f.Debug.info("Main Program Template running!");
  
    let viewport: f.Viewport;
    let cmpEngine: EngineScript;
    let vctMouse: f.Vector2 = f.Vector2.ZERO();

    document.addEventListener("interactiveViewportStarted", <EventListener>start);
    window.addEventListener("mousemove", hndMouse);
  
    function start(_event: CustomEvent): void {
      viewport = _event.detail;
      viewport.physicsDebugMode = f.PHYSICS_DEBUGMODE.COLLIDERS;
      f.Physics.settings.solverIterations = 550;
      let ship: f.Node = viewport.getBranch().getChildrenByName("Rocket")[0];
      // let terrain = viewport.getBranch().getChildrenByName("Terrain")[0].getComponent(f.ComponentMesh);;
      // //let componentMeshTerrain = terrain.getComponent(f.ComponentMesh);
      // //Versicherung, dass das der Typ ist den wir brauchen "as"
      // let terrainInfo = (terrain.mesh as f.MeshTerrain).getTerrainInfo(f.Vector3.ZERO());
      
      cmpEngine = ship.getComponent(EngineScript);
      let cmpCamera = ship.getComponent(f.ComponentCamera);
      viewport.camera = cmpCamera;
      let t: f.MeshTerrain = new f.MeshTerrain();
      //t.getTerrainInfo();
  
      f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
      f.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
  
    function update(_event: Event): void {
      control();
      f.Physics.simulate();  // if physics is included and used
      viewport.draw();
      f.AudioManager.default.update();

      let terrain = viewport.getBranch().getChildrenByName("Terrain")[0].getComponent(f.ComponentMesh);;
      let terrainInfo = (terrain.mesh as f.MeshTerrain).getTerrainInfo(f.Vector3.ZERO());
      console.log(terrainInfo);
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