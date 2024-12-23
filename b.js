/*
 * @Author: 佚心
 * @Date: 2024-03-02 20:43:28
 * @Description: 
 */
// b.js
console.log('b starting');
exports.done = false;
const a = require('./a.js');
console.log('in b, a.done = %j', a.done);
exports.done = true;
console.log('b done');