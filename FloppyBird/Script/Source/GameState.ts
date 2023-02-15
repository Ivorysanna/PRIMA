// namespace Pinball {
//     import f = FudgeCore;
//     import fui = FudgeUserInterface;
  
//     export class GameState extends f.Mutable {
//         protected reduceMutator(_mutator: f.Mutator): void {/* */ }
        
//         public frequency = 0;
//         public speed = 0;
//         private controller: fui.Controller;

//         constructor(_config: {[key: string]: number}) {
//             super();
//             this.controller = new fui.Controller(this, document.querySelector("#UI"));
//             console.log(this.controller);
//         }
//     }
//   }