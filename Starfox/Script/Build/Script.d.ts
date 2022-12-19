declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    import f = FudgeCore;
    class EngineScript extends f.ComponentScript {
        static readonly iSubclass: number;
        private rigidbody;
        power: number;
        constructor();
        hndEvent: (_event: Event) => void;
        private update;
        private hndCollision;
        yaw(_value: number): void;
        pitch(_value: number): void;
        roll(_value: number): void;
        backwards(): void;
        thrust(): void;
    }
}
declare namespace Script {
    import f = FudgeCore;
    class GameState extends f.Mutable {
        protected reduceMutator(_mutator: f.Mutator): void;
        height: number;
        velocity: number;
        fuel: number;
        private controller;
        constructor();
    }
}
declare namespace Script {
    import f = FudgeCore;
    let viewport: f.Viewport;
    let cmpTerrain: f.ComponentMesh;
    let gameState: GameState;
}
declare namespace Script {
    import f = FudgeCore;
    class Sensor extends f.ComponentScript {
        static readonly iSubclass: number;
        power: number;
        constructor();
        hndEvent: (_event: Event) => void;
        private update;
    }
}
declare namespace Script {
    import fAid = FudgeAid;
    enum JOB {
        IDLE = 0,
        ATTACK = 1
    }
    export class StateMachine extends fAid.ComponentStateMachine<JOB> {
        static readonly iSubclass: number;
        private static instructions;
        rotationIdle: number;
        private cmpBody;
        constructor();
        static get(): fAid.StateMachineInstructions<JOB>;
        private static actIdle;
        private hndEvent;
    }
    export {};
}
