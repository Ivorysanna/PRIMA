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
        audioCrashSound: f.ComponentAudio;
        constructor();
        hndEvent: (_event: Event) => void;
        update: (_event: Event) => void;
        private hndCol;
        yaw(_value: number): void;
        pitch(_value: number): void;
        roll(_value: number): void;
        backwards(): void;
        thrust(): void;
    }
}
declare namespace Script {
}
