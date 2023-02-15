declare namespace FloppyBird {
    import f = FudgeCore;
    class AudioManager {
        private static instance;
        cmpAudio: f.ComponentAudio;
        masterVolume: number;
        private audioFileFlap;
        private audioFileCollision;
        private cmpAudioFileFlap;
        private cmpAudioFileCollision;
        /**
         * The Singleton's constructor should always be private to prevent direct
         * construction calls with the `new` operator.
         */
        private constructor();
        /**
         * The static method that controls the access to the singleton instance.
         *
         * This implementation let you subclass the Singleton class while keeping
         * just one instance of each subclass around.
         */
        static getInstance(): AudioManager;
        initializeAudio(): void;
        playFlapSound(): void;
        playCollisionSound(): void;
    }
}
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
    class ScrollingBackground extends f.Node {
        static readonly backgroundVelocity: number;
        constructor(xOffset: number);
        moveBackground(amountToMove: number): void;
    }
}
declare namespace FloppyBird {
    import f = FudgeCore;
    class Tube extends f.Node {
        static readonly tubesIntervalSeconds: number;
        static readonly tubeSpeed = 0.5;
        static readonly tubeYDeviation = 0.7;
        static readonly tubeTexture: f.TextureImage;
        private readonly tubeMesh;
        private readonly tubeMaterial;
        constructor(isRotatedDownward?: boolean);
        static createSetOfTubes(): Tube[];
    }
}
declare namespace FloppyBird {
    class UIManager {
        private static readonly UI_ID;
        private static readonly SCORE_ID;
        private static instance;
        private _currentScore;
        private constructor();
        static getInstance(): UIManager;
        private set currentScore(value);
        get currentScore(): number;
        incrementScore(): void;
        resetScore(): void;
        hideUI(): void;
        showUI(): void;
    }
}
