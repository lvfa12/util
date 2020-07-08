import { formatData } from '@util/formatData/index';


let a = {
  b: 10,
  c: 20,
  d: "ddd",
  e: [
    { id: 1, val: false },
    { id: 20, val: "0" },

  ],
  f: null,
  // {
  //   g: void 0,
  //   h: null,
  // },
  i: [1, "2", true]
}

const res = formatData(a, {
  type: 'object', default: {}, rule: [
    { key: "b", type: "number", default: 0 },
    { key: "c", type: "string", default: "10" },
    {
      key: "f",
      type: "object",
      rule: [
        { key: "h", type: "boolean", default: "" },
        { key: "g", type: "string" }
      ]
    },
    {
      key: "e", type: "array", default: [], rule: {
        type: 'object', default: {}, rule: [
          { key: "id", type: "number" },
          { key: "val", type: "boolean", default: false },
        ]
      }
    },
    {
      key: "i", type: "tuple", default: [], rule: [
        { type: "string" },
        { type: "number" },
        { type: "boolean" },
        { type: 'object' }
      ]
    }
  ]
});


console.log(JSON.stringify(res, null, 4));
