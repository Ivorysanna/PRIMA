/// <reference path="../../../Core/Build/FudgeCore.d.ts" />
/// <reference path="../../../Aid/Build/FudgeAid.d.ts" />
/// <reference types="../../core/build/fudgecore" />
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
