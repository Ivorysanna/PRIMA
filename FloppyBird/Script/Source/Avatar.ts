namespace FloppyBird {
    import f = FudgeCore;
    f.Project.registerScriptNamespace(FloppyBird);

    export class Avatar extends f.ComponentScript {
        public static readonly iSubclass: number = f.Component.registerSubclass(Avatar);

        // private rigidbody: f.ComponentRigidbody;
        // public jumpForce: number = 3;

    }
}
