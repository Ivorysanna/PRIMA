namespace Script {
    import f = FudgeCore;
    f.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization

    export class EngineScript extends f.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        public static readonly iSubclass: number = f.Component.registerSubclass(EngineScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        // public message: string = "CustomComponentScript added to ";

        constructor() {
            super();

            // Don't start when running in editor
            if (f.Project.mode == f.MODE.EDITOR) return;

            // Listen to this component being added to or removed from a node
            this.addEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
            this.addEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
            this.addEventListener(f.EVENT.NODE_DESERIALIZED, this.hndEvent);
        }

        // Activate the functions of this component as response to events
        public hndEvent = (_event: Event): void => {
            switch (_event.type) {
                case f.EVENT.COMPONENT_ADD:
                    // ƒ.Debug.log(this.message, this.node);
                    this.node.addEventListener(f.EVENT.RENDER_PREPARE, this.update);
                    break;
                case f.EVENT.COMPONENT_REMOVE:
                    this.removeEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
                    this.removeEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
                    break;
                case f.EVENT.NODE_DESERIALIZED:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };

        public update = (_event: Event): void => {
            let rigidbody: f.ComponentRigidbody = this.node.getComponent(f.ComponentRigidbody);
            //rigidbody.applyTorque(f.Vector3.Y(1));
            let forceMovementSpeed: number = 20;

            // Check for key presses
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]))
                //rigidbody.mtxLocal.rotation = ƒ.Vector3.Y(180);
                rigidbody.applyForce(f.Vector3.X(forceMovementSpeed));
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) rigidbody.applyForce(f.Vector3.X(-forceMovementSpeed));
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])) rigidbody.applyForce(f.Vector3.Z(forceMovementSpeed));
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) rigidbody.applyForce(f.Vector3.Z(-forceMovementSpeed));
        };

        // protected reduceMutator(_mutator: ƒ.Mutator): void {
        //   // delete properties that should not be mutated
        //   // undefined properties and private fields (#) will not be included by default
        // }
    }
}
