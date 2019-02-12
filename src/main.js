"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addMutation(tree, name, mutation) {
    tree[name] = function (state, payload) { return mutation(state, payload.data); };
    return function (data) { return ({
        type: name,
        data: data,
    }); };
}
exports.addMutation = addMutation;
function addAction(tree, name, action) {
    tree[name] = function (context, payload) { return action(context, payload.data); };
    return function (data) { return ({
        type: name,
        data: data,
    }); };
}
exports.addAction = addAction;
