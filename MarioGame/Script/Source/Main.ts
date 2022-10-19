namespace Script {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    //Viewport
    let viewport: ƒ.Viewport;
    document.addEventListener("interactiveViewportStarted", <EventListener>(<unknown>start));

    function start(_event: CustomEvent): void {
        viewport = _event.detail;
        hndLoad(_event);
    }

    //Create Mario
    let marioPos: ƒ.Node;

    async function hndLoad(_event: CustomEvent): Promise<void> {
        // texture Mario
        let texture: ƒ.TextureImage = new ƒ.TextureImage();
        await texture.load("./Images/CharacterSheet/mario_walk.png");
        let coat: ƒ.CoatTextured = new ƒ.CoatTextured(ƒ.Color.CSS("white"), texture);

        // animation
        // Walk
        let animWalk: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("Walk", coat);
        animWalk.generateByGrid(ƒ.Rectangle.GET(0, 16, 16, 16), 3, 64, ƒ.ORIGIN2D.TOPLEFT, ƒ.Vector2.X(17));
        // Run
        // let animRun: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("Run", coat);
        // animWalk.generateByGrid(ƒ.Rectangle.GET(0, 16, 16, 16), 3, 64, ƒ.ORIGIN2D.TOPLEFT, ƒ.Vector2.X(17));

        // create Mario
        let marioNode: ƒAid.NodeSprite = new ƒAid.NodeSprite("Mario");
        marioNode.addComponent(new ƒ.ComponentTransform());
        //marioPos.appendChild(marioNode);
        marioNode.setAnimation(animWalk);
        marioNode.setFrameDirection(1);
        marioNode.framerate = 12;

        let branch: ƒ.Node = viewport.getBranch();
        marioPos = branch.getChildrenByName("MarioPosition")[0];
        marioPos.addChild(marioNode);

        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 30);
    }

    let walkSpeed: number = 1.5;

    function update(_event: Event): void {
        let amount: number = (walkSpeed * ƒ.Loop.timeFrameGame) / 1000;
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
            marioPos.mtxLocal.translateX(amount);
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
            marioPos.mtxLocal.translateX(-amount);
        }

        viewport.draw();
        ƒ.AudioManager.default.update();
    }
}
