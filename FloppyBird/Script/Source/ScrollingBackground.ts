namespace FloppyBird {
    import f = FudgeCore;

    export class ScrollingBackground extends f.Node {
        public static readonly backgroundVelocity: number = 0.5;
        constructor(_y: number) {
            super("Background");

            this.addComponent(new f.ComponentTransform());
            this.mtxLocal.translateZ(-2);
            this.mtxLocal.translateX(0);
            this.mtxLocal.translateY(_y);
            let backgroundMesh: f.Mesh = new f.MeshSprite("BackgroundMesh");
            let backgroundMaterial: f.Material = new f.Material("BackgroundMaterial", f.ShaderLitTextured, new f.CoatTextured(f.Color.CSS("WHITE"), new f.TextureImage("Assets/background.png")));
            let cmpMesh: f.ComponentMesh = new f.ComponentMesh(backgroundMesh);
            this.addComponent(cmpMesh);

            this.addComponent(new f.ComponentMaterial(backgroundMaterial));

            this.getComponent(f.ComponentMesh).mtxPivot.scaleX(31);
            this.getComponent(f.ComponentMesh).mtxPivot.scaleY(22);
            
            
        }
        moveBackground(_movement: number): void {
            let timeSinceLastFrame: number = f.Loop.timeFrameReal / 1000;
            this.mtxLocal.translateY(_movement * timeSinceLastFrame);
        }
    }

}


