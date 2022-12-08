namespace Script {
  import f = FudgeCore;
  f.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export class EngineScript extends f.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = f.Component.registerSubclass(EngineScript);
    // Properties may be mutated by users in the editor via the automatically created user interface
    private rigidbody: f.ComponentRigidbody;
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
          this.rigidbody = this.node.getComponent(f.ComponentRigidbody);
          this.rigidbody.addEventListener(f.EVENT_PHYSICS.COLLISION_ENTER, this.hndCollision);
          this.node.addEventListener(f.EVENT.RENDER_PREPARE, this.update);
          //this.node.addEventListener("SensorHit", this.hndCollision);
          this.node.addEventListener(f.EVENT.RENDER_PREPARE, this.update);
          // if deserialized the node is now fully reconstructed and access to all its components and children is possible
          break;
      }
    }

    private update = (_event: Event): void => {
      if(!gameState){
        return;
      }
      gameState.height = this.node.mtxWorld.translation.y;
      gameState.velocity = (this.rigidbody.getVelocity().magnitude.toFixed(3));

      
      // if (!cmpTerrain)
      //   return;
      // let mesh: f.MeshTerrain = (<f.MeshTerrain>cmpTerrain.mesh);
      // let info: f.TerrainInfo = mesh.getTerrainInfo(this.node.mtxLocal.translation, cmpTerrain.mtxWorld);
      //console.log(info.distance);
    }
    
    private hndCollision = (_event: Event): void => {
      console.log("Bumm");
    }

    public yaw(_value: number) {
      this.rigidbody.applyTorque(new f.Vector3(0, _value * -10, 0));
    }
    public pitch(_value: number) {
      this.rigidbody.applyTorque(f.Vector3.SCALE(this.node.mtxWorld.getX(), _value * 7.5));
    }
    public roll(_value: number) {
      this.rigidbody.applyTorque(f.Vector3.SCALE(this.node.mtxWorld.getZ(), _value));
    }
    public backwards() {
      this.rigidbody.applyForce(f.Vector3.SCALE(this.node.mtxWorld.getZ(), -this.power));
    }
    public thrust() {
      this.rigidbody.applyForce(f.Vector3.SCALE(this.node.mtxWorld.getZ(), this.power));
    }

    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}