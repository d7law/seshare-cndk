const _ = require("lodash");

let a = [{ photo: [1, 2, 3] }, { photo: [4, 5, 6] }];
const r = _.countBy(a);
console.log(r);
