export default function cssClass(...c) {
  return c.join(" ");
}
function setLocalStorageArray(key, value) {
  let val = window.localStorage.getItem(key);
  if (val) {
    try {
      val = JSON.parse(val);
      window.localStorage.setItem(
        key,
        JSON.stringify(Array.from(new Set([...val, value.toLowerCase()])))
      );
    } catch {
      return Error("target  is not object");
    }
  } else {
    window.localStorage.setItem(key, `["${value.toLowerCase()}"]`);
  }
}

function findLocalStorageArray(key, value) {
  let val = window.localStorage.getItem(key);
  if (val) {
    try {
      val = JSON.parse(val);
      let reg = new RegExp(value, "i");

      return val.filter((i) => reg.test(i));
    } catch (r) {
      return Error("target  is not object", r);
    }
  } else {
    return Error("target  is not object");
  }
}
function DeleteLocalStorageArray(key, value) {
  let val = window.localStorage.getItem(key);
  if (val) {
    try {
      val = JSON.parse(val);
      return window.localStorage.setItem(
        key,
        val.filter((i) => !i.toLowerCase() === value.toLowerCase())
      );
    } catch (r) {
      return Error("target  is not object", r);
    }
  } else {
    return Error("target  is not object");
  }
}
export { setLocalStorageArray, findLocalStorageArray, DeleteLocalStorageArray };
