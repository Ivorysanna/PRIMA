namespace FloppyBird {
    import f = FudgeCore;
    // https://refactoring.guru/design-patterns/singleton/typescript/example
    export class AudioManager {
        private static instance: AudioManager;
        public cmpAudio: f.ComponentAudio;

        public masterVolume: number = 1;

        private audioFileFlap: f.Audio;
        private audioFileCollision: f.Audio;

        private cmpAudioFileFlap: f.ComponentAudio;
        private cmpAudioFileCollision: f.ComponentAudio;

        /**
         * The Singleton's constructor should always be private to prevent direct
         * construction calls with the `new` operator.
         */
        private constructor() {}

        /**
         * The static method that controls the access to the singleton instance.
         *
         * This implementation let you subclass the Singleton class while keeping
         * just one instance of each subclass around.
         */
        public static getInstance(): AudioManager {
            if (!AudioManager.instance) {
                AudioManager.instance = new AudioManager();
            }
            return AudioManager.instance;
        }

        public initializeAudio() {
            this.audioFileFlap = new f.Audio("Sounds/wing.wav");
            this.audioFileCollision = new f.Audio("Sounds/collision.wav");

            this.cmpAudioFileFlap = new f.ComponentAudio(this.audioFileFlap, false, false);
            this.cmpAudioFileFlap.connect(true);
            this.cmpAudioFileFlap.volume = 1 * this.masterVolume;

            this.cmpAudioFileCollision = new f.ComponentAudio(this.audioFileCollision, false, false);
            this.cmpAudioFileCollision.connect(true);
            this.cmpAudioFileCollision.volume = 1 * this.masterVolume;
        }

        public playFlapSound() {
            this.cmpAudioFileFlap.play(true);
        }

        public playCollisionSound() {
            this.cmpAudioFileCollision.play(true);
        }
    }
}
