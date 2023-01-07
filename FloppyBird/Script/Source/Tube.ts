namespace FloppyBird {
    import f = FudgeCore;

    interface Values {
        tubeSpeed: number;
    }

    export class Tube extends f.Node {
        private mesh = new f.MeshObj("TubeMesh", "Assets/tube.obj");
        private mat = new f.Material("Tubes", f.ShaderFlat);

        constructor(){
            super("Tube");

            this.addComponent(new f.ComponentMesh(this.mesh));
            this.addComponent(new f.ComponentMaterial(this.mat));
            this.addComponent(new f.ComponentTransform());
        }
    }

    
}