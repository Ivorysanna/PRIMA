namespace FloppyBird {
    import f = FudgeCore;
    // import fAid = FudgeAid;

    export class Tube extends f.Node {
        // Constants
        public static readonly TUBE_COLLIDER_NODE_NAME = "TubeCollider";
        public static readonly TUBE_NODE_NAME = "Tube";
        public static readonly tubesIntervalSeconds: number = 2;
        public static readonly tubeSpeed = 0.5;
        public static readonly tubeYDeviation = 0.7;
        public static readonly tubeTexture: f.TextureImage = new f.TextureImage("Assets/brushed-metal_albedo.jpg");

        // Mesh and material
        private readonly tubeMesh = new f.MeshObj("TubeMesh", "Assets/tube.obj");
        private readonly tubeMaterial = new f.Material("Tube", f.ShaderFlatTextured, new f.CoatTextured(f.Color.CSS("White"), Tube.tubeTexture));
        // private readonly tubeMaterial = new f.Material("Tubes", f.ShaderFlat);
        // private readonly tube: fAid.Node = new fAid.Node("Tube", f.Matrix4x4.IDENTITY(), this.tubeMaterial, this.tubeMesh);

        constructor(isRotatedDownward = false) {
            super(Tube.TUBE_NODE_NAME);

            this.addComponent(new f.ComponentMesh(this.tubeMesh));
            this.addComponent(new f.ComponentMaterial(this.tubeMaterial));
            this.addComponent(new f.ComponentTransform());
            this.addComponent(new ContinuousTubeMovement());

            // Set pivot point
            this.getComponent(f.ComponentMesh).mtxPivot.translateY(-2.25);

            // Add Collider
            let rigidbody: f.ComponentRigidbody = new f.ComponentRigidbody(0, f.BODY_TYPE.KINEMATIC, f.COLLIDER_TYPE.CYLINDER, f.COLLISION_GROUP.DEFAULT, new f.Matrix4x4());
            rigidbody.addEventListener(f.EVENT_PHYSICS.COLLISION_ENTER, this.handleTubeCollision);
            // let oldCollider: OIMO.Shape = rigidbody.getShapeList();
            rigidbody.mtxPivot.scale(new f.Vector3(0.22, 2.234, 1));
            rigidbody.mtxPivot.translate(new f.Vector3(0.01, -0.53, 0));
            this.addComponent(rigidbody);

            // TODO add collider component

            if (isRotatedDownward) {
                this.mtxLocal.rotateX(180);
            }
        }

        /**
         * Creates a set of tube inside another node that acts as a container.
         * This container node also contains the trigger collider between the tubes to use for score incrementing.
         */
        public static createSetOfTubes(): f.Node {
            const tubeContainerNode = new f.Node(this.TUBE_COLLIDER_NODE_NAME);
            tubeContainerNode.addComponent(new f.ComponentTransform());

            // Randomize spawn position
            const randomSpawnPosition: number = Math.random() * 2 * this.tubeYDeviation - this.tubeYDeviation;

            // Spawn and add two new tubes
            const tubeLower = new Tube();
            tubeLower.mtxLocal.translateY(-randomSpawnPosition);
            tubeContainerNode.addChild(tubeLower);

            //Add Collider for point scoring
            const colliderNode = new f.Node("TubeCollider");
            tubeContainerNode.addChild(colliderNode);
            const rigidbodyCollider: f.ComponentRigidbody = new f.ComponentRigidbody(0, f.BODY_TYPE.KINEMATIC, f.COLLIDER_TYPE.CYLINDER, f.COLLISION_GROUP.DEFAULT, new f.Matrix4x4());
            rigidbodyCollider.mtxPivot.scale(new f.Vector3(0.1, 10, 4));
            rigidbodyCollider.isTrigger = true;
            colliderNode.addComponent(new f.ComponentTransform());
            colliderNode.addComponent(rigidbodyCollider);

            // Randomize gap size
            const randomGapSize: number = Math.random() * 0.05 + (EASY_MODE ? 1 : 0.4);

            const tubeUpper = new Tube(true);
            tubeUpper.mtxLocal.translateY(randomSpawnPosition - randomGapSize);

            tubeContainerNode.addChild(tubeUpper);

            // Move tubes to their starting position (offscreen)
            tubeContainerNode.mtxLocal.translateX(1.8);

            return tubeContainerNode;
        }

        private handleTubeCollision(_event: f.EventPhysics) {
            let collider: f.ComponentRigidbody = _event.cmpRigidbody;
            let colNode: f.Node = collider.node;
            if (colNode.name == "FloppyBirdBody") {
                AudioManager.getInstance().playCollisionSound();
                isGameOver = true;
                alert("GAME OVER");
                // TODO: Better Game Over Screen maybe?
            }
        }
    }
}
