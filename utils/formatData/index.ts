type formatType = "number" | "string" | "array" | "boolean" | "object" | "tuple";

export interface formatInterface {
  /** 数据类型 */
  type: formatType;
  /** 属性对应的key值 */
  key?: string;
  /** 默认值 */
  default?: any;
  /** rule在type值为array,object,tuple 时生效  */
  rule?: formatInterface | Array<formatInterface>
}


/**
 * 格式化数据, 根据传入的格式化参数获取对应的数据
 * @param data    需要被格式化的数据
 * @param format  格式化规则
 */
export function formatData(data, format: formatInterface) {
  if (format === void 0 || format === null) throw new Error('请传入数据格式化规则');
  switch (format.type) {
    case "number":
      return formatNumber(data, format)
    case "string":
      return formatString(data, format)
    case "boolean":
      return formatBoolean(data, format);
    case "array":
      return formatArray(data, format);
    case "object":
      return formatObject(data, format);
    case "tuple":
      return formatTuple(data, format);
    default:
      throw new Error(`规则中包含未支持的类型:${format.type}`)
  }

}



function formatNumber(data, format) {
  // console.log(data, format);
  if (typeof data === "number") {
    if (Object.is(data, NaN)) return format.default;
    return data;
  }
  if (typeof data === "bigint") return data;
  if (typeof data === 'string') {
    const val = Number(data);
    if (Object.is(val, NaN)) return format.default;
    return val
  }
  return Object(format).hasOwnProperty('default') ? format.default : 0;
}

function formatString(data, format) {
  if (typeof data === "string") return data;
  if (typeof data === "number") {
    const val = Number(data);
    if (!Object.is(val, NaN)) return val + "";
  }
  if (typeof data === "bigint") return data + "";
  return Object(format).hasOwnProperty('default') ? format.default : "";
}

function formatArray(data, format) {
  if (!(data instanceof Array) || !Object(format).hasOwnProperty('rule')) {
    return Object(format).hasOwnProperty('default') ? format.default : [];
  }
  console.log(data, format)
  let arr = [];
  for (let i = data.length; i--;) {
    arr[i] = formatData(data[i], format.rule);
  }
  return arr
}

function formatBoolean(data, format) {
  if (data === void 0) {
    if (!Object(format).hasOwnProperty('default')) return false;
    return format.default;
  }
  return Boolean(data);
}

function formatObject(data, format) {
  const defExists = Object(format).hasOwnProperty('default');
  if (format.rule === void 0) {
    if(defExists) return format.default;
    return data;
  }
  if (!(format.rule instanceof Array)) throw new Error(`rule 错误,rule字段期待一个Array，但传入一个${typeof format.rule}`);
  if (!(data instanceof Object) && defExists) return format.default;
  const obj = {};
  const length = format.rule.length;
  for (let i = 0; i < length; i++) {
    const key = format.rule[i].key;
    obj[key] = formatData((data || {})[key], format.rule[i]);
    // console.log(data, key, format.rule[i]);
  }
  return obj
}

function formatTuple(data, format) {
  console.log(data, format);
  const defExists = Object(format).hasOwnProperty('default')
  // 没有rule字段
  if (!(format.rule instanceof Array)) {
    // 有默认值返回默认值
    if (defExists) return format.default;
    // 否则返回原始data的值
    return data;
  }
  let arr = [];
  for (let i = format.rule.length; i--;) {
    arr[i] = formatData(data[i], format.rule[i]);
  }
  return arr
}






