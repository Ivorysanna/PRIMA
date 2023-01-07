namespace FloppyBird {
    import f = FudgeCore;

    // interface Values {
    //     tubeSpeed: number;
    // }

    export class Tube extends f.Node {
        public static readonly tubesIntervalSeconds: number = 1;
        public static readonly tubeSpeed = 1;

        private readonly tubeMesh = new f.MeshObj("TubeMesh", "Assets/tube.obj");
        private readonly tubeMaterial = new f.Material("Tubes", f.ShaderFlat);

        constructor(isRotatedDownward = false) {
            super("Tube");

            this.addComponent(new f.ComponentMesh(this.tubeMesh));
            this.addComponent(new f.ComponentMaterial(this.tubeMaterial));
            this.addComponent(new f.ComponentTransform());

            // TODO add collider component

            if (isRotatedDownward) {
                this.mtxLocal.rotateX(180);
            }
        }

        public static createTubes(): Tube[] {
            const tubes: Tube[] = [];

            // Randomize spawn position
            // let randomSpawnPosition: number = Math.random() * 2 - 1;
            let randomSpawnPosition: number = 0;

            // Spawn and add two new tubes
            let tubeLower = new Tube();
            tubeLower.mtxLocal.translateY(randomSpawnPosition);
            tubes.push(tubeLower);

            // Randomize gap size
            // let randomGapSize: number = Math.random() * 0.1 + 1.5;
            let randomGapSize: number = 0;

            let tubeUpper = new Tube(true);
            // TODO: remove magic number
            tubeUpper.mtxLocal.translateY(-randomSpawnPosition - randomGapSize);
            tubes.push(tubeUpper);

            tubes.forEach((tube) => {
                tube.mtxLocal.translateX(2);
            });

            return tubes;
        }
    }
}
