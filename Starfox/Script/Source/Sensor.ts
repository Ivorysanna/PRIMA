namespace Script {
  import f = FudgeCore;
  f.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export class Sensor extends f.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = f.Component.registerSubclass(Sensor);
    // Properties may be mutated by users in the editor via the automatically created user interface
    //private rigidbody: f.ComponentRigidbody;
    public power: number = 15000;


    constructor() {
      super();

      // Don't start when running in editor
      if (f.Project.mode == f.MODE.EDITOR)
        return;

      // Listen to this component being added to or removed from a node
      this.addEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
      this.addEventListener(f.EVENT.NODE_DESERIALIZED, this.hndEvent);
    }

    // Activate the functions of this component as response to events
    public hndEvent = (_event: Event): void => {
      switch (_event.type) {
        case f.EVENT.COMPONENT_ADD:
          // ƒ.Debug.log(this.message, this.node);
          break;
        case f.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
        case f.EVENT.NODE_DESERIALIZED:
          //this.rigidbody = this.node.getComponent(f.ComponentRigidbody);
          //this.rigidbody.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, this.hndCollision);
          this.node.addEventListener(f.EVENT.RENDER_PREPARE, this.update)
          // if deserialized the node is now fully reconstructed and access to all its components and children is possible
          break;
      }
    }

    private update = (_event: Event): void => {
      if (!cmpTerrain)
        return;
      let mesh: f.MeshTerrain = (<f.MeshTerrain>cmpTerrain.mesh);
      let parent: f.Node = this.node.getParent();
      let info: f.TerrainInfo = mesh.getTerrainInfo(parent.mtxWorld.translation, cmpTerrain.mtxWorld);
      console.log(info.distance);

      if(info.distance < 0){
        this.node.dispatchEvent(new Event("SensorHit", {bubbles: true}));
      }
    }

    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}