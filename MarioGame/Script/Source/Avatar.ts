namespace Script {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export class Avatar extends ƒAid.NodeSprite {
        private animWalk: ƒAid.SpriteSheetAnimation;
        private animSprint: ƒAid.SpriteSheetAnimation;
        private animJump: ƒAid.SpriteSheetAnimation;
        private animLook: ƒAid.SpriteSheetAnimation;
        private animDeath: ƒAid.SpriteSheetAnimation;

        readonly xSpeedDefault: number = 2.5;
        readonly xSpeedSprint: number = 5;
        private ySpeed: number = 0;
        private deltaTime: number = ƒ.Loop.timeFrameGame / 1000;
        private prevSprint: boolean = false;
        private leftDirection: boolean = false;

        public constructor() {
            super("Avatar");
            this.initializeAnimations();
            this.addComponent(new ƒ.ComponentTransform());
            this.setAnimation(this.animWalk);
            this.framerate = 20;
        }

        public update(deltaTime: number): void {
            let deltaTime: number = ƒ.Loop.timeFrameGame / 1000;
            this.ySpeed -= gravity * deltaTime;
            avatar.mtxLocal.translateY(this.ySpeed);
        }

        public walk(deltaTime: number): void {
            const xTranslation: number = this.deltaTime
        }
    
        public async initializeAnimations(): Promise <void> {
            let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
            await imgSpriteSheet.load("./Images/CharacterSheet/mario_walk.png");
            let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheet);


            this.animWalk = new ƒAid.SpriteSheetAnimation("Walk", coat);
            this.animWalk.generateByGrid(ƒ.Rectangle.GET(0, 16, 16, 16), 3, 16, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(17));
    
            this.animSprint = new ƒAid.SpriteSheetAnimation("Sprint", coat);
            this.animSprint.generateByGrid(ƒ.Rectangle.GET(0, 16, 16, 16), 3, 16, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(17));
    
            this.animJump = new ƒAid.SpriteSheetAnimation("Jump", coat);
            this.animJump.generateByGrid(ƒ.Rectangle.GET(0, 16, 16, 16), 3, 16, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(17));
    
            this.animLook = new ƒAid.SpriteSheetAnimation("Look", coat);
            this.animLook.generateByGrid(ƒ.Rectangle.GET(0, 16, 16, 16), 3, 16, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(17));
    
            this.animDeath = new ƒAid.SpriteSheetAnimation("Death", coat);
            this.animDeath.generateByGrid(ƒ.Rectangle.GET(0, 16, 16, 16), 3, 16, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(17));
        }

    }
}
