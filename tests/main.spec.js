"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var main_1 = require("../src/main");
jest.resetModules();
describe('addMutations', function () {
    it('should work', function () {
        var state = { count: 0 };
        var mutations = {};
        var itShouldWork = main_1.addMutation(mutations, 'IT_SHOULD_WORK', function (state, num) {
            state.count = num;
        });
        var payload = itShouldWork(222);
        expect(payload).toEqual({
            type: 'IT_SHOULD_WORK',
            data: 222,
        });
        mutations['IT_SHOULD_WORK'](state, payload);
        expect(state.count).toBe(222);
    });
});
describe('addActions', function () {
    it('should work', function () {
        var _n = 0;
        var context = {};
        var actions = {};
        var itShouldWork = main_1.addAction(actions, 'IT_SHOULD_WORK', function (context, num) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                _n = num;
                return [2 /*return*/];
            });
        }); });
        var payload = itShouldWork(222222);
        expect(payload).toEqual({
            type: 'IT_SHOULD_WORK',
            data: 222222,
        });
        actions['IT_SHOULD_WORK'](context, payload);
        expect(_n).toBe(222222);
    });
});
