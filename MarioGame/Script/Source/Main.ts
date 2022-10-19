///<reference path="./../../../Core/Build/FudgeCore.d.ts"/>
///<reference path="./../../../Aid/Build/FudgeAid.d.ts"/>

namespace Script {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;
    
    ƒ.Debug.info("Main Program Template running!");
  
    let viewport: ƒ.Viewport;
    document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);
    let marioPos: ƒ.Node;
    let walkSpeed: number = 1.5;
  
   
    async function start(_event: CustomEvent): Promise<void> {
      viewport = _event.detail;
      ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
      console.log(viewport)
  
      let branch: ƒ.Node = viewport.getBranch();
      marioPos = branch.getChildrenByName("MarioPosition")[0];
      //marioPos.removeAllChildren();
  
      // create Mario
      let marioNode: ƒAid.NodeSprite = new ƒAid.NodeSprite("Mario");
      marioNode.addComponent(new ƒ.ComponentTransform());
      marioPos.appendChild(marioNode);
  
      // texture Mario
      let texture: ƒ.TextureImage = new ƒ.TextureImage();
      await texture.load("./../../../Images/CharacterSheet/mario_walk.png");
      let coat: ƒ.CoatTextured = new ƒ.CoatTextured(ƒ.Color.CSS("white"), texture);
  
      // animation
      // Walk
      let animWalk: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("Walk", coat);
      animWalk.generateByGrid(ƒ.Rectangle.GET(0, 16, 16, 16), 3, 64, ƒ.ORIGIN2D.TOPLEFT, ƒ.Vector2.X(17));
      // Run
      let animRun: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("Run", coat);
      animWalk.generateByGrid(ƒ.Rectangle.GET(0, 16, 16, 16), 3, 64, ƒ.ORIGIN2D.TOPLEFT, ƒ.Vector2.X(17));
  
      marioNode.setAnimation(animWalk);
      marioNode.setFrameDirection(1);
      marioNode.framerate = 12;
  
      ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
      
    
    }
    
    
    function update(_event: Event): void {
      if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D,ƒ.KEYBOARD_CODE.ARROW_RIGHT])){
        marioPos.mtxLocal.translateX(walkSpeed*ƒ.Loop.timeFrameGame/1000);
      }
      if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A,ƒ.KEYBOARD_CODE.ARROW_LEFT])){
        marioPos.mtxLocal.translateX(-walkSpeed*ƒ.Loop.timeFrameGame/1000);
      
      }
    
    
      //let cmpTransL: ƒ.ComponentTransform = marioPos.getComponent(ƒ.ComponentTransform);
      //cmpTransL.mtxLocal.translateX(0.01);
      // ƒ.Physics.simulate();  // if physics is included and used
      viewport.draw();
      ƒ.AudioManager.default.update();
      
      
    }
  }