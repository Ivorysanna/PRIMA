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
        private static readonly BOTTOM_KILL_ZONE_Y;
        private static readonly TOP_KILL_ZONE_Y;
        private initialPlayerPosition;
        constructor();
        hndEvent: (_event: Event) => void;
        private addHnd;
        private collisionHandler;
        private update;
        private updateControls;
        private resetPlayerPosition;
    }
}
declare namespace FloppyBird {
    class GameStateManager {
        private static instance;
        isGameOver: boolean;
        isPlayerControllable: boolean;
        private readonly EASY_MODE;
        private constructor();
        static getInstance(): GameStateManager;
        get isEasyMode(): boolean;
        reinitializeGame(): void;
    }
}
declare namespace FloppyBird {
    import f = FudgeCore;
    let gravity: f.Vector3;
    let tubesCollection: f.Node;
    let tubeSpeedVui: TubeSpeedUIHandler;
    function resetTubes(): void;
}
declare namespace FloppyBird {
    import f = FudgeCore;
    class PlaySoundManager {
        private static instance;
        cmpAudio: f.ComponentAudio;
        masterVolume: number;
        private audioFileFlap;
        private audioFileCollision;
        private audioFilePoint;
        private cmpAudioFileFlap;
        private cmpAudioFileCollision;
        private cmpAudioFilePoint;
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
        playPointSound(): void;
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
        static readonly tubeYDeviation = 0.36;
        static readonly tubeTexture: f.TextureImage;
        static specialTubeFrequency: number;
        static specialTubeCounter: number;
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
    import f = FudgeCore;
    class TubeAnimation {
        static getAnimatorForOscillatingTubes(oscillationRange?: number): f.ComponentAnimator;
    }
}
declare namespace FloppyBird {
    import f = FudgeCore;
    class TubeSpeedUIHandler extends f.Mutable {
        tubeSpeed: number;
        constructor();
        protected reduceMutator(_mutator: f.Mutator): void;
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
