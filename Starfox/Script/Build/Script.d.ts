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
    let cmpTerrain: f.ComponentMesh;
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
