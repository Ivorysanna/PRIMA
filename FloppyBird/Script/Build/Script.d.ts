declare namespace FloppyBird {
    import f = FudgeCore;
    class Avatar extends f.ComponentScript {
        static readonly iSubclass: number;
    }
}
declare namespace FloppyBird {
    import f = FudgeCore;
    class CustomComponentScript extends f.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace FloppyBird {
    import f = FudgeCore;
    let floppyBird: f.Node;
    let gravity: f.Vector3;
}
declare namespace FloppyBird {
    import f = FudgeCore;
    class Tube extends f.Node {
        private mesh;
        private mat;
        constructor();
    }
}
