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
var Player;
(function (Player) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    window.addEventListener("load", hndLoad);
    var clrWhite = ƒ.Color.CSS("white");
    var viewport;
    var spriteNode;
    function hndLoad(_event) {
        return __awaiter(this, void 0, void 0, function () {
            var root, imgSpriteSheet, coat, animation, cmpCamera, canvas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        root = new ƒ.Node("root");
                        imgSpriteSheet = new ƒ.TextureImage();
                        return [4 /*yield*/, imgSpriteSheet.load("./Images/CharacterSheet/MarioSpriteSheet.png")];
                    case 1:
                        _a.sent();
                        coat = new ƒ.CoatTextured(undefined, imgSpriteSheet);
                        animation = new ƒAid.SpriteSheetAnimation("Bounce", coat);
                        animation.generateByGrid(ƒ.Rectangle.GET(1, 0, 17, 60), 8, 22, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(20));
                        spriteNode = new ƒAid.NodeSprite("Sprite");
                        spriteNode.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
                        spriteNode.setAnimation(animation);
                        spriteNode.setFrameDirection(1);
                        spriteNode.mtxLocal.translateY(-1);
                        spriteNode.framerate = parseInt(document.querySelector("[name=fps]").value);
                        root.addChild(spriteNode);
                        cmpCamera = new ƒ.ComponentCamera();
                        cmpCamera.mtxPivot.translateZ(5);
                        cmpCamera.mtxPivot.rotateY(180);
                        canvas = document.querySelector("canvas");
                        viewport = new ƒ.Viewport();
                        viewport.initialize("Viewport", root, cmpCamera, canvas);
                        viewport.camera.clrBackground = ƒ.Color.CSS("White");
                        viewport.draw();
                        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, hndLoop);
                        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 10);
                        document.forms[0].addEventListener("change", handleChange);
                        return [2 /*return*/];
                }
            });
        });
    }
    function hndLoop(_event) {
        var avg = document.querySelector("[name=currentframe]");
        avg.value = spriteNode.getCurrentFrame.toString();
        viewport.draw();
    }
    function handleChange(_event) {
        var value = parseInt(_event.target.value);
        spriteNode.framerate = value;
        console.log("framerate set to: " + value);
    }
})(Player || (Player = {}));
