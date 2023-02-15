namespace FloppyBird {
    import f = FudgeCore;
    export class ContinuousTubeMovement extends f.ComponentScript {
        constructor() {
            super();
            this.addEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
        }

        // Activate the functions of this component as response to events
        public hndEvent = (_event: Event): void => {
            switch (_event.type) {
                case f.EVENT.COMPONENT_ADD:
                    this.node.addEventListener(f.EVENT.RENDER_PREPARE, this.update);
                    break;
            }
        };

        private update = (_event: Event): void => {
            const deltaTime: number = f.Loop.timeFrameGame / 1000;
            const tubeNode: f.Node = this.node;
            tubeNode.mtxLocal.translateX(-Tube.tubeSpeed * deltaTime);

            // Remove tube if it's out of the viewport
            if (tubeNode.mtxLocal.translation.x < -3) {
                tubeNode.getParent().removeChild(tubeNode);
            }
        };
    }
}