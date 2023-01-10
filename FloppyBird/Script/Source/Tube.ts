namespace FloppyBird {
    import f = FudgeCore;

    export class Tube extends f.Node {
        // Constants
        public static readonly tubesIntervalSeconds: number = 2;
        public static readonly tubeSpeed = 0.5;
        public static readonly tubeYDeviation = 0.7;

        // Mesh and material
        private readonly tubeMesh = new f.MeshObj("TubeMesh", "Assets/tube.obj");
        private readonly tubeMaterial = new f.Material("Tubes", f.ShaderFlat);

        constructor(isRotatedDownward = false) {
            super("Tube");

            this.addComponent(new f.ComponentMesh(this.tubeMesh));
            this.addComponent(new f.ComponentMaterial(this.tubeMaterial));
            this.addComponent(new f.ComponentTransform());

            // Set pivot point
            this.getComponent(f.ComponentMesh).mtxPivot.translateY(-2.25);

            // Add Collider
            const rigidbody: f.ComponentRigidbody = new f.ComponentRigidbody(0, f.BODY_TYPE.KINEMATIC, f.COLLIDER_TYPE.CYLINDER);
            rigidbody.setScaling(new f.Vector3(0.2, 0.23, 0.1));
            rigidbody.setPosition(new f.Vector3(0, 0.9, 0));
            this.addComponent(rigidbody);

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
            const randomGapSize: number = Math.random() * 0.05 + 0.4;

            const tubeUpper = new Tube(true);
            tubeUpper.mtxLocal.translateY(randomSpawnPosition - randomGapSize);

            tubes.push(tubeUpper);

            // Move tubes to their starting position (offscreen)
            tubes.forEach((tube) => {
                tube.mtxLocal.translateX(1.8);
            });

            return tubes;
        }
    }
}
