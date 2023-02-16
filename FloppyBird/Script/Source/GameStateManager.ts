namespace FloppyBird {
    // https://refactoring.guru/design-patterns/singleton/typescript/example
    export class GameStateManager{
        private static instance: GameStateManager;

        private _isGameOver: boolean = false;
        private readonly EASY_MODE = true;

        private constructor() {
        }

        public static getInstance(): GameStateManager {
            if (!GameStateManager.instance) {
                GameStateManager.instance = new GameStateManager();
            }
            return GameStateManager.instance;
        }

        public set isGameOver(value: boolean) {
            this._isGameOver = value;
        }

        public get isGameOver(): boolean {
            return this._isGameOver;
        }

        public get isEasyMode(): boolean {
            return this.EASY_MODE;
        }
    }
}
