namespace Script {
    import f = FudgeCore;
    import fAid = FudgeAid;

    f.Project.registerScriptNamespace(Script);

    enum JOB {
        IDLE,
        ATTACK,
    }

    export class StateMachine extends fAid.ComponentStateMachine<JOB> {
        public static readonly iSubclass: number = f.Component.registerSubclass(StateMachine);
        private static instructions: ƒAid.StateMachineInstructions<JOB> = StateMachine.get();
        public rotationIdle: number = 3;
        private cmpBody: f.ComponentRigidbody;
        // private cmpMaterial: f.ComponentMaterial;

        constructor() {
            super();
            this.instructions = StateMachine.instructions; // setup instructions with the static set

            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR) return;

            // Listen to this component being added to or removed from a node
            this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
            this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
            this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.hndEvent);
        }

        static get(): fAid.StateMachineInstructions<JOB> {
            let setup: fAid.StateMachineInstructions<JOB> = new fAid.StateMachineInstructions();
            setup.setAction(JOB.IDLE, <ƒ.General>this.actIdle);
            return setup;
        }

        private static async actIdle(_machine: StateMachine): Promise<void> {
            console.log("Acting IDLE");
            _machine.cmpBody.applyTorque(f.Vector3.Y(_machine.rotationIdle));
        }
        private hndEvent = (_event: Event): void => {
            console.log("Implement");
        };
    }
}
