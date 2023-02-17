namespace FloppyBird {
    import f = FudgeCore;
    export class TubeAnimation {
        public static getAnimatorForOscillatingTubes(oscillationRange: number = 0.1): f.ComponentAnimator {
            const time0: number = 0;
            const time1: number = 2000;
            const time2: number = 4000;
            const time3: number = 6000;
            const value0: number = 0;
            const value1: number = oscillationRange;
            const value2: number = -oscillationRange;
            const value3: number = 0;

            const animationSequenceOscillating: f.AnimationSequence = new f.AnimationSequence();
            animationSequenceOscillating.addKey(new f.AnimationKey(time0, value0));
            animationSequenceOscillating.addKey(new f.AnimationKey(time1, value1));
            animationSequenceOscillating.addKey(new f.AnimationKey(time2, value2));
            animationSequenceOscillating.addKey(new f.AnimationKey(time3, value3));

            const animStructure: f.AnimationStructure = {
                components: {
                    ComponentTransform: [
                        {
                            "f.ComponentTransform": {
                                mtxLocal: {
                                    translation: {
                                        y: animationSequenceOscillating,
                                    },
                                },
                            },
                        },
                    ],
                },
            };

            const animation: f.Animation = new f.Animation("tubeAnimation", animStructure, 60);

            const cmpAnimator: f.ComponentAnimator = new f.ComponentAnimator(animation, f.ANIMATION_PLAYMODE["LOOP"], f.ANIMATION_PLAYBACK["TIMEBASED_CONTINOUS"]);
            cmpAnimator.scale = 1;

            return cmpAnimator;
        }
    }
}
