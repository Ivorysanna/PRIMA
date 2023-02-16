namespace FloppyBird {
    import fui = FudgeUserInterface;
    import f = FudgeCore;

    export class TubeSpeedUIHandler extends f.Mutable {
        public tubeSpeed: number = 0.5;

        public constructor() {
            super();
            let tubeSpeedVui: HTMLDivElement = document.querySelector("div#tubeSpeed");
            console.log(new fui.Controller(this, tubeSpeedVui));
        }

        protected reduceMutator(_mutator: f.Mutator): void {
            /* */
        }
    }
}
