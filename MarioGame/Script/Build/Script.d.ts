declare namespace Script {
    import ƒAid = FudgeAid;
    class Avatar extends ƒAid.NodeSprite {
        animWalk: ƒAid.SpriteSheetAnimation;
        animSprint: ƒAid.SpriteSheetAnimation;
        animJump: ƒAid.SpriteSheetAnimation;
        animLook: ƒAid.SpriteSheetAnimation;
        animDeath: ƒAid.SpriteSheetAnimation;
        constructor();
        initializeAnimations(): Promise<void>;
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
}
