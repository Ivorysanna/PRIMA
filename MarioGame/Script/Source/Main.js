///<reference path="./../../../Core/Build/FudgeCore.d.ts"/>
///<reference path="./../../../Aid/Build/FudgeAid.d.ts"/>
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    ƒ.Debug.info("Main Program Template running!");
    var viewport;
    document.addEventListener("interactiveViewportStarted", start);
    var marioPos;
    var walkSpeed = 1.5;
    function start(_event) {
        return __awaiter(this, void 0, void 0, function () {
            var branch, marioNode, texture, coat, animWalk, animRun;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        viewport = _event.detail;
                        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
                        console.log(viewport);
                        branch = viewport.getBranch();
                        marioPos = branch.getChildrenByName("MarioPosition")[0];
                        marioPos.removeAllChildren();
                        marioNode = new ƒAid.NodeSprite("Mario");
                        marioNode.addComponent(new ƒ.ComponentTransform());
                        marioPos.appendChild(marioNode);
                        texture = new ƒ.TextureImage();
                        return [4 /*yield*/, texture.load("./../../../Images/CharacterSheet/mario_walk.png")];
                    case 1:
                        _a.sent();
                        coat = new ƒ.CoatTextured(ƒ.Color.CSS("white"), texture);
                        animWalk = new ƒAid.SpriteSheetAnimation("Walk", coat);
                        animWalk.generateByGrid(ƒ.Rectangle.GET(176, 38, 16, 32), 3, 32, ƒ.ORIGIN2D.TOPLEFT, ƒ.Vector2.X(52));
                        animRun = new ƒAid.SpriteSheetAnimation("Run", coat);
                        animRun.generateByGrid(ƒ.Rectangle.GET(332, 38, 18, 32), 3, 32, ƒ.ORIGIN2D.TOPLEFT, ƒ.Vector2.X(52));
                        marioNode.setAnimation(animWalk);
                        marioNode.setFrameDirection(1);
                        marioNode.framerate = 12;
                        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
                        return [2 /*return*/];
                }
            });
        });
    }
    function update(_event) {
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
            marioPos.mtxLocal.translateX(walkSpeed * ƒ.Loop.timeFrameGame / 1000);
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
            marioPos.mtxLocal.translateX(-walkSpeed * ƒ.Loop.timeFrameGame / 1000);
        }
        //let cmpTransL: ƒ.ComponentTransform = marioPos.getComponent(ƒ.ComponentTransform);
        //cmpTransL.mtxLocal.translateX(0.01);
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        ƒ.AudioManager["default"].update();
    }
})(Script || (Script = {}));
