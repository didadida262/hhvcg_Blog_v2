/*
 * @Author: 佚心
 * @Date: 2024-03-02 20:43:23
 * @Description: 
 */
// a.js
console.log("a starting");
exports.done = false;
const b = require("./b.js");

console.log("in a, b.done = %j", b.done);
exports.done = true;
console.log("a done");

// https://didadida262.github.io/2024/10/16/canvas%E7%A6%BB%E5%B1%8F%E6%B8%B2%E6%9F%93%E8%AF%A6%E8%A7%A3/
// https://hhvcg-blog.vercel.app/2024/10/16/canvas%E7%A6%BB%E5%B1%8F%E6%B8%B2%E6%9F%93%E8%AF%A6%E8%A7%A3/
