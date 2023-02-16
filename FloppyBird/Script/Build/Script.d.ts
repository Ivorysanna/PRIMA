declare namespace FloppyBird {
    import f = FudgeCore;
    class ContinuousTubeMovement extends f.ComponentScript {
        constructor();
        hndEvent: (_event: Event) => void;
        private update;
    }
}
declare namespace FloppyBird {
    import f = FudgeCore;
    class FloppyBirdPlayer extends f.ComponentScript {
        static readonly iSubclass: number;
        private isSpaceKeyAlreadyPressed;
        private rigidbody;
        private jumpForce;
        constructor();
        hndEvent: (_event: Event) => void;
        private addHnd;
        private collisionHandler;
        private update;
        private updateControls;
    }
}
declare namespace FloppyBird {
    class GameStateManager {
        private static instance;
        private _isGameOver;
        private readonly EASY_MODE;
        private constructor();
        static getInstance(): GameStateManager;
        set isGameOver(value: boolean);
        get isGameOver(): boolean;
        get isEasyMode(): boolean;
    }
}
declare namespace FloppyBird {
    import f = FudgeCore;
    let gravity: f.Vector3;
    let tubesCollection: f.Node;
}
declare namespace FloppyBird {
    import f = FudgeCore;
    class PlaySoundManager {
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
        static getInstance(): PlaySoundManager;
        initializeAudio(): void;
        playFlapSound(): void;
        playCollisionSound(): void;
    }
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
        static readonly TUBE_COLLIDER_NODE_NAME = "TubeCollider";
        static readonly TUBE_NODE_NAME = "Tube";
        static tubesIntervalSeconds: number;
        static tubeSpeed: number;
        static readonly tubeYDeviation = 0.7;
        static readonly tubeTexture: f.TextureImage;
        private readonly tubeMesh;
        private readonly tubeMaterial;
        constructor(isRotatedDownward?: boolean);
        /**
         * Creates a set of tube inside another node that acts as a container.
         * This container node also contains the trigger collider between the tubes to use for score incrementing.
         */
        static createSetOfTubes(): f.Node;
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
