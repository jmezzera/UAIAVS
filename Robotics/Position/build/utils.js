"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var delayPromise = function (time) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, time);
    });
};
exports.delayPromise = delayPromise;
//# sourceMappingURL=utils.js.map