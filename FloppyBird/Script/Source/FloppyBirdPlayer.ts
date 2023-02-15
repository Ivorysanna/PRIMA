namespace FloppyBird {
    import f = FudgeCore;
    f.Project.registerScriptNamespace(FloppyBird); // Register the namespace to FUDGE for serialization

    export class FloppyBirdPlayer extends f.ComponentScript {
        public static readonly iSubclass: number = f.Component.registerSubclass(FloppyBirdPlayer);

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
                    // f.Debug.log(this.message, this.node);
                    this.node.addEventListener(f.EVENT.RENDER_PREPARE, this.update);
                    break;
                case f.EVENT.COMPONENT_REMOVE:
                    this.removeEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
                    this.removeEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
                    break;
                case f.EVENT.NODE_DESERIALIZED:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible

                    this.node.addEventListener(f.EVENT.RENDER_PREPARE, this.update);
                    break;
            }
        };

        private update = (_event: Event): void => {
            
            // TODO gamestate als singleton, damit man gameover von überall updaten kann
            
        };

        // TODO checkFloppyBirdCollision hier rein
        
        // TODO updatecontrols hier rein
    }
}
