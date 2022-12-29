declare namespace Script {
    import f = FudgeCore;
    class Avatar extends f.ComponentScript {
        static readonly iSubclass: number;
    }
}
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
    let floppyBird: f.Node;
    let gravity: f.Vector3;
}
