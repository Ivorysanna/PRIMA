namespace FloppyBird {
    import f = FudgeCore;

    // interface Values {
    //     tubeSpeed: number;
    // }

    export class Tube extends f.Node {
        public static readonly tubesIntervalSeconds: number = 1;
        public static readonly tubeSpeed = 0.8;
        public static readonly tubeYDeviation = 0.7;

        private readonly tubeMesh = new f.MeshObj("TubeMesh", "Assets/tube.obj");
        private readonly tubeMaterial = new f.Material("Tubes", f.ShaderFlat);

        constructor(isRotatedDownward = false) {
            super("Tube");

            this.addComponent(new f.ComponentMesh(this.tubeMesh));
            this.addComponent(new f.ComponentMaterial(this.tubeMaterial));
            this.addComponent(new f.ComponentTransform());

            // Set pivot point
            this.getComponent(f.ComponentMesh).mtxPivot.translateY(-2.25);

            // TODO add collider component

            if (isRotatedDownward) {
                this.mtxLocal.rotateX(180);
            }
        }

        public static createTubes(): Tube[] {
            const tubes: Tube[] = [];

            // Randomize spawn position
            const randomSpawnPosition: number = Math.random() * 2 * this.tubeYDeviation - this.tubeYDeviation;

            // Spawn and add two new tubes
            const tubeLower = new Tube();
            tubeLower.mtxLocal.translateY(-randomSpawnPosition);
            tubes.push(tubeLower);

            // Randomize gap size
            const randomGapSize: number = Math.random() * 0.15 + 0.18;

            const tubeUpper = new Tube(true);
            tubeUpper.mtxLocal.translateY(randomSpawnPosition - randomGapSize);

            tubes.push(tubeUpper);

            // Move tubes to their starting position (offscreen)
            tubes.forEach((tube) => {
                tube.mtxLocal.translateX(2);
            });

            return tubes;
        }
    }
}
