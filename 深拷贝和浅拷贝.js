/**
 * 浅拷贝（适用于对象和数组）
 * @param {Object|Array} source - 需要拷贝的源数据
 * @returns {Object} 拷贝结果，包含状态、消息和数据
 *   - status: boolean 拷贝是否成功
 *   - msg: string 提示信息
 *   - data: * 拷贝后的数据（成功时）或原数据（失败时）
 */
function shallowCopy(source) {
  // 修复类型判断：typeof null 为 'object'，需优先判断
  if (source === null || typeof source !== "object") {
    return {
      status: false,
      msg: "浅拷贝失败：源数据必须是对象或数组",
      data: source,
    };
  }

  // 初始化目标容器（支持数组、普通对象）
  const target = Array.isArray(source) ? [] : {};

  // 拷贝自身可枚举属性（兼容原型链安全判断）
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }

  return {
    status: true,
    msg: "浅拷贝成功",
    data: target,
  };
}

/**
 * 深拷贝（处理对象、数组、基本类型、特殊引用类型，兼容循环引用）
 * @param {*} source - 需要拷贝的数据源
 * @param {WeakMap} [map=new WeakMap()] - 用于处理循环引用的缓存
 * @returns {Object} 拷贝结果，包含状态、消息和数据
 */
function deepCopy(source, map = new WeakMap()) {
  // 基本类型直接返回（不视为失败，因为基本类型本身无需拷贝）
  if (source === null || typeof source !== "object") {
    return {
      status: true,
      msg: "基本类型无需拷贝",
      data: source,
    };
  }

  // 处理日期对象
  if (source instanceof Date) {
    return {
      status: true,
      msg: "深拷贝成功（日期类型）",
      data: new Date(source),
    };
  }

  // 处理正则对象
  if (source instanceof RegExp) {
    const newReg = new RegExp(source.source, source.flags);
    // 拷贝lastIndex（正则exec匹配时的状态）
    newReg.lastIndex = source.lastIndex;
    return {
      status: true,
      msg: "深拷贝成功（正则类型）",
      data: newReg,
    };
  }

  // 处理Set对象
  if (source instanceof Set) {
    const target = new Set();
    map.set(source, target); // 缓存防止循环引用
    source.forEach((value) => {
      // 递归拷贝Set中的元素
      const copyResult = deepCopy(value, map);
      target.add(copyResult.data);
    });
    return {
      status: true,
      msg: "深拷贝成功（Set类型）",
      data: target,
    };
  }

  // 处理Map对象
  if (source instanceof Map) {
    const target = new Map();
    map.set(source, target); // 缓存防止循环引用
    source.forEach((value, key) => {
      // 递归拷贝Map的键和值
      const keyResult = deepCopy(key, map);
      const valueResult = deepCopy(value, map);
      target.set(keyResult.data, valueResult.data);
    });
    return {
      status: true,
      msg: "深拷贝成功（Map类型）",
      data: target,
    };
  }

  // 处理循环引用（已拷贝过则直接返回缓存）
  if (map.has(source)) {
    return {
      status: true,
      msg: "深拷贝成功（循环引用）",
      data: map.get(source),
    };
  }

  // 初始化数组/对象容器
  const target = Array.isArray(source) ? [] : {};
  map.set(source, target); // 缓存当前映射，防止循环引用

  // 拷贝所有自身属性（包括不可枚举和Symbol）
  Reflect.ownKeys(source).forEach((key) => {
    const copyResult = deepCopy(source[key], map);
    target[key] = copyResult.data;
  });

  return {
    status: true,
    msg: "深拷贝成功（对象/数组）",
    data: target,
  };
}
