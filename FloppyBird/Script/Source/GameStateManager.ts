namespace FloppyBird {
    // https://refactoring.guru/design-patterns/singleton/typescript/example
    export class GameStateManager{
        private static instance: GameStateManager;

        public isGameOver: boolean = false;
        public isPlayerControllable: boolean = true;
        private readonly EASY_MODE = true;

        private constructor() {
        }

        public static getInstance(): GameStateManager {
            if (!GameStateManager.instance) {
                GameStateManager.instance = new GameStateManager();
            }
            return GameStateManager.instance;
        }

        public get isEasyMode(): boolean {
            return this.EASY_MODE;
        }

        public reinitializeGame(): void {
            this.isGameOver = false;
            this.isPlayerControllable = true;
        }
    }
}
