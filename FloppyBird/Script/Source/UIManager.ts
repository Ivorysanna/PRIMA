namespace FloppyBird {
    // https://refactoring.guru/design-patterns/singleton/typescript/example
    export class UIManager {
        private static readonly UI_ID: string = "UI";
        private static readonly SCORE_ID: string = "score";

        private static instance: UIManager;
        private _currentScore: number = 0;

        private constructor() {}

        public static getInstance(): UIManager {
            if (!UIManager.instance) {
                UIManager.instance = new UIManager();
            }
            return UIManager.instance;
        }

        // Set only privately
        private set currentScore(score: number) {
            this._currentScore = score;
            document.getElementById(UIManager.SCORE_ID).innerHTML = score.toString();
        }

        public get currentScore(): number {
            return this._currentScore;
        }

        public incrementScore() {
            PlaySoundManager.getInstance().playPointSound();
            this.currentScore++;
        }

        public resetScore() {
            this.currentScore = 0;
        }

        public hideUI() {
            document.getElementById(UIManager.UI_ID).style.display = "none";
        }

        public showUI() {
            document.getElementById(UIManager.UI_ID).style.display = "block";
        }
    }
}
