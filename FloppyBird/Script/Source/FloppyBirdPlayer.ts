namespace FloppyBird {
    import f = FudgeCore;
    f.Project.registerScriptNamespace(FloppyBird); // Register the namespace to FUDGE for serialization

    export class FloppyBirdPlayer extends f.ComponentScript {
        public static readonly iSubclass: number = f.Component.registerSubclass(FloppyBirdPlayer);
        private isSpaceKeyAlreadyPressed: boolean = false;
        private rigidbody: f.ComponentRigidbody;
        private jumpForce: f.Vector3 = new f.Vector3(0, 1, 0);

        constructor() {
            super();

            // Don't start when running in editor
            if (f.Project.mode == f.MODE.EDITOR) return;

            this.addEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
            this.addEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
        }

        // Activate the functions of this component as response to events
        public hndEvent = (_event: Event): void => {
            switch (_event.type) {
                case f.EVENT.COMPONENT_ADD:
                    this.addHnd();
                    break;
                case f.EVENT.COMPONENT_REMOVE:
                    this.removeEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
                    this.removeEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
                    this.node.removeEventListener(f.EVENT.RENDER_PREPARE, this.update);
                    this.rigidbody.removeEventListener(f.EVENT_PHYSICS.COLLISION_ENTER, this.collisionHandler);
                    break;
            }
        };

        private addHnd() {
            this.node.addEventListener(f.EVENT.RENDER_PREPARE, this.update);
            this.rigidbody = this.node.getComponent(f.ComponentRigidbody);

            this.rigidbody.addEventListener(f.EVENT_PHYSICS.COLLISION_ENTER, this.collisionHandler);
        }

        private collisionHandler(_event: f.EventPhysics): void {
            const otherCollider: f.ComponentRigidbody = _event.cmpRigidbody;
            const collidedNode: f.Node = otherCollider.node;
            if (!collidedNode) {
                return null;
            }
            switch (collidedNode.name) {
                case Tube.TUBE_COLLIDER_NODE_NAME:
                    console.log("Adding point!");
                    UIManager.getInstance().incrementScore();
                    collidedNode.removeComponent(collidedNode.getComponent(f.ComponentRigidbody));
                    break;
                case "BorderBottom":
                case Tube.TUBE_NODE_NAME:
                    PlaySoundManager.getInstance().playCollisionSound();
                    GameStateManager.getInstance().isGameOver = true;
                    const currentScore: number = UIManager.getInstance().currentScore;
                    alert(`GAME OVER ${currentScore} Tubes passed`);
                    // TODO: Better Game Over Screen maybe?
                    break;
                default:
                    break;
            }
        }

        private update = (_event: Event): void => {
            if (!GameStateManager.getInstance().isGameOver) {
                //Controls
                this.updateControls();
            }
        };

        // Controls
        private updateControls(): void {
            if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.SPACE])) {
                if (!this.isSpaceKeyAlreadyPressed) {
                    this.rigidbody.applyLinearImpulse(this.jumpForce);
                    PlaySoundManager.getInstance().playFlapSound();
                    this.isSpaceKeyAlreadyPressed = true;
                }
            } else {
                this.isSpaceKeyAlreadyPressed = false;
            }
        }
    }
}
