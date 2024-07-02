var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { darkTheme, useThemeVars, NButton, NText, useMessage } from "naive-ui";
import { Injectable, Subject, RootComponentRef, Renderer, sampleTime, fromEvent, debounceTime, Controller as Controller$1, makeError, Selection, Keyboard, QueryStateType, Query, Commander, History, Slot, ContentType, Registry, take, delay, defineComponent as defineComponent$1, useContext, useState, useRef, onContextMenu, Subscription, VElement, distinctUntilChanged, onViewChecked, useSelf, useSlots, onContentInsert, onBreak, onSlotRemove, onViewInit, onDestroy, onCompositionStart, jsx, onFocus, onBlur, jsxs, useDynamicShortcut, onPaste, RenderMode, onContentDeleted, triggerContextMenu, auditTime as auditTime$1, Event, invokeListener, DeltaLite } from "@textbus/core";
import { Layout, I18n, boldFormatter, italicFormatter, strikeThroughFormatter, underlineFormatter, listComponent, paragraphComponent as paragraphComponent$1, tableComponent, linkFormatter, blockComponent, todolistComponent, headingComponent, superscriptFormatter, subscriptFormatter, dirFormatter, blockquoteComponent, codeFormatter, fontSizeFormatter, textIndentFormatter, textAlignFormatter, fontFamilyFormatter, lineHeightFormatter, useDragResize, FileUploader, Dialog, Form, FormTextField, FormRadio, createCodeSlot as createCodeSlot$1, letterSpacingFormatter, Matcher, inlineTags, imageComponent, createCell, audioComponent, Editor, Message } from "@textbus/editor";
import { createElement, isMac, createTextNode, VIEW_DOCUMENT, EDITOR_OPTIONS, VIEW_CONTAINER, Input, SelectionBridge, Parser } from "@textbus/platform-browser";
import { merge, auditTime, Subscription as Subscription$1, fromEvent as fromEvent$1, Subject as Subject$1 } from "@tanbo/stream";
import _ from "lodash";
import * as UUID from "uuid";
import { languages, tokenize, Token } from "prismjs";
import classNames from "classnames";
import axios from "axios";
import anime from "animejs";
import dayjs from "dayjs";
import { useDraggable } from "@vueuse/core";
/**
* @vue/shared v3.4.26
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function makeMap(str, expectsLowerCase) {
  const set2 = new Set(str.split(","));
  return (val) => set2.has(val);
}
const EMPTY_OBJ = !!(process.env.NODE_ENV !== "production") ? Object.freeze({}) : {};
const EMPTY_ARR = !!(process.env.NODE_ENV !== "production") ? Object.freeze([]) : [];
const NOOP = () => {
};
const NO = () => false;
const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
(key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const isBuiltInDirective = /* @__PURE__ */ makeMap(
  "bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_2, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
const capitalize = cacheStringFunction((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});
const toHandlerKey = cacheStringFunction((str) => {
  const s = str ? `on${capitalize(str)}` : ``;
  return s;
});
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value, writable = false) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    writable,
    value
  });
};
const looseToNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value) || isObject(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const HTML_TAGS = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,hgroup,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot";
const SVG_TAGS = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view";
const MATH_TAGS = "annotation,annotation-xml,maction,maligngroup,malignmark,math,menclose,merror,mfenced,mfrac,mfraction,mglyph,mi,mlabeledtr,mlongdiv,mmultiscripts,mn,mo,mover,mpadded,mphantom,mprescripts,mroot,mrow,ms,mscarries,mscarry,msgroup,msline,mspace,msqrt,msrow,mstack,mstyle,msub,msubsup,msup,mtable,mtd,mtext,mtr,munder,munderover,none,semantics";
const isHTMLTag = /* @__PURE__ */ makeMap(HTML_TAGS);
const isSVGTag = /* @__PURE__ */ makeMap(SVG_TAGS);
const isMathMLTag = /* @__PURE__ */ makeMap(MATH_TAGS);
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce(
        (entries, [key, val2], i) => {
          entries[stringifySymbol(key, i) + " =>"] = val2;
          return entries;
        },
        {}
      )
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
    };
  } else if (isSymbol(val)) {
    return stringifySymbol(val);
  } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const stringifySymbol = (v, i = "") => {
  var _a;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v
  );
};
/**
* @vue/reactivity v3.4.26
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function warn$2(msg, ...args) {
  console.warn(`[Vue warn] ${msg}`, ...args);
}
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.detached = detached;
    this._active = true;
    this.effects = [];
    this.cleanups = [];
    this.parent = activeEffectScope;
    if (!detached && activeEffectScope) {
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
        this
      ) - 1;
    }
  }
  get active() {
    return this._active;
  }
  run(fn) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    } else if (!!(process.env.NODE_ENV !== "production")) {
      warn$2(`cannot run an inactive effect scope.`);
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    activeEffectScope = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this._active) {
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
      this._active = false;
    }
  }
}
function recordEffectScope(effect, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect);
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
let activeEffect;
class ReactiveEffect {
  constructor(fn, trigger2, scheduler, scope) {
    this.fn = fn;
    this.trigger = trigger2;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this._dirtyLevel = 4;
    this._trackId = 0;
    this._runnings = 0;
    this._shouldSchedule = false;
    this._depsLength = 0;
    recordEffectScope(this, scope);
  }
  get dirty() {
    if (this._dirtyLevel === 2 || this._dirtyLevel === 3) {
      this._dirtyLevel = 1;
      pauseTracking();
      for (let i = 0; i < this._depsLength; i++) {
        const dep = this.deps[i];
        if (dep.computed) {
          triggerComputed(dep.computed);
          if (this._dirtyLevel >= 4) {
            break;
          }
        }
      }
      if (this._dirtyLevel === 1) {
        this._dirtyLevel = 0;
      }
      resetTracking();
    }
    return this._dirtyLevel >= 4;
  }
  set dirty(v) {
    this._dirtyLevel = v ? 4 : 0;
  }
  run() {
    this._dirtyLevel = 0;
    if (!this.active) {
      return this.fn();
    }
    let lastShouldTrack = shouldTrack;
    let lastEffect = activeEffect;
    try {
      shouldTrack = true;
      activeEffect = this;
      this._runnings++;
      preCleanupEffect(this);
      return this.fn();
    } finally {
      postCleanupEffect(this);
      this._runnings--;
      activeEffect = lastEffect;
      shouldTrack = lastShouldTrack;
    }
  }
  stop() {
    if (this.active) {
      preCleanupEffect(this);
      postCleanupEffect(this);
      this.onStop && this.onStop();
      this.active = false;
    }
  }
}
function triggerComputed(computed2) {
  return computed2.value;
}
function preCleanupEffect(effect2) {
  effect2._trackId++;
  effect2._depsLength = 0;
}
function postCleanupEffect(effect2) {
  if (effect2.deps.length > effect2._depsLength) {
    for (let i = effect2._depsLength; i < effect2.deps.length; i++) {
      cleanupDepEffect(effect2.deps[i], effect2);
    }
    effect2.deps.length = effect2._depsLength;
  }
}
function cleanupDepEffect(dep, effect2) {
  const trackId = dep.get(effect2);
  if (trackId !== void 0 && effect2._trackId !== trackId) {
    dep.delete(effect2);
    if (dep.size === 0) {
      dep.cleanup();
    }
  }
}
let shouldTrack = true;
let pauseScheduleStack = 0;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function pauseScheduling() {
  pauseScheduleStack++;
}
function resetScheduling() {
  pauseScheduleStack--;
  while (!pauseScheduleStack && queueEffectSchedulers.length) {
    queueEffectSchedulers.shift()();
  }
}
function trackEffect(effect2, dep, debuggerEventExtraInfo) {
  var _a;
  if (dep.get(effect2) !== effect2._trackId) {
    dep.set(effect2, effect2._trackId);
    const oldDep = effect2.deps[effect2._depsLength];
    if (oldDep !== dep) {
      if (oldDep) {
        cleanupDepEffect(oldDep, effect2);
      }
      effect2.deps[effect2._depsLength++] = dep;
    } else {
      effect2._depsLength++;
    }
    if (!!(process.env.NODE_ENV !== "production")) {
      (_a = effect2.onTrack) == null ? void 0 : _a.call(effect2, extend({ effect: effect2 }, debuggerEventExtraInfo));
    }
  }
}
const queueEffectSchedulers = [];
function triggerEffects(dep, dirtyLevel, debuggerEventExtraInfo) {
  var _a;
  pauseScheduling();
  for (const effect2 of dep.keys()) {
    let tracking;
    if (effect2._dirtyLevel < dirtyLevel && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
      effect2._shouldSchedule || (effect2._shouldSchedule = effect2._dirtyLevel === 0);
      effect2._dirtyLevel = dirtyLevel;
    }
    if (effect2._shouldSchedule && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
      if (!!(process.env.NODE_ENV !== "production")) {
        (_a = effect2.onTrigger) == null ? void 0 : _a.call(effect2, extend({ effect: effect2 }, debuggerEventExtraInfo));
      }
      effect2.trigger();
      if ((!effect2._runnings || effect2.allowRecurse) && effect2._dirtyLevel !== 2) {
        effect2._shouldSchedule = false;
        if (effect2.scheduler) {
          queueEffectSchedulers.push(effect2.scheduler);
        }
      }
    }
  }
  resetScheduling();
}
const createDep = (cleanup, computed2) => {
  const dep = /* @__PURE__ */ new Map();
  dep.cleanup = cleanup;
  dep.computed = computed2;
  return dep;
};
const targetMap = /* @__PURE__ */ new WeakMap();
const ITERATE_KEY = Symbol(!!(process.env.NODE_ENV !== "production") ? "iterate" : "");
const MAP_KEY_ITERATE_KEY = Symbol(!!(process.env.NODE_ENV !== "production") ? "Map key iterate" : "");
function track(target, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep(() => depsMap.delete(key)));
    }
    trackEffect(
      activeEffect,
      dep,
      !!(process.env.NODE_ENV !== "production") ? {
        target,
        type,
        key
      } : void 0
    );
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray(target)) {
    const newLength = Number(newValue);
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || !isSymbol(key2) && key2 >= newLength) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  pauseScheduling();
  for (const dep of deps) {
    if (dep) {
      triggerEffects(
        dep,
        4,
        !!(process.env.NODE_ENV !== "production") ? {
          target,
          type,
          key,
          newValue,
          oldValue,
          oldTarget
        } : void 0
      );
    }
  }
  resetScheduling();
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      pauseScheduling();
      const res = toRaw(this)[key].apply(this, args);
      resetScheduling();
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function hasOwnProperty(key) {
  if (!isSymbol(key))
    key = String(key);
  const obj = toRaw(this);
  track(obj, "has", key);
  return obj.hasOwnProperty(key);
}
class BaseReactiveHandler {
  constructor(_isReadonly = false, _isShallow = false) {
    this._isReadonly = _isReadonly;
    this._isShallow = _isShallow;
  }
  get(target, key, receiver) {
    const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return isShallow2;
    } else if (key === "__v_raw") {
      if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
      // this means the reciever is a user proxy of the reactive proxy
      Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
        return target;
      }
      return;
    }
    const targetIsArray = isArray(target);
    if (!isReadonly2) {
      if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }
      if (key === "hasOwnProperty") {
        return hasOwnProperty;
      }
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (isShallow2) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  }
}
class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(false, isShallow2);
  }
  set(target, key, value, receiver) {
    let oldValue = target[key];
    if (!this._isShallow) {
      const isOldValueReadonly = isReadonly(oldValue);
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        if (isOldValueReadonly) {
          return false;
        } else {
          oldValue.value = value;
          return true;
        }
      }
    }
    const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value, oldValue);
      }
    }
    return result;
  }
  deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    const oldValue = target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
      trigger(target, "delete", key, void 0, oldValue);
    }
    return result;
  }
  has(target, key) {
    const result = Reflect.has(target, key);
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, "has", key);
    }
    return result;
  }
  ownKeys(target) {
    track(
      target,
      "iterate",
      isArray(target) ? "length" : ITERATE_KEY
    );
    return Reflect.ownKeys(target);
  }
}
class ReadonlyReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(true, isShallow2);
  }
  set(target, key) {
    if (!!(process.env.NODE_ENV !== "production")) {
      warn$2(
        `Set operation on key "${String(key)}" failed: target is readonly.`,
        target
      );
    }
    return true;
  }
  deleteProperty(target, key) {
    if (!!(process.env.NODE_ENV !== "production")) {
      warn$2(
        `Delete operation on key "${String(key)}" failed: target is readonly.`,
        target
      );
    }
    return true;
  }
}
const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(
  true
);
const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get(target, key, isReadonly2 = false, isShallow2 = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (hasChanged(key, rawKey)) {
      track(rawTarget, "get", key);
    }
    track(rawTarget, "get", rawKey);
  }
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has(key, isReadonly2 = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (hasChanged(key, rawKey)) {
      track(rawTarget, "has", key);
    }
    track(rawTarget, "has", rawKey);
  }
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly2 = false) {
  target = target["__v_raw"];
  !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else if (!!(process.env.NODE_ENV !== "production")) {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get2.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key, value, oldValue);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else if (!!(process.env.NODE_ENV !== "production")) {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get2 ? get2.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0, oldValue);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const oldTarget = !!(process.env.NODE_ENV !== "production") ? isMap(target) ? new Map(target) : new Set(target) : void 0;
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0, oldTarget);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach2(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(
      rawTarget,
      "iterate",
      isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
    );
    return {
      // iterator protocol
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    if (!!(process.env.NODE_ENV !== "production")) {
      const key = args[0] ? `on key "${args[0]}" ` : ``;
      warn$2(
        `${capitalize(type)} operation ${key}failed: target is readonly.`,
        toRaw(this)
      );
    }
    return type === "delete" ? false : type === "clear" ? void 0 : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get(this, key);
    },
    get size() {
      return size(this);
    },
    has,
    add,
    set,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has,
    add,
    set,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
    shallowInstrumentations2[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations2[method] = createIterableMethod(
      method,
      true,
      true
    );
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [
  mutableInstrumentations,
  readonlyInstrumentations,
  shallowInstrumentations,
  shallowReadonlyInstrumentations
] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(
      hasOwn(instrumentations, key) && key in target ? instrumentations : target,
      key,
      receiver
    );
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const shallowReadonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, true)
};
function checkIdentityKeys(target, has2, key) {
  const rawKey = toRaw(key);
  if (rawKey !== key && has2.call(target, rawKey)) {
    const type = toRawType(target);
    warn$2(
      `Reactive ${type} contains both the raw and reactive versions of the same object${type === `Map` ? ` as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  );
}
function shallowReactive(target) {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  );
}
function readonly(target) {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  );
}
function shallowReadonly(target) {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap
  );
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target)) {
    if (!!(process.env.NODE_ENV !== "production")) {
      warn$2(`value cannot be made reactive: ${String(target)}`);
    }
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(
    target,
    targetType === 2 ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return value ? !!value["__v_raw"] : false;
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  if (Object.isExtensible(value)) {
    def(value, "__v_skip", true);
  }
  return value;
}
const toReactive = (value) => isObject(value) ? reactive(value) : value;
const toReadonly = (value) => isObject(value) ? readonly(value) : value;
const COMPUTED_SIDE_EFFECT_WARN = `Computed is still dirty after getter evaluation, likely because a computed is mutating its own dependency in its getter. State mutations in computed getters should be avoided.  Check the docs for more details: https://vuejs.org/guide/essentials/computed.html#getters-should-be-side-effect-free`;
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this.getter = getter;
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this["__v_isReadonly"] = false;
    this.effect = new ReactiveEffect(
      () => getter(this._value),
      () => triggerRefValue(
        this,
        this.effect._dirtyLevel === 2 ? 2 : 3
      )
    );
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self2 = toRaw(this);
    if ((!self2._cacheable || self2.effect.dirty) && hasChanged(self2._value, self2._value = self2.effect.run())) {
      triggerRefValue(self2, 4);
    }
    trackRefValue(self2);
    if (self2.effect._dirtyLevel >= 2) {
      if (!!(process.env.NODE_ENV !== "production") && this._warnRecursive) {
        warn$2(COMPUTED_SIDE_EFFECT_WARN, `

getter: `, this.getter);
      }
      triggerRefValue(self2, 2);
    }
    return self2._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
  // #region polyfill _dirty for backward compatibility third party code for Vue <= 3.3.x
  get _dirty() {
    return this.effect.dirty;
  }
  set _dirty(v) {
    this.effect.dirty = v;
  }
  // #endregion
}
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = !!(process.env.NODE_ENV !== "production") ? () => {
      warn$2("Write operation failed: computed value is readonly");
    } : NOOP;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  if (!!(process.env.NODE_ENV !== "production") && debugOptions && !isSSR) {
    cRef.effect.onTrack = debugOptions.onTrack;
    cRef.effect.onTrigger = debugOptions.onTrigger;
  }
  return cRef;
}
function trackRefValue(ref2) {
  var _a;
  if (shouldTrack && activeEffect) {
    ref2 = toRaw(ref2);
    trackEffect(
      activeEffect,
      (_a = ref2.dep) != null ? _a : ref2.dep = createDep(
        () => ref2.dep = void 0,
        ref2 instanceof ComputedRefImpl ? ref2 : void 0
      ),
      !!(process.env.NODE_ENV !== "production") ? {
        target: ref2,
        type: "get",
        key: "value"
      } : void 0
    );
  }
}
function triggerRefValue(ref2, dirtyLevel = 4, newVal) {
  ref2 = toRaw(ref2);
  const dep = ref2.dep;
  if (dep) {
    triggerEffects(
      dep,
      dirtyLevel,
      !!(process.env.NODE_ENV !== "production") ? {
        target: ref2,
        type: "set",
        key: "value",
        newValue: newVal
      } : void 0
    );
  }
}
function isRef(r) {
  return !!(r && r.__v_isRef === true);
}
function ref(value) {
  return createRef(value, false);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
    newVal = useDirectValue ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = useDirectValue ? newVal : toReactive(newVal);
      triggerRefValue(this, 4, newVal);
    }
  }
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
/**
* @vue/runtime-core v3.4.26
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const stack = [];
function pushWarningContext(vnode) {
  stack.push(vnode);
}
function popWarningContext() {
  stack.pop();
}
function warn$1(msg, ...args) {
  pauseTracking();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();
  if (appWarnHandler) {
    callWithErrorHandling(
      appWarnHandler,
      instance,
      11,
      [
        msg + args.map((a) => {
          var _a, _b;
          return (_b = (_a = a.toString) == null ? void 0 : _a.call(a)) != null ? _b : JSON.stringify(a);
        }).join(""),
        instance && instance.proxy,
        trace.map(
          ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
        ).join("\n"),
        trace
      ]
    );
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    if (trace.length && // avoid spamming console during tests
    true) {
      warnArgs.push(`
`, ...formatTrace(trace));
    }
    console.warn(...warnArgs);
  }
  resetTracking();
}
function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];
  if (!currentVNode) {
    return [];
  }
  const normalizedStack = [];
  while (currentVNode) {
    const last = normalizedStack[0];
    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }
    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }
  return normalizedStack;
}
function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i) => {
    logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
  });
  return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(
    vnode.component,
    vnode.type,
    isRoot
  )}`;
  const close = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
}
function formatProps(props) {
  const res = [];
  const keys = Object.keys(props);
  keys.slice(0, 3).forEach((key) => {
    res.push(...formatProp(key, props[key]));
  });
  if (keys.length > 3) {
    res.push(` ...`);
  }
  return res;
}
function formatProp(key, value, raw) {
  if (isString(value)) {
    value = JSON.stringify(value);
    return raw ? value : [`${key}=${value}`];
  } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return raw ? value : [`${key}=${value}`];
  } else if (isRef(value)) {
    value = formatProp(key, toRaw(value.value), true);
    return raw ? value : [`${key}=Ref<`, value, `>`];
  } else if (isFunction(value)) {
    return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
  } else {
    value = toRaw(value);
    return raw ? value : [`${key}=`, value];
  }
}
const ErrorTypeStrings$1 = {
  ["sp"]: "serverPrefetch hook",
  ["bc"]: "beforeCreate hook",
  ["c"]: "created hook",
  ["bm"]: "beforeMount hook",
  ["m"]: "mounted hook",
  ["bu"]: "beforeUpdate hook",
  ["u"]: "updated",
  ["bum"]: "beforeUnmount hook",
  ["um"]: "unmounted hook",
  ["a"]: "activated hook",
  ["da"]: "deactivated hook",
  ["ec"]: "errorCaptured hook",
  ["rtc"]: "renderTracked hook",
  ["rtg"]: "renderTriggered hook",
  [0]: "setup function",
  [1]: "render function",
  [2]: "watcher getter",
  [3]: "watcher callback",
  [4]: "watcher cleanup function",
  [5]: "native event handler",
  [6]: "component event handler",
  [7]: "vnode hook",
  [8]: "directive hook",
  [9]: "transition hook",
  [10]: "app errorHandler",
  [11]: "app warnHandler",
  [12]: "ref function",
  [13]: "async component loader",
  [14]: "scheduler flush. This is likely a Vue internals bug. Please open an issue at https://github.com/vuejs/core ."
};
function callWithErrorHandling(fn, instance, type, args) {
  try {
    return args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  if (isArray(fn)) {
    const values = [];
    for (let i = 0; i < fn.length; i++) {
      values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
    }
    return values;
  } else if (!!(process.env.NODE_ENV !== "production")) {
    warn$1(
      `Invalid value type passed to callWithAsyncErrorHandling(): ${typeof fn}`
    );
  }
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = !!(process.env.NODE_ENV !== "production") ? ErrorTypeStrings$1[type] : `https://vuejs.org/error-reference/#runtime-${type}`;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      pauseTracking();
      callWithErrorHandling(
        appErrorHandler,
        null,
        10,
        [err, exposedInstance, errorInfo]
      );
      resetTracking();
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev);
}
function logError(err, type, contextVNode, throwInDev = true) {
  if (!!(process.env.NODE_ENV !== "production")) {
    const info = ErrorTypeStrings$1[type];
    if (contextVNode) {
      pushWarningContext(contextVNode);
    }
    warn$1(`Unhandled error${info ? ` during execution of ${info}` : ``}`);
    if (contextVNode) {
      popWarningContext();
    }
    if (throwInDev) {
      throw err;
    } else {
      console.error(err);
    }
  } else {
    console.error(err);
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue = [];
let flushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
const RECURSION_LIMIT = 100;
function nextTick(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id) {
  let start = flushIndex + 1;
  let end = queue.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJob = queue[middle];
    const middleJobId = getId(middleJob);
    if (middleJobId < id || middleJobId === id && middleJob.pre) {
      start = middle + 1;
    } else {
      end = middle;
    }
  }
  return start;
}
function queueJob(job) {
  if (!queue.length || !queue.includes(
    job,
    isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
  )) {
    if (job.id == null) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function invalidateJob(job) {
  const i = queue.indexOf(job);
  if (i > flushIndex) {
    queue.splice(i, 1);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray(cb)) {
    if (!activePostFlushCbs || !activePostFlushCbs.includes(
      cb,
      cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex
    )) {
      pendingPostFlushCbs.push(cb);
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(instance, seen, i = isFlushing ? flushIndex + 1 : 0) {
  if (!!(process.env.NODE_ENV !== "production")) {
    seen = seen || /* @__PURE__ */ new Map();
  }
  for (; i < queue.length; i++) {
    const cb = queue[i];
    if (cb && cb.pre) {
      if (instance && cb.id !== instance.uid) {
        continue;
      }
      if (!!(process.env.NODE_ENV !== "production") && checkRecursiveUpdates(seen, cb)) {
        continue;
      }
      queue.splice(i, 1);
      i--;
      cb();
    }
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)].sort(
      (a, b) => getId(a) - getId(b)
    );
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    if (!!(process.env.NODE_ENV !== "production")) {
      seen = seen || /* @__PURE__ */ new Map();
    }
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      if (!!(process.env.NODE_ENV !== "production") && checkRecursiveUpdates(seen, activePostFlushCbs[postFlushIndex])) {
        continue;
      }
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
const comparator = (a, b) => {
  const diff = getId(a) - getId(b);
  if (diff === 0) {
    if (a.pre && !b.pre)
      return -1;
    if (b.pre && !a.pre)
      return 1;
  }
  return diff;
};
function flushJobs(seen) {
  isFlushPending = false;
  isFlushing = true;
  if (!!(process.env.NODE_ENV !== "production")) {
    seen = seen || /* @__PURE__ */ new Map();
  }
  queue.sort(comparator);
  const check = !!(process.env.NODE_ENV !== "production") ? (job) => checkRecursiveUpdates(seen, job) : NOOP;
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && job.active !== false) {
        if (!!(process.env.NODE_ENV !== "production") && check(job)) {
          continue;
        }
        callWithErrorHandling(job, null, 14);
      }
    }
  } finally {
    flushIndex = 0;
    queue.length = 0;
    flushPostFlushCbs(seen);
    isFlushing = false;
    currentFlushPromise = null;
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs(seen);
    }
  }
}
function checkRecursiveUpdates(seen, fn) {
  if (!seen.has(fn)) {
    seen.set(fn, 1);
  } else {
    const count = seen.get(fn);
    if (count > RECURSION_LIMIT) {
      const instance = fn.ownerInstance;
      const componentName = instance && getComponentName(instance.type);
      handleError(
        `Maximum recursive updates exceeded${componentName ? ` in component <${componentName}>` : ``}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`,
        null,
        10
      );
      return true;
    } else {
      seen.set(fn, count + 1);
    }
  }
}
let isHmrUpdating = false;
const hmrDirtyComponents = /* @__PURE__ */ new Set();
if (!!(process.env.NODE_ENV !== "production")) {
  getGlobalThis().__VUE_HMR_RUNTIME__ = {
    createRecord: tryWrap(createRecord),
    rerender: tryWrap(rerender),
    reload: tryWrap(reload)
  };
}
const map = /* @__PURE__ */ new Map();
function registerHMR(instance) {
  const id = instance.type.__hmrId;
  let record = map.get(id);
  if (!record) {
    createRecord(id, instance.type);
    record = map.get(id);
  }
  record.instances.add(instance);
}
function unregisterHMR(instance) {
  map.get(instance.type.__hmrId).instances.delete(instance);
}
function createRecord(id, initialDef) {
  if (map.has(id)) {
    return false;
  }
  map.set(id, {
    initialDef: normalizeClassComponent(initialDef),
    instances: /* @__PURE__ */ new Set()
  });
  return true;
}
function normalizeClassComponent(component) {
  return isClassComponent(component) ? component.__vccOpts : component;
}
function rerender(id, newRender) {
  const record = map.get(id);
  if (!record) {
    return;
  }
  record.initialDef.render = newRender;
  [...record.instances].forEach((instance) => {
    if (newRender) {
      instance.render = newRender;
      normalizeClassComponent(instance.type).render = newRender;
    }
    instance.renderCache = [];
    isHmrUpdating = true;
    instance.effect.dirty = true;
    instance.update();
    isHmrUpdating = false;
  });
}
function reload(id, newComp) {
  const record = map.get(id);
  if (!record)
    return;
  newComp = normalizeClassComponent(newComp);
  updateComponentDef(record.initialDef, newComp);
  const instances = [...record.instances];
  for (const instance of instances) {
    const oldComp = normalizeClassComponent(instance.type);
    if (!hmrDirtyComponents.has(oldComp)) {
      if (oldComp !== record.initialDef) {
        updateComponentDef(oldComp, newComp);
      }
      hmrDirtyComponents.add(oldComp);
    }
    instance.appContext.propsCache.delete(instance.type);
    instance.appContext.emitsCache.delete(instance.type);
    instance.appContext.optionsCache.delete(instance.type);
    if (instance.ceReload) {
      hmrDirtyComponents.add(oldComp);
      instance.ceReload(newComp.styles);
      hmrDirtyComponents.delete(oldComp);
    } else if (instance.parent) {
      instance.parent.effect.dirty = true;
      queueJob(instance.parent.update);
    } else if (instance.appContext.reload) {
      instance.appContext.reload();
    } else if (typeof window !== "undefined") {
      window.location.reload();
    } else {
      console.warn(
        "[HMR] Root or manually mounted instance modified. Full reload required."
      );
    }
  }
  queuePostFlushCb(() => {
    for (const instance of instances) {
      hmrDirtyComponents.delete(
        normalizeClassComponent(instance.type)
      );
    }
  });
}
function updateComponentDef(oldComp, newComp) {
  extend(oldComp, newComp);
  for (const key in oldComp) {
    if (key !== "__file" && !(key in newComp)) {
      delete oldComp[key];
    }
  }
}
function tryWrap(fn) {
  return (id, arg) => {
    try {
      return fn(id, arg);
    } catch (e) {
      console.error(e);
      console.warn(
        `[HMR] Something went wrong during Vue component hot-reload. Full reload required.`
      );
    }
  };
}
let devtools$1;
let buffer = [];
let devtoolsNotInstalled = false;
function emit$1(event, ...args) {
  if (devtools$1) {
    devtools$1.emit(event, ...args);
  } else if (!devtoolsNotInstalled) {
    buffer.push({ event, args });
  }
}
function setDevtoolsHook$1(hook, target) {
  var _a, _b;
  devtools$1 = hook;
  if (devtools$1) {
    devtools$1.enabled = true;
    buffer.forEach(({ event, args }) => devtools$1.emit(event, ...args));
    buffer = [];
  } else if (
    // handle late devtools injection - only do this if we are in an actual
    // browser environment to avoid the timer handle stalling test runner exit
    // (#4815)
    typeof window !== "undefined" && // some envs mock window but not fully
    window.HTMLElement && // also exclude jsdom
    !((_b = (_a = window.navigator) == null ? void 0 : _a.userAgent) == null ? void 0 : _b.includes("jsdom"))
  ) {
    const replay = target.__VUE_DEVTOOLS_HOOK_REPLAY__ = target.__VUE_DEVTOOLS_HOOK_REPLAY__ || [];
    replay.push((newHook) => {
      setDevtoolsHook$1(newHook, target);
    });
    setTimeout(() => {
      if (!devtools$1) {
        target.__VUE_DEVTOOLS_HOOK_REPLAY__ = null;
        devtoolsNotInstalled = true;
        buffer = [];
      }
    }, 3e3);
  } else {
    devtoolsNotInstalled = true;
    buffer = [];
  }
}
function devtoolsInitApp(app, version2) {
  emit$1("app:init", app, version2, {
    Fragment,
    Text,
    Comment,
    Static
  });
}
function devtoolsUnmountApp(app) {
  emit$1("app:unmount", app);
}
const devtoolsComponentAdded = /* @__PURE__ */ createDevtoolsComponentHook(
  "component:added"
  /* COMPONENT_ADDED */
);
const devtoolsComponentUpdated = /* @__PURE__ */ createDevtoolsComponentHook(
  "component:updated"
  /* COMPONENT_UPDATED */
);
const _devtoolsComponentRemoved = /* @__PURE__ */ createDevtoolsComponentHook(
  "component:removed"
  /* COMPONENT_REMOVED */
);
const devtoolsComponentRemoved = (component) => {
  if (devtools$1 && typeof devtools$1.cleanupBuffer === "function" && // remove the component if it wasn't buffered
  !devtools$1.cleanupBuffer(component)) {
    _devtoolsComponentRemoved(component);
  }
};
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function createDevtoolsComponentHook(hook) {
  return (component) => {
    emit$1(
      hook,
      component.appContext.app,
      component.uid,
      component.parent ? component.parent.uid : void 0,
      component
    );
  };
}
const devtoolsPerfStart = /* @__PURE__ */ createDevtoolsPerformanceHook(
  "perf:start"
  /* PERFORMANCE_START */
);
const devtoolsPerfEnd = /* @__PURE__ */ createDevtoolsPerformanceHook(
  "perf:end"
  /* PERFORMANCE_END */
);
function createDevtoolsPerformanceHook(hook) {
  return (component, type, time) => {
    emit$1(hook, component.appContext.app, component.uid, component, type, time);
  };
}
function devtoolsComponentEmit(component, event, params) {
  emit$1(
    "component:emit",
    component.appContext.app,
    component,
    event,
    params
  );
}
function emit(instance, event, ...rawArgs) {
  if (instance.isUnmounted)
    return;
  const props = instance.vnode.props || EMPTY_OBJ;
  if (!!(process.env.NODE_ENV !== "production")) {
    const {
      emitsOptions,
      propsOptions: [propsOptions]
    } = instance;
    if (emitsOptions) {
      if (!(event in emitsOptions) && true) {
        if (!propsOptions || !(toHandlerKey(event) in propsOptions)) {
          warn$1(
            `Component emitted event "${event}" but it is neither declared in the emits option nor as an "${toHandlerKey(event)}" prop.`
          );
        }
      } else {
        const validator = emitsOptions[event];
        if (isFunction(validator)) {
          const isValid = validator(...rawArgs);
          if (!isValid) {
            warn$1(
              `Invalid event arguments: event validation failed for event "${event}".`
            );
          }
        }
      }
    }
  }
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modelArg = isModelListener2 && event.slice(7);
  if (modelArg && modelArg in props) {
    const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
    const { number, trim } = props[modifiersKey] || EMPTY_OBJ;
    if (trim) {
      args = rawArgs.map((a) => isString(a) ? a.trim() : a);
    }
    if (number) {
      args = rawArgs.map(looseToNumber);
    }
  }
  if (!!(process.env.NODE_ENV !== "production") || false) {
    devtoolsComponentEmit(instance, event, args);
  }
  if (!!(process.env.NODE_ENV !== "production")) {
    const lowerCaseEvent = event.toLowerCase();
    if (lowerCaseEvent !== event && props[toHandlerKey(lowerCaseEvent)]) {
      warn$1(
        `Event "${lowerCaseEvent}" is emitted in component ${formatComponentName(
          instance,
          instance.type
        )} but the handler is registered for "${event}". Note that HTML attributes are case-insensitive and you cannot use v-on to listen to camelCase events when using in-DOM templates. You should probably use "${hyphenate(
          event
        )}" instead of "${event}".`
      );
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
  props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(
      handler,
      instance,
      6,
      args
    );
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(
      onceHandler,
      instance,
      6,
      args
    );
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  if (isObject(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
function pushScopeId(id) {
  currentScopeId = id;
}
function popScopeId() {
  currentScopeId = null;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
  if (!ctx)
    return fn;
  if (fn._n) {
    return fn;
  }
  const renderFnWithContext = (...args) => {
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    let res;
    try {
      res = fn(...args);
    } finally {
      setCurrentRenderingInstance(prevInstance);
      if (renderFnWithContext._d) {
        setBlockTracking(1);
      }
    }
    if (!!(process.env.NODE_ENV !== "production") || false) {
      devtoolsComponentUpdated(ctx);
    }
    return res;
  };
  renderFnWithContext._n = true;
  renderFnWithContext._c = true;
  renderFnWithContext._d = true;
  return renderFnWithContext;
}
let accessedAttrs = false;
function markAttrsAccessed() {
  accessedAttrs = true;
}
function renderComponentRoot(instance) {
  const {
    type: Component,
    vnode,
    proxy,
    withProxy,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit: emit2,
    render,
    renderCache,
    props,
    data,
    setupState,
    ctx,
    inheritAttrs
  } = instance;
  const prev = setCurrentRenderingInstance(instance);
  let result;
  let fallthroughAttrs;
  if (!!(process.env.NODE_ENV !== "production")) {
    accessedAttrs = false;
  }
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      const thisProxy = !!(process.env.NODE_ENV !== "production") && setupState.__isScriptSetup ? new Proxy(proxyToUse, {
        get(target, key, receiver) {
          warn$1(
            `Property '${String(
              key
            )}' was accessed via 'this'. Avoid using 'this' in templates.`
          );
          return Reflect.get(target, key, receiver);
        }
      }) : proxyToUse;
      result = normalizeVNode(
        render.call(
          thisProxy,
          proxyToUse,
          renderCache,
          !!(process.env.NODE_ENV !== "production") ? shallowReadonly(props) : props,
          setupState,
          data,
          ctx
        )
      );
      fallthroughAttrs = attrs;
    } else {
      const render2 = Component;
      if (!!(process.env.NODE_ENV !== "production") && attrs === props) {
        markAttrsAccessed();
      }
      result = normalizeVNode(
        render2.length > 1 ? render2(
          !!(process.env.NODE_ENV !== "production") ? shallowReadonly(props) : props,
          !!(process.env.NODE_ENV !== "production") ? {
            get attrs() {
              markAttrsAccessed();
              return shallowReadonly(attrs);
            },
            slots,
            emit: emit2
          } : { attrs, slots, emit: emit2 }
        ) : render2(
          !!(process.env.NODE_ENV !== "production") ? shallowReadonly(props) : props,
          null
        )
      );
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(err, instance, 1);
    result = createVNode(Comment);
  }
  let root = result;
  let setRoot = void 0;
  if (!!(process.env.NODE_ENV !== "production") && result.patchFlag > 0 && result.patchFlag & 2048) {
    [root, setRoot] = getChildRoot(result);
  }
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs);
    const { shapeFlag } = root;
    if (keys.length) {
      if (shapeFlag & (1 | 6)) {
        if (propsOptions && keys.some(isModelListener)) {
          fallthroughAttrs = filterModelListeners(
            fallthroughAttrs,
            propsOptions
          );
        }
        root = cloneVNode(root, fallthroughAttrs, false, true);
      } else if (!!(process.env.NODE_ENV !== "production") && !accessedAttrs && root.type !== Comment) {
        const allAttrs = Object.keys(attrs);
        const eventAttrs = [];
        const extraAttrs = [];
        for (let i = 0, l = allAttrs.length; i < l; i++) {
          const key = allAttrs[i];
          if (isOn(key)) {
            if (!isModelListener(key)) {
              eventAttrs.push(key[2].toLowerCase() + key.slice(3));
            }
          } else {
            extraAttrs.push(key);
          }
        }
        if (extraAttrs.length) {
          warn$1(
            `Extraneous non-props attributes (${extraAttrs.join(", ")}) were passed to component but could not be automatically inherited because component renders fragment or text root nodes.`
          );
        }
        if (eventAttrs.length) {
          warn$1(
            `Extraneous non-emits event listeners (${eventAttrs.join(", ")}) were passed to component but could not be automatically inherited because component renders fragment or text root nodes. If the listener is intended to be a component custom event listener only, declare it using the "emits" option.`
          );
        }
      }
    }
  }
  if (vnode.dirs) {
    if (!!(process.env.NODE_ENV !== "production") && !isElementRoot(root)) {
      warn$1(
        `Runtime directive used on component with non-element root node. The directives will not function as intended.`
      );
    }
    root = cloneVNode(root, null, false, true);
    root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    if (!!(process.env.NODE_ENV !== "production") && !isElementRoot(root)) {
      warn$1(
        `Component inside <Transition> renders non-element root node that cannot be animated.`
      );
    }
    root.transition = vnode.transition;
  }
  if (!!(process.env.NODE_ENV !== "production") && setRoot) {
    setRoot(root);
  } else {
    result = root;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
const getChildRoot = (vnode) => {
  const rawChildren = vnode.children;
  const dynamicChildren = vnode.dynamicChildren;
  const childRoot = filterSingleRoot(rawChildren, false);
  if (!childRoot) {
    return [vnode, void 0];
  } else if (!!(process.env.NODE_ENV !== "production") && childRoot.patchFlag > 0 && childRoot.patchFlag & 2048) {
    return getChildRoot(childRoot);
  }
  const index = rawChildren.indexOf(childRoot);
  const dynamicIndex = dynamicChildren ? dynamicChildren.indexOf(childRoot) : -1;
  const setRoot = (updatedRoot) => {
    rawChildren[index] = updatedRoot;
    if (dynamicChildren) {
      if (dynamicIndex > -1) {
        dynamicChildren[dynamicIndex] = updatedRoot;
      } else if (updatedRoot.patchFlag > 0) {
        vnode.dynamicChildren = [...dynamicChildren, updatedRoot];
      }
    }
  };
  return [normalizeVNode(childRoot), setRoot];
};
function filterSingleRoot(children, recurse = true) {
  let singleRoot;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (isVNode(child)) {
      if (child.type !== Comment || child.children === "v-if") {
        if (singleRoot) {
          return;
        } else {
          singleRoot = child;
          if (!!(process.env.NODE_ENV !== "production") && recurse && singleRoot.patchFlag > 0 && singleRoot.patchFlag & 2048) {
            return filterSingleRoot(singleRoot.children);
          }
        }
      }
    } else {
      return;
    }
  }
  return singleRoot;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }
  return res;
};
const isElementRoot = (vnode) => {
  return vnode.shapeFlag & (6 | 1) || vnode.type === Comment;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const { props: prevProps, children: prevChildren, component } = prevVNode;
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
  const emits = component.emitsOptions;
  if (!!(process.env.NODE_ENV !== "production") && (prevChildren || nextChildren) && isHmrUpdating) {
    return true;
  }
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i];
        if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function updateHOCHostEl({ vnode, parent }, el) {
  while (parent) {
    const root = parent.subTree;
    if (root.suspense && root.suspense.activeBranch === vnode) {
      root.el = vnode.el;
    }
    if (root === vnode) {
      (vnode = parent.vnode).el = el;
      parent = parent.parent;
    } else {
      break;
    }
  }
}
const COMPONENTS = "components";
function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
const NULL_DYNAMIC_COMPONENT = Symbol.for("v-ndc");
function resolveDynamicComponent(component) {
  if (isString(component)) {
    return resolveAsset(COMPONENTS, component, false) || component;
  } else {
    return component || NULL_DYNAMIC_COMPONENT;
  }
}
function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    const Component = instance.type;
    {
      const selfName = getComponentName(
        Component,
        false
      );
      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
        return Component;
      }
    }
    const res = (
      // local registration
      // check instance[type] first which is resolved for options API
      resolve(instance[type] || Component[type], name) || // global registration
      resolve(instance.appContext[type], name)
    );
    if (!res && maybeSelfReference) {
      return Component;
    }
    if (!!(process.env.NODE_ENV !== "production") && warnMissing && !res) {
      const extra = `
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.`;
      warn$1(`Failed to resolve ${type.slice(0, -1)}: ${name}${extra}`);
    }
    return res;
  } else if (!!(process.env.NODE_ENV !== "production")) {
    warn$1(
      `resolve${capitalize(type.slice(0, -1))} can only be used in render() or setup().`
    );
  }
}
function resolve(registry, name) {
  return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
}
const isSuspense = (type) => type.__isSuspense;
function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
const ssrContextKey = Symbol.for("v-scx");
const useSSRContext = () => {
  {
    const ctx = inject(ssrContextKey);
    if (!ctx) {
      !!(process.env.NODE_ENV !== "production") && warn$1(
        `Server rendering context not provided. Make sure to only call useSSRContext() conditionally in the server build.`
      );
    }
    return ctx;
  }
};
function watchPostEffect(effect2, options) {
  return doWatch(
    effect2,
    null,
    !!(process.env.NODE_ENV !== "production") ? extend({}, options, { flush: "post" }) : { flush: "post" }
  );
}
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options) {
  if (!!(process.env.NODE_ENV !== "production") && !isFunction(cb)) {
    warn$1(
      `\`watch(fn, options?)\` signature has been moved to a separate API. Use \`watchEffect(fn, options?)\` instead. \`watch\` now only supports \`watch(source, cb, options?) signature.`
    );
  }
  return doWatch(source, cb, options);
}
function doWatch(source, cb, {
  immediate,
  deep,
  flush,
  once,
  onTrack,
  onTrigger
} = EMPTY_OBJ) {
  if (cb && once) {
    const _cb = cb;
    cb = (...args) => {
      _cb(...args);
      unwatch();
    };
  }
  if (!!(process.env.NODE_ENV !== "production") && deep !== void 0 && typeof deep === "number") {
    warn$1(
      `watch() "deep" option with number value will be used as watch depth in future versions. Please use a boolean instead to avoid potential breakage.`
    );
  }
  if (!!(process.env.NODE_ENV !== "production") && !cb) {
    if (immediate !== void 0) {
      warn$1(
        `watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
    if (deep !== void 0) {
      warn$1(
        `watch() "deep" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
    if (once !== void 0) {
      warn$1(
        `watch() "once" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
  }
  const warnInvalidSource = (s) => {
    warn$1(
      `Invalid watch source: `,
      s,
      `A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.`
    );
  };
  const instance = currentInstance;
  const reactiveGetter = (source2) => deep === true ? source2 : (
    // for deep: false, only traverse root-level properties
    traverse(source2, deep === false ? 1 : void 0)
  );
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => reactiveGetter(source);
    forceTrigger = true;
  } else if (isArray(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
    getter = () => source.map((s) => {
      if (isRef(s)) {
        return s.value;
      } else if (isReactive(s)) {
        return reactiveGetter(s);
      } else if (isFunction(s)) {
        return callWithErrorHandling(s, instance, 2);
      } else {
        !!(process.env.NODE_ENV !== "production") && warnInvalidSource(s);
      }
    });
  } else if (isFunction(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(source, instance, 2);
    } else {
      getter = () => {
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(
          source,
          instance,
          3,
          [onCleanup]
        );
      };
    }
  } else {
    getter = NOOP;
    !!(process.env.NODE_ENV !== "production") && warnInvalidSource(source);
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn) => {
    cleanup = effect2.onStop = () => {
      callWithErrorHandling(fn, instance, 4);
      cleanup = effect2.onStop = void 0;
    };
  };
  let ssrCleanup;
  if (isInSSRComponentSetup) {
    onCleanup = NOOP;
    if (!cb) {
      getter();
    } else if (immediate) {
      callWithAsyncErrorHandling(cb, instance, 3, [
        getter(),
        isMultiSource ? [] : void 0,
        onCleanup
      ]);
    }
    if (flush === "sync") {
      const ctx = useSSRContext();
      ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
    } else {
      return NOOP;
    }
  }
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect2.active || !effect2.dirty) {
      return;
    }
    if (cb) {
      const newValue = effect2.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          // pass undefined as the old value when it's changed for the first time
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect2.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
  } else {
    job.pre = true;
    if (instance)
      job.id = instance.uid;
    scheduler = () => queueJob(job);
  }
  const effect2 = new ReactiveEffect(getter, NOOP, scheduler);
  const scope = getCurrentScope();
  const unwatch = () => {
    effect2.stop();
    if (scope) {
      remove(scope.effects, effect2);
    }
  };
  if (!!(process.env.NODE_ENV !== "production")) {
    effect2.onTrack = onTrack;
    effect2.onTrigger = onTrigger;
  }
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect2.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect(
      effect2.run.bind(effect2),
      instance && instance.suspense
    );
  } else {
    effect2.run();
  }
  if (ssrCleanup)
    ssrCleanup.push(unwatch);
  return unwatch;
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const reset = setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  reset();
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function traverse(value, depth = Infinity, seen) {
  if (depth <= 0 || !isObject(value) || value["__v_skip"]) {
    return value;
  }
  seen = seen || /* @__PURE__ */ new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  depth--;
  if (isRef(value)) {
    traverse(value.value, depth, seen);
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], depth, seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, depth, seen);
    });
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key], depth, seen);
    }
  }
  return value;
}
function validateDirectiveName(name) {
  if (isBuiltInDirective(name)) {
    warn$1("Do not use built-in directive ids as custom directive id: " + name);
  }
}
function withDirectives(vnode, directives) {
  if (currentRenderingInstance === null) {
    !!(process.env.NODE_ENV !== "production") && warn$1(`withDirectives can only be used inside render functions.`);
    return vnode;
  }
  const instance = getExposeProxy(currentRenderingInstance) || currentRenderingInstance.proxy;
  const bindings = vnode.dirs || (vnode.dirs = []);
  for (let i = 0; i < directives.length; i++) {
    let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
    if (dir) {
      if (isFunction(dir)) {
        dir = {
          mounted: dir,
          updated: dir
        };
      }
      if (dir.deep) {
        traverse(value);
      }
      bindings.push({
        dir,
        instance,
        value,
        oldValue: void 0,
        arg,
        modifiers
      });
    }
  }
  return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
    }
    let hook = binding.dir[name];
    if (hook) {
      pauseTracking();
      callWithAsyncErrorHandling(hook, instance, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]);
      resetTracking();
    }
  }
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function defineComponent(options, extraOptions) {
  return isFunction(options) ? (
    // #8326: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    /* @__PURE__ */ (() => extend({ name: options.name }, extraOptions, { setup: options }))()
  ) : options;
}
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(
    type,
    hook,
    keepAliveRoot,
    true
    /* prepend */
  );
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target.isUnmounted) {
        return;
      }
      pauseTracking();
      const reset = setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      reset();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  } else if (!!(process.env.NODE_ENV !== "production")) {
    const apiName = toHandlerKey(ErrorTypeStrings$1[type].replace(/ hook$/, ""));
    warn$1(
      `${apiName} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup(). If you are using async setup(), make sure to register lifecycle hooks before the first await statement.`
    );
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => (
  // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
  (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, (...args) => hook(...args), target)
);
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook("bu");
const onUpdated = createHook("u");
const onBeforeUnmount = createHook("bum");
const onUnmounted = createHook("um");
const onServerPrefetch = createHook("sp");
const onRenderTriggered = createHook(
  "rtg"
);
const onRenderTracked = createHook(
  "rtc"
);
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
function renderList(source, renderItem, cache, index) {
  let ret;
  const cached = cache;
  if (isArray(source) || isString(source)) {
    ret = new Array(source.length);
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(source[i], i, void 0, cached);
    }
  } else if (typeof source === "number") {
    if (!!(process.env.NODE_ENV !== "production") && !Number.isInteger(source)) {
      warn$1(`The v-for range expect an integer value but got ${source}.`);
    }
    ret = new Array(source);
    for (let i = 0; i < source; i++) {
      ret[i] = renderItem(i + 1, i, void 0, cached);
    }
  } else if (isObject(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(
        source,
        (item, i) => renderItem(item, i, void 0, cached)
      );
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        ret[i] = renderItem(source[key], key, i, cached);
      }
    }
  } else {
    ret = [];
  }
  return ret;
}
function renderSlot(slots, name, props = {}, fallback, noSlotted) {
  if (currentRenderingInstance.isCE || currentRenderingInstance.parent && isAsyncWrapper(currentRenderingInstance.parent) && currentRenderingInstance.parent.isCE) {
    return createVNode("slot", props, fallback);
  }
  let slot = slots[name];
  if (!!(process.env.NODE_ENV !== "production") && slot && slot.length > 1) {
    warn$1(
      `SSR-optimized slot function detected in a non-SSR-optimized render function. You need to mark this component with $dynamic-slots in the parent template.`
    );
    slot = () => [];
  }
  if (slot && slot._c) {
    slot._d = false;
  }
  openBlock();
  const validSlotContent = slot && ensureValidVNode(slot(props));
  const rendered = createBlock(
    Fragment,
    {
      key: props.key || // slot content array of a dynamic conditional slot may have a branch
      // key attached in the `createSlots` helper, respect that
      validSlotContent && validSlotContent.key || `_${name}`
    },
    validSlotContent || [],
    validSlotContent && slots._ === 1 ? 64 : -2
  );
  if (!noSlotted && rendered.scopeId) {
    rendered.slotScopeIds = [rendered.scopeId + "-s"];
  }
  if (slot && slot._c) {
    slot._d = true;
  }
  return rendered;
}
function ensureValidVNode(vnodes) {
  return vnodes.some((child) => {
    if (!isVNode(child))
      return true;
    if (child.type === Comment)
      return false;
    if (child.type === Fragment && !ensureValidVNode(child.children))
      return false;
    return true;
  }) ? vnodes : null;
}
const getPublicInstance = (i) => {
  if (!i)
    return null;
  if (isStatefulComponent(i))
    return getExposeProxy(i) || i.proxy;
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
    $: (i) => i,
    $el: (i) => i.vnode.el,
    $data: (i) => i.data,
    $props: (i) => !!(process.env.NODE_ENV !== "production") ? shallowReadonly(i.props) : i.props,
    $attrs: (i) => !!(process.env.NODE_ENV !== "production") ? shallowReadonly(i.attrs) : i.attrs,
    $slots: (i) => !!(process.env.NODE_ENV !== "production") ? shallowReadonly(i.slots) : i.slots,
    $refs: (i) => !!(process.env.NODE_ENV !== "production") ? shallowReadonly(i.refs) : i.refs,
    $parent: (i) => getPublicInstance(i.parent),
    $root: (i) => getPublicInstance(i.root),
    $emit: (i) => i.emit,
    $options: (i) => resolveMergedOptions(i),
    $forceUpdate: (i) => i.f || (i.f = () => {
      i.effect.dirty = true;
      queueJob(i.update);
    }),
    $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
    $watch: (i) => instanceWatch.bind(i)
  })
);
const isReservedPrefix = (key) => key === "_" || key === "$";
const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    if (key === "__v_skip") {
      return true;
    }
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    if (!!(process.env.NODE_ENV !== "production") && key === "__isVue") {
      return true;
    }
    let normalizedProps;
    if (key[0] !== "$") {
      const n = accessCache[key];
      if (n !== void 0) {
        switch (n) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (hasSetupBinding(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if (
        // only cache other properties when instance has declared (thus stable)
        // props
        (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
      ) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance.attrs, "get", "");
        !!(process.env.NODE_ENV !== "production") && markAttrsAccessed();
      } else if (!!(process.env.NODE_ENV !== "production") && key === "$slots") {
        track(instance, "get", key);
      }
      return publicGetter(instance);
    } else if (
      // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key])
    ) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (
      // global properties
      globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
    ) {
      {
        return globalProperties[key];
      }
    } else if (!!(process.env.NODE_ENV !== "production") && currentRenderingInstance && (!isString(key) || // #1091 avoid internal isRef/isVNode checks on component instance leading
    // to infinite warning loop
    key.indexOf("__v") !== 0)) {
      if (data !== EMPTY_OBJ && isReservedPrefix(key[0]) && hasOwn(data, key)) {
        warn$1(
          `Property ${JSON.stringify(
            key
          )} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`
        );
      } else if (instance === currentRenderingInstance) {
        warn$1(
          `Property ${JSON.stringify(key)} was accessed during render but is not defined on instance.`
        );
      }
    }
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (!!(process.env.NODE_ENV !== "production") && setupState.__isScriptSetup && hasOwn(setupState, key)) {
      warn$1(`Cannot mutate <script setup> binding "${key}" from Options API.`);
      return false;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      !!(process.env.NODE_ENV !== "production") && warn$1(`Attempting to mutate prop "${key}". Props are readonly.`);
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      !!(process.env.NODE_ENV !== "production") && warn$1(
        `Attempting to mutate public property "${key}". Properties starting with $ are reserved and readonly.`
      );
      return false;
    } else {
      if (!!(process.env.NODE_ENV !== "production") && key in instance.appContext.config.globalProperties) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          value
        });
      } else {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({
    _: { data, setupState, accessCache, ctx, appContext, propsOptions }
  }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
if (!!(process.env.NODE_ENV !== "production") && true) {
  PublicInstanceProxyHandlers.ownKeys = (target) => {
    warn$1(
      `Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead.`
    );
    return Reflect.ownKeys(target);
  };
}
function createDevRenderContext(instance) {
  const target = {};
  Object.defineProperty(target, `_`, {
    configurable: true,
    enumerable: false,
    get: () => instance
  });
  Object.keys(publicPropertiesMap).forEach((key) => {
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: false,
      get: () => publicPropertiesMap[key](instance),
      // intercepted by the proxy so no need for implementation,
      // but needed to prevent set errors
      set: NOOP
    });
  });
  return target;
}
function exposePropsOnRenderContext(instance) {
  const {
    ctx,
    propsOptions: [propsOptions]
  } = instance;
  if (propsOptions) {
    Object.keys(propsOptions).forEach((key) => {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => instance.props[key],
        set: NOOP
      });
    });
  }
}
function exposeSetupStateOnRenderContext(instance) {
  const { ctx, setupState } = instance;
  Object.keys(toRaw(setupState)).forEach((key) => {
    if (!setupState.__isScriptSetup) {
      if (isReservedPrefix(key[0])) {
        warn$1(
          `setup() return property ${JSON.stringify(
            key
          )} should not start with "$" or "_" which are reserved prefixes for Vue internals.`
        );
        return;
      }
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => setupState[key],
        set: NOOP
      });
    }
  });
}
function normalizePropsOrEmits(props) {
  return isArray(props) ? props.reduce(
    (normalized, p2) => (normalized[p2] = null, normalized),
    {}
  ) : props;
}
function createDuplicateChecker() {
  const cache = /* @__PURE__ */ Object.create(null);
  return (type, key) => {
    if (cache[key]) {
      warn$1(`${type} property "${key}" is already defined in ${cache[key]}.`);
    } else {
      cache[key] = type;
    }
  };
}
let shouldCacheAccess = true;
function applyOptions(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook(options.beforeCreate, instance, "bc");
  }
  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = !!(process.env.NODE_ENV !== "production") ? createDuplicateChecker() : null;
  if (!!(process.env.NODE_ENV !== "production")) {
    const [propsOptions] = instance.propsOptions;
    if (propsOptions) {
      for (const key in propsOptions) {
        checkDuplicateProperties("Props", key);
      }
    }
  }
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction(methodHandler)) {
        if (!!(process.env.NODE_ENV !== "production")) {
          Object.defineProperty(ctx, key, {
            value: methodHandler.bind(publicThis),
            configurable: true,
            enumerable: true,
            writable: true
          });
        } else {
          ctx[key] = methodHandler.bind(publicThis);
        }
        if (!!(process.env.NODE_ENV !== "production")) {
          checkDuplicateProperties("Methods", key);
        }
      } else if (!!(process.env.NODE_ENV !== "production")) {
        warn$1(
          `Method "${key}" has type "${typeof methodHandler}" in the component definition. Did you reference the function correctly?`
        );
      }
    }
  }
  if (dataOptions) {
    if (!!(process.env.NODE_ENV !== "production") && !isFunction(dataOptions)) {
      warn$1(
        `The data option must be a function. Plain object usage is no longer supported.`
      );
    }
    const data = dataOptions.call(publicThis, publicThis);
    if (!!(process.env.NODE_ENV !== "production") && isPromise(data)) {
      warn$1(
        `data() returned a Promise - note data() cannot be async; If you intend to perform data fetching before component renders, use async setup() + <Suspense>.`
      );
    }
    if (!isObject(data)) {
      !!(process.env.NODE_ENV !== "production") && warn$1(`data() should return an object.`);
    } else {
      instance.data = reactive(data);
      if (!!(process.env.NODE_ENV !== "production")) {
        for (const key in data) {
          checkDuplicateProperties("Data", key);
          if (!isReservedPrefix(key[0])) {
            Object.defineProperty(ctx, key, {
              configurable: true,
              enumerable: true,
              get: () => data[key],
              set: NOOP
            });
          }
        }
      }
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get2 = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      if (!!(process.env.NODE_ENV !== "production") && get2 === NOOP) {
        warn$1(`Computed property "${key}" has no getter.`);
      }
      const set2 = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : !!(process.env.NODE_ENV !== "production") ? () => {
        warn$1(
          `Write operation failed: computed property "${key}" is readonly.`
        );
      } : NOOP;
      const c = computed({
        get: get2,
        set: set2
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: (v) => c.value = v
      });
      if (!!(process.env.NODE_ENV !== "production")) {
        checkDuplicateProperties("Computed", key);
      }
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  if (provideOptions) {
    const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key) => {
      provide(key, provides[key]);
    });
  }
  if (created) {
    callHook(created, instance, "c");
  }
  function registerLifecycleHook(register, hook) {
    if (isArray(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render && instance.render === NOOP) {
    instance.render = render;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components)
    instance.components = components;
  if (directives)
    instance.directives = directives;
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
  if (isArray(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject(opt)) {
      if ("default" in opt) {
        injected = inject(
          opt.from || key,
          opt.default,
          true
        );
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => injected.value,
        set: (v) => injected.value = v
      });
    } else {
      ctx[key] = injected;
    }
    if (!!(process.env.NODE_ENV !== "production")) {
      checkDuplicateProperties("Inject", key);
    }
  }
}
function callHook(hook, instance, type) {
  callWithAsyncErrorHandling(
    isArray(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
    instance,
    type
  );
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString(raw)) {
    const handler = ctx[raw];
    if (isFunction(handler)) {
      watch(getter, handler);
    } else if (!!(process.env.NODE_ENV !== "production")) {
      warn$1(`Invalid watch handler specified by key "${raw}"`, handler);
    }
  } else if (isFunction(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject(raw)) {
    if (isArray(raw)) {
      raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction(handler)) {
        watch(getter, handler, raw);
      } else if (!!(process.env.NODE_ENV !== "production")) {
        warn$1(`Invalid watch handler specified by key "${raw.handler}"`, handler);
      }
    }
  } else if (!!(process.env.NODE_ENV !== "production")) {
    warn$1(`Invalid watch option: "${key}"`, raw);
  }
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: { optionMergeStrategies }
  } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach(
        (m) => mergeOptions(resolved, m, optionMergeStrategies, true)
      );
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  if (isObject(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach(
      (m) => mergeOptions(to, m, strats, true)
    );
  }
  for (const key in from) {
    if (asMixin && key === "expose") {
      !!(process.env.NODE_ENV !== "production") && warn$1(
        `"expose" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.`
      );
    } else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeEmitsOrPropsOptions,
  emits: mergeEmitsOrPropsOptions,
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(
      isFunction(to) ? to.call(this, this) : to,
      isFunction(from) ? from.call(this, this) : from
    );
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
  if (to) {
    if (isArray(to) && isArray(from)) {
      return [.../* @__PURE__ */ new Set([...to, ...from])];
    }
    return extend(
      /* @__PURE__ */ Object.create(null),
      normalizePropsOrEmits(to),
      normalizePropsOrEmits(from != null ? from : {})
    );
  } else {
    return from;
  }
}
function mergeWatchOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render, hydrate) {
  return function createApp2(rootComponent2, rootProps = null) {
    if (!isFunction(rootComponent2)) {
      rootComponent2 = extend({}, rootComponent2);
    }
    if (rootProps != null && !isObject(rootProps)) {
      !!(process.env.NODE_ENV !== "production") && warn$1(`root props passed to app.mount() must be an object.`);
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new WeakSet();
    let isMounted = false;
    const app = context.app = {
      _uid: uid$1++,
      _component: rootComponent2,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v) {
        if (!!(process.env.NODE_ENV !== "production")) {
          warn$1(
            `app.config cannot be replaced. Modify individual options instead.`
          );
        }
      },
      use(plugin, ...options) {
        if (installedPlugins.has(plugin)) {
          !!(process.env.NODE_ENV !== "production") && warn$1(`Plugin has already been applied to target app.`);
        } else if (plugin && isFunction(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app, ...options);
        } else if (isFunction(plugin)) {
          installedPlugins.add(plugin);
          plugin(app, ...options);
        } else if (!!(process.env.NODE_ENV !== "production")) {
          warn$1(
            `A plugin must either be a function or an object with an "install" function.`
          );
        }
        return app;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          } else if (!!(process.env.NODE_ENV !== "production")) {
            warn$1(
              "Mixin has already been applied to target app" + (mixin.name ? `: ${mixin.name}` : "")
            );
          }
        }
        return app;
      },
      component(name, component) {
        if (!!(process.env.NODE_ENV !== "production")) {
          validateComponentName(name, context.config);
        }
        if (!component) {
          return context.components[name];
        }
        if (!!(process.env.NODE_ENV !== "production") && context.components[name]) {
          warn$1(`Component "${name}" has already been registered in target app.`);
        }
        context.components[name] = component;
        return app;
      },
      directive(name, directive) {
        if (!!(process.env.NODE_ENV !== "production")) {
          validateDirectiveName(name);
        }
        if (!directive) {
          return context.directives[name];
        }
        if (!!(process.env.NODE_ENV !== "production") && context.directives[name]) {
          warn$1(`Directive "${name}" has already been registered in target app.`);
        }
        context.directives[name] = directive;
        return app;
      },
      mount(rootContainer, isHydrate, namespace) {
        if (!isMounted) {
          if (!!(process.env.NODE_ENV !== "production") && rootContainer.__vue_app__) {
            warn$1(
              `There is already an app instance mounted on the host container.
 If you want to mount another app on the same host container, you need to unmount the previous app by calling \`app.unmount()\` first.`
            );
          }
          const vnode = createVNode(rootComponent2, rootProps);
          vnode.appContext = context;
          if (namespace === true) {
            namespace = "svg";
          } else if (namespace === false) {
            namespace = void 0;
          }
          if (!!(process.env.NODE_ENV !== "production")) {
            context.reload = () => {
              render(
                cloneVNode(vnode),
                rootContainer,
                namespace
              );
            };
          }
          if (isHydrate && hydrate) {
            hydrate(vnode, rootContainer);
          } else {
            render(vnode, rootContainer, namespace);
          }
          isMounted = true;
          app._container = rootContainer;
          rootContainer.__vue_app__ = app;
          if (!!(process.env.NODE_ENV !== "production") || false) {
            app._instance = vnode.component;
            devtoolsInitApp(app, version);
          }
          return getExposeProxy(vnode.component) || vnode.component.proxy;
        } else if (!!(process.env.NODE_ENV !== "production")) {
          warn$1(
            `App has already been mounted.
If you want to remount the same app, move your app creation logic into a factory function and create fresh app instances for each mount - e.g. \`const createMyApp = () => createApp(App)\``
          );
        }
      },
      unmount() {
        if (isMounted) {
          render(null, app._container);
          if (!!(process.env.NODE_ENV !== "production") || false) {
            app._instance = null;
            devtoolsUnmountApp(app);
          }
          delete app._container.__vue_app__;
        } else if (!!(process.env.NODE_ENV !== "production")) {
          warn$1(`Cannot unmount an app that is not mounted.`);
        }
      },
      provide(key, value) {
        if (!!(process.env.NODE_ENV !== "production") && key in context.provides) {
          warn$1(
            `App already provides property with key "${String(key)}". It will be overwritten with the new value.`
          );
        }
        context.provides[key] = value;
        return app;
      },
      runWithContext(fn) {
        const lastApp = currentApp;
        currentApp = app;
        try {
          return fn();
        } finally {
          currentApp = lastApp;
        }
      }
    };
    return app;
  };
}
let currentApp = null;
function provide(key, value) {
  if (!currentInstance) {
    if (!!(process.env.NODE_ENV !== "production")) {
      warn$1(`provide() can only be used inside setup().`);
    }
  } else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance || currentApp) {
    const provides = instance ? instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : currentApp._context.provides;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
    } else if (!!(process.env.NODE_ENV !== "production")) {
      warn$1(`injection "${String(key)}" not found.`);
    }
  } else if (!!(process.env.NODE_ENV !== "production")) {
    warn$1(`inject() can only be used inside setup() or functional components.`);
  }
}
const internalObjectProto = {};
const createInternalObject = () => Object.create(internalObjectProto);
const isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;
function initProps(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = createInternalObject();
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  if (!!(process.env.NODE_ENV !== "production")) {
    validateProps(rawProps || {}, props, instance);
  }
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function isInHmrContext(instance) {
  while (instance) {
    if (instance.type.__hmrId)
      return true;
    instance = instance.parent;
  }
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const {
    props,
    attrs,
    vnode: { patchFlag }
  } = instance;
  const rawCurrentProps = toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    !(!!(process.env.NODE_ENV !== "production") && isInHmrContext(instance)) && (optimized || patchFlag > 0) && !(patchFlag & 16)
  ) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue(
              options,
              rawCurrentProps,
              camelizedKey,
              value,
              instance,
              false
            );
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && // for camelCase
          (rawPrevProps[key] !== void 0 || // for kebab-case
          rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(
              options,
              rawCurrentProps,
              key,
              void 0,
              instance,
              true
            );
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance.attrs, "set", "");
  }
  if (!!(process.env.NODE_ENV !== "production")) {
    validateProps(rawProps || {}, props, instance);
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue(
        options,
        rawCurrentProps,
        key,
        castValues[key],
        instance,
        !hasOwn(castValues, key)
      );
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          const reset = setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(
            null,
            props
          );
          reset();
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[
      0
      /* shouldCast */
    ]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[
        1
        /* shouldCastTrue */
      ] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys)
        needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray(raw)) {
    for (let i = 0; i < raw.length; i++) {
      if (!!(process.env.NODE_ENV !== "production") && !isString(raw[i])) {
        warn$1(`props must be strings when using array syntax.`, raw[i]);
      }
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    if (!!(process.env.NODE_ENV !== "production") && !isObject(raw)) {
      warn$1(`invalid props options`, raw);
    }
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop2 = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
        if (prop2) {
          const booleanIndex = getTypeIndex(Boolean, prop2.type);
          const stringIndex = getTypeIndex(String, prop2.type);
          prop2[
            0
            /* shouldCast */
          ] = booleanIndex > -1;
          prop2[
            1
            /* shouldCastTrue */
          ] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || hasOwn(prop2, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$" && !isReservedProp(key)) {
    return true;
  } else if (!!(process.env.NODE_ENV !== "production")) {
    warn$1(`Invalid prop name: "${key}" is a reserved property.`);
  }
  return false;
}
function getType(ctor) {
  if (ctor === null) {
    return "null";
  }
  if (typeof ctor === "function") {
    return ctor.name || "";
  } else if (typeof ctor === "object") {
    const name = ctor.constructor && ctor.constructor.name;
    return name || "";
  }
  return "";
}
function isSameType(a, b) {
  return getType(a) === getType(b);
}
function getTypeIndex(type, expectedTypes) {
  if (isArray(expectedTypes)) {
    return expectedTypes.findIndex((t) => isSameType(t, type));
  } else if (isFunction(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  return -1;
}
function validateProps(rawProps, props, instance) {
  const resolvedValues = toRaw(props);
  const options = instance.propsOptions[0];
  for (const key in options) {
    let opt = options[key];
    if (opt == null)
      continue;
    validateProp(
      key,
      resolvedValues[key],
      opt,
      !!(process.env.NODE_ENV !== "production") ? shallowReadonly(resolvedValues) : resolvedValues,
      !hasOwn(rawProps, key) && !hasOwn(rawProps, hyphenate(key))
    );
  }
}
function validateProp(name, value, prop2, props, isAbsent) {
  const { type, required, validator, skipCheck } = prop2;
  if (required && isAbsent) {
    warn$1('Missing required prop: "' + name + '"');
    return;
  }
  if (value == null && !required) {
    return;
  }
  if (type != null && type !== true && !skipCheck) {
    let isValid = false;
    const types = isArray(type) ? type : [type];
    const expectedTypes = [];
    for (let i = 0; i < types.length && !isValid; i++) {
      const { valid, expectedType } = assertType(value, types[i]);
      expectedTypes.push(expectedType || "");
      isValid = valid;
    }
    if (!isValid) {
      warn$1(getInvalidTypeMessage(name, value, expectedTypes));
      return;
    }
  }
  if (validator && !validator(value, props)) {
    warn$1('Invalid prop: custom validator check failed for prop "' + name + '".');
  }
}
const isSimpleType = /* @__PURE__ */ makeMap(
  "String,Number,Boolean,Function,Symbol,BigInt"
);
function assertType(value, type) {
  let valid;
  const expectedType = getType(type);
  if (isSimpleType(expectedType)) {
    const t = typeof value;
    valid = t === expectedType.toLowerCase();
    if (!valid && t === "object") {
      valid = value instanceof type;
    }
  } else if (expectedType === "Object") {
    valid = isObject(value);
  } else if (expectedType === "Array") {
    valid = isArray(value);
  } else if (expectedType === "null") {
    valid = value === null;
  } else {
    valid = value instanceof type;
  }
  return {
    valid,
    expectedType
  };
}
function getInvalidTypeMessage(name, value, expectedTypes) {
  if (expectedTypes.length === 0) {
    return `Prop type [] for prop "${name}" won't match anything. Did you mean to use type Array instead?`;
  }
  let message = `Invalid prop: type check failed for prop "${name}". Expected ${expectedTypes.map(capitalize).join(" | ")}`;
  const expectedType = expectedTypes[0];
  const receivedType = toRawType(value);
  const expectedValue = styleValue(value, expectedType);
  const receivedValue = styleValue(value, receivedType);
  if (expectedTypes.length === 1 && isExplicable(expectedType) && !isBoolean(expectedType, receivedType)) {
    message += ` with value ${expectedValue}`;
  }
  message += `, got ${receivedType} `;
  if (isExplicable(receivedType)) {
    message += `with value ${receivedValue}.`;
  }
  return message;
}
function styleValue(value, type) {
  if (type === "String") {
    return `"${value}"`;
  } else if (type === "Number") {
    return `${Number(value)}`;
  } else {
    return `${value}`;
  }
}
function isExplicable(type) {
  const explicitTypes = ["string", "number", "boolean"];
  return explicitTypes.some((elem) => type.toLowerCase() === elem);
}
function isBoolean(...args) {
  return args.some((elem) => elem.toLowerCase() === "boolean");
}
const isInternalKey = (key) => key[0] === "_" || key === "$stable";
const normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot = (key, rawSlot, ctx) => {
  if (rawSlot._n) {
    return rawSlot;
  }
  const normalized = withCtx((...args) => {
    if (!!(process.env.NODE_ENV !== "production") && currentInstance && (!ctx || ctx.root === currentInstance.root)) {
      warn$1(
        `Slot "${key}" invoked outside of the render function: this will not track dependencies used in the slot. Invoke the slot function inside the render function instead.`
      );
    }
    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};
const normalizeObjectSlots = (rawSlots, slots, instance) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key))
      continue;
    const value = rawSlots[key];
    if (isFunction(value)) {
      slots[key] = normalizeSlot(key, value, ctx);
    } else if (value != null) {
      if (!!(process.env.NODE_ENV !== "production") && true) {
        warn$1(
          `Non-function value encountered for slot "${key}". Prefer function slots for better performance.`
        );
      }
      const normalized = normalizeSlotValue(value);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance, children) => {
  if (!!(process.env.NODE_ENV !== "production") && !isKeepAlive(instance.vnode) && true) {
    warn$1(
      `Non-function value encountered for default slot. Prefer function slots for better performance.`
    );
  }
  const normalized = normalizeSlotValue(children);
  instance.slots.default = () => normalized;
};
const initSlots = (instance, children) => {
  const slots = instance.slots = createInternalObject();
  if (instance.vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      extend(slots, children);
      def(slots, "_", type, true);
    } else {
      normalizeObjectSlots(children, slots);
    }
  } else if (children) {
    normalizeVNodeSlots(instance, children);
  }
};
const updateSlots = (instance, children, optimized) => {
  const { vnode, slots } = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      if (!!(process.env.NODE_ENV !== "production") && isHmrUpdating) {
        extend(slots, children);
        trigger(instance, "set", "$slots");
      } else if (optimized && type === 1) {
        needDeletionCheck = false;
      } else {
        extend(slots, children);
        if (!optimized && type === 1) {
          delete slots._;
        }
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }
    deletionComparisonTarget = children;
  } else if (children) {
    normalizeVNodeSlots(instance, children);
    deletionComparisonTarget = { default: 1 };
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
        delete slots[key];
      }
    }
  }
};
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if (isArray(rawRef)) {
    rawRef.forEach(
      (r, i) => setRef(
        r,
        oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef),
        parentSuspense,
        vnode,
        isUnmount
      )
    );
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getExposeProxy(vnode.component) || vnode.component.proxy : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref3 } = rawRef;
  if (!!(process.env.NODE_ENV !== "production") && !owner) {
    warn$1(
      `Missing ref owner context. ref cannot be used on hoisted vnodes. A vnode with ref must be created inside the render function.`
    );
    return;
  }
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  if (oldRef != null && oldRef !== ref3) {
    if (isString(oldRef)) {
      refs[oldRef] = null;
      if (hasOwn(setupState, oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (isRef(oldRef)) {
      oldRef.value = null;
    }
  }
  if (isFunction(ref3)) {
    callWithErrorHandling(ref3, owner, 12, [value, refs]);
  } else {
    const _isString = isString(ref3);
    const _isRef = isRef(ref3);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? hasOwn(setupState, ref3) ? setupState[ref3] : refs[ref3] : ref3.value;
          if (isUnmount) {
            isArray(existing) && remove(existing, refValue);
          } else {
            if (!isArray(existing)) {
              if (_isString) {
                refs[ref3] = [refValue];
                if (hasOwn(setupState, ref3)) {
                  setupState[ref3] = refs[ref3];
                }
              } else {
                ref3.value = [refValue];
                if (rawRef.k)
                  refs[rawRef.k] = ref3.value;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref3] = value;
          if (hasOwn(setupState, ref3)) {
            setupState[ref3] = value;
          }
        } else if (_isRef) {
          ref3.value = value;
          if (rawRef.k)
            refs[rawRef.k] = value;
        } else if (!!(process.env.NODE_ENV !== "production")) {
          warn$1("Invalid template ref type:", ref3, `(${typeof ref3})`);
        }
      };
      if (value) {
        doSet.id = -1;
        queuePostRenderEffect(doSet, parentSuspense);
      } else {
        doSet();
      }
    } else if (!!(process.env.NODE_ENV !== "production")) {
      warn$1("Invalid template ref type:", ref3, `(${typeof ref3})`);
    }
  }
}
let supported;
let perf;
function startMeasure(instance, type) {
  if (instance.appContext.config.performance && isSupported()) {
    perf.mark(`vue-${type}-${instance.uid}`);
  }
  if (!!(process.env.NODE_ENV !== "production") || false) {
    devtoolsPerfStart(instance, type, isSupported() ? perf.now() : Date.now());
  }
}
function endMeasure(instance, type) {
  if (instance.appContext.config.performance && isSupported()) {
    const startTag = `vue-${type}-${instance.uid}`;
    const endTag = startTag + `:end`;
    perf.mark(endTag);
    perf.measure(
      `<${formatComponentName(instance, instance.type)}> ${type}`,
      startTag,
      endTag
    );
    perf.clearMarks(startTag);
    perf.clearMarks(endTag);
  }
  if (!!(process.env.NODE_ENV !== "production") || false) {
    devtoolsPerfEnd(instance, type, isSupported() ? perf.now() : Date.now());
  }
}
function isSupported() {
  if (supported !== void 0) {
    return supported;
  }
  if (typeof window !== "undefined" && window.performance) {
    supported = true;
    perf = window.performance;
  } else {
    supported = false;
  }
  return supported;
}
function initFeatureFlags() {
  const needWarn = [];
  if (!!(process.env.NODE_ENV !== "production") && needWarn.length) {
    const multi = needWarn.length > 1;
    console.warn(
      `Feature flag${multi ? `s` : ``} ${needWarn.join(", ")} ${multi ? `are` : `is`} not explicitly defined. You are running the esm-bundler build of Vue, which expects these compile-time feature flags to be globally injected via the bundler config in order to get better tree-shaking in the production bundle.

For more details, see https://link.vuejs.org/feature-flags.`
    );
  }
}
const queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
  return baseCreateRenderer(options);
}
function baseCreateRenderer(options, createHydrationFns) {
  {
    initFeatureFlags();
  }
  const target = getGlobalThis();
  target.__VUE__ = true;
  if (!!(process.env.NODE_ENV !== "production") || false) {
    setDevtoolsHook$1(target.__VUE_DEVTOOLS_GLOBAL_HOOK__, target);
  }
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    setScopeId: hostSetScopeId = NOOP,
    insertStaticContent: hostInsertStaticContent
  } = options;
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = !!(process.env.NODE_ENV !== "production") && isHmrUpdating ? false : !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    const { type, ref: ref3, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container, anchor);
        break;
      case Comment:
        processCommentNode(n1, n2, container, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, namespace);
        } else if (!!(process.env.NODE_ENV !== "production")) {
          patchStaticNode(n1, n2, container, namespace);
        }
        break;
      case Fragment:
        processFragment(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        break;
      default:
        if (shapeFlag & 1) {
          processElement(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 6) {
          processComponent(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 64) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
        } else if (shapeFlag & 128) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
        } else if (!!(process.env.NODE_ENV !== "production")) {
          warn$1("Invalid VNode type:", type, `(${typeof type})`);
        }
    }
    if (ref3 != null && parentComponent) {
      setRef(ref3, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    }
  };
  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateText(n2.children),
        container,
        anchor
      );
    } else {
      const el = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateComment(n2.children || ""),
        container,
        anchor
      );
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container, anchor, namespace) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(
      n2.children,
      container,
      anchor,
      namespace,
      n2.el,
      n2.anchor
    );
  };
  const patchStaticNode = (n1, n2, container, namespace) => {
    if (n2.children !== n1.children) {
      const anchor = hostNextSibling(n1.anchor);
      removeStaticNode(n1);
      [n2.el, n2.anchor] = hostInsertStaticContent(
        n2.children,
        container,
        anchor,
        namespace
      );
    } else {
      n2.el = n1.el;
      n2.anchor = n1.anchor;
    }
  };
  const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostInsert(el, container, nextSibling);
      el = next;
    }
    hostInsert(anchor, container, nextSibling);
  };
  const removeStaticNode = ({ el, anchor }) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostRemove(el);
      el = next;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    if (n2.type === "svg") {
      namespace = "svg";
    } else if (n2.type === "math") {
      namespace = "mathml";
    }
    if (n1 == null) {
      mountElement(
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    } else {
      patchElement(
        n1,
        n2,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
  };
  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    let el;
    let vnodeHook;
    const { props, shapeFlag, transition, dirs } = vnode;
    el = vnode.el = hostCreateElement(
      vnode.type,
      namespace,
      props && props.is,
      props
    );
    if (shapeFlag & 8) {
      hostSetElementText(el, vnode.children);
    } else if (shapeFlag & 16) {
      mountChildren(
        vnode.children,
        el,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(vnode, namespace),
        slotScopeIds,
        optimized
      );
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "created");
    }
    setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    if (props) {
      for (const key in props) {
        if (key !== "value" && !isReservedProp(key)) {
          hostPatchProp(
            el,
            key,
            null,
            props[key],
            namespace,
            vnode.children,
            parentComponent,
            parentSuspense,
            unmountChildren
          );
        }
      }
      if ("value" in props) {
        hostPatchProp(el, "value", null, props.value, namespace);
      }
      if (vnodeHook = props.onVnodeBeforeMount) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
    }
    if (!!(process.env.NODE_ENV !== "production") || false) {
      Object.defineProperty(el, "__vnode", {
        value: vnode,
        enumerable: false
      });
      Object.defineProperty(el, "__vueParentComponent", {
        value: parentComponent,
        enumerable: false
      });
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = needTransition(parentSuspense, transition);
    if (needCallTransitionHooks) {
      transition.beforeEnter(el);
    }
    hostInsert(el, container, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        needCallTransitionHooks && transition.enter(el);
        dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
      }, parentSuspense);
    }
  };
  const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el, scopeId);
    }
    if (slotScopeIds) {
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el, slotScopeIds[i]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if (!!(process.env.NODE_ENV !== "production") && subTree.patchFlag > 0 && subTree.patchFlag & 2048) {
        subTree = filterSingleRoot(subTree.children) || subTree;
      }
      if (vnode === subTree) {
        const parentVNode = parentComponent.vnode;
        setScopeId(
          el,
          parentVNode,
          parentVNode.scopeId,
          parentVNode.slotScopeIds,
          parentComponent.parent
        );
      }
    }
  };
  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
    for (let i = start; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
      patch(
        null,
        child,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    const el = n2.el = n1.el;
    let { patchFlag, dynamicChildren, dirs } = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;
    parentComponent && toggleRecurse(parentComponent, false);
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    parentComponent && toggleRecurse(parentComponent, true);
    if (!!(process.env.NODE_ENV !== "production") && isHmrUpdating) {
      patchFlag = 0;
      optimized = false;
      dynamicChildren = null;
    }
    if (dynamicChildren) {
      patchBlockChildren(
        n1.dynamicChildren,
        dynamicChildren,
        el,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds
      );
      if (!!(process.env.NODE_ENV !== "production")) {
        traverseStaticChildren(n1, n2);
      }
    } else if (!optimized) {
      patchChildren(
        n1,
        n2,
        el,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds,
        false
      );
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(
          el,
          n2,
          oldProps,
          newProps,
          parentComponent,
          parentSuspense,
          namespace
        );
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, "class", null, newProps.class, namespace);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el, "style", oldProps.style, newProps.style, namespace);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || key === "value") {
              hostPatchProp(
                el,
                key,
                prev,
                next,
                namespace,
                n1.children,
                parentComponent,
                parentSuspense,
                unmountChildren
              );
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(
        el,
        n2,
        oldProps,
        newProps,
        parentComponent,
        parentSuspense,
        namespace
      );
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i];
      const container = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
        oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          fallbackContainer
        )
      );
      patch(
        oldVNode,
        newVNode,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        true
      );
    }
  };
  const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, namespace) => {
    if (oldProps !== newProps) {
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(
              el,
              key,
              oldProps[key],
              null,
              namespace,
              vnode.children,
              parentComponent,
              parentSuspense,
              unmountChildren
            );
          }
        }
      }
      for (const key in newProps) {
        if (isReservedProp(key))
          continue;
        const next = newProps[key];
        const prev = oldProps[key];
        if (next !== prev && key !== "value") {
          hostPatchProp(
            el,
            key,
            prev,
            next,
            namespace,
            vnode.children,
            parentComponent,
            parentSuspense,
            unmountChildren
          );
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el, "value", oldProps.value, newProps.value, namespace);
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
    if (!!(process.env.NODE_ENV !== "production") && // #5523 dev root fragment may inherit directives
    (isHmrUpdating || patchFlag & 2048)) {
      patchFlag = 0;
      optimized = false;
      dynamicChildren = null;
    }
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container, anchor);
      hostInsert(fragmentEndAnchor, container, anchor);
      mountChildren(
        // #10007
        // such fragment like `<></>` will be compiled into
        // a fragment which doesn't have a children.
        // In this case fallback to an empty array
        n2.children || [],
        container,
        fragmentEndAnchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
      // of renderSlot() with no valid children
      n1.dynamicChildren) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          container,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds
        );
        if (!!(process.env.NODE_ENV !== "production")) {
          traverseStaticChildren(n1, n2);
        } else if (
          // #2080 if the stable fragment has a key, it's a <template v-for> that may
          //  get moved around. Make sure all root level vnodes inherit el.
          // #2134 or if it's a component root, it may also get moved around
          // as the component is being moved.
          n2.key != null || parentComponent && n2 === parentComponent.subTree
        ) {
          traverseStaticChildren(
            n1,
            n2,
            true
            /* shallow */
          );
        }
      } else {
        patchChildren(
          n1,
          n2,
          container,
          fragmentEndAnchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(
          n2,
          container,
          anchor,
          namespace,
          optimized
        );
      } else {
        mountComponent(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          optimized
        );
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
    const instance = initialVNode.component = createComponentInstance(
      initialVNode,
      parentComponent,
      parentSuspense
    );
    if (!!(process.env.NODE_ENV !== "production") && instance.type.__hmrId) {
      registerHMR(instance);
    }
    if (!!(process.env.NODE_ENV !== "production")) {
      pushWarningContext(initialVNode);
      startMeasure(instance, `mount`);
    }
    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    }
    {
      if (!!(process.env.NODE_ENV !== "production")) {
        startMeasure(instance, `init`);
      }
      setupComponent(instance);
      if (!!(process.env.NODE_ENV !== "production")) {
        endMeasure(instance, `init`);
      }
    }
    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect);
      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container, anchor);
      }
    } else {
      setupRenderEffect(
        instance,
        initialVNode,
        container,
        anchor,
        parentSuspense,
        namespace,
        optimized
      );
    }
    if (!!(process.env.NODE_ENV !== "production")) {
      popWarningContext();
      endMeasure(instance, `mount`);
    }
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        if (!!(process.env.NODE_ENV !== "production")) {
          pushWarningContext(n2);
        }
        updateComponentPreRender(instance, n2, optimized);
        if (!!(process.env.NODE_ENV !== "production")) {
          popWarningContext();
        }
        return;
      } else {
        instance.next = n2;
        invalidateJob(instance.update);
        instance.effect.dirty = true;
        instance.update();
      }
    } else {
      n2.el = n1.el;
      instance.vnode = n2;
    }
  };
  const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook;
        const { el, props } = initialVNode;
        const { bm, m, parent } = instance;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance, false);
        if (bm) {
          invokeArrayFns(bm);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        }
        toggleRecurse(instance, true);
        if (el && hydrateNode) {
          const hydrateSubTree = () => {
            if (!!(process.env.NODE_ENV !== "production")) {
              startMeasure(instance, `render`);
            }
            instance.subTree = renderComponentRoot(instance);
            if (!!(process.env.NODE_ENV !== "production")) {
              endMeasure(instance, `render`);
            }
            if (!!(process.env.NODE_ENV !== "production")) {
              startMeasure(instance, `hydrate`);
            }
            hydrateNode(
              el,
              instance.subTree,
              instance,
              parentSuspense,
              null
            );
            if (!!(process.env.NODE_ENV !== "production")) {
              endMeasure(instance, `hydrate`);
            }
          };
          if (isAsyncWrapperVNode) {
            initialVNode.type.__asyncLoader().then(
              // note: we are moving the render call into an async callback,
              // which means it won't track dependencies - but it's ok because
              // a server-rendered async wrapper is already in resolved state
              // and it will never need to change.
              () => !instance.isUnmounted && hydrateSubTree()
            );
          } else {
            hydrateSubTree();
          }
        } else {
          if (!!(process.env.NODE_ENV !== "production")) {
            startMeasure(instance, `render`);
          }
          const subTree = instance.subTree = renderComponentRoot(instance);
          if (!!(process.env.NODE_ENV !== "production")) {
            endMeasure(instance, `render`);
          }
          if (!!(process.env.NODE_ENV !== "production")) {
            startMeasure(instance, `patch`);
          }
          patch(
            null,
            subTree,
            container,
            anchor,
            instance,
            parentSuspense,
            namespace
          );
          if (!!(process.env.NODE_ENV !== "production")) {
            endMeasure(instance, `patch`);
          }
          initialVNode.el = subTree.el;
        }
        if (m) {
          queuePostRenderEffect(m, parentSuspense);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
            parentSuspense
          );
        }
        if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense);
        }
        instance.isMounted = true;
        if (!!(process.env.NODE_ENV !== "production") || false) {
          devtoolsComponentAdded(instance);
        }
        initialVNode = container = anchor = null;
      } else {
        let { next, bu, u, parent, vnode } = instance;
        {
          const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
          if (nonHydratedAsyncRoot) {
            if (next) {
              next.el = vnode.el;
              updateComponentPreRender(instance, next, optimized);
            }
            nonHydratedAsyncRoot.asyncDep.then(() => {
              if (!instance.isUnmounted) {
                componentUpdateFn();
              }
            });
            return;
          }
        }
        let originNext = next;
        let vnodeHook;
        if (!!(process.env.NODE_ENV !== "production")) {
          pushWarningContext(next || instance.vnode);
        }
        toggleRecurse(instance, false);
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        }
        if (bu) {
          invokeArrayFns(bu);
        }
        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next, vnode);
        }
        toggleRecurse(instance, true);
        if (!!(process.env.NODE_ENV !== "production")) {
          startMeasure(instance, `render`);
        }
        const nextTree = renderComponentRoot(instance);
        if (!!(process.env.NODE_ENV !== "production")) {
          endMeasure(instance, `render`);
        }
        const prevTree = instance.subTree;
        instance.subTree = nextTree;
        if (!!(process.env.NODE_ENV !== "production")) {
          startMeasure(instance, `patch`);
        }
        patch(
          prevTree,
          nextTree,
          // parent may have changed if it's in a teleport
          hostParentNode(prevTree.el),
          // anchor may have changed if it's in a fragment
          getNextHostNode(prevTree),
          instance,
          parentSuspense,
          namespace
        );
        if (!!(process.env.NODE_ENV !== "production")) {
          endMeasure(instance, `patch`);
        }
        next.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance, nextTree.el);
        }
        if (u) {
          queuePostRenderEffect(u, parentSuspense);
        }
        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, next, vnode),
            parentSuspense
          );
        }
        if (!!(process.env.NODE_ENV !== "production") || false) {
          devtoolsComponentUpdated(instance);
        }
        if (!!(process.env.NODE_ENV !== "production")) {
          popWarningContext();
        }
      }
    };
    const effect2 = instance.effect = new ReactiveEffect(
      componentUpdateFn,
      NOOP,
      () => queueJob(update),
      instance.scope
      // track it in component's effect scope
    );
    const update = instance.update = () => {
      if (effect2.dirty) {
        effect2.run();
      }
    };
    update.id = instance.uid;
    toggleRecurse(instance, true);
    if (!!(process.env.NODE_ENV !== "production")) {
      effect2.onTrack = instance.rtc ? (e) => invokeArrayFns(instance.rtc, e) : void 0;
      effect2.onTrigger = instance.rtg ? (e) => invokeArrayFns(instance.rtg, e) : void 0;
      update.ownerInstance = instance;
    }
    update();
  };
  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    pauseTracking();
    flushPreFlushCbs(instance);
    resetTracking();
  };
  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const { patchFlag, shapeFlag } = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container, "");
        }
        if (shapeFlag & 16) {
          mountChildren(
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i;
    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      patch(
        c1[i],
        nextChild,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
    if (oldLength > newLength) {
      unmountChildren(
        c1,
        parentComponent,
        parentSuspense,
        true,
        false,
        commonLength
      );
    } else {
      mountChildren(
        c2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized,
        commonLength
      );
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i <= e2) {
          patch(
            null,
            c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true);
        i++;
      }
    } else {
      const s1 = i;
      const s2 = i;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (nextChild.key != null) {
          if (!!(process.env.NODE_ENV !== "production") && keyToNewIndexMap.has(nextChild.key)) {
            warn$1(
              `Duplicate keys found during update:`,
              JSON.stringify(nextChild.key),
              `Make sure keys are unique.`
            );
          }
          keyToNewIndexMap.set(nextChild.key, i);
        }
      }
      let j;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i = 0; i < toBePatched; i++)
        newIndexToOldIndexMap[i] = 0;
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j = s2; j <= e2; j++) {
            if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(
            prevChild,
            c2[newIndex],
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
      j = increasingNewIndexSequence.length - 1;
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(
            null,
            nextChild,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, 2);
          } else {
            j--;
          }
        }
      }
    }
  };
  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const { el, type, transition, children, shapeFlag } = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type.move(vnode, container, anchor, internals);
      return;
    }
    if (type === Fragment) {
      hostInsert(el, container, anchor);
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, anchor, moveType);
      }
      hostInsert(vnode.anchor, container, anchor);
      return;
    }
    if (type === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    }
    const needTransition2 = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition2) {
      if (moveType === 0) {
        transition.beforeEnter(el);
        hostInsert(el, container, anchor);
        queuePostRenderEffect(() => transition.enter(el), parentSuspense);
      } else {
        const { leave, delayLeave, afterLeave } = transition;
        const remove22 = () => hostInsert(el, container, anchor);
        const performLeave = () => {
          leave(el, () => {
            remove22();
            afterLeave && afterLeave();
          });
        };
        if (delayLeave) {
          delayLeave(el, remove22, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el, container, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const {
      type,
      props,
      ref: ref3,
      children,
      dynamicChildren,
      shapeFlag,
      patchFlag,
      dirs
    } = vnode;
    if (ref3 != null) {
      setRef(ref3, null, parentSuspense, vnode, true);
    }
    if (shapeFlag & 256) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(
          vnode,
          parentComponent,
          parentSuspense,
          optimized,
          internals,
          doRemove
        );
      } else if (dynamicChildren && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(
          dynamicChildren,
          parentComponent,
          parentSuspense,
          false,
          true
        );
      } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove2(vnode);
      }
    }
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
      }, parentSuspense);
    }
  };
  const remove2 = (vnode) => {
    const { type, el, anchor, transition } = vnode;
    if (type === Fragment) {
      if (!!(process.env.NODE_ENV !== "production") && vnode.patchFlag > 0 && vnode.patchFlag & 2048 && transition && !transition.persisted) {
        vnode.children.forEach((child) => {
          if (child.type === Comment) {
            hostRemove(child.el);
          } else {
            remove2(child);
          }
        });
      } else {
        removeFragment(el, anchor);
      }
      return;
    }
    if (type === Static) {
      removeStaticNode(vnode);
      return;
    }
    const performRemove = () => {
      hostRemove(el);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const performLeave = () => leave(el, performRemove);
      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end) => {
    let next;
    while (cur !== end) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }
    hostRemove(end);
  };
  const unmountComponent = (instance, parentSuspense, doRemove) => {
    if (!!(process.env.NODE_ENV !== "production") && instance.type.__hmrId) {
      unregisterHMR(instance);
    }
    const { bum, scope, update, subTree, um } = instance;
    if (bum) {
      invokeArrayFns(bum);
    }
    scope.stop();
    if (update) {
      update.active = false;
      unmount(subTree, instance, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    queuePostRenderEffect(() => {
      instance.isUnmounted = true;
    }, parentSuspense);
    if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
      parentSuspense.deps--;
      if (parentSuspense.deps === 0) {
        parentSuspense.resolve();
      }
    }
    if (!!(process.env.NODE_ENV !== "production") || false) {
      devtoolsComponentRemoved(instance);
    }
  };
  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
    for (let i = start; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    return hostNextSibling(vnode.anchor || vnode.el);
  };
  let isFlushing2 = false;
  const render = (vnode, container, namespace) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
      }
    } else {
      patch(
        container._vnode || null,
        vnode,
        container,
        null,
        null,
        null,
        namespace
      );
    }
    if (!isFlushing2) {
      isFlushing2 = true;
      flushPreFlushCbs();
      flushPostFlushCbs();
      isFlushing2 = false;
    }
    container._vnode = vnode;
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove2,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options
  };
  let hydrate;
  let hydrateNode;
  return {
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate)
  };
}
function resolveChildrenNamespace({ type, props }, currentNamespace) {
  return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
}
function toggleRecurse({ effect: effect2, update }, allowed) {
  effect2.allowRecurse = update.allowRecurse = allowed;
}
function needTransition(parentSuspense, transition) {
  return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray(ch1) && isArray(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      const c1 = ch1[i];
      let c2 = ch2[i];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i] = cloneIfMounted(ch2[i]);
          c2.el = c1.el;
        }
        if (!shallow)
          traverseStaticChildren(c1, c2);
      }
      if (c2.type === Text) {
        c2.el = c1.el;
      }
      if (!!(process.env.NODE_ENV !== "production") && c2.type === Comment && !c2.el) {
        c2.el = c1.el;
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p2[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = u + v >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p2[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p2[v];
  }
  return result;
}
function locateNonHydratedAsyncRoot(instance) {
  const subComponent = instance.subTree.component;
  if (subComponent) {
    if (subComponent.asyncDep && !subComponent.asyncResolved) {
      return subComponent;
    } else {
      return locateNonHydratedAsyncRoot(subComponent);
    }
  }
}
const isTeleport = (type) => type.__isTeleport;
const Fragment = Symbol.for("v-fgt");
const Text = Symbol.for("v-txt");
const Comment = Symbol.for("v-cmt");
const Static = Symbol.for("v-stc");
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
let isBlockTreeEnabled = 1;
function setBlockTracking(value) {
  isBlockTreeEnabled += value;
}
function setupBlock(vnode) {
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
  closeBlock();
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(
    createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      true
    )
  );
}
function createBlock(type, props, children, patchFlag, dynamicProps) {
  return setupBlock(
    createVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      true
    )
  );
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  if (!!(process.env.NODE_ENV !== "production") && n2.shapeFlag & 6 && hmrDirtyComponents.has(n2.type)) {
    n1.shapeFlag &= ~256;
    n2.shapeFlag &= ~512;
    return false;
  }
  return n1.type === n2.type && n1.key === n2.key;
}
const createVNodeWithArgsTransform = (...args) => {
  return _createVNode(
    ...args
  );
};
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({
  ref: ref3,
  ref_key,
  ref_for
}) => {
  if (typeof ref3 === "number") {
    ref3 = "" + ref3;
  }
  return ref3 != null ? isString(ref3) || isRef(ref3) || isFunction(ref3) ? { i: currentRenderingInstance, r: ref3, k: ref_key, f: !!ref_for } : ref3 : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null,
    ctx: currentRenderingInstance
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= isString(children) ? 8 : 16;
  }
  if (!!(process.env.NODE_ENV !== "production") && vnode.key !== vnode.key) {
    warn$1(`VNode created with invalid key (NaN). VNode type:`, vnode.type);
  }
  if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
  !isBlockNode && // has current parent block
  currentBlock && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = !!(process.env.NODE_ENV !== "production") ? createVNodeWithArgsTransform : _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    if (!!(process.env.NODE_ENV !== "production") && !type) {
      warn$1(`Invalid vnode type when creating vnode: ${type}.`);
    }
    type = Comment;
  }
  if (isVNode(type)) {
    const cloned = cloneVNode(
      type,
      props,
      true
      /* mergeRef: true */
    );
    if (children) {
      normalizeChildren(cloned, children);
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
      if (cloned.shapeFlag & 6) {
        currentBlock[currentBlock.indexOf(type)] = cloned;
      } else {
        currentBlock.push(cloned);
      }
    }
    cloned.patchFlag |= -2;
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style } = props;
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject(style)) {
      if (isProxy(style) && !isArray(style)) {
        style = extend({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
  if (!!(process.env.NODE_ENV !== "production") && shapeFlag & 4 && isProxy(type)) {
    type = toRaw(type);
    warn$1(
      `Vue received a Component that was made a reactive object. This can lead to unnecessary performance overhead and should be avoided by marking the component with \`markRaw\` or using \`shallowRef\` instead of \`ref\`.`,
      `
Component that was made reactive: `,
      type
    );
  }
  return createBaseVNode(
    type,
    props,
    children,
    patchFlag,
    dynamicProps,
    shapeFlag,
    isBlockNode,
    true
  );
}
function guardReactiveProps(props) {
  if (!props)
    return null;
  return isProxy(props) || isInternalObject(props) ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
  const { props, ref: ref3, patchFlag, children, transition } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      mergeRef && ref3 ? isArray(ref3) ? ref3.concat(normalizeRef(extraProps)) : [ref3, normalizeRef(extraProps)] : normalizeRef(extraProps)
    ) : ref3,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children: !!(process.env.NODE_ENV !== "production") && patchFlag === -1 && isArray(children) ? children.map(deepCloneVNode) : children,
    target: vnode.target,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor,
    ctx: vnode.ctx,
    ce: vnode.ce
  };
  if (transition && cloneTransition) {
    cloned.transition = transition.clone(cloned);
  }
  return cloned;
}
function deepCloneVNode(vnode) {
  const cloned = cloneVNode(vnode);
  if (isArray(vnode.children)) {
    cloned.children = vnode.children.map(deepCloneVNode);
  }
  return cloned;
}
function createTextVNode(text = " ", flag = 0) {
  return createVNode(Text, null, text, flag);
}
function createCommentVNode(text = "", asBlock = false) {
  return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment);
  } else if (isArray(child)) {
    return createVNode(
      Fragment,
      null,
      // #3666, avoid reference pollution when reusing vnode
      child.slice()
    );
  } else if (typeof child === "object") {
    return cloneIfMounted(child);
  } else {
    return createVNode(Text, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray(children)) {
    type = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children._;
      if (!slotFlag && !isInternalObject(children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type = 16;
      children = [createTextVNode(children)];
    } else {
      type = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}
function mergeProps(...args) {
  const ret = {};
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7, [
    vnode,
    prevVNode
  ]);
}
const emptyAppContext = createAppContext();
let uid = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    scope: new EffectScope(
      true
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: EMPTY_OBJ,
    // inheritAttrs
    inheritAttrs: type.inheritAttrs,
    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    attrsProxy: null,
    slotsProxy: null,
    // suspense related
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  if (!!(process.env.NODE_ENV !== "production")) {
    instance.ctx = createDevRenderContext(instance);
  } else {
    instance.ctx = { _: instance };
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
let internalSetCurrentInstance;
let setInSSRSetupState;
{
  const g = getGlobalThis();
  const registerGlobalSetter = (key, setter) => {
    let setters;
    if (!(setters = g[key]))
      setters = g[key] = [];
    setters.push(setter);
    return (v) => {
      if (setters.length > 1)
        setters.forEach((set2) => set2(v));
      else
        setters[0](v);
    };
  };
  internalSetCurrentInstance = registerGlobalSetter(
    `__VUE_INSTANCE_SETTERS__`,
    (v) => currentInstance = v
  );
  setInSSRSetupState = registerGlobalSetter(
    `__VUE_SSR_SETTERS__`,
    (v) => isInSSRComponentSetup = v
  );
}
const setCurrentInstance = (instance) => {
  const prev = currentInstance;
  internalSetCurrentInstance(instance);
  instance.scope.on();
  return () => {
    instance.scope.off();
    internalSetCurrentInstance(prev);
  };
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  internalSetCurrentInstance(null);
};
const isBuiltInTag = /* @__PURE__ */ makeMap("slot,component");
function validateComponentName(name, { isNativeTag }) {
  if (isBuiltInTag(name) || isNativeTag(name)) {
    warn$1(
      "Do not use built-in or reserved HTML elements as component id: " + name
    );
  }
}
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false) {
  isSSR && setInSSRSetupState(isSSR);
  const { props, children } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isSSR && setInSSRSetupState(false);
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  var _a;
  const Component = instance.type;
  if (!!(process.env.NODE_ENV !== "production")) {
    if (Component.name) {
      validateComponentName(Component.name, instance.appContext.config);
    }
    if (Component.components) {
      const names = Object.keys(Component.components);
      for (let i = 0; i < names.length; i++) {
        validateComponentName(names[i], instance.appContext.config);
      }
    }
    if (Component.directives) {
      const names = Object.keys(Component.directives);
      for (let i = 0; i < names.length; i++) {
        validateDirectiveName(names[i]);
      }
    }
    if (Component.compilerOptions && isRuntimeOnly()) {
      warn$1(
        `"compilerOptions" is only supported when using a build of Vue that includes the runtime compiler. Since you are using a runtime-only build, the options should be passed via your build tool config instead.`
      );
    }
  }
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
  if (!!(process.env.NODE_ENV !== "production")) {
    exposePropsOnRenderContext(instance);
  }
  const { setup } = Component;
  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    const reset = setCurrentInstance(instance);
    pauseTracking();
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      0,
      [
        !!(process.env.NODE_ENV !== "production") ? shallowReadonly(instance.props) : instance.props,
        setupContext
      ]
    );
    resetTracking();
    reset();
    if (isPromise(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          handleSetupResult(instance, resolvedResult, isSSR);
        }).catch((e) => {
          handleError(e, instance, 0);
        });
      } else {
        instance.asyncDep = setupResult;
        if (!!(process.env.NODE_ENV !== "production") && !instance.suspense) {
          const name = (_a = Component.name) != null ? _a : "Anonymous";
          warn$1(
            `Component <${name}>: setup function returned a promise, but no <Suspense> boundary was found in the parent component tree. A component with async setup() must be nested in a <Suspense> in order to be rendered.`
          );
        }
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction(setupResult)) {
    if (instance.type.__ssrInlineRender) {
      instance.ssrRender = setupResult;
    } else {
      instance.render = setupResult;
    }
  } else if (isObject(setupResult)) {
    if (!!(process.env.NODE_ENV !== "production") && isVNode(setupResult)) {
      warn$1(
        `setup() should not return VNodes directly - return a render function instead.`
      );
    }
    if (!!(process.env.NODE_ENV !== "production") || false) {
      instance.devtoolsRawSetupState = setupResult;
    }
    instance.setupState = proxyRefs(setupResult);
    if (!!(process.env.NODE_ENV !== "production")) {
      exposeSetupStateOnRenderContext(instance);
    }
  } else if (!!(process.env.NODE_ENV !== "production") && setupResult !== void 0) {
    warn$1(
      `setup() should return an object. Received: ${setupResult === null ? "null" : typeof setupResult}`
    );
  }
  finishComponentSetup(instance, isSSR);
}
let compile;
const isRuntimeOnly = () => !compile;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component = instance.type;
  if (!instance.render) {
    if (!isSSR && compile && !Component.render) {
      const template = Component.template || resolveMergedOptions(instance).template;
      if (template) {
        if (!!(process.env.NODE_ENV !== "production")) {
          startMeasure(instance, `compile`);
        }
        const { isCustomElement, compilerOptions } = instance.appContext.config;
        const { delimiters, compilerOptions: componentCompilerOptions } = Component;
        const finalCompilerOptions = extend(
          extend(
            {
              isCustomElement,
              delimiters
            },
            compilerOptions
          ),
          componentCompilerOptions
        );
        Component.render = compile(template, finalCompilerOptions);
        if (!!(process.env.NODE_ENV !== "production")) {
          endMeasure(instance, `compile`);
        }
      }
    }
    instance.render = Component.render || NOOP;
  }
  {
    const reset = setCurrentInstance(instance);
    pauseTracking();
    try {
      applyOptions(instance);
    } finally {
      resetTracking();
      reset();
    }
  }
  if (!!(process.env.NODE_ENV !== "production") && !Component.render && instance.render === NOOP && !isSSR) {
    if (Component.template) {
      warn$1(
        `Component provided template option but runtime compilation is not supported in this build of Vue. Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".`
      );
    } else {
      warn$1(`Component is missing template or render function.`);
    }
  }
}
const attrsProxyHandlers = !!(process.env.NODE_ENV !== "production") ? {
  get(target, key) {
    markAttrsAccessed();
    track(target, "get", "");
    return target[key];
  },
  set() {
    warn$1(`setupContext.attrs is readonly.`);
    return false;
  },
  deleteProperty() {
    warn$1(`setupContext.attrs is readonly.`);
    return false;
  }
} : {
  get(target, key) {
    track(target, "get", "");
    return target[key];
  }
};
function getSlotsProxy(instance) {
  return instance.slotsProxy || (instance.slotsProxy = new Proxy(instance.slots, {
    get(target, key) {
      track(instance, "get", "$slots");
      return target[key];
    }
  }));
}
function createSetupContext(instance) {
  const expose = (exposed) => {
    if (!!(process.env.NODE_ENV !== "production")) {
      if (instance.exposed) {
        warn$1(`expose() should be called only once per setup().`);
      }
      if (exposed != null) {
        let exposedType = typeof exposed;
        if (exposedType === "object") {
          if (isArray(exposed)) {
            exposedType = "array";
          } else if (isRef(exposed)) {
            exposedType = "ref";
          }
        }
        if (exposedType !== "object") {
          warn$1(
            `expose() should be passed a plain object, received ${exposedType}.`
          );
        }
      }
    }
    instance.exposed = exposed || {};
  };
  if (!!(process.env.NODE_ENV !== "production")) {
    let attrsProxy;
    return Object.freeze({
      get attrs() {
        return attrsProxy || (attrsProxy = new Proxy(instance.attrs, attrsProxyHandlers));
      },
      get slots() {
        return getSlotsProxy(instance);
      },
      get emit() {
        return (event, ...args) => instance.emit(event, ...args);
      },
      expose
    });
  } else {
    return {
      attrs: new Proxy(instance.attrs, attrsProxyHandlers),
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
}
function getExposeProxy(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      },
      has(target, key) {
        return key in target || key in publicPropertiesMap;
      }
    }));
  }
}
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
function getComponentName(Component, includeInferred = true) {
  return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function formatComponentName(instance, Component, isRoot = false) {
  let name = getComponentName(Component);
  if (!name && Component.__file) {
    const match = Component.__file.match(/([^/\\]+)\.\w+$/);
    if (match) {
      name = match[1];
    }
  }
  if (!name && instance && instance.parent) {
    const inferFromRegistry = (registry) => {
      for (const key in registry) {
        if (registry[key] === Component) {
          return key;
        }
      }
    };
    name = inferFromRegistry(
      instance.components || instance.parent.type.components
    ) || inferFromRegistry(instance.appContext.components);
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
function isClassComponent(value) {
  return isFunction(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  const c = computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
  if (!!(process.env.NODE_ENV !== "production")) {
    const i = getCurrentInstance();
    if (i && i.appContext.config.warnRecursiveComputed) {
      c._warnRecursive = true;
    }
  }
  return c;
};
function h(type, propsOrChildren, children) {
  const l = arguments.length;
  if (l === 2) {
    if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren]);
      }
      return createVNode(type, propsOrChildren);
    } else {
      return createVNode(type, null, propsOrChildren);
    }
  } else {
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2);
    } else if (l === 3 && isVNode(children)) {
      children = [children];
    }
    return createVNode(type, propsOrChildren, children);
  }
}
function initCustomFormatter() {
  if (!!!(process.env.NODE_ENV !== "production") || typeof window === "undefined") {
    return;
  }
  const vueStyle = { style: "color:#3ba776" };
  const numberStyle = { style: "color:#1677ff" };
  const stringStyle = { style: "color:#f5222d" };
  const keywordStyle = { style: "color:#eb2f96" };
  const formatter = {
    header(obj) {
      if (!isObject(obj)) {
        return null;
      }
      if (obj.__isVue) {
        return ["div", vueStyle, `VueInstance`];
      } else if (isRef(obj)) {
        return [
          "div",
          {},
          ["span", vueStyle, genRefFlag(obj)],
          "<",
          formatValue(obj.value),
          `>`
        ];
      } else if (isReactive(obj)) {
        return [
          "div",
          {},
          ["span", vueStyle, isShallow(obj) ? "ShallowReactive" : "Reactive"],
          "<",
          formatValue(obj),
          `>${isReadonly(obj) ? ` (readonly)` : ``}`
        ];
      } else if (isReadonly(obj)) {
        return [
          "div",
          {},
          ["span", vueStyle, isShallow(obj) ? "ShallowReadonly" : "Readonly"],
          "<",
          formatValue(obj),
          ">"
        ];
      }
      return null;
    },
    hasBody(obj) {
      return obj && obj.__isVue;
    },
    body(obj) {
      if (obj && obj.__isVue) {
        return [
          "div",
          {},
          ...formatInstance(obj.$)
        ];
      }
    }
  };
  function formatInstance(instance) {
    const blocks = [];
    if (instance.type.props && instance.props) {
      blocks.push(createInstanceBlock("props", toRaw(instance.props)));
    }
    if (instance.setupState !== EMPTY_OBJ) {
      blocks.push(createInstanceBlock("setup", instance.setupState));
    }
    if (instance.data !== EMPTY_OBJ) {
      blocks.push(createInstanceBlock("data", toRaw(instance.data)));
    }
    const computed2 = extractKeys(instance, "computed");
    if (computed2) {
      blocks.push(createInstanceBlock("computed", computed2));
    }
    const injected = extractKeys(instance, "inject");
    if (injected) {
      blocks.push(createInstanceBlock("injected", injected));
    }
    blocks.push([
      "div",
      {},
      [
        "span",
        {
          style: keywordStyle.style + ";opacity:0.66"
        },
        "$ (internal): "
      ],
      ["object", { object: instance }]
    ]);
    return blocks;
  }
  function createInstanceBlock(type, target) {
    target = extend({}, target);
    if (!Object.keys(target).length) {
      return ["span", {}];
    }
    return [
      "div",
      { style: "line-height:1.25em;margin-bottom:0.6em" },
      [
        "div",
        {
          style: "color:#476582"
        },
        type
      ],
      [
        "div",
        {
          style: "padding-left:1.25em"
        },
        ...Object.keys(target).map((key) => {
          return [
            "div",
            {},
            ["span", keywordStyle, key + ": "],
            formatValue(target[key], false)
          ];
        })
      ]
    ];
  }
  function formatValue(v, asRaw = true) {
    if (typeof v === "number") {
      return ["span", numberStyle, v];
    } else if (typeof v === "string") {
      return ["span", stringStyle, JSON.stringify(v)];
    } else if (typeof v === "boolean") {
      return ["span", keywordStyle, v];
    } else if (isObject(v)) {
      return ["object", { object: asRaw ? toRaw(v) : v }];
    } else {
      return ["span", stringStyle, String(v)];
    }
  }
  function extractKeys(instance, type) {
    const Comp = instance.type;
    if (isFunction(Comp)) {
      return;
    }
    const extracted = {};
    for (const key in instance.ctx) {
      if (isKeyOfType(Comp, key, type)) {
        extracted[key] = instance.ctx[key];
      }
    }
    return extracted;
  }
  function isKeyOfType(Comp, key, type) {
    const opts = Comp[type];
    if (isArray(opts) && opts.includes(key) || isObject(opts) && key in opts) {
      return true;
    }
    if (Comp.extends && isKeyOfType(Comp.extends, key, type)) {
      return true;
    }
    if (Comp.mixins && Comp.mixins.some((m) => isKeyOfType(m, key, type))) {
      return true;
    }
  }
  function genRefFlag(v) {
    if (isShallow(v)) {
      return `ShallowRef`;
    }
    if (v.effect) {
      return `ComputedRef`;
    }
    return `Ref`;
  }
  if (window.devtoolsFormatters) {
    window.devtoolsFormatters.push(formatter);
  } else {
    window.devtoolsFormatters = [formatter];
  }
}
const version = "3.4.26";
const warn = !!(process.env.NODE_ENV !== "production") ? warn$1 : NOOP;
!!(process.env.NODE_ENV !== "production") || true ? devtools$1 : void 0;
!!(process.env.NODE_ENV !== "production") || true ? setDevtoolsHook$1 : NOOP;
/**
* @vue/runtime-dom v3.4.26
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const svgNS = "http://www.w3.org/2000/svg";
const mathmlNS = "http://www.w3.org/1998/Math/MathML";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, namespace, is, props) => {
    const el = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : doc.createElement(tag, is ? { is } : void 0);
    if (tag === "select" && props && props.multiple != null) {
      el.setAttribute("multiple", props.multiple);
    }
    return el;
  },
  createText: (text) => doc.createTextNode(text),
  createComment: (text) => doc.createComment(text),
  setText: (node, text) => {
    node.nodeValue = text;
  },
  setElementText: (el, text) => {
    el.textContent = text;
  },
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector) => doc.querySelector(selector),
  setScopeId(el, id) {
    el.setAttribute(id, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(content, parent, anchor, namespace, start, end) {
    const before = anchor ? anchor.previousSibling : parent.lastChild;
    if (start && (start === end || start.nextSibling)) {
      while (true) {
        parent.insertBefore(start.cloneNode(true), anchor);
        if (start === end || !(start = start.nextSibling))
          break;
      }
    } else {
      templateContainer.innerHTML = namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content;
      const template = templateContainer.content;
      if (namespace === "svg" || namespace === "mathml") {
        const wrapper = template.firstChild;
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }
        template.removeChild(wrapper);
      }
      parent.insertBefore(template, anchor);
    }
    return [
      // first
      before ? before.nextSibling : parent.firstChild,
      // last
      anchor ? anchor.previousSibling : parent.lastChild
    ];
  }
};
const vtcKey = Symbol("_vtc");
function patchClass(el, value, isSVG) {
  const transitionClasses = el[vtcKey];
  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
  }
  if (value == null) {
    el.removeAttribute("class");
  } else if (isSVG) {
    el.setAttribute("class", value);
  } else {
    el.className = value;
  }
}
const vShowOriginalDisplay = Symbol("_vod");
const vShowHidden = Symbol("_vsh");
const vShow = {
  beforeMount(el, { value }, { transition }) {
    el[vShowOriginalDisplay] = el.style.display === "none" ? "" : el.style.display;
    if (transition && value) {
      transition.beforeEnter(el);
    } else {
      setDisplay(el, value);
    }
  },
  mounted(el, { value }, { transition }) {
    if (transition && value) {
      transition.enter(el);
    }
  },
  updated(el, { value, oldValue }, { transition }) {
    if (!value === !oldValue)
      return;
    if (transition) {
      if (value) {
        transition.beforeEnter(el);
        setDisplay(el, true);
        transition.enter(el);
      } else {
        transition.leave(el, () => {
          setDisplay(el, false);
        });
      }
    } else {
      setDisplay(el, value);
    }
  },
  beforeUnmount(el, { value }) {
    setDisplay(el, value);
  }
};
if (!!(process.env.NODE_ENV !== "production")) {
  vShow.name = "show";
}
function setDisplay(el, value) {
  el.style.display = value ? el[vShowOriginalDisplay] : "none";
  el[vShowHidden] = !value;
}
const CSS_VAR_TEXT = Symbol(!!(process.env.NODE_ENV !== "production") ? "CSS_VAR_TEXT" : "");
function useCssVars(getter) {
  const instance = getCurrentInstance();
  if (!instance) {
    !!(process.env.NODE_ENV !== "production") && warn(`useCssVars is called without current active component instance.`);
    return;
  }
  const updateTeleports = instance.ut = (vars = getter(instance.proxy)) => {
    Array.from(
      document.querySelectorAll(`[data-v-owner="${instance.uid}"]`)
    ).forEach((node) => setVarsOnNode(node, vars));
  };
  if (!!(process.env.NODE_ENV !== "production")) {
    instance.getCssVars = () => getter(instance.proxy);
  }
  const setVars = () => {
    const vars = getter(instance.proxy);
    setVarsOnVNode(instance.subTree, vars);
    updateTeleports(vars);
  };
  onMounted(() => {
    watchPostEffect(setVars);
    const ob = new MutationObserver(setVars);
    ob.observe(instance.subTree.el.parentNode, { childList: true });
    onUnmounted(() => ob.disconnect());
  });
}
function setVarsOnVNode(vnode, vars) {
  if (vnode.shapeFlag & 128) {
    const suspense = vnode.suspense;
    vnode = suspense.activeBranch;
    if (suspense.pendingBranch && !suspense.isHydrating) {
      suspense.effects.push(() => {
        setVarsOnVNode(suspense.activeBranch, vars);
      });
    }
  }
  while (vnode.component) {
    vnode = vnode.component.subTree;
  }
  if (vnode.shapeFlag & 1 && vnode.el) {
    setVarsOnNode(vnode.el, vars);
  } else if (vnode.type === Fragment) {
    vnode.children.forEach((c) => setVarsOnVNode(c, vars));
  } else if (vnode.type === Static) {
    let { el, anchor } = vnode;
    while (el) {
      setVarsOnNode(el, vars);
      if (el === anchor)
        break;
      el = el.nextSibling;
    }
  }
}
function setVarsOnNode(el, vars) {
  if (el.nodeType === 1) {
    const style = el.style;
    let cssText = "";
    for (const key in vars) {
      style.setProperty(`--${key}`, vars[key]);
      cssText += `--${key}: ${vars[key]};`;
    }
    style[CSS_VAR_TEXT] = cssText;
  }
}
const displayRE = /(^|;)\s*display\s*:/;
function patchStyle(el, prev, next) {
  const style = el.style;
  const isCssString = isString(next);
  let hasControlledDisplay = false;
  if (next && !isCssString) {
    if (prev) {
      if (!isString(prev)) {
        for (const key in prev) {
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      } else {
        for (const prevStyle of prev.split(";")) {
          const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      }
    }
    for (const key in next) {
      if (key === "display") {
        hasControlledDisplay = true;
      }
      setStyle(style, key, next[key]);
    }
  } else {
    if (isCssString) {
      if (prev !== next) {
        const cssVarText = style[CSS_VAR_TEXT];
        if (cssVarText) {
          next += ";" + cssVarText;
        }
        style.cssText = next;
        hasControlledDisplay = displayRE.test(next);
      }
    } else if (prev) {
      el.removeAttribute("style");
    }
  }
  if (vShowOriginalDisplay in el) {
    el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
    if (el[vShowHidden]) {
      style.display = "none";
    }
  }
}
const semicolonRE = /[^\\];\s*$/;
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
  if (isArray(val)) {
    val.forEach((v) => setStyle(style, name, v));
  } else {
    if (val == null)
      val = "";
    if (!!(process.env.NODE_ENV !== "production")) {
      if (semicolonRE.test(val)) {
        warn(
          `Unexpected semicolon at the end of '${name}' style value: '${val}'`
        );
      }
    }
    if (name.startsWith("--")) {
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);
      if (importantRE.test(val)) {
        style.setProperty(
          hyphenate(prefixed),
          val.replace(importantRE, ""),
          "important"
        );
      } else {
        style[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = camelize(rawName);
  if (name !== "filter" && name in style) {
    return prefixCache[rawName] = name;
  }
  name = capitalize(name);
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;
    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    const isBoolean2 = isSpecialBooleanAttr(key);
    if (value == null || isBoolean2 && !includeBooleanAttr(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, isBoolean2 ? "" : value);
    }
  }
}
function patchDOMProp(el, key, value, prevChildren, parentComponent, parentSuspense, unmountChildren) {
  if (key === "innerHTML" || key === "textContent") {
    if (prevChildren) {
      unmountChildren(prevChildren, parentComponent, parentSuspense);
    }
    el[key] = value == null ? "" : value;
    return;
  }
  const tag = el.tagName;
  if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
  !tag.includes("-")) {
    const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value;
    const newValue = value == null ? "" : value;
    if (oldValue !== newValue || !("_value" in el)) {
      el.value = newValue;
    }
    if (value == null) {
      el.removeAttribute(key);
    }
    el._value = value;
    return;
  }
  let needRemove = false;
  if (value === "" || value == null) {
    const type = typeof el[key];
    if (type === "boolean") {
      value = includeBooleanAttr(value);
    } else if (value == null && type === "string") {
      value = "";
      needRemove = true;
    } else if (type === "number") {
      value = 0;
      needRemove = true;
    }
  }
  try {
    el[key] = value;
  } catch (e) {
    if (!!(process.env.NODE_ENV !== "production") && !needRemove) {
      warn(
        `Failed setting prop "${key}" on <${tag.toLowerCase()}>: value ${value} is invalid.`,
        e
      );
    }
  }
  needRemove && el.removeAttribute(key);
}
function addEventListener(el, event, handler, options) {
  el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
  el.removeEventListener(event, handler, options);
}
const veiKey = Symbol("_vei");
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
  const invokers = el[veiKey] || (el[veiKey] = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = !!(process.env.NODE_ENV !== "production") ? sanitizeEventValue(nextValue, rawName) : nextValue;
  } else {
    const [name, options] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(
        !!(process.env.NODE_ENV !== "production") ? sanitizeEventValue(nextValue, rawName) : nextValue,
        instance
      );
      addEventListener(el, name, invoker, options);
    } else if (existingInvoker) {
      removeEventListener(el, name, existingInvoker, options);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
  let options;
  if (optionsModifierRE.test(name)) {
    options = {};
    let m;
    while (m = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m[0].length);
      options[m[0].toLowerCase()] = true;
    }
  }
  const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
  return [event, options];
}
let cachedNow = 0;
const p = /* @__PURE__ */ Promise.resolve();
const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
function createInvoker(initialValue, instance) {
  const invoker = (e) => {
    if (!e._vts) {
      e._vts = Date.now();
    } else if (e._vts <= invoker.attached) {
      return;
    }
    callWithAsyncErrorHandling(
      patchStopImmediatePropagation(e, invoker.value),
      instance,
      5,
      [e]
    );
  };
  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}
function sanitizeEventValue(value, propName) {
  if (isFunction(value) || isArray(value)) {
    return value;
  }
  warn(
    `Wrong type passed as event handler to ${propName} - did you forget @ or : in front of your prop?
Expected function or array of functions, received type ${typeof value}.`
  );
  return NOOP;
}
function patchStopImmediatePropagation(e, value) {
  if (isArray(value)) {
    const originalStop = e.stopImmediatePropagation;
    e.stopImmediatePropagation = () => {
      originalStop.call(e);
      e._stopped = true;
    };
    return value.map(
      (fn) => (e2) => !e2._stopped && fn && fn(e2)
    );
  } else {
    return value;
  }
}
const isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // lowercase letter
key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
const patchProp = (el, key, prevValue, nextValue, namespace, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
  const isSVG = namespace === "svg";
  if (key === "class") {
    patchClass(el, nextValue, isSVG);
  } else if (key === "style") {
    patchStyle(el, prevValue, nextValue);
  } else if (isOn(key)) {
    if (!isModelListener(key)) {
      patchEvent(el, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
    patchDOMProp(
      el,
      key,
      nextValue,
      prevChildren,
      parentComponent,
      parentSuspense,
      unmountChildren
    );
  } else {
    if (key === "true-value") {
      el._trueValue = nextValue;
    } else if (key === "false-value") {
      el._falseValue = nextValue;
    }
    patchAttr(el, key, nextValue, isSVG);
  }
};
function shouldSetAsProp(el, key, value, isSVG) {
  if (isSVG) {
    if (key === "innerHTML" || key === "textContent") {
      return true;
    }
    if (key in el && isNativeOn(key) && isFunction(value)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable" || key === "translate") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el.tagName === "TEXTAREA") {
    return false;
  }
  if (key === "width" || key === "height") {
    const tag = el.tagName;
    if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") {
      return false;
    }
  }
  if (isNativeOn(key) && isString(value)) {
    return false;
  }
  return key in el;
}
const systemModifiers = ["ctrl", "shift", "alt", "meta"];
const modifierGuards = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  ctrl: (e) => !e.ctrlKey,
  shift: (e) => !e.shiftKey,
  alt: (e) => !e.altKey,
  meta: (e) => !e.metaKey,
  left: (e) => "button" in e && e.button !== 0,
  middle: (e) => "button" in e && e.button !== 1,
  right: (e) => "button" in e && e.button !== 2,
  exact: (e, modifiers) => systemModifiers.some((m) => e[`${m}Key`] && !modifiers.includes(m))
};
const withModifiers = (fn, modifiers) => {
  const cache = fn._withMods || (fn._withMods = {});
  const cacheKey = modifiers.join(".");
  return cache[cacheKey] || (cache[cacheKey] = (event, ...args) => {
    for (let i = 0; i < modifiers.length; i++) {
      const guard = modifierGuards[modifiers[i]];
      if (guard && guard(event, modifiers))
        return;
    }
    return fn(event, ...args);
  });
};
const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
let renderer;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
const createApp = (...args) => {
  const app = ensureRenderer().createApp(...args);
  if (!!(process.env.NODE_ENV !== "production")) {
    injectNativeTagCheck(app);
    injectCompilerOptionsCheck(app);
  }
  const { mount } = app;
  app.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (!container)
      return;
    const component = app._component;
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML;
    }
    container.innerHTML = "";
    const proxy = mount(container, false, resolveRootNamespace(container));
    if (container instanceof Element) {
      container.removeAttribute("v-cloak");
      container.setAttribute("data-v-app", "");
    }
    return proxy;
  };
  return app;
};
function resolveRootNamespace(container) {
  if (container instanceof SVGElement) {
    return "svg";
  }
  if (typeof MathMLElement === "function" && container instanceof MathMLElement) {
    return "mathml";
  }
}
function injectNativeTagCheck(app) {
  Object.defineProperty(app.config, "isNativeTag", {
    value: (tag) => isHTMLTag(tag) || isSVGTag(tag) || isMathMLTag(tag),
    writable: false
  });
}
function injectCompilerOptionsCheck(app) {
  {
    const isCustomElement = app.config.isCustomElement;
    Object.defineProperty(app.config, "isCustomElement", {
      get() {
        return isCustomElement;
      },
      set() {
        warn(
          `The \`isCustomElement\` config option is deprecated. Use \`compilerOptions.isCustomElement\` instead.`
        );
      }
    });
    const compilerOptions = app.config.compilerOptions;
    const msg = `The \`compilerOptions\` config option is only respected when using a build of Vue.js that includes the runtime compiler (aka "full build"). Since you are using the runtime-only build, \`compilerOptions\` must be passed to \`@vue/compiler-dom\` in the build setup instead.
- For vue-loader: pass it via vue-loader's \`compilerOptions\` loader option.
- For vue-cli: see https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader
- For vite: pass it via @vitejs/plugin-vue options. See https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#example-for-passing-options-to-vuecompiler-sfc`;
    Object.defineProperty(app.config, "compilerOptions", {
      get() {
        warn(msg);
        return compilerOptions;
      },
      set() {
        warn(msg);
      }
    });
  }
}
function normalizeContainer(container) {
  if (isString(container)) {
    const res = document.querySelector(container);
    if (!!(process.env.NODE_ENV !== "production") && !res) {
      warn(
        `Failed to mount app: mount target selector "${container}" returned null.`
      );
    }
    return res;
  }
  if (!!(process.env.NODE_ENV !== "production") && window.ShadowRoot && container instanceof window.ShadowRoot && container.mode === "closed") {
    warn(
      `mounting on a ShadowRoot with \`{mode: "closed"}\` may lead to unpredictable bugs`
    );
  }
  return container;
}
/**
* vue v3.4.26
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function initDev() {
  {
    initCustomFormatter();
  }
}
if (!!(process.env.NODE_ENV !== "production")) {
  initDev();
}
const _sfc_main$s = /* @__PURE__ */ defineComponent({
  __name: "UIConfig",
  setup(__props) {
    const injector = inject("injector");
    const themeProvider = injector == null ? void 0 : injector.get(ThemeProvider);
    const theme = ref((themeProvider == null ? void 0 : themeProvider.theme) === "dark" ? darkTheme : null);
    const sub = themeProvider == null ? void 0 : themeProvider.onThemeUpdate.subscribe((themeState) => {
      switch (themeState) {
        case "dark":
          theme.value = darkTheme;
          break;
        case "light":
          theme.value = null;
          break;
        default:
          return;
      }
    });
    onUnmounted(() => {
      sub == null ? void 0 : sub.unsubscribe();
    });
    return (_ctx, _cache) => {
      const _component_n_message_provider = resolveComponent("n-message-provider");
      const _component_n_config_provider = resolveComponent("n-config-provider");
      return openBlock(), createBlock(_component_n_config_provider, {
        theme: theme.value,
        style: { width: "100%" }
      }, {
        default: withCtx(() => [
          createVNode(_component_n_message_provider, null, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "default")
            ]),
            _: 3
          })
        ]),
        _: 3
      }, 8, ["theme"]);
    };
  }
});
const _hoisted_1$q = ["material"];
const _sfc_main$r = /* @__PURE__ */ defineComponent({
  __name: "UIIcon",
  props: {
    icon: {},
    color: {},
    depth: {},
    size: {},
    rotate: {}
  },
  setup(__props) {
    useCssVars((_ctx) => ({
      "40e4484e": rotateVal.value
    }));
    const props = __props;
    const rotateVal = computed(() => props.rotate + "s");
    const material = computed(() => {
      var _a, _b;
      if ((_a = props.icon) == null ? void 0 : _a.includes("material")) {
        const arr = (_b = props.icon) == null ? void 0 : _b.split("-");
        if (!arr || arr[0] !== "material") {
          return "";
        } else {
          if (arr[arr.length - 1] === "icons")
            return "";
          return arr[arr.length - 1];
        }
      }
      return "";
    });
    return (_ctx, _cache) => {
      const _component_n_icon = resolveComponent("n-icon");
      return openBlock(), createBlock(_component_n_icon, {
        size: _ctx.size,
        depth: _ctx.depth,
        color: _ctx.color
      }, {
        default: withCtx(() => [
          createBaseVNode("span", {
            material: material.value,
            class: normalizeClass([_ctx.icon, "icon", rotateVal.value && "rotate"])
          }, null, 10, _hoisted_1$q)
        ]),
        _: 1
      }, 8, ["size", "depth", "color"]);
    };
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const UIIcon$1 = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["__scopeId", "data-v-e179f417"]]);
var MaterialTypeEnum$1 = /* @__PURE__ */ ((MaterialTypeEnum2) => {
  MaterialTypeEnum2["FILLED"] = "material-icons-filled-";
  MaterialTypeEnum2["OUTLINED"] = "material-icons-outlined-";
  MaterialTypeEnum2["ROUND"] = "material-icons-round-";
  MaterialTypeEnum2["SHARP"] = "material-icons-sharp-";
  MaterialTypeEnum2["TWO_TONE"] = "material-icons-two-tone-";
  return MaterialTypeEnum2;
})(MaterialTypeEnum$1 || {});
var __defProp$h = Object.defineProperty;
var __getOwnPropDesc$h = Object.getOwnPropertyDescriptor;
var __decorateClass$h = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$h(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$h(target, key, result);
  return result;
};
let OutlineService = class {
  constructor() {
    __publicField(this, "isExpanded");
    __publicField(this, "expandEvent", new Subject());
    __publicField(this, "onExpand");
    this.isExpanded = false;
    this.onExpand = this.expandEvent.asObservable();
  }
  setup(initExpanded) {
    this.isExpanded = initExpanded;
  }
  handleExpand() {
    this.isExpanded = !this.isExpanded;
    this.expandEvent.next(this.isExpanded);
  }
  destory() {
  }
};
OutlineService = __decorateClass$h([
  Injectable()
], OutlineService);
const _hoisted_1$p = ["onClick"];
const _sfc_main$q = /* @__PURE__ */ defineComponent({
  __name: "OutlineView",
  props: {
    data: { type: Function },
    activeIndex: { type: Function },
    scrollTop: { type: Function },
    scrollerTo: { type: Function }
  },
  setup(__props) {
    useCssVars((_ctx) => ({
      "644940c3": unref(themeVars).textColor3,
      "644940c2": unref(themeVars).textColor2
    }));
    const props = __props;
    const themeVars = useThemeVars();
    const state = reactive({
      data: computed(() => props.data()),
      activeIndex: computed(() => props.activeIndex()),
      scrollTop: computed(() => props.scrollTop())
    });
    return (_ctx, _cache) => {
      const _component_n_space = resolveComponent("n-space");
      return openBlock(), createElementBlock("div", {
        class: "editor-outline",
        style: normalizeStyle({ position: "absolute", top: state.scrollTop + "px" })
      }, [
        createVNode(_component_n_space, {
          id: "editor-outline-container",
          class: "editor-outline-container scrollbar",
          vertical: ""
        }, {
          default: withCtx(() => [
            (openBlock(true), createElementBlock(Fragment, null, renderList(state.data, (item, index) => {
              return openBlock(), createElementBlock("div", {
                key: index,
                class: normalizeClass(["outline-heading-item", `outline-heading-${(item == null ? void 0 : item.tagName.toLocaleLowerCase()) || "null"}`])
              }, [
                createBaseVNode("a", {
                  class: normalizeClass(["outline-heading-text", state.activeIndex === index ? "active" : ""]),
                  href: "javascript:;",
                  draggable: "false",
                  onClick: ($event) => _ctx.scrollerTo(item == null ? void 0 : item.offsetTop)
                }, toDisplayString(item == null ? void 0 : item.text), 11, _hoisted_1$p)
              ], 2);
            }), 128))
          ]),
          _: 1
        })
      ], 4);
    };
  }
});
const OutlineView = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["__scopeId", "data-v-36195bfe"]]);
class OutlinePlugin {
  constructor() {
    __publicField(this, "app", null);
    __publicField(this, "workbench", null);
    __publicField(this, "host", null);
    __publicField(this, "subs", []);
    __publicField(this, "renderer");
    __publicField(this, "rootComponentRef");
    __publicField(this, "outlineService");
    __publicField(this, "scrollerRef", null);
    __publicField(this, "outlineData", ref([]));
    __publicField(this, "activeIndex", ref(0));
    __publicField(this, "scrollTop", ref(0));
    __publicField(this, "injector");
  }
  setup(injector) {
    const layout = injector.get(Layout);
    const structurer = injector.get(Structurer);
    this.injector = injector;
    this.workbench = layout.workbench;
    this.rootComponentRef = injector.get(RootComponentRef);
    this.renderer = injector.get(Renderer);
    this.outlineService = injector.get(OutlineService);
    this.scrollerRef = structurer.scrollerRef;
    this.outlineData = ref([]);
    this.activeIndex = ref(0);
    this.scrollTop = ref(0);
    this.host = createElement("div", { classes: ["outline-container"] });
    this.workbench.appendChild(this.host);
    this.subs.push(
      // TODO 设置条件：1.当且仅当大纲视图展开时才同步更新。
      this.renderer.onViewUpdated.pipe(sampleTime(1e3)).subscribe(() => {
        const headingComponents = this.getHeadingComponents(this.rootComponentRef.component);
        if (headingComponents.length === 0)
          return;
        const headingVNodes = headingComponents.map((component) => {
          return this.renderer.getVNodeByComponent(component);
        });
        const headingNativeNodes = headingVNodes.map((vnode) => {
          return this.renderer.getNativeNodeByVNode(vnode);
        });
        this.outlineData.value = headingNativeNodes.map((el) => {
          return {
            tagName: el.tagName,
            text: el.innerText,
            offsetTop: el.offsetTop
          };
        });
      }),
      fromEvent(this.scrollerRef, "scroll").pipe(debounceTime(20)).subscribe(() => {
        this.activeIndex.value = this.outlineData.value.findIndex((item) => item.offsetTop >= this.scrollerRef.scrollTop);
        this.scrollTop.value = this.scrollerRef.scrollTop;
      }),
      this.outlineService.onExpand.subscribe(() => {
        this.outlineService.isExpanded ? this.expand() : this.collapse();
      })
    );
  }
  // 展开视图
  expand() {
    this.workbench.style.display = "flex";
    this.workbench.style.flexDirection = "row";
    this.host.style.width = "200px";
    this.host.style.opacity = "1";
    this.host.style.zIndex = "1";
    this.app = createApp(h(_sfc_main$s, null, {
      default: () => h(OutlineView, {
        data: () => this.outlineData.value,
        activeIndex: () => this.activeIndex.value,
        scrollTop: () => this.scrollTop.value,
        scrollerTo: (offsetTop) => this.scrollerToCallback(offsetTop)
      })
    })).provide("injector", this.injector);
    this.app.mount(this.host);
  }
  // 折叠视图
  collapse() {
    var _a;
    this.workbench.style.display = "unset";
    this.workbench.style.flexDirection = "unset";
    this.host.style.width = "0px";
    this.host.style.opacity = "0";
    this.host.style.zIndex = "-1";
    (_a = this.app) == null ? void 0 : _a.unmount();
  }
  scrollerToCallback(offsetTop) {
    var _a;
    (_a = this.scrollerRef) == null ? void 0 : _a.scrollTo({ top: offsetTop, behavior: "smooth" });
  }
  getHeadingComponents(rootComponent2) {
    const components = [];
    function traverse2(component, result) {
      component.slots.toArray().forEach((slot) => {
        slot.sliceContent().forEach((content) => {
          if (typeof content !== "string") {
            if (content.name === "HeadingComponent") {
              result.push(content);
            } else {
              traverse2(content, result);
            }
          } else {
            return;
          }
        });
      });
    }
    traverse2(rootComponent2, components);
    return components;
  }
  onDestroy() {
    var _a;
    this.subs.forEach((i) => i.unsubscribe());
    this.outlineData.value = [];
    (_a = this.app) == null ? void 0 : _a.unmount();
    this.host = null;
    this.workbench = null;
    this.scrollerRef = null;
  }
}
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var collectionUtils = { exports: {} };
var utils$3 = collectionUtils.exports = {};
utils$3.forEach = function(collection, callback) {
  for (var i = 0; i < collection.length; i++) {
    var result = callback(collection[i]);
    if (result) {
      return result;
    }
  }
};
var collectionUtilsExports = collectionUtils.exports;
var elementUtils = function(options) {
  var getState2 = options.stateHandler.getState;
  function isDetectable(element) {
    var state = getState2(element);
    return state && !!state.isDetectable;
  }
  function markAsDetectable(element) {
    getState2(element).isDetectable = true;
  }
  function isBusy(element) {
    return !!getState2(element).busy;
  }
  function markBusy(element, busy) {
    getState2(element).busy = !!busy;
  }
  return {
    isDetectable,
    markAsDetectable,
    isBusy,
    markBusy
  };
};
var listenerHandler = function(idHandler2) {
  var eventListeners = {};
  function getListeners(element) {
    var id = idHandler2.get(element);
    if (id === void 0) {
      return [];
    }
    return eventListeners[id] || [];
  }
  function addListener(element, listener) {
    var id = idHandler2.get(element);
    if (!eventListeners[id]) {
      eventListeners[id] = [];
    }
    eventListeners[id].push(listener);
  }
  function removeListener(element, listener) {
    var listeners = getListeners(element);
    for (var i = 0, len = listeners.length; i < len; ++i) {
      if (listeners[i] === listener) {
        listeners.splice(i, 1);
        break;
      }
    }
  }
  function removeAllListeners(element) {
    var listeners = getListeners(element);
    if (!listeners) {
      return;
    }
    listeners.length = 0;
  }
  return {
    get: getListeners,
    add: addListener,
    removeListener,
    removeAllListeners
  };
};
var idGenerator = function() {
  var idCount = 1;
  function generate() {
    return idCount++;
  }
  return {
    generate
  };
};
var idHandler = function(options) {
  var idGenerator2 = options.idGenerator;
  var getState2 = options.stateHandler.getState;
  function getId2(element) {
    var state = getState2(element);
    if (state && state.id !== void 0) {
      return state.id;
    }
    return null;
  }
  function setId(element) {
    var state = getState2(element);
    if (!state) {
      throw new Error("setId required the element to have a resize detection state.");
    }
    var id = idGenerator2.generate();
    state.id = id;
    return id;
  }
  return {
    get: getId2,
    set: setId
  };
};
var reporter = function(quiet) {
  function noop() {
  }
  var reporter2 = {
    log: noop,
    warn: noop,
    error: noop
  };
  if (!quiet && window.console) {
    var attachFunction = function(reporter3, name) {
      reporter3[name] = function reporterProxy() {
        var f = console[name];
        if (f.apply) {
          f.apply(console, arguments);
        } else {
          for (var i = 0; i < arguments.length; i++) {
            f(arguments[i]);
          }
        }
      };
    };
    attachFunction(reporter2, "log");
    attachFunction(reporter2, "warn");
    attachFunction(reporter2, "error");
  }
  return reporter2;
};
var browserDetector$2 = { exports: {} };
var detector = browserDetector$2.exports = {};
detector.isIE = function(version2) {
  function isAnyIeVersion() {
    var agent = navigator.userAgent.toLowerCase();
    return agent.indexOf("msie") !== -1 || agent.indexOf("trident") !== -1 || agent.indexOf(" edge/") !== -1;
  }
  if (!isAnyIeVersion()) {
    return false;
  }
  if (!version2) {
    return true;
  }
  var ieVersion = function() {
    var undef, v = 3, div = document.createElement("div"), all = div.getElementsByTagName("i");
    do {
      div.innerHTML = "<!--[if gt IE " + ++v + "]><i></i><![endif]-->";
    } while (all[0]);
    return v > 4 ? v : undef;
  }();
  return version2 === ieVersion;
};
detector.isLegacyOpera = function() {
  return !!window.opera;
};
var browserDetectorExports = browserDetector$2.exports;
var utils$2 = { exports: {} };
var utils$1 = utils$2.exports = {};
utils$1.getOption = getOption$1;
function getOption$1(options, name, defaultValue) {
  var value = options[name];
  if ((value === void 0 || value === null) && defaultValue !== void 0) {
    return defaultValue;
  }
  return value;
}
var utilsExports = utils$2.exports;
var utils = utilsExports;
var batchProcessor = function batchProcessorMaker(options) {
  options = options || {};
  var reporter2 = options.reporter;
  var asyncProcess = utils.getOption(options, "async", true);
  var autoProcess = utils.getOption(options, "auto", true);
  if (autoProcess && !asyncProcess) {
    reporter2 && reporter2.warn("Invalid options combination. auto=true and async=false is invalid. Setting async=true.");
    asyncProcess = true;
  }
  var batch = Batch();
  var asyncFrameHandler;
  var isProcessing = false;
  function addFunction(level, fn) {
    if (!isProcessing && autoProcess && asyncProcess && batch.size() === 0) {
      processBatchAsync();
    }
    batch.add(level, fn);
  }
  function processBatch() {
    isProcessing = true;
    while (batch.size()) {
      var processingBatch = batch;
      batch = Batch();
      processingBatch.process();
    }
    isProcessing = false;
  }
  function forceProcessBatch(localAsyncProcess) {
    if (isProcessing) {
      return;
    }
    if (localAsyncProcess === void 0) {
      localAsyncProcess = asyncProcess;
    }
    if (asyncFrameHandler) {
      cancelFrame(asyncFrameHandler);
      asyncFrameHandler = null;
    }
    if (localAsyncProcess) {
      processBatchAsync();
    } else {
      processBatch();
    }
  }
  function processBatchAsync() {
    asyncFrameHandler = requestFrame(processBatch);
  }
  function cancelFrame(listener) {
    var cancel = clearTimeout;
    return cancel(listener);
  }
  function requestFrame(callback) {
    var raf = function(fn) {
      return setTimeout(fn, 0);
    };
    return raf(callback);
  }
  return {
    add: addFunction,
    force: forceProcessBatch
  };
};
function Batch() {
  var batch = {};
  var size2 = 0;
  var topLevel = 0;
  var bottomLevel = 0;
  function add2(level, fn) {
    if (!fn) {
      fn = level;
      level = 0;
    }
    if (level > topLevel) {
      topLevel = level;
    } else if (level < bottomLevel) {
      bottomLevel = level;
    }
    if (!batch[level]) {
      batch[level] = [];
    }
    batch[level].push(fn);
    size2++;
  }
  function process2() {
    for (var level = bottomLevel; level <= topLevel; level++) {
      var fns = batch[level];
      for (var i = 0; i < fns.length; i++) {
        var fn = fns[i];
        fn();
      }
    }
  }
  function getSize() {
    return size2;
  }
  return {
    add: add2,
    process: process2,
    size: getSize
  };
}
var prop = "_erd";
function initState(element) {
  element[prop] = {};
  return getState(element);
}
function getState(element) {
  return element[prop];
}
function cleanState(element) {
  delete element[prop];
}
var stateHandler$1 = {
  initState,
  getState,
  cleanState
};
var browserDetector$1 = browserDetectorExports;
var object = function(options) {
  options = options || {};
  var reporter2 = options.reporter;
  var batchProcessor2 = options.batchProcessor;
  var getState2 = options.stateHandler.getState;
  if (!reporter2) {
    throw new Error("Missing required dependency: reporter.");
  }
  function addListener(element, listener) {
    function listenerProxy() {
      listener(element);
    }
    if (browserDetector$1.isIE(8)) {
      getState2(element).object = {
        proxy: listenerProxy
      };
      element.attachEvent("onresize", listenerProxy);
    } else {
      var object2 = getObject(element);
      if (!object2) {
        throw new Error("Element is not detectable by this strategy.");
      }
      object2.contentDocument.defaultView.addEventListener("resize", listenerProxy);
    }
  }
  function buildCssTextString(rules) {
    var seperator = options.important ? " !important; " : "; ";
    return (rules.join(seperator) + seperator).trim();
  }
  function makeDetectable(options2, element, callback) {
    if (!callback) {
      callback = element;
      element = options2;
      options2 = null;
    }
    options2 = options2 || {};
    options2.debug;
    function injectObject(element2, callback2) {
      var OBJECT_STYLE = buildCssTextString(["display: block", "position: absolute", "top: 0", "left: 0", "width: 100%", "height: 100%", "border: none", "padding: 0", "margin: 0", "opacity: 0", "z-index: -1000", "pointer-events: none"]);
      var positionCheckPerformed = false;
      var style = window.getComputedStyle(element2);
      var width = element2.offsetWidth;
      var height = element2.offsetHeight;
      getState2(element2).startSize = {
        width,
        height
      };
      function mutateDom() {
        function alterPositionStyles() {
          if (style.position === "static") {
            element2.style.setProperty("position", "relative", options2.important ? "important" : "");
            var removeRelativeStyles = function(reporter3, element3, style2, property) {
              function getNumericalValue(value2) {
                return value2.replace(/[^-\d\.]/g, "");
              }
              var value = style2[property];
              if (value !== "auto" && getNumericalValue(value) !== "0") {
                reporter3.warn("An element that is positioned static has style." + property + "=" + value + " which is ignored due to the static positioning. The element will need to be positioned relative, so the style." + property + " will be set to 0. Element: ", element3);
                element3.style.setProperty(property, "0", options2.important ? "important" : "");
              }
            };
            removeRelativeStyles(reporter2, element2, style, "top");
            removeRelativeStyles(reporter2, element2, style, "right");
            removeRelativeStyles(reporter2, element2, style, "bottom");
            removeRelativeStyles(reporter2, element2, style, "left");
          }
        }
        function onObjectLoad() {
          if (!positionCheckPerformed) {
            alterPositionStyles();
          }
          function getDocument(element3, callback3) {
            if (!element3.contentDocument) {
              var state = getState2(element3);
              if (state.checkForObjectDocumentTimeoutId) {
                window.clearTimeout(state.checkForObjectDocumentTimeoutId);
              }
              state.checkForObjectDocumentTimeoutId = setTimeout(function checkForObjectDocument() {
                state.checkForObjectDocumentTimeoutId = 0;
                getDocument(element3, callback3);
              }, 100);
              return;
            }
            callback3(element3.contentDocument);
          }
          var objectElement = this;
          getDocument(objectElement, function onObjectDocumentReady(objectDocument) {
            callback2(element2);
          });
        }
        if (style.position !== "") {
          alterPositionStyles();
          positionCheckPerformed = true;
        }
        var object2 = document.createElement("object");
        object2.style.cssText = OBJECT_STYLE;
        object2.tabIndex = -1;
        object2.type = "text/html";
        object2.setAttribute("aria-hidden", "true");
        object2.onload = onObjectLoad;
        if (!browserDetector$1.isIE()) {
          object2.data = "about:blank";
        }
        if (!getState2(element2)) {
          return;
        }
        element2.appendChild(object2);
        getState2(element2).object = object2;
        if (browserDetector$1.isIE()) {
          object2.data = "about:blank";
        }
      }
      if (batchProcessor2) {
        batchProcessor2.add(mutateDom);
      } else {
        mutateDom();
      }
    }
    if (browserDetector$1.isIE(8)) {
      callback(element);
    } else {
      injectObject(element, callback);
    }
  }
  function getObject(element) {
    return getState2(element).object;
  }
  function uninstall(element) {
    if (!getState2(element)) {
      return;
    }
    var object2 = getObject(element);
    if (!object2) {
      return;
    }
    if (browserDetector$1.isIE(8)) {
      element.detachEvent("onresize", object2.proxy);
    } else {
      element.removeChild(object2);
    }
    if (getState2(element).checkForObjectDocumentTimeoutId) {
      window.clearTimeout(getState2(element).checkForObjectDocumentTimeoutId);
    }
    delete getState2(element).object;
  }
  return {
    makeDetectable,
    addListener,
    uninstall
  };
};
var forEach$1 = collectionUtilsExports.forEach;
var scroll = function(options) {
  options = options || {};
  var reporter2 = options.reporter;
  var batchProcessor2 = options.batchProcessor;
  var getState2 = options.stateHandler.getState;
  options.stateHandler.hasState;
  var idHandler2 = options.idHandler;
  if (!batchProcessor2) {
    throw new Error("Missing required dependency: batchProcessor");
  }
  if (!reporter2) {
    throw new Error("Missing required dependency: reporter.");
  }
  var scrollbarSizes = getScrollbarSizes();
  var styleId = "erd_scroll_detection_scrollbar_style";
  var detectionContainerClass = "erd_scroll_detection_container";
  function initDocument(targetDocument) {
    injectScrollStyle(targetDocument, styleId, detectionContainerClass);
  }
  initDocument(window.document);
  function buildCssTextString(rules) {
    var seperator = options.important ? " !important; " : "; ";
    return (rules.join(seperator) + seperator).trim();
  }
  function getScrollbarSizes() {
    var width = 500;
    var height = 500;
    var child = document.createElement("div");
    child.style.cssText = buildCssTextString(["position: absolute", "width: " + width * 2 + "px", "height: " + height * 2 + "px", "visibility: hidden", "margin: 0", "padding: 0"]);
    var container = document.createElement("div");
    container.style.cssText = buildCssTextString(["position: absolute", "width: " + width + "px", "height: " + height + "px", "overflow: scroll", "visibility: none", "top: " + -width * 3 + "px", "left: " + -height * 3 + "px", "visibility: hidden", "margin: 0", "padding: 0"]);
    container.appendChild(child);
    document.body.insertBefore(container, document.body.firstChild);
    var widthSize = width - container.clientWidth;
    var heightSize = height - container.clientHeight;
    document.body.removeChild(container);
    return {
      width: widthSize,
      height: heightSize
    };
  }
  function injectScrollStyle(targetDocument, styleId2, containerClass) {
    function injectStyle(style2, method) {
      method = method || function(element) {
        targetDocument.head.appendChild(element);
      };
      var styleElement = targetDocument.createElement("style");
      styleElement.innerHTML = style2;
      styleElement.id = styleId2;
      method(styleElement);
      return styleElement;
    }
    if (!targetDocument.getElementById(styleId2)) {
      var containerAnimationClass = containerClass + "_animation";
      var containerAnimationActiveClass = containerClass + "_animation_active";
      var style = "/* Created by the element-resize-detector library. */\n";
      style += "." + containerClass + " > div::-webkit-scrollbar { " + buildCssTextString(["display: none"]) + " }\n\n";
      style += "." + containerAnimationActiveClass + " { " + buildCssTextString(["-webkit-animation-duration: 0.1s", "animation-duration: 0.1s", "-webkit-animation-name: " + containerAnimationClass, "animation-name: " + containerAnimationClass]) + " }\n";
      style += "@-webkit-keyframes " + containerAnimationClass + " { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }\n";
      style += "@keyframes " + containerAnimationClass + " { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }";
      injectStyle(style);
    }
  }
  function addAnimationClass(element) {
    element.className += " " + detectionContainerClass + "_animation_active";
  }
  function addEvent(el, name, cb) {
    if (el.addEventListener) {
      el.addEventListener(name, cb);
    } else if (el.attachEvent) {
      el.attachEvent("on" + name, cb);
    } else {
      return reporter2.error("[scroll] Don't know how to add event listeners.");
    }
  }
  function removeEvent(el, name, cb) {
    if (el.removeEventListener) {
      el.removeEventListener(name, cb);
    } else if (el.detachEvent) {
      el.detachEvent("on" + name, cb);
    } else {
      return reporter2.error("[scroll] Don't know how to remove event listeners.");
    }
  }
  function getExpandElement(element) {
    return getState2(element).container.childNodes[0].childNodes[0].childNodes[0];
  }
  function getShrinkElement(element) {
    return getState2(element).container.childNodes[0].childNodes[0].childNodes[1];
  }
  function addListener(element, listener) {
    var listeners = getState2(element).listeners;
    if (!listeners.push) {
      throw new Error("Cannot add listener to an element that is not detectable.");
    }
    getState2(element).listeners.push(listener);
  }
  function makeDetectable(options2, element, callback) {
    if (!callback) {
      callback = element;
      element = options2;
      options2 = null;
    }
    options2 = options2 || {};
    function debug() {
      if (options2.debug) {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(idHandler2.get(element), "Scroll: ");
        if (reporter2.log.apply) {
          reporter2.log.apply(null, args);
        } else {
          for (var i = 0; i < args.length; i++) {
            reporter2.log(args[i]);
          }
        }
      }
    }
    function isDetached(element2) {
      function isInDocument(element3) {
        var isInShadowRoot = element3.getRootNode && element3.getRootNode().contains(element3);
        return element3 === element3.ownerDocument.body || element3.ownerDocument.body.contains(element3) || isInShadowRoot;
      }
      if (!isInDocument(element2)) {
        return true;
      }
      if (window.getComputedStyle(element2) === null) {
        return true;
      }
      return false;
    }
    function isUnrendered(element2) {
      var container = getState2(element2).container.childNodes[0];
      var style = window.getComputedStyle(container);
      return !style.width || style.width.indexOf("px") === -1;
    }
    function getStyle() {
      var elementStyle = window.getComputedStyle(element);
      var style = {};
      style.position = elementStyle.position;
      style.width = element.offsetWidth;
      style.height = element.offsetHeight;
      style.top = elementStyle.top;
      style.right = elementStyle.right;
      style.bottom = elementStyle.bottom;
      style.left = elementStyle.left;
      style.widthCSS = elementStyle.width;
      style.heightCSS = elementStyle.height;
      return style;
    }
    function storeStartSize() {
      var style = getStyle();
      getState2(element).startSize = {
        width: style.width,
        height: style.height
      };
      debug("Element start size", getState2(element).startSize);
    }
    function initListeners() {
      getState2(element).listeners = [];
    }
    function storeStyle() {
      debug("storeStyle invoked.");
      if (!getState2(element)) {
        debug("Aborting because element has been uninstalled");
        return;
      }
      var style = getStyle();
      getState2(element).style = style;
    }
    function storeCurrentSize(element2, width, height) {
      getState2(element2).lastWidth = width;
      getState2(element2).lastHeight = height;
    }
    function getExpandChildElement(element2) {
      return getExpandElement(element2).childNodes[0];
    }
    function getWidthOffset() {
      return 2 * scrollbarSizes.width + 1;
    }
    function getHeightOffset() {
      return 2 * scrollbarSizes.height + 1;
    }
    function getExpandWidth(width) {
      return width + 10 + getWidthOffset();
    }
    function getExpandHeight(height) {
      return height + 10 + getHeightOffset();
    }
    function getShrinkWidth(width) {
      return width * 2 + getWidthOffset();
    }
    function getShrinkHeight(height) {
      return height * 2 + getHeightOffset();
    }
    function positionScrollbars(element2, width, height) {
      var expand = getExpandElement(element2);
      var shrink = getShrinkElement(element2);
      var expandWidth = getExpandWidth(width);
      var expandHeight = getExpandHeight(height);
      var shrinkWidth = getShrinkWidth(width);
      var shrinkHeight = getShrinkHeight(height);
      expand.scrollLeft = expandWidth;
      expand.scrollTop = expandHeight;
      shrink.scrollLeft = shrinkWidth;
      shrink.scrollTop = shrinkHeight;
    }
    function injectContainerElement() {
      var container = getState2(element).container;
      if (!container) {
        container = document.createElement("div");
        container.className = detectionContainerClass;
        container.style.cssText = buildCssTextString(["visibility: hidden", "display: inline", "width: 0px", "height: 0px", "z-index: -1", "overflow: hidden", "margin: 0", "padding: 0"]);
        getState2(element).container = container;
        addAnimationClass(container);
        element.appendChild(container);
        var onAnimationStart = function() {
          getState2(element).onRendered && getState2(element).onRendered();
        };
        addEvent(container, "animationstart", onAnimationStart);
        getState2(element).onAnimationStart = onAnimationStart;
      }
      return container;
    }
    function injectScrollElements() {
      function alterPositionStyles() {
        var style = getState2(element).style;
        if (style.position === "static") {
          element.style.setProperty("position", "relative", options2.important ? "important" : "");
          var removeRelativeStyles = function(reporter3, element2, style2, property) {
            function getNumericalValue(value2) {
              return value2.replace(/[^-\d\.]/g, "");
            }
            var value = style2[property];
            if (value !== "auto" && getNumericalValue(value) !== "0") {
              reporter3.warn("An element that is positioned static has style." + property + "=" + value + " which is ignored due to the static positioning. The element will need to be positioned relative, so the style." + property + " will be set to 0. Element: ", element2);
              element2.style[property] = 0;
            }
          };
          removeRelativeStyles(reporter2, element, style, "top");
          removeRelativeStyles(reporter2, element, style, "right");
          removeRelativeStyles(reporter2, element, style, "bottom");
          removeRelativeStyles(reporter2, element, style, "left");
        }
      }
      function getLeftTopBottomRightCssText(left, top, bottom, right) {
        left = !left ? "0" : left + "px";
        top = !top ? "0" : top + "px";
        bottom = !bottom ? "0" : bottom + "px";
        right = !right ? "0" : right + "px";
        return ["left: " + left, "top: " + top, "right: " + right, "bottom: " + bottom];
      }
      debug("Injecting elements");
      if (!getState2(element)) {
        debug("Aborting because element has been uninstalled");
        return;
      }
      alterPositionStyles();
      var rootContainer = getState2(element).container;
      if (!rootContainer) {
        rootContainer = injectContainerElement();
      }
      var scrollbarWidth = scrollbarSizes.width;
      var scrollbarHeight = scrollbarSizes.height;
      var containerContainerStyle = buildCssTextString(["position: absolute", "flex: none", "overflow: hidden", "z-index: -1", "visibility: hidden", "width: 100%", "height: 100%", "left: 0px", "top: 0px"]);
      var containerStyle = buildCssTextString(["position: absolute", "flex: none", "overflow: hidden", "z-index: -1", "visibility: hidden"].concat(getLeftTopBottomRightCssText(-(1 + scrollbarWidth), -(1 + scrollbarHeight), -scrollbarHeight, -scrollbarWidth)));
      var expandStyle = buildCssTextString(["position: absolute", "flex: none", "overflow: scroll", "z-index: -1", "visibility: hidden", "width: 100%", "height: 100%"]);
      var shrinkStyle = buildCssTextString(["position: absolute", "flex: none", "overflow: scroll", "z-index: -1", "visibility: hidden", "width: 100%", "height: 100%"]);
      var expandChildStyle = buildCssTextString(["position: absolute", "left: 0", "top: 0"]);
      var shrinkChildStyle = buildCssTextString(["position: absolute", "width: 200%", "height: 200%"]);
      var containerContainer = document.createElement("div");
      var container = document.createElement("div");
      var expand = document.createElement("div");
      var expandChild = document.createElement("div");
      var shrink = document.createElement("div");
      var shrinkChild = document.createElement("div");
      containerContainer.dir = "ltr";
      containerContainer.style.cssText = containerContainerStyle;
      containerContainer.className = detectionContainerClass;
      container.className = detectionContainerClass;
      container.style.cssText = containerStyle;
      expand.style.cssText = expandStyle;
      expandChild.style.cssText = expandChildStyle;
      shrink.style.cssText = shrinkStyle;
      shrinkChild.style.cssText = shrinkChildStyle;
      expand.appendChild(expandChild);
      shrink.appendChild(shrinkChild);
      container.appendChild(expand);
      container.appendChild(shrink);
      containerContainer.appendChild(container);
      rootContainer.appendChild(containerContainer);
      function onExpandScroll() {
        var state = getState2(element);
        if (state && state.onExpand) {
          state.onExpand();
        } else {
          debug("Aborting expand scroll handler: element has been uninstalled");
        }
      }
      function onShrinkScroll() {
        var state = getState2(element);
        if (state && state.onShrink) {
          state.onShrink();
        } else {
          debug("Aborting shrink scroll handler: element has been uninstalled");
        }
      }
      addEvent(expand, "scroll", onExpandScroll);
      addEvent(shrink, "scroll", onShrinkScroll);
      getState2(element).onExpandScroll = onExpandScroll;
      getState2(element).onShrinkScroll = onShrinkScroll;
    }
    function registerListenersAndPositionElements() {
      function updateChildSizes(element2, width, height) {
        var expandChild = getExpandChildElement(element2);
        var expandWidth = getExpandWidth(width);
        var expandHeight = getExpandHeight(height);
        expandChild.style.setProperty("width", expandWidth + "px", options2.important ? "important" : "");
        expandChild.style.setProperty("height", expandHeight + "px", options2.important ? "important" : "");
      }
      function updateDetectorElements(done) {
        var width = element.offsetWidth;
        var height = element.offsetHeight;
        var sizeChanged = width !== getState2(element).lastWidth || height !== getState2(element).lastHeight;
        debug("Storing current size", width, height);
        storeCurrentSize(element, width, height);
        batchProcessor2.add(0, function performUpdateChildSizes() {
          if (!sizeChanged) {
            return;
          }
          if (!getState2(element)) {
            debug("Aborting because element has been uninstalled");
            return;
          }
          if (!areElementsInjected()) {
            debug("Aborting because element container has not been initialized");
            return;
          }
          if (options2.debug) {
            var w = element.offsetWidth;
            var h2 = element.offsetHeight;
            if (w !== width || h2 !== height) {
              reporter2.warn(idHandler2.get(element), "Scroll: Size changed before updating detector elements.");
            }
          }
          updateChildSizes(element, width, height);
        });
        batchProcessor2.add(1, function updateScrollbars() {
          if (!getState2(element)) {
            debug("Aborting because element has been uninstalled");
            return;
          }
          if (!areElementsInjected()) {
            debug("Aborting because element container has not been initialized");
            return;
          }
          positionScrollbars(element, width, height);
        });
        if (sizeChanged && done) {
          batchProcessor2.add(2, function() {
            if (!getState2(element)) {
              debug("Aborting because element has been uninstalled");
              return;
            }
            if (!areElementsInjected()) {
              debug("Aborting because element container has not been initialized");
              return;
            }
            done();
          });
        }
      }
      function areElementsInjected() {
        return !!getState2(element).container;
      }
      function notifyListenersIfNeeded() {
        function isFirstNotify() {
          return getState2(element).lastNotifiedWidth === void 0;
        }
        debug("notifyListenersIfNeeded invoked");
        var state = getState2(element);
        if (isFirstNotify() && state.lastWidth === state.startSize.width && state.lastHeight === state.startSize.height) {
          return debug("Not notifying: Size is the same as the start size, and there has been no notification yet.");
        }
        if (state.lastWidth === state.lastNotifiedWidth && state.lastHeight === state.lastNotifiedHeight) {
          return debug("Not notifying: Size already notified");
        }
        debug("Current size not notified, notifying...");
        state.lastNotifiedWidth = state.lastWidth;
        state.lastNotifiedHeight = state.lastHeight;
        forEach$1(getState2(element).listeners, function(listener) {
          listener(element);
        });
      }
      function handleRender() {
        debug("startanimation triggered.");
        if (isUnrendered(element)) {
          debug("Ignoring since element is still unrendered...");
          return;
        }
        debug("Element rendered.");
        var expand = getExpandElement(element);
        var shrink = getShrinkElement(element);
        if (expand.scrollLeft === 0 || expand.scrollTop === 0 || shrink.scrollLeft === 0 || shrink.scrollTop === 0) {
          debug("Scrollbars out of sync. Updating detector elements...");
          updateDetectorElements(notifyListenersIfNeeded);
        }
      }
      function handleScroll() {
        debug("Scroll detected.");
        if (isUnrendered(element)) {
          debug("Scroll event fired while unrendered. Ignoring...");
          return;
        }
        updateDetectorElements(notifyListenersIfNeeded);
      }
      debug("registerListenersAndPositionElements invoked.");
      if (!getState2(element)) {
        debug("Aborting because element has been uninstalled");
        return;
      }
      getState2(element).onRendered = handleRender;
      getState2(element).onExpand = handleScroll;
      getState2(element).onShrink = handleScroll;
      var style = getState2(element).style;
      updateChildSizes(element, style.width, style.height);
    }
    function finalizeDomMutation() {
      debug("finalizeDomMutation invoked.");
      if (!getState2(element)) {
        debug("Aborting because element has been uninstalled");
        return;
      }
      var style = getState2(element).style;
      storeCurrentSize(element, style.width, style.height);
      positionScrollbars(element, style.width, style.height);
    }
    function ready() {
      callback(element);
    }
    function install() {
      debug("Installing...");
      initListeners();
      storeStartSize();
      batchProcessor2.add(0, storeStyle);
      batchProcessor2.add(1, injectScrollElements);
      batchProcessor2.add(2, registerListenersAndPositionElements);
      batchProcessor2.add(3, finalizeDomMutation);
      batchProcessor2.add(4, ready);
    }
    debug("Making detectable...");
    if (isDetached(element)) {
      debug("Element is detached");
      injectContainerElement();
      debug("Waiting until element is attached...");
      getState2(element).onRendered = function() {
        debug("Element is now attached");
        install();
      };
    } else {
      install();
    }
  }
  function uninstall(element) {
    var state = getState2(element);
    if (!state) {
      return;
    }
    state.onExpandScroll && removeEvent(getExpandElement(element), "scroll", state.onExpandScroll);
    state.onShrinkScroll && removeEvent(getShrinkElement(element), "scroll", state.onShrinkScroll);
    state.onAnimationStart && removeEvent(state.container, "animationstart", state.onAnimationStart);
    state.container && element.removeChild(state.container);
  }
  return {
    makeDetectable,
    addListener,
    uninstall,
    initDocument
  };
};
var forEach = collectionUtilsExports.forEach;
var elementUtilsMaker = elementUtils;
var listenerHandlerMaker = listenerHandler;
var idGeneratorMaker = idGenerator;
var idHandlerMaker = idHandler;
var reporterMaker = reporter;
var browserDetector = browserDetectorExports;
var batchProcessorMaker2 = batchProcessor;
var stateHandler = stateHandler$1;
var objectStrategyMaker = object;
var scrollStrategyMaker = scroll;
function isCollection(obj) {
  return Array.isArray(obj) || obj.length !== void 0;
}
function toArray(collection) {
  if (!Array.isArray(collection)) {
    var array = [];
    forEach(collection, function(obj) {
      array.push(obj);
    });
    return array;
  } else {
    return collection;
  }
}
function isElement(obj) {
  return obj && obj.nodeType === 1;
}
var elementResizeDetector = function(options) {
  options = options || {};
  var idHandler2;
  if (options.idHandler) {
    idHandler2 = {
      get: function(element) {
        return options.idHandler.get(element, true);
      },
      set: options.idHandler.set
    };
  } else {
    var idGenerator2 = idGeneratorMaker();
    var defaultIdHandler = idHandlerMaker({
      idGenerator: idGenerator2,
      stateHandler
    });
    idHandler2 = defaultIdHandler;
  }
  var reporter2 = options.reporter;
  if (!reporter2) {
    var quiet = reporter2 === false;
    reporter2 = reporterMaker(quiet);
  }
  var batchProcessor2 = getOption(options, "batchProcessor", batchProcessorMaker2({ reporter: reporter2 }));
  var globalOptions = {};
  globalOptions.callOnAdd = !!getOption(options, "callOnAdd", true);
  globalOptions.debug = !!getOption(options, "debug", false);
  var eventListenerHandler = listenerHandlerMaker(idHandler2);
  var elementUtils2 = elementUtilsMaker({
    stateHandler
  });
  var detectionStrategy;
  var desiredStrategy = getOption(options, "strategy", "object");
  var importantCssRules = getOption(options, "important", false);
  var strategyOptions = {
    reporter: reporter2,
    batchProcessor: batchProcessor2,
    stateHandler,
    idHandler: idHandler2,
    important: importantCssRules
  };
  if (desiredStrategy === "scroll") {
    if (browserDetector.isLegacyOpera()) {
      reporter2.warn("Scroll strategy is not supported on legacy Opera. Changing to object strategy.");
      desiredStrategy = "object";
    } else if (browserDetector.isIE(9)) {
      reporter2.warn("Scroll strategy is not supported on IE9. Changing to object strategy.");
      desiredStrategy = "object";
    }
  }
  if (desiredStrategy === "scroll") {
    detectionStrategy = scrollStrategyMaker(strategyOptions);
  } else if (desiredStrategy === "object") {
    detectionStrategy = objectStrategyMaker(strategyOptions);
  } else {
    throw new Error("Invalid strategy name: " + desiredStrategy);
  }
  var onReadyCallbacks = {};
  function listenTo(options2, elements, listener) {
    function onResizeCallback(element) {
      var listeners = eventListenerHandler.get(element);
      forEach(listeners, function callListenerProxy(listener2) {
        listener2(element);
      });
    }
    function addListener(callOnAdd2, element, listener2) {
      eventListenerHandler.add(element, listener2);
      if (callOnAdd2) {
        listener2(element);
      }
    }
    if (!listener) {
      listener = elements;
      elements = options2;
      options2 = {};
    }
    if (!elements) {
      throw new Error("At least one element required.");
    }
    if (!listener) {
      throw new Error("Listener required.");
    }
    if (isElement(elements)) {
      elements = [elements];
    } else if (isCollection(elements)) {
      elements = toArray(elements);
    } else {
      return reporter2.error("Invalid arguments. Must be a DOM element or a collection of DOM elements.");
    }
    var elementsReady = 0;
    var callOnAdd = getOption(options2, "callOnAdd", globalOptions.callOnAdd);
    var onReadyCallback = getOption(options2, "onReady", function noop() {
    });
    var debug = getOption(options2, "debug", globalOptions.debug);
    forEach(elements, function attachListenerToElement(element) {
      if (!stateHandler.getState(element)) {
        stateHandler.initState(element);
        idHandler2.set(element);
      }
      var id = idHandler2.get(element);
      debug && reporter2.log("Attaching listener to element", id, element);
      if (!elementUtils2.isDetectable(element)) {
        debug && reporter2.log(id, "Not detectable.");
        if (elementUtils2.isBusy(element)) {
          debug && reporter2.log(id, "System busy making it detectable");
          addListener(callOnAdd, element, listener);
          onReadyCallbacks[id] = onReadyCallbacks[id] || [];
          onReadyCallbacks[id].push(function onReady() {
            elementsReady++;
            if (elementsReady === elements.length) {
              onReadyCallback();
            }
          });
          return;
        }
        debug && reporter2.log(id, "Making detectable...");
        elementUtils2.markBusy(element, true);
        return detectionStrategy.makeDetectable({ debug, important: importantCssRules }, element, function onElementDetectable(element2) {
          debug && reporter2.log(id, "onElementDetectable");
          if (stateHandler.getState(element2)) {
            elementUtils2.markAsDetectable(element2);
            elementUtils2.markBusy(element2, false);
            detectionStrategy.addListener(element2, onResizeCallback);
            addListener(callOnAdd, element2, listener);
            var state = stateHandler.getState(element2);
            if (state && state.startSize) {
              var width = element2.offsetWidth;
              var height = element2.offsetHeight;
              if (state.startSize.width !== width || state.startSize.height !== height) {
                onResizeCallback(element2);
              }
            }
            if (onReadyCallbacks[id]) {
              forEach(onReadyCallbacks[id], function(callback) {
                callback();
              });
            }
          } else {
            debug && reporter2.log(id, "Element uninstalled before being detectable.");
          }
          delete onReadyCallbacks[id];
          elementsReady++;
          if (elementsReady === elements.length) {
            onReadyCallback();
          }
        });
      }
      debug && reporter2.log(id, "Already detecable, adding listener.");
      addListener(callOnAdd, element, listener);
      elementsReady++;
    });
    if (elementsReady === elements.length) {
      onReadyCallback();
    }
  }
  function uninstall(elements) {
    if (!elements) {
      return reporter2.error("At least one element is required.");
    }
    if (isElement(elements)) {
      elements = [elements];
    } else if (isCollection(elements)) {
      elements = toArray(elements);
    } else {
      return reporter2.error("Invalid arguments. Must be a DOM element or a collection of DOM elements.");
    }
    forEach(elements, function(element) {
      eventListenerHandler.removeAllListeners(element);
      detectionStrategy.uninstall(element);
      stateHandler.cleanState(element);
    });
  }
  function initDocument(targetDocument) {
    detectionStrategy.initDocument && detectionStrategy.initDocument(targetDocument);
  }
  return {
    listenTo,
    removeListener: eventListenerHandler.removeListener,
    removeAllListeners: eventListenerHandler.removeAllListeners,
    uninstall,
    initDocument
  };
};
function getOption(options, name, defaultValue) {
  var value = options[name];
  if ((value === void 0 || value === null) && defaultValue !== void 0) {
    return defaultValue;
  }
  return value;
}
const elementResizeDetector$1 = /* @__PURE__ */ getDefaultExportFromCjs(elementResizeDetector);
function useGetKeymapHandler(el, elementRef) {
  if (el === elementRef) {
    return "";
  }
  if (el.dataset.keymap) {
    return el.dataset.keymap;
  }
  return useGetKeymapHandler(el.parentNode, elementRef);
}
function useKeymap(config) {
  const _isMac = isMac();
  const arr = [];
  if (config.ctrlKey) {
    arr.push(_isMac ? "textbus-icon-command" : "Ctrl");
  }
  if (config.shiftKey) {
    arr.push(_isMac ? "textbus-icon-shift" : "Shift");
  }
  if (config.altKey) {
    arr.push(_isMac ? "textbus-icon-opt" : "Alt");
  }
  const keys = Array.isArray(config.key) ? config.key.map((i) => i.toUpperCase()).join("/") : typeof config.key === "string" ? config.key.toUpperCase() : Array.isArray(config.key.name) ? config.key.name.map((i) => i.toUpperCase()).join("/") : config.key.name.toLowerCase();
  const result = [];
  if (_isMac) {
    result.push(
      ...arr.map((s) => {
        return createElement("span", {
          classes: [s]
        });
      }),
      createTextNode(keys)
    );
  } else {
    arr.push(keys);
    arr.forEach((value, index) => {
      if (index - 1 > -1) {
        result.push(
          createElement("span", {
            classes: ["textbus-toolbar-keymap-join"],
            children: [createTextNode("+")]
          })
        );
      }
      result.push(createTextNode(value));
    });
  }
  return arr;
}
const _withScopeId$1 = (n) => (pushScopeId("data-v-a8c9101a"), n = n(), popScopeId(), n);
const _hoisted_1$o = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  viewBox: "0 0 24 24"
}, [
  /* @__PURE__ */ createBaseVNode("path", {
    d: "M6 10c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2z",
    fill: "currentColor"
  })
], -1));
const _hoisted_2$d = {
  key: 0,
  class: "toolbar-keymap-prompt"
};
const _sfc_main$p = /* @__PURE__ */ defineComponent({
  __name: "ToolbarView",
  props: {
    cmpts: {}
  },
  setup(__props) {
    useCssVars((_ctx) => ({
      "019e76d0": unref(themeVars).buttonColor2Hover,
      "6e73c027": unref(themeVars).baseColor
    }));
    const erd = elementResizeDetector$1();
    const themeVars = useThemeVars();
    const injector = inject("injector");
    const controller = injector.get(Controller$1);
    const isReadOnly = ref(false);
    const subs = [];
    const props = __props;
    const keymapStr = ref("");
    const toolbarData = ref([]);
    const collapseData = ref([]);
    const boundarySequence = ref([]);
    const collapseState = ref(false);
    function handleExpandBtnClick() {
      collapseState.value = !collapseState.value;
    }
    const toolbarRef = ref();
    const collapseRef = ref();
    onBeforeMount(() => {
      toolbarData.value = props.cmpts.map((vnode) => {
        vnode.key = UUID.v4();
        return vnode;
      });
    });
    onMounted(() => {
      var _a;
      const widthSequence = [];
      (_a = toolbarRef.value) == null ? void 0 : _a.childNodes.forEach((node) => {
        if (!["#text", "#comment"].includes(node.nodeName)) {
          const group = node;
          widthSequence.push(group.offsetWidth + 12);
        }
      });
      const initWidth = _.sum(widthSequence) - 12;
      boundarySequence.value = widthSequence.map((item, index, arr) => {
        return initWidth - _.sum(arr.slice(arr.length - index, arr.length));
      });
      useToolbarCollapse();
      erd.listenTo(toolbarRef.value, async () => {
        await useToolbarCollapse();
      });
      subs.push(
        fromEvent(toolbarRef.value, "mouseover").subscribe((ev) => {
          const keymap = useGetKeymapHandler(ev.target, toolbarRef.value);
          if (keymap) {
            try {
              const config = JSON.parse(keymap);
              keymapStr.value = useKeymap(config).join("+");
              return;
            } catch (e) {
              console.log(e);
            }
          }
          keymapStr.value = "";
        }),
        controller.onReadonlyStateChange.subscribe((v) => {
          isReadOnly.value = v;
        })
      );
    });
    async function useToolbarCollapse() {
      for (let index = 0; index < boundarySequence.value.length; index++) {
        if (toolbarRef.value.offsetWidth - 48 < boundarySequence.value[index]) {
          if (toolbarData.value[boundarySequence.value.length - index - 1]) {
            const vnode = toolbarData.value.pop();
            await nextTick();
            vnode && collapseData.value.unshift(vnode);
          }
        } else {
          if (!toolbarData.value[boundarySequence.value.length - index - 1]) {
            if (collapseData.value.length > 0) {
              const vnode = collapseData.value.shift();
              await nextTick();
              vnode && toolbarData.value.push(vnode);
              index--;
            }
          }
        }
      }
    }
    onUnmounted(() => {
      try {
        if (toolbarRef.value) {
          erd.uninstall(toolbarRef.value);
        }
        subs.forEach((i) => i.unsubscribe());
      } catch (error) {
        console.error("工具条监听器销毁失败！");
      }
    });
    return (_ctx, _cache) => {
      const _component_n_icon = resolveComponent("n-icon");
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("div", {
          ref_key: "toolbarRef",
          ref: toolbarRef,
          class: "custom-toolbar"
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(toolbarData.value, (node) => {
            return openBlock(), createBlock(resolveDynamicComponent(node), {
              class: "tool-item",
              key: node.key
            });
          }), 128)),
          collapseData.value.length ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: normalizeClass(["expand-btn", collapseState.value ? "expand-state" : ""]),
            onClick: handleExpandBtnClick
          }, [
            createVNode(unref(NButton), {
              text: "",
              color: unref(themeVars).textColor1,
              size: "large",
              disabled: isReadOnly.value
            }, {
              default: withCtx(() => [
                createVNode(_component_n_icon, { size: 24 }, {
                  default: withCtx(() => [
                    _hoisted_1$o
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["color", "disabled"])
          ], 2)) : createCommentVNode("", true)
        ], 512),
        withDirectives(createBaseVNode("div", {
          ref_key: "collapseRef",
          ref: collapseRef,
          class: "toolbar-collapse-wrapper"
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(collapseData.value, (node) => {
            return openBlock(), createBlock(resolveDynamicComponent(node), {
              class: "tool-item",
              key: node.key
            });
          }), 128))
        ], 512), [
          [vShow, collapseState.value && collapseData.value.length > 0]
        ]),
        keymapStr.value ? (openBlock(), createElementBlock("div", _hoisted_2$d, toDisplayString(keymapStr.value), 1)) : createCommentVNode("", true)
      ], 64);
    };
  }
});
const ToolbarView = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["__scopeId", "data-v-a8c9101a"]]);
makeError("Toolbar");
class Toolbar {
  constructor(toolFactories = [], host) {
    __publicField(this, "toolWrapper", null);
    __publicField(this, "subs", []);
    __publicField(this, "tools");
    __publicField(this, "components", []);
    __publicField(this, "toolbarView", null);
    this.toolFactories = toolFactories;
    this.tools = this.toolFactories.map((i) => {
      return Array.isArray(i) ? i.map((j) => j()) : i();
    });
    this.toolWrapper = host;
  }
  setup(injector) {
    const selection = injector.get(Selection);
    this.tools.forEach((tool) => {
      if (Array.isArray(tool)) {
        const groupWrapper = [];
        tool.forEach((t) => {
          groupWrapper.push(t.setup(injector, this.toolWrapper));
        });
        this.components.push(h("div", { class: "group-wrapper" }, groupWrapper));
        return;
      }
      this.components.push(tool.setup(injector, this.toolWrapper));
    });
    this.toolbarView = createApp(h(_sfc_main$s, null, {
      default: () => h(ToolbarView, { cmpts: this.components })
    }));
    this.toolbarView.provide("injector", injector);
    this.toolbarView.mount(this.toolWrapper);
    this.subs.push(
      merge(
        selection.onChange
        // refreshService.onRefresh,
      ).pipe(auditTime(100)).subscribe(() => {
        this.tools.flat().forEach((tool) => {
          tool.refreshState();
        });
      })
    );
  }
  onDestroy() {
    var _a;
    this.toolWrapper = null;
    this.components.length = 0;
    this.components = [];
    (_a = this.toolbarView) == null ? void 0 : _a.unmount();
    this.subs.forEach((i) => i.unsubscribe());
    this.toolFactories.length = 0;
    this.toolFactories = [];
    this.tools.length = 0;
    this.tools = [];
  }
}
const _hoisted_1$n = ["material"];
const _sfc_main$o = /* @__PURE__ */ defineComponent({
  __name: "UIIcon",
  props: {
    icon: {},
    color: {},
    depth: {},
    size: {},
    rotate: {}
  },
  setup(__props) {
    useCssVars((_ctx) => ({
      "5ac93d6d": rotateVal.value
    }));
    const props = __props;
    const rotateVal = computed(() => props.rotate + "s");
    const material = computed(() => {
      var _a, _b;
      if (typeof props.icon === "string") {
        if ((_a = props.icon) == null ? void 0 : _a.includes("material")) {
          const arr = (_b = props.icon) == null ? void 0 : _b.split("-");
          if (!arr || arr[0] !== "material") {
            return "";
          } else {
            if (arr[arr.length - 1] === "icons")
              return "";
            return arr[arr.length - 1];
          }
        }
      }
      return "";
    });
    return (_ctx, _cache) => {
      const _component_n_icon = resolveComponent("n-icon");
      return openBlock(), createBlock(_component_n_icon, {
        size: _ctx.size,
        depth: _ctx.depth,
        color: _ctx.color,
        component: typeof _ctx.icon === "string" ? void 0 : _ctx.icon
      }, {
        default: withCtx(() => [
          typeof props.icon === "string" ? (openBlock(), createElementBlock("span", {
            key: 0,
            material: material.value,
            class: normalizeClass([typeof props.icon === "string" && _ctx.icon, "icon", rotateVal.value && "rotate"])
          }, null, 10, _hoisted_1$n)) : createCommentVNode("", true)
        ]),
        _: 1
      }, 8, ["size", "depth", "color", "component"]);
    };
  }
});
const UIIcon = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["__scopeId", "data-v-4c19d330"]]);
const _hoisted_1$m = ["data-keymap", "title"];
const _hoisted_2$c = {
  key: 1,
  class: "label"
};
const _sfc_main$n = /* @__PURE__ */ defineComponent({
  __name: "UIButton",
  props: {
    iconClasses: {},
    size: {},
    label: {},
    tooltip: {},
    onClick: { type: Function },
    keymap: {},
    highlight: { type: Function },
    disabled: { type: Function }
  },
  setup(__props) {
    useCssVars((_ctx) => ({
      "4f3a66c2": unref(themeVars).buttonColor2Hover,
      "15a30028": unref(themeVars).buttonColor2Pressed
    }));
    const themeVars = useThemeVars();
    const props = __props;
    const state = reactive({
      highlight: computed(() => {
        var _a;
        return (_a = props.highlight) == null ? void 0 : _a.call(props);
      }),
      disabled: computed(() => {
        var _a;
        return (_a = props.disabled) == null ? void 0 : _a.call(props);
      })
    });
    function handleClick() {
      props.onClick && props.onClick();
    }
    return (_ctx, _cache) => {
      const _component_n_button = resolveComponent("n-button");
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["button-tool", state.highlight ? "active" : ""]),
        "data-keymap": JSON.stringify(_ctx.keymap),
        title: _ctx.tooltip,
        onClick: handleClick
      }, [
        createVNode(_component_n_button, {
          class: "btn",
          block: "",
          text: "",
          size: "large",
          disabled: state.disabled
        }, {
          default: withCtx(() => {
            var _a;
            return [
              ((_a = _ctx.iconClasses) == null ? void 0 : _a.length) ? (openBlock(), createBlock(UIIcon, {
                key: 0,
                icon: _ctx.iconClasses ? _ctx.iconClasses[0] : "",
                size: _ctx.size || 16
              }, null, 8, ["icon", "size"])) : createCommentVNode("", true),
              _ctx.label ? (openBlock(), createElementBlock("span", _hoisted_2$c, toDisplayString(_ctx.label), 1)) : createCommentVNode("", true)
            ];
          }),
          _: 1
        }, 8, ["disabled"])
      ], 10, _hoisted_1$m);
    };
  }
});
const UIButton$2 = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["__scopeId", "data-v-67365e0f"]]);
const _hoisted_1$l = { class: "dropdown-tool" };
const _hoisted_2$b = { key: 1 };
const _sfc_main$m = /* @__PURE__ */ defineComponent({
  __name: "UIDropdown",
  props: {
    keymap: {},
    classes: {},
    iconClasses: {},
    tooltip: {},
    label: {},
    options: {},
    highlight: { type: Function },
    disabled: { type: Function }
  },
  setup(__props) {
    var _a;
    provide("useClose", handleClose);
    const props = __props;
    const state = reactive({
      highlight: computed(() => {
        var _a2;
        return (_a2 = props.highlight) == null ? void 0 : _a2.call(props);
      }),
      disabled: computed(() => {
        var _a2;
        return (_a2 = props.disabled) == null ? void 0 : _a2.call(props);
      })
    });
    useThemeVars();
    const isShow = ref(false);
    ref();
    function handleClose() {
      isShow.value = false;
    }
    const dropdownOptions = (_a = props.options) == null ? void 0 : _a.map((item) => {
      var _a2;
      if (item.type === ToolType.Render) {
        return {
          key: UUID.v4(),
          label: item.label,
          children: [
            {
              key: UUID.v4(),
              type: item.type,
              render: () => h(item.render, {
                onSelectEnd: () => {
                  isShow.value = false;
                }
              })
            }
          ]
        };
      }
      if (item.type === ToolType.Select) {
        return {
          key: UUID.v4(),
          label: item.label,
          children: (_a2 = item.children) == null ? void 0 : _a2.map((item2) => {
            return {
              key: UUID.v4(),
              label: item2.label,
              // icon: renderIcon(item.classes),
              props: item2.props
            };
          })
        };
      }
      if (item.type === ToolType.Dialog) {
        return {
          key: UUID.v4(),
          label: item.label,
          props: {
            onClick: item.onClick
          }
        };
      }
      return {
        key: UUID.v4(),
        label: item.label,
        props: {
          onClick: item.onClick
        }
      };
    });
    return (_ctx, _cache) => {
      const _component_n_button = resolveComponent("n-button");
      const _component_n_dropdown = resolveComponent("n-dropdown");
      return openBlock(), createElementBlock("div", _hoisted_1$l, [
        createVNode(_component_n_dropdown, {
          show: isShow.value,
          "onUpdate:show": _cache[0] || (_cache[0] = ($event) => isShow.value = $event),
          trigger: "click",
          placement: "bottom-start",
          to: false,
          disabled: state.disabled,
          options: unref(dropdownOptions)
        }, {
          default: withCtx(() => [
            createVNode(_component_n_button, {
              text: "",
              class: "trigger",
              title: _ctx.tooltip,
              disabled: state.disabled
            }, {
              default: withCtx(() => [
                _ctx.iconClasses ? (openBlock(), createBlock(UIIcon, {
                  key: 0,
                  class: "dropdown-icon",
                  icon: _ctx.iconClasses ? _ctx.iconClasses[0] : "",
                  size: 16
                }, null, 8, ["icon"])) : createCommentVNode("", true),
                _ctx.label ? (openBlock(), createElementBlock("span", _hoisted_2$b, toDisplayString(_ctx.label), 1)) : createCommentVNode("", true),
                createVNode(UIIcon, {
                  class: normalizeClass(["dropdown-caret", isShow.value ? "active" : ""]),
                  icon: "textbus-dropdown-caret"
                }, null, 8, ["class"])
              ]),
              _: 1
            }, 8, ["title", "disabled"])
          ]),
          _: 1
        }, 8, ["show", "disabled", "options"])
      ]);
    };
  }
});
const UIDropdown = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["__scopeId", "data-v-8ff3c500"]]);
const _hoisted_1$k = ["title"];
const _hoisted_2$a = { class: "popover-left-btn" };
const _hoisted_3$6 = { class: "popover-right-btn" };
const _hoisted_4$4 = { class: "wrapper" };
const _sfc_main$l = /* @__PURE__ */ defineComponent({
  __name: "UIPopover",
  props: {
    keymap: {},
    classes: {},
    iconClasses: {},
    tooltip: {},
    label: {},
    view: {},
    highlight: { type: Function },
    disabled: { type: Function }
  },
  setup(__props) {
    useCssVars((_ctx) => ({
      "f9a55398": unref(themeVars).buttonColor2Hover
    }));
    provide("useClose", handleClose);
    const props = __props;
    const state = reactive({
      highlight: computed(() => {
        var _a;
        return (_a = props.highlight) == null ? void 0 : _a.call(props);
      }),
      disabled: computed(() => {
        var _a;
        return (_a = props.disabled) == null ? void 0 : _a.call(props);
      })
    });
    inject("injector");
    const themeVars = useThemeVars();
    const isShow = ref(false);
    const popoverRef = ref();
    const btnRef = ref();
    function handleClickoutside(ev) {
      if (btnRef.value === ev.target) {
        return;
      }
      isShow.value = false;
    }
    function handleClose() {
      isShow.value = false;
    }
    return (_ctx, _cache) => {
      const _component_n_popover = resolveComponent("n-popover");
      return openBlock(), createBlock(_component_n_popover, {
        ref_key: "popoverRef",
        ref: popoverRef,
        trigger: "click",
        placement: "bottom-start",
        flip: true,
        "show-arrow": false,
        to: false,
        show: isShow.value,
        disabled: state.disabled,
        onClickoutside: handleClickoutside
      }, {
        trigger: withCtx(() => [
          createBaseVNode("div", {
            ref_key: "btnRef",
            ref: btnRef,
            class: normalizeClass(["trigger", state.disabled ? "disabled" : ""]),
            title: _ctx.tooltip,
            onClick: _cache[0] || (_cache[0] = ($event) => isShow.value = !isShow.value)
          }, [
            createBaseVNode("div", _hoisted_2$a, [
              _ctx.iconClasses ? (openBlock(), createBlock(UIIcon, {
                key: 0,
                class: "popover-icon",
                icon: _ctx.iconClasses ? _ctx.iconClasses[0] : "",
                size: 16
              }, null, 8, ["icon"])) : createCommentVNode("", true)
            ]),
            createBaseVNode("div", _hoisted_3$6, [
              createVNode(UIIcon, {
                class: normalizeClass(["popover-caret", isShow.value ? "active" : ""]),
                icon: "textbus-dropdown-caret"
              }, null, 8, ["class"])
            ])
          ], 10, _hoisted_1$k)
        ]),
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_4$4, [
            (openBlock(), createBlock(resolveDynamicComponent(_ctx.view), { class: "popover-item" }))
          ])
        ]),
        _: 1
      }, 8, ["show", "disabled"]);
    };
  }
});
const UIPopover = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["__scopeId", "data-v-f4522a75"]]);
var MaterialTypeEnum = /* @__PURE__ */ ((MaterialTypeEnum2) => {
  MaterialTypeEnum2["FILLED"] = "material-icons-filled-";
  MaterialTypeEnum2["OUTLINED"] = "material-icons-outlined-";
  MaterialTypeEnum2["ROUND"] = "material-icons-round-";
  MaterialTypeEnum2["SHARP"] = "material-icons-sharp-";
  MaterialTypeEnum2["TWO_TONE"] = "material-icons-two-tone-";
  return MaterialTypeEnum2;
})(MaterialTypeEnum || {});
const _hoisted_1$j = { class: "select-tool" };
const _hoisted_2$9 = { class: "selector-label" };
const _sfc_main$k = /* @__PURE__ */ defineComponent({
  __name: "UISelect",
  props: {
    currentValue: {},
    classes: {},
    iconClasses: {},
    tooltip: {},
    mini: { type: Boolean },
    options: {},
    onSelected: { type: Function },
    highlight: { type: Function },
    disabled: { type: Function }
  },
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    var _a;
    useCssVars((_ctx) => ({
      "eef520be": unref(themeVars).buttonColor2Hover
    }));
    const themeVars = useThemeVars();
    const props = __props;
    const state = reactive({
      highlight: computed(() => {
        var _a2;
        return (_a2 = props.highlight) == null ? void 0 : _a2.call(props);
      }),
      disabled: computed(() => {
        var _a2;
        return (_a2 = props.disabled) == null ? void 0 : _a2.call(props);
      })
    });
    watch(() => {
      var _a2;
      return (_a2 = props.currentValue) == null ? void 0 : _a2.value;
    }, () => {
      var _a2;
      val.value = (_a2 = props.currentValue) == null ? void 0 : _a2.value;
    });
    const val = ref((_a = props.currentValue) == null ? void 0 : _a.value);
    const isShow = ref(false);
    function handleSelect() {
      props.onSelected && props.onSelected(val.value);
    }
    function renderLabel(option) {
      return h("div", { style: { display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" } }, [
        h("div", { style: { display: "flex", width: "100%", flexDirection: "row", alignItems: "center" } }, [
          option.prefix ? h(
            UIIcon,
            {
              icon: `${MaterialTypeEnum.FILLED}${option.prefix}`,
              style: {
                display: "flex",
                alignItems: "center",
                verticalAlign: "-0.15em",
                marginRight: "4px"
              },
              size: 16
            }
          ) : null,
          h("div", { class: option.classes, style: { minWidth: "50px" } }, { default: () => option.label })
        ]),
        option.suffix ? h(NText, { depth: 3 }, { default: () => option.suffix }) : null
      ]);
    }
    return (_ctx, _cache) => {
      const _component_n_button = resolveComponent("n-button");
      const _component_n_popselect = resolveComponent("n-popselect");
      return openBlock(), createElementBlock("div", _hoisted_1$j, [
        createVNode(_component_n_popselect, {
          class: normalizeClass([_ctx.classes]),
          trigger: "click",
          show: isShow.value,
          "onUpdate:show": _cache[0] || (_cache[0] = ($event) => isShow.value = $event),
          value: val.value,
          "onUpdate:value": [
            _cache[1] || (_cache[1] = ($event) => val.value = $event),
            handleSelect
          ],
          options: _ctx.options,
          "consistent-menu-width": false,
          "render-label": renderLabel,
          placement: "bottom-start"
        }, {
          default: withCtx(() => [
            createVNode(_component_n_button, {
              class: normalizeClass(["selector", _ctx.mini ? "" : "mini"]),
              text: "",
              title: _ctx.tooltip,
              disabled: state.disabled
            }, {
              default: withCtx(() => [
                _ctx.iconClasses ? (openBlock(), createBlock(UIIcon, {
                  key: 0,
                  class: "selector-icon",
                  icon: _ctx.iconClasses ? _ctx.iconClasses[0] : "",
                  size: 16
                }, null, 8, ["icon"])) : createCommentVNode("", true),
                createBaseVNode("span", _hoisted_2$9, toDisplayString(_ctx.options[_ctx.options.findIndex((item) => item.value === val.value)].label), 1),
                createVNode(UIIcon, {
                  class: normalizeClass(["selector-caret", isShow.value ? "active" : ""]),
                  icon: "textbus-dropdown-caret"
                }, null, 8, ["class"])
              ]),
              _: 1
            }, 8, ["class", "title", "disabled"])
          ]),
          _: 1
        }, 8, ["class", "show", "value", "options"])
      ]);
    };
  }
});
const UISelect = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["__scopeId", "data-v-52755c35"]]);
const _withScopeId = (n) => (pushScopeId("data-v-1e884f56"), n = n(), popScopeId(), n);
const _hoisted_1$i = { class: "segment-dropdown-tool" };
const _hoisted_2$8 = ["title"];
const _hoisted_3$5 = ["data-color"];
const _hoisted_4$3 = { class: "wrapper" };
const _hoisted_5$1 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "clear-icon" }, null, -1));
const _hoisted_6$1 = { class: "list" };
const _hoisted_7 = ["data-bgcolor", "onClick"];
const _sfc_main$j = /* @__PURE__ */ defineComponent({
  __name: "UISegmentDropdown",
  props: {
    iconClasses: {},
    keymap: {},
    tooltip: {},
    options: {},
    onSelected: { type: Function },
    currentValue: {},
    highlight: { type: Function },
    disabled: { type: Function }
  },
  setup(__props) {
    useCssVars((_ctx) => ({
      "249df3d2": unref(themeVars).buttonColor2,
      "616d0965": unref(themeVars).buttonColor2Hover
    }));
    const injector = inject("injector");
    const keyboard = injector == null ? void 0 : injector.get(Keyboard);
    const themeVars = useThemeVars();
    const props = __props;
    const state = reactive({
      highlight: computed(() => {
        var _a;
        return (_a = props.highlight) == null ? void 0 : _a.call(props);
      }),
      disabled: computed(() => {
        var _a;
        return (_a = props.disabled) == null ? void 0 : _a.call(props);
      })
    });
    const isShow = ref(false);
    const btnRef = ref();
    const currentColor = ref(props.options[0]);
    function handleSelect(value) {
      isShow.value = false;
      currentColor.value = value;
      props.onSelected(value);
    }
    function handleLeftBtnClick() {
      props.onSelected(currentColor.value);
    }
    function handleClickoutside(ev) {
      if (btnRef.value === ev.target) {
        return;
      }
      isShow.value = false;
    }
    if (props.keymap) {
      keyboard == null ? void 0 : keyboard.addShortcut({
        keymap: props.keymap,
        action: () => {
          if (!state.disabled && currentColor.value) {
            props.onSelected(currentColor.value);
          }
        }
      });
    }
    return (_ctx, _cache) => {
      const _component_n_button = resolveComponent("n-button");
      const _component_n_popover = resolveComponent("n-popover");
      return openBlock(), createElementBlock("div", _hoisted_1$i, [
        createVNode(_component_n_popover, {
          trigger: "click",
          placement: "bottom-start",
          to: false,
          "show-arrow": false,
          show: isShow.value,
          disabled: state.disabled,
          onClickoutside: handleClickoutside
        }, {
          trigger: withCtx(() => [
            createBaseVNode("div", {
              class: normalizeClass(["trigger", state.disabled ? "disabled" : ""]),
              title: _ctx.tooltip
            }, [
              createBaseVNode("div", {
                class: "selector-left-btn",
                "data-color": currentColor.value,
                style: normalizeStyle({ color: currentColor.value }),
                onClick: handleLeftBtnClick
              }, [
                _ctx.iconClasses ? (openBlock(), createBlock(UIIcon, {
                  key: 0,
                  class: "selector-icon",
                  icon: _ctx.iconClasses ? _ctx.iconClasses[0] : "",
                  size: 16
                }, null, 8, ["icon"])) : createCommentVNode("", true)
              ], 12, _hoisted_3$5),
              createBaseVNode("div", {
                ref_key: "btnRef",
                ref: btnRef,
                class: "selector-right-btn",
                onClick: _cache[0] || (_cache[0] = ($event) => isShow.value = !isShow.value)
              }, [
                createVNode(UIIcon, {
                  class: normalizeClass(["selector-caret", isShow.value ? "active" : ""]),
                  icon: "textbus-dropdown-caret"
                }, null, 8, ["class"])
              ], 512)
            ], 10, _hoisted_2$8)
          ]),
          default: withCtx(() => [
            createBaseVNode("div", _hoisted_4$3, [
              createVNode(_component_n_button, {
                class: "default-color",
                size: "small",
                block: "",
                secondary: "",
                onClick: _cache[1] || (_cache[1] = ($event) => handleSelect(_ctx.options[0])),
                disabled: state.disabled
              }, {
                default: withCtx(() => [
                  _hoisted_5$1,
                  createTextVNode(" 默认颜色 ")
                ]),
                _: 1
              }, 8, ["disabled"]),
              createBaseVNode("div", _hoisted_6$1, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.options, (item) => {
                  return openBlock(), createElementBlock("div", {
                    key: item,
                    "data-bgcolor": item,
                    class: normalizeClass(["color-block", _ctx.currentValue.value === item ? "using" : ""]),
                    style: normalizeStyle({ backgroundColor: item }),
                    onClick: ($event) => handleSelect(item)
                  }, null, 14, _hoisted_7);
                }), 128))
              ])
            ])
          ]),
          _: 1
        }, 8, ["show", "disabled"])
      ]);
    };
  }
});
const UISegmentDropdown = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["__scopeId", "data-v-1e884f56"]]);
const _hoisted_1$h = ["data-keymap", "title"];
const _hoisted_2$7 = {
  key: 1,
  class: "label"
};
const _sfc_main$i = /* @__PURE__ */ defineComponent({
  __name: "UISwitchButton",
  props: {
    iconClasses: {},
    label: {},
    tooltip: {},
    onClick: { type: Function },
    keymap: {},
    highlight: { type: Function },
    disabled: { type: Function },
    iconIndex: { type: Function }
  },
  setup(__props) {
    useCssVars((_ctx) => ({
      "13003670": unref(themeVars).buttonColor2Hover,
      "018114ae": unref(themeVars).buttonColor2Pressed
    }));
    const themeVars = useThemeVars();
    const props = __props;
    const state = reactive({
      highlight: computed(() => {
        var _a;
        return (_a = props.highlight) == null ? void 0 : _a.call(props);
      }),
      disabled: computed(() => {
        var _a;
        return (_a = props.disabled) == null ? void 0 : _a.call(props);
      }),
      iconIndex: computed(() => {
        var _a;
        return (_a = props.iconIndex) == null ? void 0 : _a.call(props);
      })
    });
    function handleClick() {
      props.onClick && props.onClick();
    }
    return (_ctx, _cache) => {
      const _component_n_button = resolveComponent("n-button");
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["button-tool", state.highlight ? "active" : ""]),
        "data-keymap": JSON.stringify(_ctx.keymap),
        title: _ctx.tooltip,
        onClick: handleClick
      }, [
        createVNode(_component_n_button, {
          class: "btn",
          block: "",
          text: "",
          size: "large",
          disabled: state.disabled
        }, {
          default: withCtx(() => {
            var _a;
            return [
              ((_a = _ctx.iconClasses) == null ? void 0 : _a.length) ? (openBlock(), createBlock(UIIcon, {
                key: 0,
                icon: _ctx.iconClasses ? _ctx.iconClasses[state.iconIndex || 0] : "",
                size: 24
              }, null, 8, ["icon"])) : createCommentVNode("", true),
              _ctx.label ? (openBlock(), createElementBlock("span", _hoisted_2$7, toDisplayString(_ctx.label), 1)) : createCommentVNode("", true)
            ];
          }),
          _: 1
        }, 8, ["disabled"])
      ], 10, _hoisted_1$h);
    };
  }
});
const UISwitchButton = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["__scopeId", "data-v-44a7b693"]]);
let ButtonTool$2 = class ButtonTool {
  constructor(factory) {
    __publicField(this, "config");
    __publicField(this, "controller");
    __publicField(this, "isHighlight");
    __publicField(this, "isDisabled");
    this.factory = factory;
    this.isHighlight = ref(false);
    this.isDisabled = ref(false);
  }
  setup(injector) {
    this.config = this.factory(injector);
    this.controller = injector.get(Controller$1);
    const keyboard = injector.get(Keyboard);
    const viewer = h(UIButton$2, {
      ...this.config,
      highlight: () => this.isHighlight.value,
      disabled: () => this.isDisabled.value
    });
    if (this.config.keymap) {
      keyboard.addShortcut({
        keymap: this.config.keymap,
        action: () => {
          this.config.onClick();
        }
      });
    }
    this.controller.onReadonlyStateChange.subscribe((v) => {
      this.isDisabled.value = v;
    });
    return viewer;
  }
  refreshState() {
    if (!this.config.queryState) {
      return;
    }
    if (this.controller.readonly) {
      this.isDisabled.value = true;
      this.isHighlight.value = false;
      return;
    }
    const state = this.config.queryState();
    switch (state.state) {
      case QueryStateType.Disabled:
        this.isDisabled.value = true;
        this.isHighlight.value = false;
        break;
      case QueryStateType.Enabled:
        this.isDisabled.value = false;
        this.isHighlight.value = true;
        break;
      case QueryStateType.Normal:
        this.isDisabled.value = false;
        this.isHighlight.value = false;
    }
  }
  disabled(is) {
    if (is) {
      this.isDisabled.value = true;
      this.isHighlight.value = false;
    }
  }
  onDestroy() {
    var _a, _b;
    (_b = (_a = this.config).onDestroy) == null ? void 0 : _b.call(_a);
  }
};
class PopoverTool {
  constructor(factory) {
    __publicField(this, "config");
    // private viewer!: UIPopover
    __publicField(this, "controller");
    __publicField(this, "subs", []);
    __publicField(this, "isHighlight");
    __publicField(this, "isDisabled");
    this.factory = factory;
    this.isHighlight = ref(false);
    this.isDisabled = ref(false);
  }
  setup(textbus) {
    const config = this.factory(textbus);
    this.config = config;
    this.controller = textbus.get(Controller$1);
    const viewer = h(UIPopover, {
      ...this.config,
      options: [],
      highlight: () => this.isHighlight.value,
      disabled: () => this.isDisabled.value
    });
    this.controller.onReadonlyStateChange.subscribe((v) => {
      this.isDisabled.value = v;
    });
    return viewer;
  }
  refreshState() {
    if (this.controller.readonly) {
      this.isDisabled.value = true;
      this.isHighlight.value = false;
      return;
    }
    const state = this.config.queryState();
    switch (state.state) {
      case QueryStateType.Enabled:
        this.isDisabled.value = false;
        this.isHighlight.value = true;
        break;
      case QueryStateType.Normal:
        this.isDisabled.value = false;
        this.isHighlight.value = false;
        break;
      case QueryStateType.Disabled:
        this.isDisabled.value = true;
        this.isHighlight.value = false;
        break;
    }
  }
  disabled(is) {
    if (is) {
      this.isDisabled.value = true;
      this.isHighlight.value = false;
    }
  }
  onDestroy() {
    var _a, _b;
    this.subs.forEach((i) => i.unsubscribe());
    (_b = (_a = this.config).onDestroy) == null ? void 0 : _b.call(_a);
  }
}
class SegmentDropdownTool {
  constructor(factory) {
    __publicField(this, "config");
    __publicField(this, "controller");
    __publicField(this, "isHighlight");
    __publicField(this, "isDisabled");
    __publicField(this, "currentValue");
    this.factory = factory;
    this.isHighlight = ref(false);
    this.isDisabled = ref(false);
    this.currentValue = ref("");
  }
  setup(injector) {
    const config = this.factory(injector);
    this.controller = injector.get(Controller$1);
    this.config = config;
    const colorProvider = injector.get(ColorProvider);
    const colorOptions = colorProvider.getColorOptions();
    const dropdown = h(UISegmentDropdown, {
      // ...config,
      tooltip: config.tooltip,
      keymap: config.keymap,
      iconClasses: config.iconClasses,
      options: colorOptions,
      onSelected: (value) => {
        config.useValue && config.useValue(value);
      },
      currentValue: this.currentValue,
      highlight: () => this.isHighlight.value,
      disabled: () => this.isDisabled.value
    });
    this.controller.onReadonlyStateChange.subscribe((v) => {
      this.isDisabled.value = v;
    });
    return dropdown;
  }
  disabled(is) {
    if (is) {
      this.isDisabled.value = true;
      this.isHighlight.value = false;
    }
  }
  refreshState() {
    if (!this.config.queryState) {
      return;
    }
    if (this.controller.readonly) {
      this.isDisabled.value = true;
      this.isHighlight.value = false;
      return;
    }
    const state = this.config.queryState();
    this.currentValue.value = state.value;
    switch (state.state) {
      case QueryStateType.Enabled:
        this.isDisabled.value = false;
        this.isHighlight.value = true;
        break;
      case QueryStateType.Normal:
        this.isDisabled.value = false;
        this.isHighlight.value = false;
        break;
      case QueryStateType.Disabled:
        this.isDisabled.value = true;
        this.isHighlight.value = false;
        break;
    }
  }
  onDestroy() {
    var _a, _b;
    (_b = (_a = this.config).onDestroy) == null ? void 0 : _b.call(_a);
  }
}
class SelectTool {
  // 当前值
  constructor(factory) {
    __publicField(this, "config");
    __publicField(this, "controller");
    __publicField(this, "isHighlight");
    __publicField(this, "isDisabled");
    __publicField(this, "currentVal");
    this.factory = factory;
    this.isHighlight = ref(false);
    this.isDisabled = ref(false);
    this.currentVal = ref(null);
  }
  setup(injector, limitElement) {
    const config = this.factory(injector);
    this.controller = injector.get(Controller$1);
    this.config = config;
    this.currentVal.value = this.config.options[this.config.options.findIndex((item) => item.default)].value;
    const keyboard = injector.get(Keyboard);
    const select = h(UISelect, {
      currentValue: this.currentVal,
      ...config,
      onSelected: (value) => {
        config.onChecked(value);
      },
      highlight: () => this.isHighlight.value,
      disabled: () => this.isDisabled.value
    });
    config.options.filter((i) => i.keymap).forEach((i) => {
      keyboard.addShortcut({
        keymap: i.keymap,
        action: () => {
          if (!this.isDisabled.value) {
            this.config.onChecked(i.value);
          }
        }
      });
    });
    this.controller.onReadonlyStateChange.subscribe((v) => {
      this.isDisabled.value = v;
    });
    return select;
  }
  refreshState() {
    if (!this.config.queryState) {
      return;
    }
    if (this.controller.readonly) {
      this.isDisabled.value = true;
      this.isHighlight.value = false;
      return;
    }
    const state = this.config.queryState();
    if (state.value) {
      const option = this.config.options.find((i) => {
        return i.value === state.value;
      });
      if (option) {
        this.currentVal.value = option.value;
        this.isDisabled.value = false;
        this.isHighlight.value = true;
        return;
      }
    }
    this.isHighlight.value = false;
    this.isDisabled.value = state.state === QueryStateType.Disabled;
    this.currentVal.value = this.config.options[this.config.options.findIndex((item) => item.default)].value;
  }
  disabled(is) {
    if (is) {
      this.isDisabled.value = true;
      this.isHighlight.value = false;
    }
  }
  onDestroy() {
    var _a, _b;
    (_b = (_a = this.config).onDestroy) == null ? void 0 : _b.call(_a);
  }
}
var ToolType = /* @__PURE__ */ ((ToolType2) => {
  ToolType2["Button"] = "button";
  ToolType2["Select"] = "select";
  ToolType2["Render"] = "render";
  ToolType2["Dialog"] = "dialog";
  return ToolType2;
})(ToolType || {});
class DropdownTool {
  constructor(factory) {
    __publicField(this, "menus", []);
    __publicField(this, "isHighlight");
    __publicField(this, "isDisabled");
    __publicField(this, "controller");
    this.factory = factory;
    this.isHighlight = ref(false);
    this.isDisabled = ref(false);
  }
  setup(injector, limitElement) {
    const config = this.factory(injector);
    const keyboard = injector.get(Keyboard);
    const dialog = injector.get(DialogProvider);
    this.controller = injector.get(Controller$1);
    this.menus = config.options.map((option) => {
      switch (option.type) {
        case "button":
          return option;
        case "select":
          return this.createSelect(option, keyboard);
        case "render":
          return this.createPopover(option, keyboard);
        case "dialog":
          return this.createDialog(option, dialog, injector, keyboard);
      }
    });
    const dropdown = h(UIDropdown, {
      class: config.class,
      iconClasses: config.iconClasses,
      tooltip: config.tooltip,
      label: config.label,
      options: this.menus,
      highlight: () => this.isHighlight.value,
      disabled: () => this.isDisabled.value
    });
    this.controller.onReadonlyStateChange.subscribe((v) => {
      this.isDisabled.value = v;
    });
    return dropdown;
  }
  refreshState() {
  }
  disabled() {
  }
  onDestroy() {
    this.menus = [];
  }
  createDialog(config, dialog, injector, keyboard) {
    var _a, _b;
    return {
      label: config.label,
      iconClasses: (_a = config.classes) == null ? void 0 : _a.join(" "),
      classes: (_b = config.classes) == null ? void 0 : _b.join(" "),
      type: config.type,
      onClick: () => {
        dialog.create({
          content: config.view
        }, injector);
      }
    };
  }
  createPopover(config, keyboard) {
    var _a;
    return {
      label: config.label,
      classes: (_a = config.classes) == null ? void 0 : _a.join(" "),
      type: config.type,
      render: config.view
    };
  }
  createSelect(config, keyboard) {
    const options = config.options.map((option) => {
      var _a;
      return {
        label: option.label,
        classes: (_a = option.classes) == null ? void 0 : _a.join(" "),
        props: {
          onClick: () => {
            config.onChecked(option.value);
          }
        }
      };
    });
    return {
      label: config.label,
      type: config.type,
      children: [
        ...options
      ]
    };
  }
  // private createDialog(config: DialogToolConfig, keyboard: Keyboard, dialog: Dialog) {
  //   const item = this._createItem({
  //     ...config,
  //     label: config.label || '',
  //     isDropdown: false
  //   })
  //   fromEvent(item.elementRef, 'click').subscribe(() => {
  //     dialog.show(config.viewController.elementRef)
  //     this.uiDropdown.hide()
  //   })
  //   const defaultValue: any = {}
  //   let prevValue = defaultValue
  //   config.viewController.onComplete.subscribe(value => {
  //     prevValue = value
  //     config.useValue(value)
  //     dialog.hide()
  //   })
  //   config.viewController.onCancel.subscribe(() => {
  //     dialog.hide()
  //   })
  //   if (config.keymap) {
  //     keyboard.addShortcut({
  //       keymap: config.keymap,
  //       action() {
  //         if (!item.disabled && prevValue !== defaultValue) {
  //           config.useValue(prevValue)
  //         }
  //       }
  //     })
  //   }
  //   const controller = this.controller
  //   return {
  //     elementRef: item.elementRef,
  //     disabled(is: boolean) {
  //       item.disabled = is
  //     },
  //     refreshState() {
  //       if (!config.queryState) {
  //         return
  //       }
  //       const viewer = item
  //       if (controller.readonly) {
  //         viewer.disabled = true
  //         viewer.highlight = false
  //         return
  //       }
  //       const state = config.queryState()
  //       switch (state.state) {
  //         case QueryStateType.Disabled:
  //           viewer.disabled = true
  //           viewer.highlight = false
  //           config.viewController.reset()
  //           break
  //         case QueryStateType.Enabled:
  //           viewer.disabled = false
  //           viewer.highlight = true
  //           config.viewController.update(state.value)
  //           break
  //         case QueryStateType.Normal:
  //           viewer.disabled = false
  //           viewer.highlight = false
  //           config.viewController.reset()
  //       }
  //     }
  //   }
  // }
  // private createDropdown(config: DropdownToolConfig, keyboard: Keyboard) {
  //   const item = this._createItem({
  //     ...config,
  //     label: config.label || '',
  //     isDropdown: true
  //   })
  //   const menu = createElement('div', {
  //     classes: ['textbus-toolbar-submenu'],
  //     children: [
  //       config.viewController.elementRef
  //     ]
  //   })
  //   const defaultValue: any = {}
  //   let prevValue = defaultValue
  //   config.viewController.onComplete.subscribe(v => {
  //     prevValue = v
  //     config.useValue(v)
  //     this.uiDropdown.hide()
  //   })
  //   if (config.keymap) {
  //     keyboard.addShortcut({
  //       keymap: config.keymap,
  //       action() {
  //         if (!item.disabled && prevValue !== defaultValue) {
  //           config.useValue(prevValue)
  //         }
  //       }
  //     })
  //   }
  //   item.elementRef.appendChild(menu)
  //   const controller = this.controller
  //   return {
  //     elementRef: item.elementRef,
  //     disabled(is: boolean) {
  //       item.disabled = is
  //     },
  //     refreshState() {
  //       if (!config.queryState) {
  //         return
  //       }
  //       const viewer = item
  //       if (controller.readonly) {
  //         viewer.disabled = true
  //         viewer.highlight = false
  //         return
  //       }
  //       const state = config.queryState()
  //       switch (state.state) {
  //         case QueryStateType.Disabled:
  //           viewer.disabled = true
  //           viewer.highlight = false
  //           config.viewController.reset()
  //           break
  //         case QueryStateType.Enabled:
  //           viewer.disabled = false
  //           viewer.highlight = true
  //           config.viewController.update(state.value)
  //           break
  //         case QueryStateType.Normal:
  //           viewer.disabled = false
  //           viewer.highlight = false
  //           config.viewController.reset()
  //       }
  //     }
  //   }
  // }
  // private createSelect(config: SelectToolMenu, keyboard: Keyboard): ToolItem {
  //   const item = this._createItem({
  //     ...config,
  //     isDropdown: true
  //   })
  //   const map = new Map<SelectOptionConfig, Element>()
  //   const menu = createElement('div', {
  //     classes: ['textbus-toolbar-submenu'],
  //     children: [
  //       createElement('div', {
  //         classes: ['textbus-toolbar-select-options'],
  //         children: config.options.map(option => {
  //           const el = createOption({
  //             ...option,
  //             onClick: () => {
  //               config.onChecked(option.value)
  //               this.uiDropdown.hide()
  //             }
  //           })
  //           map.set(option, el)
  //           if (option.keymap) {
  //             keyboard.addShortcut({
  //               keymap: option.keymap,
  //               action() {
  //                 if (!item.disabled) {
  //                   config.onChecked(option.value)
  //                 }
  //               }
  //             })
  //           }
  //           return el
  //         })
  //       })
  //     ]
  //   })
  //   item.elementRef.appendChild(menu)
  //   const controller = this.controller
  //   return {
  //     elementRef: item.elementRef,
  //     disabled(is: boolean) {
  //       item.disabled = is
  //     },
  //     refreshState() {
  //       if (!config.queryState) {
  //         return
  //       }
  //       const viewer = item
  //       if (controller.readonly) {
  //         viewer.disabled = true
  //         viewer.highlight = false
  //         return
  //       }
  //       const state = config.queryState()
  //       switch (state.state) {
  //         case QueryStateType.Disabled:
  //           viewer.disabled = true
  //           viewer.highlight = false
  //           break
  //         case QueryStateType.Enabled:
  //           viewer.disabled = false
  //           viewer.highlight = true
  //           map.forEach((el, config) => {
  //             if (config.value === state.value) {
  //               el.classList.add('textbus-toolbar-option-active')
  //             } else {
  //               el.classList.remove('textbus-toolbar-option-active')
  //             }
  //           })
  //           break
  //         case QueryStateType.Normal:
  //           viewer.disabled = false
  //           viewer.highlight = false
  //           map.forEach((el) => {
  //             el.classList.remove('textbus-toolbar-option-active')
  //           })
  //       }
  //     }
  //   }
  // }
  // private createButton(config: ButtonToolMenu, keyboard: Keyboard): ToolItem {
  //   const item = this._createItem({
  //     ...config,
  //     label: config.label || '',
  //     isDropdown: false
  //   })
  //   fromEvent(item.elementRef, 'click').subscribe(() => {
  //     config.onClick()
  //     this.uiDropdown.hide()
  //   })
  //   if (config.keymap) {
  //     keyboard.addShortcut({
  //       keymap: config.keymap,
  //       action() {
  //         if (!item.disabled) {
  //           config.onClick()
  //         }
  //       }
  //     })
  //   }
  //   const controller = this.controller
  //   return {
  //     elementRef: item.elementRef,
  //     disabled(is: boolean) {
  //       item.disabled = is
  //     },
  //     refreshState() {
  //       if (!config.queryState) {
  //         return
  //       }
  //       const viewer = item
  //       if (controller.readonly) {
  //         viewer.disabled = true
  //         viewer.highlight = false
  //         return
  //       }
  //       const state = config.queryState()
  //       switch (state.state) {
  //         case QueryStateType.Disabled:
  //           viewer.disabled = true
  //           viewer.highlight = false
  //           break
  //         case QueryStateType.Enabled:
  //           viewer.disabled = false
  //           viewer.highlight = true
  //           break
  //         case QueryStateType.Normal:
  //           viewer.disabled = false
  //           viewer.highlight = false
  //       }
  //     }
  //   }
  // }
  // private _createItem(config: GroupItemConfig) {
  //   const button = createElement('button', {
  //     attrs: {
  //       type: 'button'
  //     },
  //     classes: ['textbus-toolbar-group-button'],
  //     children: [
  //       config.iconClasses ? createElement('span', {
  //         classes: [...config.iconClasses, 'textbus-toolbar-group-button-icon']
  //       }) : null,
  //       createElement('span', {
  //         classes: ['textbus-toolbar-group-button-label'],
  //         children: [
  //           createTextNode(config.label)
  //         ]
  //       }),
  //       config.keymap ? createElement('span', {
  //         classes: ['textbus-toolbar-group-button-keymap'],
  //         children: createKeymap(config.keymap)
  //       }) : null,
  //       config.isDropdown ? createElement('span', {
  //         classes: ['textbus-toolbar-group-button-caret']
  //       }) : null
  //     ]
  //   }) as HTMLButtonElement
  //   const wrapper = createElement('div', {
  //     classes: ['textbus-toolbar-group-item'],
  //     children: [
  //       button
  //     ]
  //   })
  //   let highlight = false
  //   let disabled = false
  //   return {
  //     elementRef: wrapper,
  //     get highlight() {
  //       return highlight
  //     },
  //     set highlight(v: boolean) {
  //       highlight = v
  //       if (v) {
  //         button.classList.add('textbus-toolbar-group-button-active')
  //       } else {
  //         button.classList.remove('textbus-toolbar-group-button-active')
  //       }
  //     },
  //     get disabled() {
  //       return disabled
  //     },
  //     set disabled(v: boolean) {
  //       disabled = v
  //       button.disabled = v
  //     }
  //   }
  // }
}
class SwitchButtonTool {
  // params: Writable<UIButtonDefineProps> = {}
  constructor(factory) {
    __publicField(this, "config");
    __publicField(this, "controller");
    __publicField(this, "isHighlight");
    __publicField(this, "isDisabled");
    __publicField(this, "iconIndex");
    this.factory = factory;
    this.isHighlight = ref(false);
    this.isDisabled = ref(false);
    this.iconIndex = ref(0);
  }
  setup(injector) {
    const updateState = (state) => {
      if (state.highlight !== void 0)
        this.isHighlight.value = state.highlight;
      if (state.disabled !== void 0)
        this.isDisabled.value = state.disabled;
      if (state.iconIndex !== void 0)
        this.iconIndex.value = state.iconIndex;
    };
    this.config = this.factory(injector, updateState);
    this.controller = injector.get(Controller$1);
    const keyboard = injector.get(Keyboard);
    const viewer = h(UISwitchButton, {
      ...this.config,
      highlight: () => this.isHighlight.value,
      disabled: () => this.isDisabled.value,
      iconIndex: () => this.iconIndex.value
    });
    if (this.config.keymap) {
      keyboard.addShortcut({
        keymap: this.config.keymap,
        action: () => {
          this.config.onClick();
        }
      });
    }
    this.controller.onReadonlyStateChange.subscribe((v) => {
      this.isDisabled.value = v;
    });
    return viewer;
  }
  refreshState() {
    if (this.controller.readonly) {
      this.isDisabled.value = true;
      this.isHighlight.value = false;
      return;
    }
  }
  disabled(is) {
    if (is) {
      this.isDisabled.value = true;
      this.isHighlight.value = false;
    }
  }
  onDestroy() {
    var _a, _b;
    (_b = (_a = this.config).onDestroy) == null ? void 0 : _b.call(_a);
  }
}
function boldToolConfigFactory(injector) {
  const query = injector.get(Query);
  const commander = injector.get(Commander);
  const i18n = injector.get(I18n);
  return {
    // iconClasses: [`${MaterialTypeEnum.FILLED}format_bold`],
    iconClasses: [`textbus-icon-bold`],
    tooltip: i18n.get("plugins.toolbar.boldTool.tooltip"),
    keymap: {
      ctrlKey: true,
      key: "b"
    },
    queryState() {
      return query.queryFormat(boldFormatter);
    },
    onClick() {
      const state = query.queryFormat(boldFormatter);
      const b = state.state === QueryStateType.Enabled;
      b ? commander.unApplyFormat(boldFormatter) : commander.applyFormat(boldFormatter, "");
    }
  };
}
function boldTool() {
  return new ButtonTool$2(boldToolConfigFactory);
}
function historyBackToolConfigFactory(injector) {
  const history = injector.get(History);
  const i18n = injector.get(I18n);
  return {
    iconClasses: [`textbus-icon-history-back`],
    tooltip: i18n.get("plugins.toolbar.historyBackTool.tooltip"),
    keymap: {
      ctrlKey: true,
      key: "z"
    },
    queryState() {
      return {
        state: history.canBack ? QueryStateType.Normal : QueryStateType.Disabled,
        value: null
      };
    },
    onClick() {
      history.back();
    }
  };
}
function historyBackTool() {
  return new ButtonTool$2(historyBackToolConfigFactory);
}
function historyForwardToolConfigFactory(injector) {
  const history = injector.get(History);
  const i18n = injector.get(I18n);
  return {
    iconClasses: [`textbus-icon-history-forward`],
    tooltip: i18n.get("plugins.toolbar.historyForwardTool.tooltip"),
    keymap: {
      ctrlKey: true,
      // shiftKey: true,
      key: "y"
    },
    queryState() {
      return {
        state: history.canForward ? QueryStateType.Normal : QueryStateType.Disabled,
        value: null
      };
    },
    onClick() {
      history.forward();
    }
  };
}
function historyForwardTool() {
  return new ButtonTool$2(historyForwardToolConfigFactory);
}
function italicToolConfigFactory(injector) {
  const query = injector.get(Query);
  const commander = injector.get(Commander);
  const i18n = injector.get(I18n);
  return {
    iconClasses: ["textbus-icon-italic"],
    tooltip: i18n.get("plugins.toolbar.italicTool.tooltip"),
    keymap: {
      ctrlKey: true,
      key: "i"
    },
    queryState() {
      return query.queryFormat(italicFormatter);
    },
    onClick() {
      const state = query.queryFormat(italicFormatter);
      const b = state.state === QueryStateType.Enabled;
      b ? commander.unApplyFormat(italicFormatter) : commander.applyFormat(italicFormatter, true);
    }
  };
}
function italicTool() {
  return new ButtonTool$2(italicToolConfigFactory);
}
function strikeThroughToolConfigFactory(injector) {
  const i18n = injector.get(I18n);
  const query = injector.get(Query);
  const commander = injector.get(Commander);
  return {
    iconClasses: ["textbus-icon-strikethrough"],
    tooltip: i18n.get("plugins.toolbar.strikeThrough.tooltip"),
    keymap: {
      ctrlKey: true,
      key: "d"
    },
    queryState() {
      return query.queryFormat(strikeThroughFormatter);
    },
    onClick() {
      const state = query.queryFormat(strikeThroughFormatter);
      const b = state.state === QueryStateType.Enabled;
      b ? commander.unApplyFormat(strikeThroughFormatter) : commander.applyFormat(strikeThroughFormatter, true);
    }
  };
}
function strikeThroughTool() {
  return new ButtonTool$2(strikeThroughToolConfigFactory);
}
function underlineToolConfigFactory(injector) {
  const query = injector.get(Query);
  const commander = injector.get(Commander);
  const i18n = injector.get(I18n);
  return {
    iconClasses: ["textbus-icon-underline"],
    tooltip: i18n.get("plugins.toolbar.ulTool.tooltip"),
    keymap: {
      ctrlKey: true,
      key: "u"
    },
    queryState() {
      return query.queryFormat(underlineFormatter);
    },
    onClick() {
      const state = query.queryFormat(underlineFormatter);
      const b = state.state === QueryStateType.Enabled;
      b ? commander.unApplyFormat(underlineFormatter) : commander.applyFormat(underlineFormatter, true);
    }
  };
}
function underlineTool() {
  return new ButtonTool$2(underlineToolConfigFactory);
}
function listToolCreator(injector, type) {
  const selection = injector.get(Selection);
  const commander = injector.get(Commander);
  const instance = {
    queryState() {
      const component = selection.commonAncestorComponent;
      if ((component == null ? void 0 : component.name) === listComponent.name && component.extends.type === type) {
        return {
          state: QueryStateType.Enabled,
          value: component
        };
      }
      return {
        state: QueryStateType.Normal,
        value: null
      };
    },
    onClick() {
      const queryState = instance.queryState();
      if (queryState.state === QueryStateType.Normal) {
        instance.toList();
      } else {
        instance.toParagraph();
      }
    },
    toParagraph() {
      commander.transform({
        target: paragraphComponent$1,
        multipleSlot: false,
        slotFactory() {
          return new Slot([
            ContentType.Text,
            ContentType.InlineComponent
          ]);
        }
      });
    },
    toList() {
      commander.transform({
        target: listComponent,
        multipleSlot: true,
        slotFactory() {
          return new Slot([
            ContentType.Text,
            ContentType.InlineComponent
          ]);
        },
        stateFactory() {
          return type;
        }
      });
    }
  };
  return instance;
}
function olToolConfigFactory(injector) {
  const i18n = injector.get(I18n);
  return {
    iconClasses: ["textbus-icon-list-numbered"],
    tooltip: i18n.get("plugins.toolbar.olTool.tooltip"),
    keymap: {
      shiftKey: true,
      ctrlKey: true,
      key: "o"
    },
    ...listToolCreator(injector, "ol")
  };
}
function olTool() {
  return new ButtonTool$2(olToolConfigFactory);
}
function ulToolConfigFactory(injector) {
  const i18n = injector.get(I18n);
  return {
    iconClasses: ["textbus-icon-list"],
    tooltip: i18n.get("plugins.toolbar.ulTool.tooltip"),
    keymap: {
      shiftKey: true,
      ctrlKey: true,
      key: "u"
    },
    ...listToolCreator(injector, "ul")
  };
}
function ulTool() {
  return new ButtonTool$2(ulToolConfigFactory);
}
function tableRemoveToolConfigFactory(injector) {
  const i18n = injector.get(I18n);
  const query = injector.get(Query);
  const commander = injector.get(Commander);
  return {
    iconClasses: ["textbus-icon-table-remove"],
    tooltip: i18n.get("plugins.toolbar.tableAddTool.tooltip"),
    queryState() {
      const s = query.queryComponent(tableComponent);
      if (s.state !== QueryStateType.Enabled) {
        s.state = QueryStateType.Disabled;
      } else if (s.state === QueryStateType.Enabled) {
        s.state = QueryStateType.Normal;
      }
      return s;
    },
    onClick() {
      const s = query.queryComponent(tableComponent);
      if (s.state === QueryStateType.Enabled) {
        commander.removeComponent(s.value);
      }
    }
  };
}
function tableRemoveTool() {
  return new ButtonTool$2(tableRemoveToolConfigFactory);
}
function insertParagraphAfterToolConfigFactory(injector) {
  const i18n = injector.get(I18n);
  const commander = injector.get(Commander);
  const selection = injector.get(Selection);
  return {
    iconClasses: ["textbus-icon-insert-paragraph-after"],
    tooltip: i18n.get("plugins.toolbar.insertParagraphAfterTool.tooltip"),
    keymap: {
      ctrlKey: true,
      key: "p"
    },
    queryState() {
      var _a;
      if (selection.isSelected) {
        if ((_a = selection.commonAncestorComponent) == null ? void 0 : _a.parent) {
          return {
            state: QueryStateType.Normal,
            value: null
          };
        }
      }
      return {
        state: QueryStateType.Disabled,
        value: null
      };
    },
    onClick() {
      const p2 = paragraphComponent$1.createInstance(injector);
      commander.insertAfter(p2, selection.commonAncestorComponent);
      selection.setPosition(p2.slots.get(0), 0);
    }
  };
}
function insertParagraphAfterTool() {
  return new ButtonTool$2(insertParagraphAfterToolConfigFactory);
}
function insertParagraphBeforeToolConfigFactory(injector) {
  const i18n = injector.get(I18n);
  const commander = injector.get(Commander);
  const selection = injector.get(Selection);
  return {
    iconClasses: ["textbus-icon-insert-paragraph-before"],
    tooltip: i18n.get("plugins.toolbar.insertParagraphBeforeTool.tooltip"),
    keymap: {
      ctrlKey: true,
      shiftKey: true,
      key: "p"
    },
    queryState() {
      var _a;
      if (selection.isSelected) {
        if ((_a = selection.commonAncestorComponent) == null ? void 0 : _a.parent) {
          return {
            state: QueryStateType.Normal,
            value: null
          };
        }
      }
      return {
        state: QueryStateType.Disabled,
        value: null
      };
    },
    onClick() {
      const p2 = paragraphComponent$1.createInstance(injector);
      commander.insertBefore(p2, selection.commonAncestorComponent);
      selection.setPosition(p2.slots.get(0), 0);
    }
  };
}
function insertParagraphBeforeTool() {
  return new ButtonTool$2(insertParagraphBeforeToolConfigFactory);
}
function unlinkToolConfigFactory(injector) {
  const i18n = injector.get(I18n);
  const selection = injector.get(Selection);
  const query = injector.get(Query);
  const commander = injector.get(Commander);
  return {
    tooltip: i18n.get("plugins.toolbar.unlinkTool.tooltip"),
    iconClasses: ["textbus-icon-unlink"],
    queryState() {
      const state = query.queryFormat(linkFormatter);
      if (state.state === QueryStateType.Normal) {
        state.state = QueryStateType.Disabled;
      }
      return state;
    },
    onClick() {
      if (selection.isCollapsed) {
        const slot = selection.startSlot;
        slot.getFormatRangesByFormatter(linkFormatter, 0, slot.length).filter((f) => {
          return f.startIndex < selection.startOffset && f.endIndex >= selection.endOffset;
        }).forEach((f) => {
          slot.retain(f.startIndex);
          slot.retain(f.endIndex - f.startIndex, linkFormatter, null);
        });
      } else {
        commander.unApplyFormat(linkFormatter);
      }
    }
  };
}
function unlinkTool() {
  return new ButtonTool$2(unlinkToolConfigFactory);
}
function formatPainterToolConfigFactory(injector) {
  const selection = injector.get(Selection);
  const commander = injector.get(Commander);
  const doc2 = injector.get(VIEW_DOCUMENT);
  const i18n = injector.get(I18n);
  const registry = injector.get(Registry);
  let isActive = false;
  return {
    iconClasses: ["textbus-icon-brush"],
    tooltip: i18n.get("plugins.toolbar.formatPainterTool.tooltip"),
    queryState() {
      if (isActive) {
        return {
          state: QueryStateType.Enabled,
          value: null
        };
      }
      return {
        state: selection.isSelected ? QueryStateType.Normal : QueryStateType.Disabled,
        value: null
      };
    },
    onClick() {
      if (!selection.isSelected) {
        return;
      }
      isActive = true;
      const startSlot = selection.startSlot;
      const formats = startSlot.extractFormatsByIndex(selection.startOffset);
      const parentComponent = startSlot.parent;
      const multipleComponent = [
        listComponent,
        todolistComponent
      ];
      const canTransformComponentNames = [
        paragraphComponent$1,
        blockComponent,
        listComponent,
        todolistComponent,
        headingComponent
      ].map((i) => i.name);
      let componentName = paragraphComponent$1.name;
      let state = null;
      if (canTransformComponentNames.includes(parentComponent.name)) {
        componentName = parentComponent.name;
        state = typeof parentComponent.state === "object" && parentComponent.state !== null ? JSON.parse(JSON.stringify(parentComponent.state)) : parentComponent.state;
      }
      const { Text: Text2, InlineComponent, BlockComponent } = ContentType;
      fromEvent(doc2, "mouseup").pipe(take(1), delay(10)).subscribe(() => {
        isActive = false;
        commander.cleanFormats([linkFormatter]);
        formats.forEach((i) => {
          commander.applyFormat(i[0], i[1]);
        });
        commander.transform({
          multipleSlot: multipleComponent.map((i) => i.name).includes(componentName),
          target: registry.getComponent(componentName),
          slotFactory() {
            return new Slot(componentName === blockComponent.name ? [
              Text2,
              InlineComponent,
              BlockComponent
            ] : [
              Text2,
              InlineComponent
            ], startSlot.state);
          },
          stateFactory() {
            return state;
          }
        });
      });
    }
  };
}
function formatPainterTool() {
  return new ButtonTool$2(formatPainterToolConfigFactory);
}
function cleanToolConfigFactory(injector) {
  const selection = injector.get(Selection);
  const commander = injector.get(Commander);
  const i18n = injector.get(I18n);
  return {
    iconClasses: ["textbus-icon-clear-formatting"],
    tooltip: i18n.get("plugins.toolbar.cleanTool.tooltip"),
    keymap: {
      ctrlKey: true,
      shiftKey: true,
      altKey: true,
      key: "c"
    },
    queryState() {
      return {
        state: selection.isCollapsed ? QueryStateType.Disabled : QueryStateType.Normal,
        value: null
      };
    },
    onClick() {
      commander.cleanFormats([linkFormatter]);
      commander.cleanAttributes();
    }
  };
}
function cleanTool() {
  return new ButtonTool$2(cleanToolConfigFactory);
}
function superscriptToolConfigFactory(injector) {
  const i18n = injector.get(I18n);
  const query = injector.get(Query);
  const commander = injector.get(Commander);
  return {
    iconClasses: ["textbus-icon-superscript"],
    tooltip: i18n.get("plugins.toolbar.superscript.tooltip"),
    queryState() {
      return query.queryFormat(superscriptFormatter);
    },
    onClick() {
      const state = query.queryFormat(superscriptFormatter);
      const b = state.state === QueryStateType.Enabled;
      b ? commander.unApplyFormat(superscriptFormatter) : commander.applyFormat(superscriptFormatter, true);
    }
  };
}
function superscriptTool() {
  return new ButtonTool$2(superscriptToolConfigFactory);
}
function subscriptToolConfigFactory(injector) {
  const i18n = injector.get(I18n);
  const query = injector.get(Query);
  const commander = injector.get(Commander);
  return {
    iconClasses: ["textbus-icon-subscript"],
    tooltip: i18n.get("plugins.tooltip.subscript.tooltip"),
    queryState() {
      return query.queryFormat(subscriptFormatter);
    },
    onClick() {
      const state = query.queryFormat(subscriptFormatter);
      const b = state.state === QueryStateType.Enabled;
      b ? commander.unApplyFormat(subscriptFormatter) : commander.applyFormat(subscriptFormatter, true);
    }
  };
}
function subscriptTool() {
  return new ButtonTool$2(subscriptToolConfigFactory);
}
function leftToRightToolConfigFactory(injector) {
  const i18n = injector.get(I18n);
  const query = injector.get(Query);
  const commander = injector.get(Commander);
  return {
    iconClasses: ["textbus-icon-ltr"],
    tooltip: i18n.get("plugins.toolbar.leftToRightTool.tooltip"),
    queryState() {
      const state = query.queryAttribute(dirFormatter);
      return {
        state: state.value === "ltr" ? QueryStateType.Enabled : QueryStateType.Normal,
        value: state.value
      };
    },
    onClick() {
      const state = query.queryAttribute(dirFormatter);
      const b = state.value === "ltr";
      b ? commander.unApplyAttribute(dirFormatter) : commander.applyAttribute(dirFormatter, "ltr");
    }
  };
}
function leftToRightTool() {
  return new ButtonTool$2(leftToRightToolConfigFactory);
}
function rightToLeftToolConfigFactory(injector) {
  const i18n = injector.get(I18n);
  const query = injector.get(Query);
  const commander = injector.get(Commander);
  return {
    iconClasses: ["textbus-icon-rtl"],
    tooltip: i18n.get("plugins.toolbar.rightToLeftTool.tooltip"),
    queryState() {
      const state = query.queryAttribute(dirFormatter);
      return {
        state: state.value === "rtl" ? QueryStateType.Enabled : QueryStateType.Normal,
        value: state.value
      };
    },
    onClick() {
      const state = query.queryAttribute(dirFormatter);
      const b = state.value === "rtl";
      b ? commander.unApplyAttribute(dirFormatter) : commander.applyAttribute(dirFormatter, "rtl");
    }
  };
}
function rightToLeftTool() {
  return new ButtonTool$2(rightToLeftToolConfigFactory);
}
function blockquoteToolConfigFactory(injector) {
  const i18n = injector.get(I18n);
  const query = injector.get(Query);
  const commander = injector.get(Commander);
  const selection = injector.get(Selection);
  return {
    iconClasses: ["textbus-icon-quotes-right"],
    tooltip: i18n.get("plugins.toolbar.blockquoteTool.tooltip"),
    keymap: /win(dows|32|64)/i.test(navigator.userAgent) ? {
      // windows 下无法触发 ctrl + ' 号 keydown 事件，原因未知
      altKey: true,
      key: "'"
    } : {
      ctrlKey: true,
      key: "'"
    },
    queryState() {
      return query.queryComponent(blockquoteComponent);
    },
    onClick() {
      const state = query.queryComponent(blockquoteComponent);
      if (state.state === QueryStateType.Enabled) {
        const current = state.value;
        const parent = current.parent;
        const index = parent.indexOf(current);
        parent.retain(index);
        commander.removeComponent(current);
        current.slots.get(0).sliceContent().forEach((i) => {
          parent.insert(i);
        });
      } else {
        const block = blockquoteComponent.createInstance(injector);
        const slot = block.slots.get(0);
        if (selection.startSlot === selection.endSlot) {
          const parentComponent = selection.startSlot.parent;
          const parentSlot = parentComponent.parent;
          const position = parentSlot.indexOf(parentComponent);
          slot.insert(parentComponent);
          parentSlot.retain(position);
          parentSlot.insert(block);
        } else {
          const commonAncestorSlot = selection.commonAncestorSlot;
          const scope = selection.getCommonAncestorSlotScope();
          commonAncestorSlot.cut(scope.startOffset, scope.endOffset).sliceContent().forEach((i) => {
            slot.insert(i);
          });
          commonAncestorSlot.retain(scope.startOffset);
          commonAncestorSlot.insert(block);
        }
      }
    }
  };
}
function blockquoteTool() {
  return new ButtonTool$2(blockquoteToolConfigFactory);
}
function codeToolConfigFactory(injector) {
  const i18n = injector.get(I18n);
  const query = injector.get(Query);
  const commander = injector.get(Commander);
  return {
    iconClasses: ["textbus-icon-code"],
    tooltip: i18n.get("plugins.toolbar.codeTool.tooltip"),
    keymap: {
      key: ";",
      ctrlKey: true
    },
    queryState() {
      return query.queryFormat(codeFormatter);
    },
    onClick() {
      const state = query.queryFormat(codeFormatter);
      const b = state.state === QueryStateType.Enabled;
      b ? commander.unApplyFormat(codeFormatter) : commander.applyFormat(codeFormatter, true);
    }
  };
}
function codeTool() {
  return new ButtonTool$2(codeToolConfigFactory);
}
function headingToolConfigFactory(injector) {
  const i18n = injector.get(I18n);
  const query = injector.get(Query);
  const commander = injector.get(Commander);
  return {
    tooltip: i18n.get("plugins.toolbar.headingTool.tooltip"),
    options: [{
      label: i18n.get("plugins.toolbar.headingTool.h1"),
      classes: ["textbus-toolbar-h1"],
      value: "h1",
      keymap: {
        ctrlKey: true,
        key: "1"
      },
      suffix: "Ctrl+1"
    }, {
      label: i18n.get("plugins.toolbar.headingTool.h2"),
      classes: ["textbus-toolbar-h2"],
      value: "h2",
      keymap: {
        ctrlKey: true,
        key: "2"
      },
      suffix: "Ctrl+2"
    }, {
      label: i18n.get("plugins.toolbar.headingTool.h3"),
      classes: ["textbus-toolbar-h3"],
      value: "h3",
      keymap: {
        ctrlKey: true,
        key: "3"
      },
      suffix: "Ctrl+3"
    }, {
      label: i18n.get("plugins.toolbar.headingTool.h4"),
      classes: ["textbus-toolbar-h4"],
      value: "h4",
      keymap: {
        ctrlKey: true,
        key: "4"
      },
      suffix: "Ctrl+4"
    }, {
      label: i18n.get("plugins.toolbar.headingTool.h5"),
      classes: ["textbus-toolbar-h5"],
      value: "h5",
      keymap: {
        ctrlKey: true,
        key: "5"
      },
      suffix: "Ctrl+5"
    }, {
      label: i18n.get("plugins.toolbar.headingTool.h6"),
      classes: ["textbus-toolbar-h6"],
      value: "h6",
      keymap: {
        ctrlKey: true,
        key: "6"
      },
      suffix: "Ctrl+6"
    }, {
      label: i18n.get("plugins.toolbar.headingTool.paragraph"),
      value: "p",
      default: true,
      keymap: {
        ctrlKey: true,
        key: "0"
      },
      suffix: "Ctrl+0"
    }],
    queryState() {
      const headingState = query.queryComponent(headingComponent);
      if (headingState.state === QueryStateType.Enabled) {
        return {
          state: QueryStateType.Enabled,
          value: headingState.value.state
        };
      }
      const paragraphState = query.queryComponent(paragraphComponent$1);
      return {
        state: paragraphState.state,
        value: paragraphState.state === QueryStateType.Enabled ? "p" : null
      };
    },
    onChecked(value) {
      const isHeading = /h[1-6]/.test(value);
      commander.transform({
        target: isHeading ? headingComponent : paragraphComponent$1,
        multipleSlot: false,
        slotFactory() {
          return new Slot([
            ContentType.Text,
            ContentType.InlineComponent
          ]);
        },
        stateFactory() {
          if (isHeading) {
            return value;
          }
        }
      });
    }
  };
}
function headingTool() {
  return new SelectTool(headingToolConfigFactory);
}
function fontSizeToolConfigFactory(injector) {
  const i18n = injector.get(I18n);
  const query = injector.get(Query);
  const commander = injector.get(Commander);
  return {
    tooltip: i18n.get("plugins.toolbar.fontSizeTool.tooltip"),
    iconClasses: ["textbus-icon-font-size"],
    mini: true,
    options: [{
      // label: i18n.get('plugins.toolbar.fontSizeTool.defaultSizeText'),
      label: "默 认",
      // 该选项与其它选项的字符宽度略有不同，中间增加一个空格来维持一致性
      classes: ["textbus-toolbar-font-size-inherit"],
      value: "",
      default: true
    }, {
      label: "12px",
      classes: ["textbus-toolbar-font-size-12"],
      value: "12px"
    }, {
      label: "13px",
      classes: ["textbus-toolbar-font-size-13"],
      value: "13px"
    }, {
      label: "14px",
      classes: ["textbus-toolbar-font-size-14"],
      value: "14px"
    }, {
      label: "15px",
      classes: ["textbus-toolbar-font-size-15"],
      value: "15px"
    }, {
      label: "16px",
      classes: ["textbus-toolbar-font-size-16"],
      value: "16px"
    }, {
      label: "18px",
      classes: ["textbus-toolbar-font-size-18"],
      value: "18px"
    }, {
      label: "20px",
      classes: ["textbus-toolbar-font-size-20"],
      value: "20px"
    }, {
      label: "24px",
      classes: ["textbus-toolbar-font-size-24"],
      value: "24px"
    }, {
      label: "36px",
      classes: ["textbus-toolbar-font-size-36"],
      value: "36px"
    }, {
      label: "48px",
      classes: ["textbus-toolbar-font-size-48"],
      value: "48px"
    }],
    queryState() {
      return query.queryFormat(fontSizeFormatter);
    },
    onChecked(value) {
      !value ? commander.unApplyFormat(fontSizeFormatter) : commander.applyFormat(fontSizeFormatter, value);
    }
  };
}
function fontSizeTool() {
  return new SelectTool(fontSizeToolConfigFactory);
}
function textIndentToolConfigFactory(injector) {
  const i18n = injector.get(I18n);
  const query = injector.get(Query);
  const commander = injector.get(Commander);
  return {
    tooltip: i18n.get("plugins.toolbar.textIndentTool.tooltip"),
    iconClasses: ["textbus-icon-text-indent"],
    mini: true,
    options: [{
      label: "0x",
      value: "0",
      classes: ["textbus-toolbar-text-indent-0"],
      default: true
    }, {
      label: "1x",
      value: "1em",
      classes: ["textbus-toolbar-text-indent-1"]
    }, {
      label: "2x",
      classes: ["textbus-toolbar-text-indent-2"],
      value: "2em"
    }, {
      label: "4x",
      classes: ["textbus-toolbar-text-indent-4"],
      value: "4em"
    }],
    queryState() {
      return query.queryAttribute(textIndentFormatter);
    },
    onChecked(value) {
      value === "0" ? commander.unApplyAttribute(textIndentFormatter) : commander.applyAttribute(textIndentFormatter, value);
    }
  };
}
function textIndentTool() {
  return new SelectTool(textIndentToolConfigFactory);
}
function textAlignToolConfigFactory(injector) {
  const i18n = injector.get(I18n);
  const query = injector.get(Query);
  const commander = injector.get(Commander);
  return {
    tooltip: i18n.get("plugins.toolbar.textAlignTool.tooltip"),
    options: [{
      label: i18n.get("plugins.toolbar.textAlignTool.left"),
      iconClasses: ["textbus-icon-paragraph-left"],
      value: "left",
      keymap: {
        ctrlKey: true,
        key: "l"
      },
      default: true
    }, {
      label: i18n.get("plugins.toolbar.textAlignTool.right"),
      iconClasses: ["textbus-icon-paragraph-right"],
      value: "right",
      keymap: {
        ctrlKey: true,
        key: "r"
      }
    }, {
      label: i18n.get("plugins.toolbar.textAlignTool.center"),
      iconClasses: ["textbus-icon-paragraph-center"],
      value: "center",
      keymap: {
        ctrlKey: true,
        key: "e"
      }
    }, {
      label: i18n.get("plugins.toolbar.textAlignTool.justify"),
      iconClasses: ["textbus-icon-paragraph-justify"],
      value: "justify",
      keymap: {
        ctrlKey: true,
        key: "j"
      }
    }],
    queryState() {
      return query.queryAttribute(textAlignFormatter);
    },
    onChecked(value) {
      commander.applyAttribute(textAlignFormatter, value);
    }
  };
}
function textAlignTool() {
  return new SelectTool(textAlignToolConfigFactory);
}
const isSupportFont = function() {
  const fullbackFontName = "Arial";
  const text = "HeRe-is*SoMe%tEst +99.? !@ #~ &^teXtWw L$VEY$U0";
  const fontSize = 20;
  const width = 200;
  const height = 50;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
  context.textAlign = "center";
  context.fillStyle = "black";
  context.textBaseline = "middle";
  function checker(fontName) {
    context.clearRect(0, 0, width, height);
    context.font = fontSize + "px " + fontName + ", " + fullbackFontName;
    context.fillText(text, width / 2, height / 2);
    const data = context.getImageData(0, 0, width, height).data;
    return Array.from(data).filter((n) => n !== 0);
  }
  return function(fontName) {
    if (fontName.toLowerCase() === fullbackFontName.toLowerCase()) {
      return true;
    }
    return checker(fullbackFontName).join("") !== checker(fontName).join("");
  };
}();
function fontFamilyToolConfigFactory(injector) {
  const i18n = injector.get(I18n);
  const query = injector.get(Query);
  const commander = injector.get(Commander);
  return {
    tooltip: i18n.get("plugins.toolbar.fontFamilyTool.tooltip"),
    options: [{
      label: i18n.get("plugins.toolbar.fontFamilyTool.defaultFamilyText"),
      classes: ["textbus-toolbar-font-family-inherit"],
      value: "",
      default: true
    }, {
      label: "宋体",
      classes: ["textbus-toolbar-font-family-SimSun"],
      value: "SimSun, STSong"
    }, {
      label: "黑体",
      classes: ["textbus-toolbar-font-family-SimHei"],
      value: "SimHei, STHeiti"
    }, {
      label: "微软雅黑",
      classes: ["textbus-toolbar-font-family-Microsoft-YaHei"],
      value: "Microsoft YaHei"
    }, {
      label: "楷体",
      classes: ["textbus-toolbar-font-family-KaiTi"],
      value: "KaiTi, STKaiti"
    }, {
      label: "仿宋",
      classes: ["textbus-toolbar-font-family-FangSong"],
      value: "FangSong, STFangsong"
    }, {
      label: "冬青黑简体中文",
      classes: ["textbus-toolbar-font-family-DongQingHei"],
      value: '"Hiragino Sans GB", 冬青黑简体中文'
    }, {
      label: "苹方",
      classes: ["textbus-toolbar-font-family-PingFang"],
      value: '"PingFang SC", 苹方'
    }, {
      label: "隶书",
      classes: ["textbus-toolbar-font-family-SimLi"],
      value: "SimLi"
    }, {
      label: "Andale Mono",
      classes: ["textbus-toolbar-font-family-andale-mono"],
      value: "Andale Mono"
    }, {
      label: "Arial",
      classes: ["textbus-toolbar-font-family-Arial"],
      value: "Arial"
    }, {
      label: "Helvetica",
      classes: ["textbus-toolbar-font-family-Helvetica"],
      value: "Helvetica"
    }, {
      label: "Impact",
      classes: ["textbus-toolbar-font-family-Impact"],
      value: "Impact"
    }, {
      label: "Times New Roman",
      classes: ["textbus-toolbar-font-family-Times-New-Roman"],
      value: "Times New Roman"
    }].map((i) => {
      if (i.value && typeof i.value === "string") {
        if (!i.value.split(",").map((i2) => isSupportFont(i2.trim())).some((v) => v)) {
          i.disabled = true;
        }
      }
      return i;
    }),
    queryState() {
      return query.queryFormat(fontFamilyFormatter);
    },
    onChecked(value) {
      value ? commander.applyFormat(fontFamilyFormatter, value) : commander.unApplyFormat(fontFamilyFormatter);
    }
  };
}
function fontFamilyTool() {
  return new SelectTool(fontFamilyToolConfigFactory);
}
function lineHeightToolConfigFactory(injector) {
  const i18n = injector.get(I18n);
  const query = injector.get(Query);
  const commander = injector.get(Commander);
  return {
    tooltip: i18n.get("plugins.toolbar.lineHeightTool.tooltip"),
    iconClasses: ["textbus-icon-line-height"],
    mini: true,
    options: [{
      label: i18n.get("plugins.toolbar.lineHeightTool.defaultValueLabel"),
      classes: ["textbus-toolbar-line-height-inherit"],
      value: "",
      default: true
    }, {
      label: "1x",
      classes: ["textbus-toolbar-line-height-1"],
      value: "1em"
    }, {
      label: "1.2x",
      classes: ["textbus-toolbar-line-height-1_2"],
      value: "1.2em"
    }, {
      label: "1.4x",
      classes: ["textbus-toolbar-line-height-1_4"],
      value: "1.4em"
    }, {
      label: "1.6x",
      classes: ["textbus-toolbar-line-height-1_6"],
      value: "1.6em"
    }, {
      label: "1.8x",
      classes: ["textbus-toolbar-line-height-1_8"],
      value: "1.8em"
    }, {
      label: "2x",
      classes: ["textbus-toolbar-line-height-2"],
      value: "2em"
    }, {
      label: "3x",
      classes: ["textbus-toolbar-line-height-3"],
      value: "3em"
    }, {
      label: "4x",
      classes: ["textbus-toolbar-line-height-4"],
      value: "4em"
    }],
    queryState() {
      return query.queryFormat(lineHeightFormatter);
    },
    onChecked(value) {
      if (value) {
        commander.applyFormat(lineHeightFormatter, value);
      } else {
        commander.unApplyFormat(lineHeightFormatter);
      }
    }
  };
}
function lineHeightTool() {
  return new SelectTool(lineHeightToolConfigFactory);
}
class MarginSetter {
  constructor(label) {
    __publicField(this, "name", "margin");
    __publicField(this, "elementRef");
    __publicField(this, "inputs", []);
    this.elementRef = createElement("div", {
      classes: ["textbus-form-group"],
      children: [
        createElement("label", {
          classes: ["textbus-control-label"],
          children: [
            createTextNode(label)
          ]
        }),
        createElement("div", {
          classes: ["textbus-control-static"],
          children: [
            createElement("div", {
              classes: ["textbus-toolbar-image-margin-setter"],
              children: Array.from({ length: 4 }).fill(null).map(() => createElement("input", {
                attrs: {
                  type: "text",
                  value: "0"
                },
                classes: ["textbus-form-control"]
              }))
            })
          ]
        })
      ]
    });
    this.inputs = Array.from(this.elementRef.querySelectorAll("input"));
  }
  reset() {
    this.inputs.forEach((input) => input.value = "");
  }
  update(value) {
    this.reset();
    if (value) {
      const vars = (value + "").split(/\s+/g);
      vars.forEach((v, index) => {
        this.inputs[index].value = v;
      });
    }
  }
  getAttr() {
    return {
      name: this.name,
      value: this.inputs.map((input) => {
        if (Number(input.value)) {
          return input.value + "px";
        }
        return input.value || "0";
      }).join(" ")
    };
  }
  validate() {
    return true;
  }
}
class SizeSetter {
  constructor(name, i18n) {
    __publicField(this, "elementRef");
    __publicField(this, "inputs", []);
    this.name = name;
    this.i18n = i18n;
    this.elementRef = createElement("div", {
      classes: ["textbus-form-group"],
      children: [
        createElement("label", {
          classes: ["textbus-control-label"],
          children: [
            createTextNode(i18n.get("label"))
          ]
        }),
        createElement("div", {
          classes: ["textbus-control-value"],
          children: [
            createElement("div", {
              classes: ["textbus-toolbar-image-size-setter"],
              children: [
                createElement("input", {
                  attrs: { type: "text", placeholder: i18n.get("widthPlaceholder") },
                  classes: ["textbus-form-control"]
                }),
                createTextNode(" * "),
                createElement("input", {
                  attrs: { type: "text", placeholder: i18n.get("heightPlaceholder") },
                  classes: ["textbus-form-control"]
                })
              ]
            })
          ]
        })
      ]
    });
    this.inputs = Array.from(this.elementRef.querySelectorAll("input"));
  }
  reset() {
    this.inputs.forEach((input) => input.value = "");
  }
  update(value) {
    this.inputs[0].value = (value == null ? void 0 : value.width) || "";
    this.inputs[1].value = (value == null ? void 0 : value.height) || "";
  }
  getAttr() {
    return {
      name: this.name,
      value: {
        width: this.inputs[0].value,
        height: this.inputs[1].value
      }
    };
  }
  validate() {
    return true;
  }
}
const imageB2UComponent = defineComponent$1({
  type: ContentType.InlineComponent,
  name: "ImageB2UComponent",
  setup(data) {
    const injector = useContext();
    const img2Url = injector.get(ImgToUrlService);
    const reg = /^https?:\/\/.+\.(jpg|jpeg|png|gif|bmp|svg)$/i;
    if (data && data.state && !reg.test(data.state.src)) {
      img2Url.addUploadProcess(
        data.state.src,
        (url) => {
          console.log(url);
          stateController.update((draft) => {
            draft.src = url;
          });
        },
        (err) => {
          console.log("图片上传失败");
          stateController.update((draft) => {
            draft.src = "image-error.png";
          });
          console.log(err);
        }
      );
    }
    let state = (data == null ? void 0 : data.state) || {
      src: ""
    };
    const stateController = useState(state);
    stateController.onChange.subscribe((v) => {
      state = v;
    });
    const ref2 = useRef();
    useDragResize(ref2, (rect) => {
      stateController.update((draft) => {
        Object.assign(draft, rect);
      });
    });
    const fileUploader = injector.get(FileUploader);
    const i18n = injector.get(I18n);
    const dialog = injector.get(Dialog);
    const childI18n = i18n.getContext("components.imageComponent.contextMenu");
    onContextMenu((event) => {
      event.useMenus([{
        label: childI18n.get("title"),
        iconClasses: ["textbus-icon-image"],
        onClick() {
          const form = new Form({
            title: childI18n.get("title"),
            cancelBtnText: childI18n.get("cancelBtnText"),
            confirmBtnText: childI18n.get("confirmBtnText"),
            items: [
              new FormTextField({
                label: childI18n.get("linkLabel"),
                name: "src",
                placeholder: childI18n.get("linkInputPlaceholder"),
                canUpload: true,
                uploadType: "image",
                uploadBtnText: childI18n.get("uploadBtnText"),
                fileUploader,
                validateFn(value) {
                  if (!value) {
                    return childI18n.get("validateErrorMessage");
                  }
                  return false;
                }
              }),
              new SizeSetter("size", childI18n.getContext("sizeSetter")),
              new SizeSetter("maxSize", childI18n.getContext("maxSizeSetter")),
              new FormRadio({
                label: childI18n.get("float.label"),
                name: "float",
                values: [{
                  label: childI18n.get("float.noFloatLabel"),
                  value: "none",
                  default: true
                }, {
                  label: childI18n.get("float.floatToLeftLabel"),
                  value: "left"
                }, {
                  label: childI18n.get("float.floatToRightLabel"),
                  value: "right"
                }]
              }),
              new MarginSetter(childI18n.get("marginLabel"))
            ]
          });
          form.update({
            src: state.src,
            margin: state.margin,
            float: state.float,
            size: {
              width: state.width,
              height: state.height
            },
            maxSize: {
              width: state.maxWidth,
              height: state.maxHeight
            }
          });
          dialog.show(form.elementRef);
          const sub = new Subscription();
          sub.add(form.onComplete.subscribe((value) => {
            const config = {
              src: value.src,
              margin: value.margin,
              float: value.float,
              maxWidth: value.maxSize.width,
              maxHeight: value.maxSize.height,
              width: value.size.width,
              height: value.size.height
            };
            stateController.update((draft) => {
              Object.assign(draft, config);
            });
            dialog.hide();
            sub.unsubscribe();
          }));
          sub.add(form.onCancel.subscribe(() => {
            dialog.hide();
            sub.unsubscribe();
          }));
        }
      }]);
    });
    return {
      render() {
        return VElement.createElement("img", {
          src: state.src,
          class: "tb-img",
          ref: ref2,
          style: {
            width: state.width,
            height: state.height,
            maxWidth: state.maxWidth,
            maxHeight: state.maxHeight,
            margin: state.margin,
            float: state.float
          }
        });
      }
    };
  }
});
const imageB2UComponentLoader = {
  match(element) {
    return element.tagName === "IMG";
  },
  read(element, injector) {
    const style = element.style;
    return imageB2UComponent.createInstance(injector, {
      state: {
        src: element.getAttribute("src") || "",
        width: style.width,
        height: style.height,
        margin: style.margin,
        float: style.float,
        maxWidth: style.maxWidth,
        maxHeight: style.maxHeight
      }
    });
  }
};
var __defProp$g = Object.defineProperty;
var __getOwnPropDesc$g = Object.getOwnPropertyDescriptor;
var __decorateClass$g = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$g(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$g(target, key, result);
  return result;
};
let ResizeService = class {
  constructor() {
    __publicField(this, "resizeEvent", new Subject());
    __publicField(this, "onResize");
    this.onResize = this.resizeEvent.asObservable();
  }
  handleResize(value) {
    this.resizeEvent.next(value);
  }
  destory() {
  }
};
ResizeService = __decorateClass$g([
  Injectable()
], ResizeService);
var __defProp$f = Object.defineProperty;
var __getOwnPropDesc$f = Object.getOwnPropertyDescriptor;
var __decorateClass$f = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$f(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$f(target, key, result);
  return result;
};
let Img2base64Service = class {
  // 任务数
  constructor() {
    // private axios: AxiosInstance | null
    // private uploadImgUrl: string
    __publicField(this, "finishEvent", new Subject());
    __publicField(this, "onFinish", this.finishEvent.asObservable());
    __publicField(this, "errorEvent", new Subject());
    __publicField(this, "onError", this.errorEvent.asObservable());
    __publicField(this, "promiseSequence");
    __publicField(this, "tasks");
    /**
     * 图片url链接转base64
     * @param {String} url 图片链接
     * @returns 转base64后的值或者报错信息
     */
    __publicField(this, "imgUrlToBase64", (url) => {
      return new Promise((resolve2, reject) => {
        if (!url) {
          reject("请传入url内容");
        }
        const base64Regex = /^data:image\/([a-z]+);base64,/;
        if (base64Regex.test(url)) {
          resolve2(url);
        }
        const imgRegex = /\.(png|jpe?g|gif|bmp|svg)(\?.*)?$/;
        if (!imgRegex.test(url)) {
          console.warn("非(png/jpe?g/gif/svg等)图片地址:" + url);
        }
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.src = url;
        image.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = image.width;
          canvas.height = image.height;
          ctx && ctx.drawImage(image, 0, 0, image.width, image.height);
          const lastDotIndex = url.lastIndexOf(".");
          const ext = lastDotIndex !== -1 ? url.substring(lastDotIndex + 1) : "";
          const dataUrl = canvas.toDataURL(`image/${ext.toLowerCase()}`);
          resolve2(dataUrl || "");
        };
        image.onerror = (err) => {
          console.log(err);
          reject("图片加载失败！");
        };
      });
    });
    this.tasks = 0;
    this.promiseSequence = [];
  }
  /** 添加任务 */
  addTask() {
    this.tasks++;
  }
  /** 移出任务 */
  removeTask() {
    this.tasks--;
  }
  /** 任务完成 */
  finish() {
    this.finishEvent.next("");
  }
  /** 任务出错 */
  error(msg) {
    const err = new Error(msg);
    this.errorEvent.next(err);
  }
  /** 检查进度： 如果任务数为0，任务完成 */
  checkProcess() {
    if (this.tasks === 0)
      this.finish();
  }
  /** 加入图片转化的进程 */
  addProcess(url, callback) {
    this.addTask();
    this.promiseSequence.push(
      this.imgUrlToBase64(url).then((base64) => {
        callback(base64);
        this.removeTask();
      }).catch((err) => {
        this.error(err);
      })
    );
  }
  destory() {
    this.promiseSequence = [];
  }
};
Img2base64Service = __decorateClass$f([
  Injectable()
], Img2base64Service);
var __defProp$e = Object.defineProperty;
var __getOwnPropDesc$e = Object.getOwnPropertyDescriptor;
var __decorateClass$e = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$e(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$e(target, key, result);
  return result;
};
let ImgToUrlService = class {
  // 当前运行的任务数
  constructor() {
    __publicField(this, "uploadFunction");
    __publicField(this, "finishEvent", new Subject());
    __publicField(this, "onFinish", this.finishEvent.asObservable());
    __publicField(this, "errorEvent", new Subject());
    __publicField(this, "onError", this.errorEvent.asObservable());
    __publicField(this, "queue");
    __publicField(this, "tasks");
    // 当前运行的任务数
    __publicField(this, "maxConcurrency");
    // 最大并行任务数
    __publicField(this, "isRunning");
    this.tasks = 0;
    this.isRunning = 0;
    this.queue = [];
    this.maxConcurrency = 6;
  }
  setup(uploadFunction, maxConcurrency = 6) {
    this.uploadFunction = uploadFunction;
    this.maxConcurrency = maxConcurrency;
  }
  /** 加入图片转化的进程 (需要同时处理多张图片的情况) */
  addUploadProcess(base64Data, success, error) {
    this.addTask(base64Data).then((url) => {
      success(url);
    }).catch((err) => {
      error == null ? void 0 : error(err);
    });
  }
  /** 独立上传图片 (在图片工具中上传图片时使用) */
  uploadImg(img) {
    if (!this.uploadFunction)
      return Promise.reject(new Error("未设置上传函数"));
    return this.uploadFunction(img);
  }
  /** 添加任务 */
  addTask(base64Data) {
    if (!this.uploadFunction)
      return Promise.reject(new Error("未设置上传函数"));
    this.tasks++;
    return new Promise((resolve2, reject) => {
      this.queue.push({ base64Data, resolve: resolve2, reject });
      this.processQueue();
    });
  }
  // 处理队列中的上传任务(当前上传任务大于 this.maxConcurrency 时会进入等待)
  processQueue() {
    if (this.queue.length > 0 && this.isRunning < this.maxConcurrency) {
      console.log("this.isRunning", this.isRunning);
      const task = this.queue.shift();
      this.isRunning++;
      task && this.uploadTask(task).then(() => {
        this.isRunning--;
        this.checkProcess();
        this.processQueue();
      }).catch((error) => {
        console.error("Upload failed:", error);
        this.isRunning--;
        this.checkProcess();
        this.error(error);
        this.processQueue();
      });
    } else if (this.queue.length === 0)
      ;
  }
  /** 任务完成 */
  finish() {
    this.finishEvent.next(this.tasks);
    this.tasks = 0;
  }
  /** 任务出错 */
  error(msg) {
    const err = new Error(msg);
    this.errorEvent.next(err);
  }
  /** 检查进度： 如果任务数为0，任务完成 */
  checkProcess() {
    if (this.isRunning === 0)
      this.finish();
  }
  // 执行单个上传任务
  uploadTask(task) {
    return this.uploadFunction(task.base64Data).then((url) => {
      task.resolve(url);
    }).catch((err) => {
      task.reject(err);
    });
  }
  static isBase64(str) {
    const regex = /^data:image\/([a-zA-Z]+);base64,/;
    return regex.test(str);
  }
  destory() {
    this.queue = [];
    this.tasks = 0;
    this.isRunning = 0;
  }
};
ImgToUrlService = __decorateClass$e([
  Injectable()
], ImgToUrlService);
var __defProp$d = Object.defineProperty;
var __getOwnPropDesc$d = Object.getOwnPropertyDescriptor;
var __decorateClass$d = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$d(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$d(target, key, result);
  return result;
};
let AddAnimeService = class {
  constructor() {
    __publicField(this, "onComponentActive");
    __publicField(this, "componentActiveEvent", new Subject());
    this.onComponentActive = this.componentActiveEvent.asObservable().pipe(distinctUntilChanged());
  }
  updateActiveComponent(component) {
    this.componentActiveEvent.next(component);
  }
  destory() {
  }
};
AddAnimeService = __decorateClass$d([
  Injectable()
], AddAnimeService);
var __defProp$c = Object.defineProperty;
var __getOwnPropDesc$c = Object.getOwnPropertyDescriptor;
var __decorateClass$c = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$c(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$c(target, key, result);
  return result;
};
let RootEventService = class {
  constructor() {
    __publicField(this, "onComponentContextmenu");
    __publicField(this, "componentContextmenuEvent", new Subject());
    this.onComponentContextmenu = this.componentContextmenuEvent.asObservable().pipe(distinctUntilChanged());
  }
  handleContextmenu(ev) {
    this.componentContextmenuEvent.next(ev);
  }
  destory() {
  }
};
RootEventService = __decorateClass$c([
  Injectable()
], RootEventService);
const ANIME = "anime";
const ANIME_COMPONENT = "anime-component";
const ANIME_FORMATTER_NAME = "AnimeFormatter";
const ANIME_COMPONENT_NAME = "AnimeComponent";
const animePlayerFormatterContextmenuEvent = new Subject();
const onAnimePlayerFormatterContextmenu = animePlayerFormatterContextmenuEvent.asObservable();
class AnimePlayerFormatter {
  constructor() {
    __publicField(this, "name", ANIME_FORMATTER_NAME);
    __publicField(this, "tagName", ANIME);
    __publicField(this, "columned", false);
    __publicField(this, "priority", 0);
  }
  render(children, formatValue, renderMode) {
    const vdom = new VElement(
      ANIME,
      {
        "data-id": formatValue.dataId,
        "data-serial": formatValue.dataSerial,
        "data-effect": formatValue.dataEffect,
        "data-state": formatValue.dataState,
        "data-title": formatValue.dataTitle
      },
      children
    );
    vdom.listeners.contextmenu = (event) => {
      animePlayerFormatterContextmenuEvent.next({ vdom, event });
    };
    return vdom;
  }
}
const animePlayerFormatter = new AnimePlayerFormatter();
const animePlayerFormatLoader = {
  match(element) {
    return [ANIME].includes(element.tagName.toLowerCase());
  },
  // 当元素匹配成功时，会调用 read 方法获取样式的值
  read(node) {
    const data = {
      dataId: node.dataset.id,
      dataSerial: node.dataset.serial,
      dataEffect: node.dataset.effect,
      dataState: node.dataset.state,
      dataTitle: node.dataset.title
    };
    return {
      formatter: animePlayerFormatter,
      value: data
    };
  }
};
var __defProp$b = Object.defineProperty;
var __getOwnPropDesc$b = Object.getOwnPropertyDescriptor;
var __decorateClass$b = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$b(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$b(target, key, result);
  return result;
};
let AnimeEventService = class {
  constructor() {
    __publicField(this, "onAnimeContextmenu");
    __publicField(this, "AnimeContextmenuEvent", new Subject());
    __publicField(this, "sub");
    this.onAnimeContextmenu = this.AnimeContextmenuEvent.asObservable();
    this.sub = onAnimePlayerFormatterContextmenu.subscribe(({ vdom, event }) => {
      this.AnimeContextmenuEvent.next({ vdom, event });
    });
  }
  destory() {
    this.sub.unsubscribe();
  }
};
AnimeEventService = __decorateClass$b([
  Injectable()
], AnimeEventService);
const imageU2BComponent = defineComponent$1({
  name: "ImageU2BComponent",
  type: ContentType.InlineComponent,
  setup(data) {
    const injector = useContext();
    const img2base64 = injector.get(Img2base64Service);
    let state = {
      src: data.state.src
    };
    const reg = /^https?/gi;
    if (reg.test(data.state.src)) {
      const stateController = useState(state);
      stateController.onChange.subscribe((newState) => {
        state = newState;
      });
      img2base64.addProcess(data.state.src, (result) => {
        stateController.update((draft) => {
          draft.src = result;
        });
      });
      onViewChecked(() => {
        img2base64.checkProcess();
      });
    }
    return {
      render() {
        return VElement.createElement("img", {
          src: state.src,
          class: "tb-img",
          style: {
            width: data.state.width,
            height: data.state.height,
            maxWidth: data.state.maxWidth,
            maxHeight: data.state.maxHeight,
            margin: data.state.margin,
            float: data.state.float
          }
        });
      }
    };
  }
});
const imageU2BComponentLoader = {
  match(element) {
    return element.tagName === "IMG";
  },
  read(element, injector) {
    const style = element.style;
    return imageU2BComponent.createInstance(injector, {
      state: {
        src: element.getAttribute("src") || "",
        width: style.width,
        height: style.height,
        margin: style.margin,
        float: style.float,
        maxWidth: style.maxWidth,
        maxHeight: style.maxHeight
      }
    });
  }
};
const rootComponent = defineComponent$1({
  type: ContentType.BlockComponent,
  name: "RootComponent",
  setup(data) {
    const injector = useContext();
    const selection = injector.get(Selection);
    const options = injector.get(EDITOR_OPTIONS);
    const docContainer = injector.get(VIEW_DOCUMENT);
    const self2 = useSelf();
    const slots = useSlots((data == null ? void 0 : data.slots) || [new Slot([
      ContentType.Text,
      ContentType.BlockComponent,
      ContentType.InlineComponent
    ])]);
    onContentInsert((ev) => {
      if (typeof ev.data.content === "string" || ev.data.content.type !== ContentType.BlockComponent) {
        const p2 = paragraphComponent$1.createInstance(injector);
        const slot = p2.slots.get(0);
        slot.insert(ev.data.content);
        ev.target.insert(p2);
        selection.setPosition(slot, slot.index);
        ev.preventDefault();
      }
    });
    onBreak((ev) => {
      const p2 = paragraphComponent$1.createInstance(injector);
      const slot = slots.get(0);
      slot.insert(p2);
      selection.setPosition(p2.slots.get(0), 0);
      ev.preventDefault();
    });
    onSlotRemove((ev) => {
      ev.preventDefault();
    });
    const rootNode = useRef();
    const subscription = new Subscription$1();
    onViewInit(() => {
      subscription.add(fromEvent$1(docContainer, "click").subscribe((ev) => {
        var _a;
        const rect = rootNode.current.getBoundingClientRect();
        const firstSlot = slots.first;
        if (ev.clientY > rect.top + rect.height - 30) {
          const lastContent = firstSlot.getContentAtIndex(firstSlot.length - 1);
          if (!firstSlot.isEmpty && typeof lastContent !== "string" && lastContent.name !== paragraphComponent$1.name) {
            const index = firstSlot.index;
            firstSlot.retain(firstSlot.length);
            const p2 = paragraphComponent$1.createInstance(injector);
            firstSlot.insert(p2);
            firstSlot.retain(index);
            selection.setPosition(p2.slots.get(0), 0);
          }
        } else if (ev.target === rootNode.current) {
          let parentComponent = (_a = selection.focusSlot) == null ? void 0 : _a.parent;
          while (parentComponent && parentComponent.parentComponent !== self2) {
            parentComponent = parentComponent.parentComponent;
          }
          if (!parentComponent) {
            return;
          }
          const index = firstSlot.indexOf(parentComponent);
          if (index > -1) {
            if (ev.clientX - rect.left < 4) {
              selection.setPosition(firstSlot, index);
              selection.restore();
            } else if (rect.left + rect.width - ev.clientX < 4) {
              selection.setPosition(firstSlot, index + 1);
              selection.restore();
            }
          }
        }
      }));
    });
    onDestroy(() => {
      subscription.unsubscribe();
    });
    onCompositionStart(() => {
      var _a;
      (_a = rootNode.current) == null ? void 0 : _a.setAttribute("data-placeholder", "");
    });
    return {
      render(slotRender) {
        return slotRender(slots.get(0), (children) => {
          var _a;
          return new VElement("div", {
            "textbus-document": "true",
            "ref": rootNode,
            "data-placeholder": ((_a = slots.get(0)) == null ? void 0 : _a.isEmpty) ? options.placeholder || "" : ""
          }, children);
        });
      }
    };
  }
});
const rootComponentLoader = {
  match() {
    return true;
  },
  read(element, context, slotParser) {
    const slot = new Slot([
      ContentType.Text,
      ContentType.BlockComponent,
      ContentType.InlineComponent
    ]);
    slotParser(slot, element);
    return rootComponent.createInstance(context, {
      state: null,
      slots: [slot]
    });
  }
};
(function(Prism2) {
  Prism2.languages.typescript = Prism2.languages.extend("javascript", {
    "class-name": {
      pattern: /(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,
      lookbehind: true,
      greedy: true,
      inside: null
      // see below
    },
    "builtin": /\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/
  });
  Prism2.languages.typescript.keyword.push(
    /\b(?:abstract|declare|is|keyof|readonly|require)\b/,
    // keywords that have to be followed by an identifier
    /\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,
    // This is for `import type *, {}`
    /\btype\b(?=\s*(?:[\{*]|$))/
  );
  delete Prism2.languages.typescript["parameter"];
  delete Prism2.languages.typescript["literal-property"];
  var typeInside = Prism2.languages.extend("typescript", {});
  delete typeInside["class-name"];
  Prism2.languages.typescript["class-name"].inside = typeInside;
  Prism2.languages.insertBefore("typescript", "function", {
    "decorator": {
      pattern: /@[$\w\xA0-\uFFFF]+/,
      inside: {
        "at": {
          pattern: /^@/,
          alias: "operator"
        },
        "function": /^[\s\S]+/
      }
    },
    "generic-function": {
      // e.g. foo<T extends "bar" | "baz">( ...
      pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,
      greedy: true,
      inside: {
        "function": /^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,
        "generic": {
          pattern: /<[\s\S]+/,
          // everything after the first <
          alias: "class-name",
          inside: typeInside
        }
      }
    }
  });
  Prism2.languages.ts = Prism2.languages.typescript;
})(Prism);
(function(Prism2) {
  var keywords = /\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|exports|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|module|native|new|non-sealed|null|open|opens|package|permits|private|protected|provides|public|record(?!\s*[(){}[\]<>=%~.:,;?+\-*/&|^])|requires|return|sealed|short|static|strictfp|super|switch|synchronized|this|throw|throws|to|transient|transitive|try|uses|var|void|volatile|while|with|yield)\b/;
  var classNamePrefix = /(?:[a-z]\w*\s*\.\s*)*(?:[A-Z]\w*\s*\.\s*)*/.source;
  var className = {
    pattern: RegExp(/(^|[^\w.])/.source + classNamePrefix + /[A-Z](?:[\d_A-Z]*[a-z]\w*)?\b/.source),
    lookbehind: true,
    inside: {
      "namespace": {
        pattern: /^[a-z]\w*(?:\s*\.\s*[a-z]\w*)*(?:\s*\.)?/,
        inside: {
          "punctuation": /\./
        }
      },
      "punctuation": /\./
    }
  };
  Prism2.languages.java = Prism2.languages.extend("clike", {
    "string": {
      pattern: /(^|[^\\])"(?:\\.|[^"\\\r\n])*"/,
      lookbehind: true,
      greedy: true
    },
    "class-name": [
      className,
      {
        // variables, parameters, and constructor references
        // this to support class names (or generic parameters) which do not contain a lower case letter (also works for methods)
        pattern: RegExp(/(^|[^\w.])/.source + classNamePrefix + /[A-Z]\w*(?=\s+\w+\s*[;,=()]|\s*(?:\[[\s,]*\]\s*)?::\s*new\b)/.source),
        lookbehind: true,
        inside: className.inside
      },
      {
        // class names based on keyword
        // this to support class names (or generic parameters) which do not contain a lower case letter (also works for methods)
        pattern: RegExp(/(\b(?:class|enum|extends|implements|instanceof|interface|new|record|throws)\s+)/.source + classNamePrefix + /[A-Z]\w*\b/.source),
        lookbehind: true,
        inside: className.inside
      }
    ],
    "keyword": keywords,
    "function": [
      Prism2.languages.clike.function,
      {
        pattern: /(::\s*)[a-z_]\w*/,
        lookbehind: true
      }
    ],
    "number": /\b0b[01][01_]*L?\b|\b0x(?:\.[\da-f_p+-]+|[\da-f_]+(?:\.[\da-f_p+-]+)?)\b|(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?\d[\d_]*)?[dfl]?/i,
    "operator": {
      pattern: /(^|[^.])(?:<<=?|>>>?=?|->|--|\+\+|&&|\|\||::|[?:~]|[-+*/%&|^!=<>]=?)/m,
      lookbehind: true
    },
    "constant": /\b[A-Z][A-Z_\d]+\b/
  });
  Prism2.languages.insertBefore("java", "string", {
    "triple-quoted-string": {
      // http://openjdk.java.net/jeps/355#Description
      pattern: /"""[ \t]*[\r\n](?:(?:"|"")?(?:\\.|[^"\\]))*"""/,
      greedy: true,
      alias: "string"
    },
    "char": {
      pattern: /'(?:\\.|[^'\\\r\n]){1,6}'/,
      greedy: true
    }
  });
  Prism2.languages.insertBefore("java", "class-name", {
    "annotation": {
      pattern: /(^|[^.])@\w+(?:\s*\.\s*\w+)*/,
      lookbehind: true,
      alias: "punctuation"
    },
    "generics": {
      pattern: /<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&))*>)*>)*>)*>/,
      inside: {
        "class-name": className,
        "keyword": keywords,
        "punctuation": /[<>(),.:]/,
        "operator": /[?&|]/
      }
    },
    "import": [
      {
        pattern: RegExp(/(\bimport\s+)/.source + classNamePrefix + /(?:[A-Z]\w*|\*)(?=\s*;)/.source),
        lookbehind: true,
        inside: {
          "namespace": className.inside.namespace,
          "punctuation": /\./,
          "operator": /\*/,
          "class-name": /\w+/
        }
      },
      {
        pattern: RegExp(/(\bimport\s+static\s+)/.source + classNamePrefix + /(?:\w+|\*)(?=\s*;)/.source),
        lookbehind: true,
        alias: "static",
        inside: {
          "namespace": className.inside.namespace,
          "static": /\b\w+$/,
          "punctuation": /\./,
          "operator": /\*/,
          "class-name": /\w+/
        }
      }
    ],
    "namespace": {
      pattern: RegExp(
        /(\b(?:exports|import(?:\s+static)?|module|open|opens|package|provides|requires|to|transitive|uses|with)\s+)(?!<keyword>)[a-z]\w*(?:\.[a-z]\w*)*\.?/.source.replace(/<keyword>/g, function() {
          return keywords.source;
        })
      ),
      lookbehind: true,
      inside: {
        "punctuation": /\./
      }
    }
  });
})(Prism);
(function(Prism2) {
  var powershell = Prism2.languages.powershell = {
    "comment": [
      {
        pattern: /(^|[^`])<#[\s\S]*?#>/,
        lookbehind: true
      },
      {
        pattern: /(^|[^`])#.*/,
        lookbehind: true
      }
    ],
    "string": [
      {
        pattern: /"(?:`[\s\S]|[^`"])*"/,
        greedy: true,
        inside: null
        // see below
      },
      {
        pattern: /'(?:[^']|'')*'/,
        greedy: true
      }
    ],
    // Matches name spaces as well as casts, attribute decorators. Force starting with letter to avoid matching array indices
    // Supports two levels of nested brackets (e.g. `[OutputType([System.Collections.Generic.List[int]])]`)
    "namespace": /\[[a-z](?:\[(?:\[[^\]]*\]|[^\[\]])*\]|[^\[\]])*\]/i,
    "boolean": /\$(?:false|true)\b/i,
    "variable": /\$\w+\b/,
    // Cmdlets and aliases. Aliases should come last, otherwise "write" gets preferred over "write-host" for example
    // Get-Command | ?{ $_.ModuleName -match "Microsoft.PowerShell.(Util|Core|Management)" }
    // Get-Alias | ?{ $_.ReferencedCommand.Module.Name -match "Microsoft.PowerShell.(Util|Core|Management)" }
    "function": [
      /\b(?:Add|Approve|Assert|Backup|Block|Checkpoint|Clear|Close|Compare|Complete|Compress|Confirm|Connect|Convert|ConvertFrom|ConvertTo|Copy|Debug|Deny|Disable|Disconnect|Dismount|Edit|Enable|Enter|Exit|Expand|Export|Find|ForEach|Format|Get|Grant|Group|Hide|Import|Initialize|Install|Invoke|Join|Limit|Lock|Measure|Merge|Move|New|Open|Optimize|Out|Ping|Pop|Protect|Publish|Push|Read|Receive|Redo|Register|Remove|Rename|Repair|Request|Reset|Resize|Resolve|Restart|Restore|Resume|Revoke|Save|Search|Select|Send|Set|Show|Skip|Sort|Split|Start|Step|Stop|Submit|Suspend|Switch|Sync|Tee|Test|Trace|Unblock|Undo|Uninstall|Unlock|Unprotect|Unpublish|Unregister|Update|Use|Wait|Watch|Where|Write)-[a-z]+\b/i,
      /\b(?:ac|cat|chdir|clc|cli|clp|clv|compare|copy|cp|cpi|cpp|cvpa|dbp|del|diff|dir|ebp|echo|epal|epcsv|epsn|erase|fc|fl|ft|fw|gal|gbp|gc|gci|gcs|gdr|gi|gl|gm|gp|gps|group|gsv|gu|gv|gwmi|iex|ii|ipal|ipcsv|ipsn|irm|iwmi|iwr|kill|lp|ls|measure|mi|mount|move|mp|mv|nal|ndr|ni|nv|ogv|popd|ps|pushd|pwd|rbp|rd|rdr|ren|ri|rm|rmdir|rni|rnp|rp|rv|rvpa|rwmi|sal|saps|sasv|sbp|sc|select|set|shcm|si|sl|sleep|sls|sort|sp|spps|spsv|start|sv|swmi|tee|trcm|type|write)\b/i
    ],
    // per http://technet.microsoft.com/en-us/library/hh847744.aspx
    "keyword": /\b(?:Begin|Break|Catch|Class|Continue|Data|Define|Do|DynamicParam|Else|ElseIf|End|Exit|Filter|Finally|For|ForEach|From|Function|If|InlineScript|Parallel|Param|Process|Return|Sequence|Switch|Throw|Trap|Try|Until|Using|Var|While|Workflow)\b/i,
    "operator": {
      pattern: /(^|\W)(?:!|-(?:b?(?:and|x?or)|as|(?:Not)?(?:Contains|In|Like|Match)|eq|ge|gt|is(?:Not)?|Join|le|lt|ne|not|Replace|sh[lr])\b|-[-=]?|\+[+=]?|[*\/%]=?)/i,
      lookbehind: true
    },
    "punctuation": /[|{}[\];(),.]/
  };
  powershell.string[0].inside = {
    "function": {
      // Allow for one level of nesting
      pattern: /(^|[^`])\$\((?:\$\([^\r\n()]*\)|(?!\$\()[^\r\n)])*\)/,
      lookbehind: true,
      inside: powershell
    },
    "boolean": powershell.boolean,
    "variable": powershell.variable
  };
})(Prism);
Prism.languages.swift = {
  "comment": {
    // Nested comments are supported up to 2 levels
    pattern: /(^|[^\\:])(?:\/\/.*|\/\*(?:[^/*]|\/(?!\*)|\*(?!\/)|\/\*(?:[^*]|\*(?!\/))*\*\/)*\*\/)/,
    lookbehind: true,
    greedy: true
  },
  "string-literal": [
    // https://docs.swift.org/swift-book/LanguageGuide/StringsAndCharacters.html
    {
      pattern: RegExp(
        /(^|[^"#])/.source + "(?:" + /"(?:\\(?:\((?:[^()]|\([^()]*\))*\)|\r\n|[^(])|[^\\\r\n"])*"/.source + "|" + /"""(?:\\(?:\((?:[^()]|\([^()]*\))*\)|[^(])|[^\\"]|"(?!""))*"""/.source + ")" + /(?!["#])/.source
      ),
      lookbehind: true,
      greedy: true,
      inside: {
        "interpolation": {
          pattern: /(\\\()(?:[^()]|\([^()]*\))*(?=\))/,
          lookbehind: true,
          inside: null
          // see below
        },
        "interpolation-punctuation": {
          pattern: /^\)|\\\($/,
          alias: "punctuation"
        },
        "punctuation": /\\(?=[\r\n])/,
        "string": /[\s\S]+/
      }
    },
    {
      pattern: RegExp(
        /(^|[^"#])(#+)/.source + "(?:" + /"(?:\\(?:#+\((?:[^()]|\([^()]*\))*\)|\r\n|[^#])|[^\\\r\n])*?"/.source + "|" + /"""(?:\\(?:#+\((?:[^()]|\([^()]*\))*\)|[^#])|[^\\])*?"""/.source + ")\\2"
      ),
      lookbehind: true,
      greedy: true,
      inside: {
        "interpolation": {
          pattern: /(\\#+\()(?:[^()]|\([^()]*\))*(?=\))/,
          lookbehind: true,
          inside: null
          // see below
        },
        "interpolation-punctuation": {
          pattern: /^\)|\\#+\($/,
          alias: "punctuation"
        },
        "string": /[\s\S]+/
      }
    }
  ],
  "directive": {
    // directives with conditions
    pattern: RegExp(
      /#/.source + "(?:" + (/(?:elseif|if)\b/.source + "(?:[ 	]*" + /(?:![ \t]*)?(?:\b\w+\b(?:[ \t]*\((?:[^()]|\([^()]*\))*\))?|\((?:[^()]|\([^()]*\))*\))(?:[ \t]*(?:&&|\|\|))?/.source + ")+") + "|" + /(?:else|endif)\b/.source + ")"
    ),
    alias: "property",
    inside: {
      "directive-name": /^#\w+/,
      "boolean": /\b(?:false|true)\b/,
      "number": /\b\d+(?:\.\d+)*\b/,
      "operator": /!|&&|\|\||[<>]=?/,
      "punctuation": /[(),]/
    }
  },
  "literal": {
    pattern: /#(?:colorLiteral|column|dsohandle|file(?:ID|Literal|Path)?|function|imageLiteral|line)\b/,
    alias: "constant"
  },
  "other-directive": {
    pattern: /#\w+\b/,
    alias: "property"
  },
  "attribute": {
    pattern: /@\w+/,
    alias: "atrule"
  },
  "function-definition": {
    pattern: /(\bfunc\s+)\w+/,
    lookbehind: true,
    alias: "function"
  },
  "label": {
    // https://docs.swift.org/swift-book/LanguageGuide/ControlFlow.html#ID141
    pattern: /\b(break|continue)\s+\w+|\b[a-zA-Z_]\w*(?=\s*:\s*(?:for|repeat|while)\b)/,
    lookbehind: true,
    alias: "important"
  },
  "keyword": /\b(?:Any|Protocol|Self|Type|actor|as|assignment|associatedtype|associativity|async|await|break|case|catch|class|continue|convenience|default|defer|deinit|didSet|do|dynamic|else|enum|extension|fallthrough|fileprivate|final|for|func|get|guard|higherThan|if|import|in|indirect|infix|init|inout|internal|is|isolated|lazy|left|let|lowerThan|mutating|none|nonisolated|nonmutating|open|operator|optional|override|postfix|precedencegroup|prefix|private|protocol|public|repeat|required|rethrows|return|right|safe|self|set|some|static|struct|subscript|super|switch|throw|throws|try|typealias|unowned|unsafe|var|weak|where|while|willSet)\b/,
  "boolean": /\b(?:false|true)\b/,
  "nil": {
    pattern: /\bnil\b/,
    alias: "constant"
  },
  "short-argument": /\$\d+\b/,
  "omit": {
    pattern: /\b_\b/,
    alias: "keyword"
  },
  "number": /\b(?:[\d_]+(?:\.[\de_]+)?|0x[a-f0-9_]+(?:\.[a-f0-9p_]+)?|0b[01_]+|0o[0-7_]+)\b/i,
  // A class name must start with an upper-case letter and be either 1 letter long or contain a lower-case letter.
  "class-name": /\b[A-Z](?:[A-Z_\d]*[a-z]\w*)?\b/,
  "function": /\b[a-z_]\w*(?=\s*\()/i,
  "constant": /\b(?:[A-Z_]{2,}|k[A-Z][A-Za-z_]+)\b/,
  // Operators are generic in Swift. Developers can even create new operators (e.g. +++).
  // https://docs.swift.org/swift-book/ReferenceManual/zzSummaryOfTheGrammar.html#ID481
  // This regex only supports ASCII operators.
  "operator": /[-+*/%=!<>&|^~?]+|\.[.\-+*/%=!<>&|^~?]+/,
  "punctuation": /[{}[\]();,.:\\]/
};
Prism.languages.swift["string-literal"].forEach(function(rule) {
  rule.inside["interpolation"].inside = Prism.languages.swift;
});
Prism.languages.json = {
  "property": {
    pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
    lookbehind: true,
    greedy: true
  },
  "string": {
    pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
    lookbehind: true,
    greedy: true
  },
  "comment": {
    pattern: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
    greedy: true
  },
  "number": /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
  "punctuation": /[{}[\],]/,
  "operator": /:/,
  "boolean": /\b(?:false|true)\b/,
  "null": {
    pattern: /\bnull\b/,
    alias: "keyword"
  }
};
Prism.languages.webmanifest = Prism.languages.json;
(function(Prism2) {
  var string = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
  Prism2.languages.css = {
    "comment": /\/\*[\s\S]*?\*\//,
    "atrule": {
      pattern: RegExp("@[\\w-](?:" + /[^;{\s"']|\s+(?!\s)/.source + "|" + string.source + ")*?" + /(?:;|(?=\s*\{))/.source),
      inside: {
        "rule": /^@[\w-]+/,
        "selector-function-argument": {
          pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
          lookbehind: true,
          alias: "selector"
        },
        "keyword": {
          pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
          lookbehind: true
        }
        // See rest below
      }
    },
    "url": {
      // https://drafts.csswg.org/css-values-3/#urls
      pattern: RegExp("\\burl\\((?:" + string.source + "|" + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ")\\)", "i"),
      greedy: true,
      inside: {
        "function": /^url/i,
        "punctuation": /^\(|\)$/,
        "string": {
          pattern: RegExp("^" + string.source + "$"),
          alias: "url"
        }
      }
    },
    "selector": {
      pattern: RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|` + string.source + ")*(?=\\s*\\{)"),
      lookbehind: true
    },
    "string": {
      pattern: string,
      greedy: true
    },
    "property": {
      pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
      lookbehind: true
    },
    "important": /!important\b/i,
    "function": {
      pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
      lookbehind: true
    },
    "punctuation": /[(){};:,]/
  };
  Prism2.languages.css["atrule"].inside.rest = Prism2.languages.css;
  var markup = Prism2.languages.markup;
  if (markup) {
    markup.tag.addInlined("style", "css");
    markup.tag.addAttribute("style", "css");
  }
})(Prism);
Prism.languages.less = Prism.languages.extend("css", {
  "comment": [
    /\/\*[\s\S]*?\*\//,
    {
      pattern: /(^|[^\\])\/\/.*/,
      lookbehind: true
    }
  ],
  "atrule": {
    pattern: /@[\w-](?:\((?:[^(){}]|\([^(){}]*\))*\)|[^(){};\s]|\s+(?!\s))*?(?=\s*\{)/,
    inside: {
      "punctuation": /[:()]/
    }
  },
  // selectors and mixins are considered the same
  "selector": {
    pattern: /(?:@\{[\w-]+\}|[^{};\s@])(?:@\{[\w-]+\}|\((?:[^(){}]|\([^(){}]*\))*\)|[^(){};@\s]|\s+(?!\s))*?(?=\s*\{)/,
    inside: {
      // mixin parameters
      "variable": /@+[\w-]+/
    }
  },
  "property": /(?:@\{[\w-]+\}|[\w-])+(?:\+_?)?(?=\s*:)/,
  "operator": /[+\-*\/]/
});
Prism.languages.insertBefore("less", "property", {
  "variable": [
    // Variable declaration (the colon must be consumed!)
    {
      pattern: /@[\w-]+\s*:/,
      inside: {
        "punctuation": /:/
      }
    },
    // Variable usage
    /@@?[\w-]+/
  ],
  "mixin-usage": {
    pattern: /([{;]\s*)[.#](?!\d)[\w-].*?(?=[(;])/,
    lookbehind: true,
    alias: "function"
  }
});
Prism.languages.scss = Prism.languages.extend("css", {
  "comment": {
    pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/,
    lookbehind: true
  },
  "atrule": {
    pattern: /@[\w-](?:\([^()]+\)|[^()\s]|\s+(?!\s))*?(?=\s+[{;])/,
    inside: {
      "rule": /@[\w-]+/
      // See rest below
    }
  },
  // url, compassified
  "url": /(?:[-a-z]+-)?url(?=\()/i,
  // CSS selector regex is not appropriate for Sass
  // since there can be lot more things (var, @ directive, nesting..)
  // a selector must start at the end of a property or after a brace (end of other rules or nesting)
  // it can contain some characters that aren't used for defining rules or end of selector, & (parent selector), or interpolated variable
  // the end of a selector is found when there is no rules in it ( {} or {\s}) or if there is a property (because an interpolated var
  // can "pass" as a selector- e.g: proper#{$erty})
  // this one was hard to do, so please be careful if you edit this one :)
  "selector": {
    // Initial look-ahead is used to prevent matching of blank selectors
    pattern: /(?=\S)[^@;{}()]?(?:[^@;{}()\s]|\s+(?!\s)|#\{\$[-\w]+\})+(?=\s*\{(?:\}|\s|[^}][^:{}]*[:{][^}]))/,
    inside: {
      "parent": {
        pattern: /&/,
        alias: "important"
      },
      "placeholder": /%[-\w]+/,
      "variable": /\$[-\w]+|#\{\$[-\w]+\}/
    }
  },
  "property": {
    pattern: /(?:[-\w]|\$[-\w]|#\{\$[-\w]+\})+(?=\s*:)/,
    inside: {
      "variable": /\$[-\w]+|#\{\$[-\w]+\}/
    }
  }
});
Prism.languages.insertBefore("scss", "atrule", {
  "keyword": [
    /@(?:content|debug|each|else(?: if)?|extend|for|forward|function|if|import|include|mixin|return|use|warn|while)\b/i,
    {
      pattern: /( )(?:from|through)(?= )/,
      lookbehind: true
    }
  ]
});
Prism.languages.insertBefore("scss", "important", {
  // var and interpolated vars
  "variable": /\$[-\w]+|#\{\$[-\w]+\}/
});
Prism.languages.insertBefore("scss", "function", {
  "module-modifier": {
    pattern: /\b(?:as|hide|show|with)\b/i,
    alias: "keyword"
  },
  "placeholder": {
    pattern: /%[-\w]+/,
    alias: "selector"
  },
  "statement": {
    pattern: /\B!(?:default|optional)\b/i,
    alias: "keyword"
  },
  "boolean": /\b(?:false|true)\b/,
  "null": {
    pattern: /\bnull\b/,
    alias: "keyword"
  },
  "operator": {
    pattern: /(\s)(?:[-+*\/%]|[=!]=|<=?|>=?|and|not|or)(?=\s)/,
    lookbehind: true
  }
});
Prism.languages.scss["atrule"].inside.rest = Prism.languages.scss;
(function(Prism2) {
  var unit = {
    pattern: /(\b\d+)(?:%|[a-z]+)/,
    lookbehind: true
  };
  var number = {
    pattern: /(^|[^\w.-])-?(?:\d+(?:\.\d+)?|\.\d+)/,
    lookbehind: true
  };
  var inside = {
    "comment": {
      pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/,
      lookbehind: true
    },
    "url": {
      pattern: /\burl\((["']?).*?\1\)/i,
      greedy: true
    },
    "string": {
      pattern: /("|')(?:(?!\1)[^\\\r\n]|\\(?:\r\n|[\s\S]))*\1/,
      greedy: true
    },
    "interpolation": null,
    // See below
    "func": null,
    // See below
    "important": /\B!(?:important|optional)\b/i,
    "keyword": {
      pattern: /(^|\s+)(?:(?:else|for|if|return|unless)(?=\s|$)|@[\w-]+)/,
      lookbehind: true
    },
    "hexcode": /#[\da-f]{3,6}/i,
    "color": [
      /\b(?:AliceBlue|AntiqueWhite|Aqua|Aquamarine|Azure|Beige|Bisque|Black|BlanchedAlmond|Blue|BlueViolet|Brown|BurlyWood|CadetBlue|Chartreuse|Chocolate|Coral|CornflowerBlue|Cornsilk|Crimson|Cyan|DarkBlue|DarkCyan|DarkGoldenRod|DarkGr[ae]y|DarkGreen|DarkKhaki|DarkMagenta|DarkOliveGreen|DarkOrange|DarkOrchid|DarkRed|DarkSalmon|DarkSeaGreen|DarkSlateBlue|DarkSlateGr[ae]y|DarkTurquoise|DarkViolet|DeepPink|DeepSkyBlue|DimGr[ae]y|DodgerBlue|FireBrick|FloralWhite|ForestGreen|Fuchsia|Gainsboro|GhostWhite|Gold|GoldenRod|Gr[ae]y|Green|GreenYellow|HoneyDew|HotPink|IndianRed|Indigo|Ivory|Khaki|Lavender|LavenderBlush|LawnGreen|LemonChiffon|LightBlue|LightCoral|LightCyan|LightGoldenRodYellow|LightGr[ae]y|LightGreen|LightPink|LightSalmon|LightSeaGreen|LightSkyBlue|LightSlateGr[ae]y|LightSteelBlue|LightYellow|Lime|LimeGreen|Linen|Magenta|Maroon|MediumAquaMarine|MediumBlue|MediumOrchid|MediumPurple|MediumSeaGreen|MediumSlateBlue|MediumSpringGreen|MediumTurquoise|MediumVioletRed|MidnightBlue|MintCream|MistyRose|Moccasin|NavajoWhite|Navy|OldLace|Olive|OliveDrab|Orange|OrangeRed|Orchid|PaleGoldenRod|PaleGreen|PaleTurquoise|PaleVioletRed|PapayaWhip|PeachPuff|Peru|Pink|Plum|PowderBlue|Purple|Red|RosyBrown|RoyalBlue|SaddleBrown|Salmon|SandyBrown|SeaGreen|SeaShell|Sienna|Silver|SkyBlue|SlateBlue|SlateGr[ae]y|Snow|SpringGreen|SteelBlue|Tan|Teal|Thistle|Tomato|Transparent|Turquoise|Violet|Wheat|White|WhiteSmoke|Yellow|YellowGreen)\b/i,
      {
        pattern: /\b(?:hsl|rgb)\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*\)\B|\b(?:hsl|rgb)a\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*(?:0|0?\.\d+|1)\s*\)\B/i,
        inside: {
          "unit": unit,
          "number": number,
          "function": /[\w-]+(?=\()/,
          "punctuation": /[(),]/
        }
      }
    ],
    "entity": /\\[\da-f]{1,8}/i,
    "unit": unit,
    "boolean": /\b(?:false|true)\b/,
    "operator": [
      // We want non-word chars around "-" because it is
      // accepted in property names.
      /~|[+!\/%<>?=]=?|[-:]=|\*[*=]?|\.{2,3}|&&|\|\||\B-\B|\b(?:and|in|is(?: a| defined| not|nt)?|not|or)\b/
    ],
    "number": number,
    "punctuation": /[{}()\[\];:,]/
  };
  inside["interpolation"] = {
    pattern: /\{[^\r\n}:]+\}/,
    alias: "variable",
    inside: {
      "delimiter": {
        pattern: /^\{|\}$/,
        alias: "punctuation"
      },
      rest: inside
    }
  };
  inside["func"] = {
    pattern: /[\w-]+\([^)]*\).*/,
    inside: {
      "function": /^[^(]+/,
      rest: inside
    }
  };
  Prism2.languages.stylus = {
    "atrule-declaration": {
      pattern: /(^[ \t]*)@.+/m,
      lookbehind: true,
      inside: {
        "atrule": /^@[\w-]+/,
        rest: inside
      }
    },
    "variable-declaration": {
      pattern: /(^[ \t]*)[\w$-]+\s*.?=[ \t]*(?:\{[^{}]*\}|\S.*|$)/m,
      lookbehind: true,
      inside: {
        "variable": /^\S+/,
        rest: inside
      }
    },
    "statement": {
      pattern: /(^[ \t]*)(?:else|for|if|return|unless)[ \t].+/m,
      lookbehind: true,
      inside: {
        "keyword": /^\S+/,
        rest: inside
      }
    },
    // A property/value pair cannot end with a comma or a brace
    // It cannot have indented content unless it ended with a semicolon
    "property-declaration": {
      pattern: /((?:^|\{)([ \t]*))(?:[\w-]|\{[^}\r\n]+\})+(?:\s*:\s*|[ \t]+)(?!\s)[^{\r\n]*(?:;|[^{\r\n,]$(?!(?:\r?\n|\r)(?:\{|\2[ \t])))/m,
      lookbehind: true,
      inside: {
        "property": {
          pattern: /^[^\s:]+/,
          inside: {
            "interpolation": inside.interpolation
          }
        },
        rest: inside
      }
    },
    // A selector can contain parentheses only as part of a pseudo-element
    // It can span multiple lines.
    // It must end with a comma or an accolade or have indented content.
    "selector": {
      pattern: /(^[ \t]*)(?:(?=\S)(?:[^{}\r\n:()]|::?[\w-]+(?:\([^)\r\n]*\)|(?![\w-]))|\{[^}\r\n]+\})+)(?:(?:\r?\n|\r)(?:\1(?:(?=\S)(?:[^{}\r\n:()]|::?[\w-]+(?:\([^)\r\n]*\)|(?![\w-]))|\{[^}\r\n]+\})+)))*(?:,$|\{|(?=(?:\r?\n|\r)(?:\{|\1[ \t])))/m,
      lookbehind: true,
      inside: {
        "interpolation": inside.interpolation,
        "comment": inside.comment,
        "punctuation": /[{},]/
      }
    },
    "func": inside.func,
    "string": inside.string,
    "comment": {
      pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/,
      lookbehind: true,
      greedy: true
    },
    "interpolation": inside.interpolation,
    "punctuation": /[{}()\[\];:.]/
  };
})(Prism);
Prism.languages.c = Prism.languages.extend("clike", {
  "comment": {
    pattern: /\/\/(?:[^\r\n\\]|\\(?:\r\n?|\n|(?![\r\n])))*|\/\*[\s\S]*?(?:\*\/|$)/,
    greedy: true
  },
  "string": {
    // https://en.cppreference.com/w/c/language/string_literal
    pattern: /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/,
    greedy: true
  },
  "class-name": {
    pattern: /(\b(?:enum|struct)\s+(?:__attribute__\s*\(\([\s\S]*?\)\)\s*)?)\w+|\b[a-z]\w*_t\b/,
    lookbehind: true
  },
  "keyword": /\b(?:_Alignas|_Alignof|_Atomic|_Bool|_Complex|_Generic|_Imaginary|_Noreturn|_Static_assert|_Thread_local|__attribute__|asm|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|inline|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|typeof|union|unsigned|void|volatile|while)\b/,
  "function": /\b[a-z_]\w*(?=\s*\()/i,
  "number": /(?:\b0x(?:[\da-f]+(?:\.[\da-f]*)?|\.[\da-f]+)(?:p[+-]?\d+)?|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?)[ful]{0,4}/i,
  "operator": />>=?|<<=?|->|([-+&|:])\1|[?:~]|[-+*/%&|^!=<>]=?/
});
Prism.languages.insertBefore("c", "string", {
  "char": {
    // https://en.cppreference.com/w/c/language/character_constant
    pattern: /'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n]){0,32}'/,
    greedy: true
  }
});
Prism.languages.insertBefore("c", "string", {
  "macro": {
    // allow for multiline macro definitions
    // spaces after the # character compile fine with gcc
    pattern: /(^[\t ]*)#\s*[a-z](?:[^\r\n\\/]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|\\(?:\r\n|[\s\S]))*/im,
    lookbehind: true,
    greedy: true,
    alias: "property",
    inside: {
      "string": [
        {
          // highlight the path of the include statement as a string
          pattern: /^(#\s*include\s*)<[^>]+>/,
          lookbehind: true
        },
        Prism.languages.c["string"]
      ],
      "char": Prism.languages.c["char"],
      "comment": Prism.languages.c["comment"],
      "macro-name": [
        {
          pattern: /(^#\s*define\s+)\w+\b(?!\()/i,
          lookbehind: true
        },
        {
          pattern: /(^#\s*define\s+)\w+\b(?=\()/i,
          lookbehind: true,
          alias: "function"
        }
      ],
      // highlight macro directives as keywords
      "directive": {
        pattern: /^(#\s*)[a-z]+/,
        lookbehind: true,
        alias: "keyword"
      },
      "directive-hash": /^#/,
      "punctuation": /##|\\(?=[\r\n])/,
      "expression": {
        pattern: /\S[\s\S]*/,
        inside: Prism.languages.c
      }
    }
  }
});
Prism.languages.insertBefore("c", "function", {
  // highlight predefined macros as constants
  "constant": /\b(?:EOF|NULL|SEEK_CUR|SEEK_END|SEEK_SET|__DATE__|__FILE__|__LINE__|__TIMESTAMP__|__TIME__|__func__|stderr|stdin|stdout)\b/
});
delete Prism.languages.c["boolean"];
(function(Prism2) {
  var keyword = /\b(?:alignas|alignof|asm|auto|bool|break|case|catch|char|char16_t|char32_t|char8_t|class|co_await|co_return|co_yield|compl|concept|const|const_cast|consteval|constexpr|constinit|continue|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|final|float|for|friend|goto|if|import|inline|int|int16_t|int32_t|int64_t|int8_t|long|module|mutable|namespace|new|noexcept|nullptr|operator|override|private|protected|public|register|reinterpret_cast|requires|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|uint16_t|uint32_t|uint64_t|uint8_t|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/;
  var modName = /\b(?!<keyword>)\w+(?:\s*\.\s*\w+)*\b/.source.replace(/<keyword>/g, function() {
    return keyword.source;
  });
  Prism2.languages.cpp = Prism2.languages.extend("c", {
    "class-name": [
      {
        pattern: RegExp(/(\b(?:class|concept|enum|struct|typename)\s+)(?!<keyword>)\w+/.source.replace(/<keyword>/g, function() {
          return keyword.source;
        })),
        lookbehind: true
      },
      // This is intended to capture the class name of method implementations like:
      //   void foo::bar() const {}
      // However! The `foo` in the above example could also be a namespace, so we only capture the class name if
      // it starts with an uppercase letter. This approximation should give decent results.
      /\b[A-Z]\w*(?=\s*::\s*\w+\s*\()/,
      // This will capture the class name before destructors like:
      //   Foo::~Foo() {}
      /\b[A-Z_]\w*(?=\s*::\s*~\w+\s*\()/i,
      // This also intends to capture the class name of method implementations but here the class has template
      // parameters, so it can't be a namespace (until C++ adds generic namespaces).
      /\b\w+(?=\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>\s*::\s*\w+\s*\()/
    ],
    "keyword": keyword,
    "number": {
      pattern: /(?:\b0b[01']+|\b0x(?:[\da-f']+(?:\.[\da-f']*)?|\.[\da-f']+)(?:p[+-]?[\d']+)?|(?:\b[\d']+(?:\.[\d']*)?|\B\.[\d']+)(?:e[+-]?[\d']+)?)[ful]{0,4}/i,
      greedy: true
    },
    "operator": />>=?|<<=?|->|--|\+\+|&&|\|\||[?:~]|<=>|[-+*/%&|^!=<>]=?|\b(?:and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/,
    "boolean": /\b(?:false|true)\b/
  });
  Prism2.languages.insertBefore("cpp", "string", {
    "module": {
      // https://en.cppreference.com/w/cpp/language/modules
      pattern: RegExp(
        /(\b(?:import|module)\s+)/.source + "(?:" + // header-name
        /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|<[^<>\r\n]*>/.source + "|" + // module name or partition or both
        /<mod-name>(?:\s*:\s*<mod-name>)?|:\s*<mod-name>/.source.replace(/<mod-name>/g, function() {
          return modName;
        }) + ")"
      ),
      lookbehind: true,
      greedy: true,
      inside: {
        "string": /^[<"][\s\S]+/,
        "operator": /:/,
        "punctuation": /\./
      }
    },
    "raw-string": {
      pattern: /R"([^()\\ ]{0,16})\([\s\S]*?\)\1"/,
      alias: "string",
      greedy: true
    }
  });
  Prism2.languages.insertBefore("cpp", "keyword", {
    "generic-function": {
      pattern: /\b(?!operator\b)[a-z_]\w*\s*<(?:[^<>]|<[^<>]*>)*>(?=\s*\()/i,
      inside: {
        "function": /^\w+/,
        "generic": {
          pattern: /<[\s\S]+/,
          alias: "class-name",
          inside: Prism2.languages.cpp
        }
      }
    }
  });
  Prism2.languages.insertBefore("cpp", "operator", {
    "double-colon": {
      pattern: /::/,
      alias: "punctuation"
    }
  });
  Prism2.languages.insertBefore("cpp", "class-name", {
    // the base clause is an optional list of parent classes
    // https://en.cppreference.com/w/cpp/language/class
    "base-clause": {
      pattern: /(\b(?:class|struct)\s+\w+\s*:\s*)[^;{}"'\s]+(?:\s+[^;{}"'\s]+)*(?=\s*[;{])/,
      lookbehind: true,
      greedy: true,
      inside: Prism2.languages.extend("cpp", {})
    }
  });
  Prism2.languages.insertBefore("inside", "double-colon", {
    // All untokenized words that are not namespaces should be class names
    "class-name": /\b[a-z_]\w*\b(?!\s*::)/i
  }, Prism2.languages.cpp["base-clause"]);
})(Prism);
(function(Prism2) {
  function replace(pattern, replacements) {
    return pattern.replace(/<<(\d+)>>/g, function(m, index) {
      return "(?:" + replacements[+index] + ")";
    });
  }
  function re(pattern, replacements, flags) {
    return RegExp(replace(pattern, replacements), "");
  }
  function nested(pattern, depthLog2) {
    for (var i = 0; i < depthLog2; i++) {
      pattern = pattern.replace(/<<self>>/g, function() {
        return "(?:" + pattern + ")";
      });
    }
    return pattern.replace(/<<self>>/g, "[^\\s\\S]");
  }
  var keywordKinds = {
    // keywords which represent a return or variable type
    type: "bool byte char decimal double dynamic float int long object sbyte short string uint ulong ushort var void",
    // keywords which are used to declare a type
    typeDeclaration: "class enum interface record struct",
    // contextual keywords
    // ("var" and "dynamic" are missing because they are used like types)
    contextual: "add alias and ascending async await by descending from(?=\\s*(?:\\w|$)) get global group into init(?=\\s*;) join let nameof not notnull on or orderby partial remove select set unmanaged value when where with(?=\\s*{)",
    // all other keywords
    other: "abstract as base break case catch checked const continue default delegate do else event explicit extern finally fixed for foreach goto if implicit in internal is lock namespace new null operator out override params private protected public readonly ref return sealed sizeof stackalloc static switch this throw try typeof unchecked unsafe using virtual volatile while yield"
  };
  function keywordsToPattern(words) {
    return "\\b(?:" + words.trim().replace(/ /g, "|") + ")\\b";
  }
  var typeDeclarationKeywords = keywordsToPattern(keywordKinds.typeDeclaration);
  var keywords = RegExp(keywordsToPattern(keywordKinds.type + " " + keywordKinds.typeDeclaration + " " + keywordKinds.contextual + " " + keywordKinds.other));
  var nonTypeKeywords = keywordsToPattern(keywordKinds.typeDeclaration + " " + keywordKinds.contextual + " " + keywordKinds.other);
  var nonContextualKeywords = keywordsToPattern(keywordKinds.type + " " + keywordKinds.typeDeclaration + " " + keywordKinds.other);
  var generic = nested(/<(?:[^<>;=+\-*/%&|^]|<<self>>)*>/.source, 2);
  var nestedRound = nested(/\((?:[^()]|<<self>>)*\)/.source, 2);
  var name = /@?\b[A-Za-z_]\w*\b/.source;
  var genericName = replace(/<<0>>(?:\s*<<1>>)?/.source, [name, generic]);
  var identifier = replace(/(?!<<0>>)<<1>>(?:\s*\.\s*<<1>>)*/.source, [nonTypeKeywords, genericName]);
  var array = /\[\s*(?:,\s*)*\]/.source;
  var typeExpressionWithoutTuple = replace(/<<0>>(?:\s*(?:\?\s*)?<<1>>)*(?:\s*\?)?/.source, [identifier, array]);
  var tupleElement = replace(/[^,()<>[\];=+\-*/%&|^]|<<0>>|<<1>>|<<2>>/.source, [generic, nestedRound, array]);
  var tuple = replace(/\(<<0>>+(?:,<<0>>+)+\)/.source, [tupleElement]);
  var typeExpression = replace(/(?:<<0>>|<<1>>)(?:\s*(?:\?\s*)?<<2>>)*(?:\s*\?)?/.source, [tuple, identifier, array]);
  var typeInside = {
    "keyword": keywords,
    "punctuation": /[<>()?,.:[\]]/
  };
  var character = /'(?:[^\r\n'\\]|\\.|\\[Uux][\da-fA-F]{1,8})'/.source;
  var regularString = /"(?:\\.|[^\\"\r\n])*"/.source;
  var verbatimString = /@"(?:""|\\[\s\S]|[^\\"])*"(?!")/.source;
  Prism2.languages.csharp = Prism2.languages.extend("clike", {
    "string": [
      {
        pattern: re(/(^|[^$\\])<<0>>/.source, [verbatimString]),
        lookbehind: true,
        greedy: true
      },
      {
        pattern: re(/(^|[^@$\\])<<0>>/.source, [regularString]),
        lookbehind: true,
        greedy: true
      }
    ],
    "class-name": [
      {
        // Using static
        // using static System.Math;
        pattern: re(/(\busing\s+static\s+)<<0>>(?=\s*;)/.source, [identifier]),
        lookbehind: true,
        inside: typeInside
      },
      {
        // Using alias (type)
        // using Project = PC.MyCompany.Project;
        pattern: re(/(\busing\s+<<0>>\s*=\s*)<<1>>(?=\s*;)/.source, [name, typeExpression]),
        lookbehind: true,
        inside: typeInside
      },
      {
        // Using alias (alias)
        // using Project = PC.MyCompany.Project;
        pattern: re(/(\busing\s+)<<0>>(?=\s*=)/.source, [name]),
        lookbehind: true
      },
      {
        // Type declarations
        // class Foo<A, B>
        // interface Foo<out A, B>
        pattern: re(/(\b<<0>>\s+)<<1>>/.source, [typeDeclarationKeywords, genericName]),
        lookbehind: true,
        inside: typeInside
      },
      {
        // Single catch exception declaration
        // catch(Foo)
        // (things like catch(Foo e) is covered by variable declaration)
        pattern: re(/(\bcatch\s*\(\s*)<<0>>/.source, [identifier]),
        lookbehind: true,
        inside: typeInside
      },
      {
        // Name of the type parameter of generic constraints
        // where Foo : class
        pattern: re(/(\bwhere\s+)<<0>>/.source, [name]),
        lookbehind: true
      },
      {
        // Casts and checks via as and is.
        // as Foo<A>, is Bar<B>
        // (things like if(a is Foo b) is covered by variable declaration)
        pattern: re(/(\b(?:is(?:\s+not)?|as)\s+)<<0>>/.source, [typeExpressionWithoutTuple]),
        lookbehind: true,
        inside: typeInside
      },
      {
        // Variable, field and parameter declaration
        // (Foo bar, Bar baz, Foo[,,] bay, Foo<Bar, FooBar<Bar>> bax)
        pattern: re(/\b<<0>>(?=\s+(?!<<1>>|with\s*\{)<<2>>(?:\s*[=,;:{)\]]|\s+(?:in|when)\b))/.source, [typeExpression, nonContextualKeywords, name]),
        inside: typeInside
      }
    ],
    "keyword": keywords,
    // https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/lexical-structure#literals
    "number": /(?:\b0(?:x[\da-f_]*[\da-f]|b[01_]*[01])|(?:\B\.\d+(?:_+\d+)*|\b\d+(?:_+\d+)*(?:\.\d+(?:_+\d+)*)?)(?:e[-+]?\d+(?:_+\d+)*)?)(?:[dflmu]|lu|ul)?\b/i,
    "operator": />>=?|<<=?|[-=]>|([-+&|])\1|~|\?\?=?|[-+*/%&|^!=<>]=?/,
    "punctuation": /\?\.?|::|[{}[\];(),.:]/
  });
  Prism2.languages.insertBefore("csharp", "number", {
    "range": {
      pattern: /\.\./,
      alias: "operator"
    }
  });
  Prism2.languages.insertBefore("csharp", "punctuation", {
    "named-parameter": {
      pattern: re(/([(,]\s*)<<0>>(?=\s*:)/.source, [name]),
      lookbehind: true,
      alias: "punctuation"
    }
  });
  Prism2.languages.insertBefore("csharp", "class-name", {
    "namespace": {
      // namespace Foo.Bar {}
      // using Foo.Bar;
      pattern: re(/(\b(?:namespace|using)\s+)<<0>>(?:\s*\.\s*<<0>>)*(?=\s*[;{])/.source, [name]),
      lookbehind: true,
      inside: {
        "punctuation": /\./
      }
    },
    "type-expression": {
      // default(Foo), typeof(Foo<Bar>), sizeof(int)
      pattern: re(/(\b(?:default|sizeof|typeof)\s*\(\s*(?!\s))(?:[^()\s]|\s(?!\s)|<<0>>)*(?=\s*\))/.source, [nestedRound]),
      lookbehind: true,
      alias: "class-name",
      inside: typeInside
    },
    "return-type": {
      // Foo<Bar> ForBar(); Foo IFoo.Bar() => 0
      // int this[int index] => 0; T IReadOnlyList<T>.this[int index] => this[index];
      // int Foo => 0; int Foo { get; set } = 0;
      pattern: re(/<<0>>(?=\s+(?:<<1>>\s*(?:=>|[({]|\.\s*this\s*\[)|this\s*\[))/.source, [typeExpression, identifier]),
      inside: typeInside,
      alias: "class-name"
    },
    "constructor-invocation": {
      // new List<Foo<Bar[]>> { }
      pattern: re(/(\bnew\s+)<<0>>(?=\s*[[({])/.source, [typeExpression]),
      lookbehind: true,
      inside: typeInside,
      alias: "class-name"
    },
    /*'explicit-implementation': {
    	// int IFoo<Foo>.Bar => 0; void IFoo<Foo<Foo>>.Foo<T>();
    	pattern: replace(/\b<<0>>(?=\.<<1>>)/, className, methodOrPropertyDeclaration),
    	inside: classNameInside,
    	alias: 'class-name'
    },*/
    "generic-method": {
      // foo<Bar>()
      pattern: re(/<<0>>\s*<<1>>(?=\s*\()/.source, [name, generic]),
      inside: {
        "function": re(/^<<0>>/.source, [name]),
        "generic": {
          pattern: RegExp(generic),
          alias: "class-name",
          inside: typeInside
        }
      }
    },
    "type-list": {
      // The list of types inherited or of generic constraints
      // class Foo<F> : Bar, IList<FooBar>
      // where F : Bar, IList<int>
      pattern: re(
        /\b((?:<<0>>\s+<<1>>|record\s+<<1>>\s*<<5>>|where\s+<<2>>)\s*:\s*)(?:<<3>>|<<4>>|<<1>>\s*<<5>>|<<6>>)(?:\s*,\s*(?:<<3>>|<<4>>|<<6>>))*(?=\s*(?:where|[{;]|=>|$))/.source,
        [typeDeclarationKeywords, genericName, name, typeExpression, keywords.source, nestedRound, /\bnew\s*\(\s*\)/.source]
      ),
      lookbehind: true,
      inside: {
        "record-arguments": {
          pattern: re(/(^(?!new\s*\()<<0>>\s*)<<1>>/.source, [genericName, nestedRound]),
          lookbehind: true,
          greedy: true,
          inside: Prism2.languages.csharp
        },
        "keyword": keywords,
        "class-name": {
          pattern: RegExp(typeExpression),
          greedy: true,
          inside: typeInside
        },
        "punctuation": /[,()]/
      }
    },
    "preprocessor": {
      pattern: /(^[\t ]*)#.*/m,
      lookbehind: true,
      alias: "property",
      inside: {
        // highlight preprocessor directives as keywords
        "directive": {
          pattern: /(#)\b(?:define|elif|else|endif|endregion|error|if|line|nullable|pragma|region|undef|warning)\b/,
          lookbehind: true,
          alias: "keyword"
        }
      }
    }
  });
  var regularStringOrCharacter = regularString + "|" + character;
  var regularStringCharacterOrComment = replace(/\/(?![*/])|\/\/[^\r\n]*[\r\n]|\/\*(?:[^*]|\*(?!\/))*\*\/|<<0>>/.source, [regularStringOrCharacter]);
  var roundExpression = nested(replace(/[^"'/()]|<<0>>|\(<<self>>*\)/.source, [regularStringCharacterOrComment]), 2);
  var attrTarget = /\b(?:assembly|event|field|method|module|param|property|return|type)\b/.source;
  var attr = replace(/<<0>>(?:\s*\(<<1>>*\))?/.source, [identifier, roundExpression]);
  Prism2.languages.insertBefore("csharp", "class-name", {
    "attribute": {
      // Attributes
      // [Foo], [Foo(1), Bar(2, Prop = "foo")], [return: Foo(1), Bar(2)], [assembly: Foo(Bar)]
      pattern: re(/((?:^|[^\s\w>)?])\s*\[\s*)(?:<<0>>\s*:\s*)?<<1>>(?:\s*,\s*<<1>>)*(?=\s*\])/.source, [attrTarget, attr]),
      lookbehind: true,
      greedy: true,
      inside: {
        "target": {
          pattern: re(/^<<0>>(?=\s*:)/.source, [attrTarget]),
          alias: "keyword"
        },
        "attribute-arguments": {
          pattern: re(/\(<<0>>*\)/.source, [roundExpression]),
          inside: Prism2.languages.csharp
        },
        "class-name": {
          pattern: RegExp(identifier),
          inside: {
            "punctuation": /\./
          }
        },
        "punctuation": /[:,]/
      }
    }
  });
  var formatString = /:[^}\r\n]+/.source;
  var mInterpolationRound = nested(replace(/[^"'/()]|<<0>>|\(<<self>>*\)/.source, [regularStringCharacterOrComment]), 2);
  var mInterpolation = replace(/\{(?!\{)(?:(?![}:])<<0>>)*<<1>>?\}/.source, [mInterpolationRound, formatString]);
  var sInterpolationRound = nested(replace(/[^"'/()]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|<<0>>|\(<<self>>*\)/.source, [regularStringOrCharacter]), 2);
  var sInterpolation = replace(/\{(?!\{)(?:(?![}:])<<0>>)*<<1>>?\}/.source, [sInterpolationRound, formatString]);
  function createInterpolationInside(interpolation, interpolationRound) {
    return {
      "interpolation": {
        pattern: re(/((?:^|[^{])(?:\{\{)*)<<0>>/.source, [interpolation]),
        lookbehind: true,
        inside: {
          "format-string": {
            pattern: re(/(^\{(?:(?![}:])<<0>>)*)<<1>>(?=\}$)/.source, [interpolationRound, formatString]),
            lookbehind: true,
            inside: {
              "punctuation": /^:/
            }
          },
          "punctuation": /^\{|\}$/,
          "expression": {
            pattern: /[\s\S]+/,
            alias: "language-csharp",
            inside: Prism2.languages.csharp
          }
        }
      },
      "string": /[\s\S]+/
    };
  }
  Prism2.languages.insertBefore("csharp", "string", {
    "interpolation-string": [
      {
        pattern: re(/(^|[^\\])(?:\$@|@\$)"(?:""|\\[\s\S]|\{\{|<<0>>|[^\\{"])*"/.source, [mInterpolation]),
        lookbehind: true,
        greedy: true,
        inside: createInterpolationInside(mInterpolation, mInterpolationRound)
      },
      {
        pattern: re(/(^|[^@\\])\$"(?:\\.|\{\{|<<0>>|[^\\"{])*"/.source, [sInterpolation]),
        lookbehind: true,
        greedy: true,
        inside: createInterpolationInside(sInterpolation, sInterpolationRound)
      }
    ],
    "char": {
      pattern: RegExp(character),
      greedy: true
    }
  });
  Prism2.languages.dotnet = Prism2.languages.cs = Prism2.languages.csharp;
})(Prism);
Prism.languages.go = Prism.languages.extend("clike", {
  "string": {
    pattern: /(^|[^\\])"(?:\\.|[^"\\\r\n])*"|`[^`]*`/,
    lookbehind: true,
    greedy: true
  },
  "keyword": /\b(?:break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go(?:to)?|if|import|interface|map|package|range|return|select|struct|switch|type|var)\b/,
  "boolean": /\b(?:_|false|iota|nil|true)\b/,
  "number": [
    // binary and octal integers
    /\b0(?:b[01_]+|o[0-7_]+)i?\b/i,
    // hexadecimal integers and floats
    /\b0x(?:[a-f\d_]+(?:\.[a-f\d_]*)?|\.[a-f\d_]+)(?:p[+-]?\d+(?:_\d+)*)?i?(?!\w)/i,
    // decimal integers and floats
    /(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?[\d_]+)?i?(?!\w)/i
  ],
  "operator": /[*\/%^!=]=?|\+[=+]?|-[=-]?|\|[=|]?|&(?:=|&|\^=?)?|>(?:>=?|=)?|<(?:<=?|=|-)?|:=|\.\.\./,
  "builtin": /\b(?:append|bool|byte|cap|close|complex|complex(?:64|128)|copy|delete|error|float(?:32|64)|u?int(?:8|16|32|64)?|imag|len|make|new|panic|print(?:ln)?|real|recover|rune|string|uintptr)\b/
});
Prism.languages.insertBefore("go", "string", {
  "char": {
    pattern: /'(?:\\.|[^'\\\r\n]){0,10}'/,
    greedy: true
  }
});
delete Prism.languages.go["class-name"];
(function(Prism2) {
  var javascript = Prism2.util.clone(Prism2.languages.javascript);
  var space = /(?:\s|\/\/.*(?!.)|\/\*(?:[^*]|\*(?!\/))\*\/)/.source;
  var braces = /(?:\{(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])*\})/.source;
  var spread = /(?:\{<S>*\.{3}(?:[^{}]|<BRACES>)*\})/.source;
  function re(source, flags) {
    source = source.replace(/<S>/g, function() {
      return space;
    }).replace(/<BRACES>/g, function() {
      return braces;
    }).replace(/<SPREAD>/g, function() {
      return spread;
    });
    return RegExp(source, flags);
  }
  spread = re(spread).source;
  Prism2.languages.jsx = Prism2.languages.extend("markup", javascript);
  Prism2.languages.jsx.tag.pattern = re(
    /<\/?(?:[\w.:-]+(?:<S>+(?:[\w.:$-]+(?:=(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s{'"/>=]+|<BRACES>))?|<SPREAD>))*<S>*\/?)?>/.source
  );
  Prism2.languages.jsx.tag.inside["tag"].pattern = /^<\/?[^\s>\/]*/;
  Prism2.languages.jsx.tag.inside["attr-value"].pattern = /=(?!\{)(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s'">]+)/;
  Prism2.languages.jsx.tag.inside["tag"].inside["class-name"] = /^[A-Z]\w*(?:\.[A-Z]\w*)*$/;
  Prism2.languages.jsx.tag.inside["comment"] = javascript["comment"];
  Prism2.languages.insertBefore("inside", "attr-name", {
    "spread": {
      pattern: re(/<SPREAD>/.source),
      inside: Prism2.languages.jsx
    }
  }, Prism2.languages.jsx.tag);
  Prism2.languages.insertBefore("inside", "special-attr", {
    "script": {
      // Allow for two levels of nesting
      pattern: re(/=<BRACES>/.source),
      alias: "language-javascript",
      inside: {
        "script-punctuation": {
          pattern: /^=(?=\{)/,
          alias: "punctuation"
        },
        rest: Prism2.languages.jsx
      }
    }
  }, Prism2.languages.jsx.tag);
  var stringifyToken = function(token) {
    if (!token) {
      return "";
    }
    if (typeof token === "string") {
      return token;
    }
    if (typeof token.content === "string") {
      return token.content;
    }
    return token.content.map(stringifyToken).join("");
  };
  var walkTokens = function(tokens) {
    var openedTags = [];
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      var notTagNorBrace = false;
      if (typeof token !== "string") {
        if (token.type === "tag" && token.content[0] && token.content[0].type === "tag") {
          if (token.content[0].content[0].content === "</") {
            if (openedTags.length > 0 && openedTags[openedTags.length - 1].tagName === stringifyToken(token.content[0].content[1])) {
              openedTags.pop();
            }
          } else {
            if (token.content[token.content.length - 1].content === "/>")
              ;
            else {
              openedTags.push({
                tagName: stringifyToken(token.content[0].content[1]),
                openedBraces: 0
              });
            }
          }
        } else if (openedTags.length > 0 && token.type === "punctuation" && token.content === "{") {
          openedTags[openedTags.length - 1].openedBraces++;
        } else if (openedTags.length > 0 && openedTags[openedTags.length - 1].openedBraces > 0 && token.type === "punctuation" && token.content === "}") {
          openedTags[openedTags.length - 1].openedBraces--;
        } else {
          notTagNorBrace = true;
        }
      }
      if (notTagNorBrace || typeof token === "string") {
        if (openedTags.length > 0 && openedTags[openedTags.length - 1].openedBraces === 0) {
          var plainText = stringifyToken(token);
          if (i < tokens.length - 1 && (typeof tokens[i + 1] === "string" || tokens[i + 1].type === "plain-text")) {
            plainText += stringifyToken(tokens[i + 1]);
            tokens.splice(i + 1, 1);
          }
          if (i > 0 && (typeof tokens[i - 1] === "string" || tokens[i - 1].type === "plain-text")) {
            plainText = stringifyToken(tokens[i - 1]) + plainText;
            tokens.splice(i - 1, 1);
            i--;
          }
          tokens[i] = new Prism2.Token("plain-text", plainText, null, plainText);
        }
      }
      if (token.content && typeof token.content !== "string") {
        walkTokens(token.content);
      }
    }
  };
  Prism2.hooks.add("after-tokenize", function(env) {
    if (env.language !== "jsx" && env.language !== "tsx") {
      return;
    }
    walkTokens(env.tokens);
  });
})(Prism);
(function(Prism2) {
  var typescript = Prism2.util.clone(Prism2.languages.typescript);
  Prism2.languages.tsx = Prism2.languages.extend("jsx", typescript);
  delete Prism2.languages.tsx["parameter"];
  delete Prism2.languages.tsx["literal-property"];
  var tag = Prism2.languages.tsx.tag;
  tag.pattern = RegExp(/(^|[^\w$]|(?=<\/))/.source + "(?:" + tag.pattern.source + ")", tag.pattern.flags);
  tag.lookbehind = true;
})(Prism);
function useEnterBreaking(injector, slots) {
  const selection = injector.get(Selection);
  const commander = injector.get(Commander);
  const self2 = useSelf();
  onBreak((ev) => {
    var _a;
    const parentSlot = self2.parent;
    const index = parentSlot.indexOf(self2);
    parentSlot.retain(index + 1);
    const currentSlot = slots.get(0);
    const delta = currentSlot.cut(ev.data.index).toDelta();
    const nextSlot = new Slot([
      ContentType.Text,
      ContentType.InlineComponent
    ]);
    let i = 0;
    while (i < delta.length) {
      const item = delta[i];
      item.formats = item.formats.filter((format2) => {
        return format2[0].name !== "AnimeFormatter";
      });
      if (nextSlot.insert(item.insert, item.formats)) {
        i++;
        continue;
      }
      break;
    }
    if (nextSlot.isEmpty) {
      nextSlot.applyFormat(linkFormatter, {
        startIndex: 0,
        endIndex: 1,
        value: null
      });
    }
    const component = paragraphComponent.createInstance(injector, {
      slots: [nextSlot]
    });
    const beforeComponent = parentSlot.getContentAtIndex(index - 1);
    if (index === parentSlot.length - 1 && beforeComponent && typeof beforeComponent !== "string" && ["BlockComponent", "ParagraphComponent", "HeadingComponent"].includes(beforeComponent.name) && ((_a = beforeComponent.slots.get(0)) == null ? void 0 : _a.isEmpty) && currentSlot.isEmpty && nextSlot.isEmpty) {
      const host = parentSlot.parentSlot;
      if (host) {
        const index2 = host.indexOf(self2.parentComponent);
        parentSlot.retain(parentSlot.index - 2);
        parentSlot.delete(2);
        host.retain(index2 + 1);
        host.insert(component);
      }
    }
    if (!component.parent) {
      parentSlot.insert(component);
    }
    selection.selectLastPosition(component);
    while (i < delta.length) {
      const item = delta[i];
      i++;
      item.formats = item.formats.filter((format2) => {
        return format2[0].name !== "AnimeFormatter";
      });
      commander.insert(item.insert, item.formats);
    }
    selection.setPosition(component.slots.get(0), 0);
    ev.preventDefault();
  });
}
const paragraphComponent = defineComponent$1({
  type: ContentType.BlockComponent,
  name: "ParagraphComponent",
  setup(data) {
    const injector = useContext();
    const slots = useSlots((data == null ? void 0 : data.slots) || [new Slot([
      ContentType.Text,
      ContentType.InlineComponent
    ])]);
    useEnterBreaking(injector, slots);
    return {
      render(slotRender) {
        return slotRender(slots.get(0), (children) => {
          return /* @__PURE__ */ jsx("p", { children });
        });
      }
    };
  }
});
const paragraphComponentLoader = {
  match(element) {
    return element.tagName === "P";
  },
  read(element, injector, slotParser) {
    const slot = slotParser(new Slot([
      ContentType.Text,
      ContentType.InlineComponent
    ]), element);
    return paragraphComponent.createInstance(injector, {
      slots: [slot]
    });
  }
};
function useComponentToolbar() {
  let isShow = false;
  const self2 = useSelf();
  onFocus(() => {
    isShow = true;
    self2.changeMarker.forceMarkDirtied();
  });
  onBlur(() => {
    isShow = false;
    self2.changeMarker.forceMarkDirtied();
  });
  return function(props) {
    return /* @__PURE__ */ jsx("div", { class: "tb-component-toolbar", style: {
      display: isShow ? "block" : "none"
    }, onMousedown: (ev) => {
      ev.preventDefault();
      return false;
    }, children: /* @__PURE__ */ jsx("div", { class: "tb-component-toolbar-inner", children: props.children }) });
  };
}
function useSelector(config, callback) {
  let isOpen = false;
  const self2 = useSelf();
  onBlur(() => {
    isOpen = false;
    self2.changeMarker.forceMarkDirtied();
  });
  let current = config.items.find((item) => {
    return item.value === config.defaultValue;
  });
  const container = useContext(VIEW_DOCUMENT);
  const subscription = fromEvent$1(container, "mousedown").subscribe(() => {
    if (isOpen) {
      isOpen = false;
      self2.changeMarker.forceMarkDirtied();
    }
  });
  onDestroy(() => {
    subscription.unsubscribe();
  });
  return function() {
    return /* @__PURE__ */ jsxs("div", { class: classNames("textbus-toolbar-dropdown", {
      "textbus-toolbar-dropdown-open": isOpen
    }), children: [
      /* @__PURE__ */ jsx("div", { class: "textbus-toolbar-dropdown-button", children: /* @__PURE__ */ jsx("span", { class: "textbus-toolbar-item textbus-toolbar-dropdown", children: /* @__PURE__ */ jsxs("button", { class: "textbus-toolbar-button", type: "button", onClick: () => {
        isOpen = !isOpen;
        self2.changeMarker.forceMarkDirtied();
      }, children: [
        /* @__PURE__ */ jsx("span", { class: "textbus-toolbar-select-label", children: (current == null ? void 0 : current.label) || " " }),
        /* @__PURE__ */ jsx("span", { class: "textbus-dropdown-caret" })
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { class: "textbus-toolbar-dropdown-menu", children: /* @__PURE__ */ jsx("div", { class: "textbus-toolbar-select-options", children: config.items.map((item) => {
        return /* @__PURE__ */ jsx("button", { class: "textbus-toolbar-option", onMousedown: (ev) => ev.stopPropagation(), type: "button", onClick: () => {
          current = item;
          isOpen = false;
          callback(item);
          self2.changeMarker.forceMarkDirtied();
        }, children: /* @__PURE__ */ jsx("span", { class: "textbus-toolbar-option-label", children: item.label }) });
      }) }) })
    ] });
  };
}
const codeStyles = {
  keyword: "keyword",
  string: "string",
  function: "function",
  number: "number",
  tag: "tag",
  comment: "comment",
  boolean: "boolean",
  operator: false,
  builtin: "builtin",
  punctuation: false,
  regex: "regex",
  selector: "selector",
  property: "attr-name",
  "class-name": "class-name",
  "attr-name": "attr-name",
  "attr-value": "attr-value",
  "template-punctuation": "string"
};
const languageList = [{
  label: "JavaScript",
  value: "JavaScript"
}, {
  label: "HTML",
  value: "HTML"
}, {
  label: "CSS",
  value: "CSS"
}, {
  label: "TypeScript",
  value: "TypeScript"
}, {
  label: "Java",
  value: "Java"
}, {
  label: "C",
  value: "C"
}, {
  label: "C++",
  value: "CPP"
}, {
  label: "C#",
  value: "CSharp"
}, {
  label: "Swift",
  value: "Swift"
}, {
  label: "Go",
  value: "Go"
}, {
  label: "JSON",
  value: "JSON"
}, {
  label: "Less",
  value: "Less"
}, {
  label: "SCSS",
  value: "SCSS"
}, {
  label: "Stylus",
  value: "Stylus"
}, {
  label: "Jsx",
  value: "Jsx"
}, {
  label: "Tsx",
  value: "Tsx"
}, {
  label: "",
  value: ""
}];
class CodeStyleFormatter {
  constructor() {
    __publicField(this, "priority", 0);
    // 新增代码
    __publicField(this, "name", "code" + Math.random());
    __publicField(this, "columned", false);
  }
  render(children, formatValue) {
    return new VElement("span", {
      class: "tb-hl-" + formatValue
    }, children);
  }
}
const codeStyleFormatter = new CodeStyleFormatter();
function getLanguageBlockCommentStart(lang) {
  const types = {
    HTML: ["<!--", "-->"],
    JavaScript: ["/*", "*/"],
    CSS: ["/*", "*/"],
    TypeScript: ["/*", "*/"],
    Java: ["/*", "*/"],
    Swift: ["/*", "*/"],
    Go: ["/*", "*/"],
    JSON: ["", ""],
    Less: ["/*", "*/"],
    SCSS: ["/*", "*/"],
    Stylus: ["/*", "*/"],
    C: ["/*", "*/"],
    CPP: ["/*", "*/"],
    CSharp: ["/*", "*/"],
    Tsx: ["/*", "*/"],
    Jsx: ["/*", "*/"]
  };
  return types[lang] || ["", ""];
}
function getLanguageGrammar(lang) {
  return {
    HTML: languages.html,
    JavaScript: languages.javascript,
    CSS: languages.css,
    TypeScript: languages.typescript,
    Java: languages.java,
    Swift: languages.swift,
    JSON: languages.json,
    Go: languages.go,
    Ruby: languages.ruby,
    Less: languages.less,
    SCSS: languages.scss,
    Stylus: languages.stylus,
    C: languages.c,
    CPP: languages.cpp,
    CSharp: languages.csharp,
    Jsx: languages.jsx,
    Tsx: languages.tsx
  }[lang] || null;
}
function format(tokens, slot, index) {
  tokens.forEach((token) => {
    if (token instanceof Token) {
      const styleName = codeStyles[token.type];
      slot.retain(index);
      slot.retain(token.length, codeStyleFormatter, styleName || null);
      if (Array.isArray(token.content)) {
        format(token.content, slot, index);
      }
    }
    index += token.length;
  });
}
function formatCodeLines(lines, startBlock, blockCommentStartString, blockCommentEndString, languageGrammar) {
  return lines.map((item) => {
    let i = item.code;
    const slot = createCodeSlot();
    slot.updateState((draft) => {
      draft.blockCommentStart = startBlock;
      draft.emphasize = item.emphasize;
    });
    if (slot.state.blockCommentStart) {
      i = blockCommentStartString + i;
    }
    slot.insert(i);
    if (languageGrammar) {
      const tokens = tokenize(i, languageGrammar);
      format(tokens, slot, 0);
      if (slot.state.blockCommentStart) {
        slot.retain(0);
        slot.delete(2);
      }
      const lastToken = tokens.pop();
      if (lastToken && typeof lastToken !== "string" && lastToken.type === "comment" && lastToken.content.indexOf(blockCommentStartString) === 0) {
        const regString = blockCommentEndString.replace(new RegExp(`[${blockCommentEndString}]`, "g"), (i2) => "\\" + i2);
        slot.updateState((draft) => {
          draft.blockCommentEnd = new RegExp(regString + "$").test(lastToken.content);
        });
        startBlock = !slot.state.blockCommentEnd;
      } else {
        startBlock = false;
      }
    } else {
      slot.updateState((draft) => {
        draft.blockCommentEnd = true;
      });
    }
    return slot;
  });
}
function reformat(slots, startSlot, languageGrammar, blockCommentStartString, blockCommentEndString, forceFormat = false) {
  const list = slots.toArray();
  let i = list.indexOf(startSlot);
  for (; i < list.length; i++) {
    const slot = list[i];
    let code = slot.sliceContent()[0];
    if (slot.state.blockCommentStart) {
      code = blockCommentStartString + code;
    }
    const shadow = new Slot([ContentType.Text]);
    shadow.insert(code);
    const tokens = tokenize(code, languageGrammar);
    format(tokens, shadow, 0);
    if (slot.state.blockCommentStart) {
      shadow.retain(0);
      shadow.delete(2);
    }
    slot.retain(0);
    slot.retain(slot.length, codeStyleFormatter, null);
    shadow.getFormats().forEach((i2) => {
      slot.retain(i2.startIndex);
      slot.retain(i2.endIndex - i2.startIndex, i2.formatter, i2.value);
    });
    const lastToken = tokens.pop();
    if (lastToken && typeof lastToken !== "string" && lastToken.type === "comment" && lastToken.content.indexOf(blockCommentStartString) === 0) {
      const regString = blockCommentEndString.replace(new RegExp(`[${blockCommentEndString}]`, "g"), (i2) => "\\" + i2);
      slot.updateState((draft) => {
        draft.blockCommentEnd = new RegExp(regString + "$").test(lastToken.content);
      });
    } else {
      slot.updateState((draft) => {
        draft.blockCommentEnd = true;
      });
    }
    const next = list[i + 1];
    if (next) {
      if (!forceFormat && next.state.blockCommentStart === !slot.state.blockCommentEnd) {
        break;
      }
      next.updateState((draft) => {
        draft.blockCommentStart = !slot.state.blockCommentEnd;
      });
    }
  }
}
function createCodeSlot() {
  return new Slot([
    ContentType.Text
  ], {
    blockCommentEnd: true,
    blockCommentStart: false,
    emphasize: false
  });
}
const preComponent = defineComponent$1({
  type: ContentType.BlockComponent,
  name: "PreComponent",
  separable: false,
  zenCoding: {
    key: "Enter",
    match(c) {
      const matchString = languageList.map((i) => i.label || i.value).concat("js", "ts").join("|").replace(/\+/, "\\+");
      const reg = new RegExp(`^\`\`\`(${matchString})$`, "i");
      return reg.test(c);
    },
    generateInitData(content) {
      const matchString = content.replace(/`/g, "").replace(/\+/, "\\+");
      for (const item of languageList) {
        const reg = new RegExp(`^${matchString}$`, "i");
        if (reg.test(item.label || item.value)) {
          return {
            state: {
              lang: item.value,
              theme: ""
            },
            slots: [createCodeSlot()]
          };
        }
      }
      if (/^js$/i.test(matchString)) {
        return {
          state: {
            lang: "JavaScript",
            theme: ""
          },
          slots: [createCodeSlot()]
        };
      }
      if (/^ts$/i.test(matchString)) {
        return {
          state: {
            lang: "TypeScript",
            theme: ""
          },
          slots: [createCodeSlot()]
        };
      }
      return {
        state: {
          lang: "",
          theme: ""
        },
        slots: [createCodeSlot()]
      };
    }
  },
  setup(data = {
    slots: [],
    state: {
      lang: "",
      theme: ""
    }
  }) {
    var _a, _b, _c;
    let languageGrammar = getLanguageGrammar(data.state.lang);
    let [blockCommentStartString, blockCommentEndString] = getLanguageBlockCommentStart(data.state.lang);
    const stateController = useState({
      lang: data.state.lang,
      theme: ((_a = data.state) == null ? void 0 : _a.theme) || "auto"
    });
    const injector = useContext();
    const i18n = injector.get(I18n);
    const selection = injector.get(Selection);
    stateController.onChange.subscribe((newState) => {
      data.state.lang = newState.lang;
      data.state.theme = newState.theme;
      languageGrammar = getLanguageGrammar(newState.lang);
      [blockCommentStartString, blockCommentEndString] = getLanguageBlockCommentStart(newState.lang);
      isStop = true;
      slots.toArray().forEach((i) => {
        i.updateState((draft) => {
          draft.blockCommentStart = false;
          draft.blockCommentEnd = false;
        });
      });
      if (!languageGrammar) {
        slots.toArray().forEach((i) => {
          i.retain(0);
          i.retain(i.length, codeStyleFormatter, null);
        });
      } else {
        reformat(slots, slots.get(0), languageGrammar, blockCommentStartString, blockCommentEndString, true);
      }
      isStop = false;
    });
    const codeConfig = (data.slots || [createCodeSlot()]).map((i) => {
      var _a2;
      return {
        emphasize: ((_a2 = i.state) == null ? void 0 : _a2.emphasize) || false,
        code: i.toString()
      };
    });
    const slotList = formatCodeLines(
      codeConfig,
      false,
      blockCommentStartString,
      blockCommentEndString,
      languageGrammar
    );
    const slots = useSlots(slotList);
    let isStop = false;
    slots.onChildSlotChange.subscribe((slot) => {
      if (languageGrammar && !isStop) {
        isStop = true;
        const index = slot.index;
        reformat(slots, slot, languageGrammar, blockCommentStartString, blockCommentEndString);
        slot.retain(index);
        isStop = false;
      }
    });
    useDynamicShortcut({
      keymap: {
        key: "/",
        ctrlKey: true
      },
      action: () => {
        const startIndex = slots.indexOf(selection.startSlot);
        const endIndex = slots.indexOf(selection.endSlot);
        const selectedSlots = slots.slice(startIndex, endIndex + 1);
        const isAllComment = selectedSlots.every((f) => {
          return /^\s*\/\//.test(f.toString());
        });
        if (isAllComment) {
          selectedSlots.forEach((f) => {
            const code = f.toString();
            const index = code.indexOf("// ");
            const index2 = code.indexOf("//");
            if (index >= 0) {
              f.cut(index, index + 3);
              if (f === selection.anchorSlot) {
                selection.setAnchor(f, selection.startOffset - 3);
              }
              if (f === selection.focusSlot) {
                selection.setFocus(f, selection.endOffset - 3);
              }
            } else {
              f.cut(index2, index2 + 2);
              if (f === selection.anchorSlot) {
                selection.setAnchor(f, selection.startOffset - 2);
              }
              if (f === selection.focusSlot) {
                selection.setFocus(f, selection.endOffset - 2);
              }
            }
          });
        } else {
          selectedSlots.forEach((f) => {
            f.retain(0);
            f.insert("// ");
          });
          selection.setBaseAndExtent(selection.startSlot, selection.startOffset + 3, selection.endSlot, selection.endOffset + 3);
        }
      }
    });
    onBreak((ev) => {
      if (ev.target.isEmpty && ev.target === slots.last) {
        const prevSlot = slots.get(slots.length - 2);
        if (prevSlot == null ? void 0 : prevSlot.isEmpty) {
          const paragraph = paragraphComponent.createInstance(injector);
          const parentComponent = selection.commonAncestorComponent;
          const parentSlot = parentComponent.parent;
          const index = parentSlot.indexOf(parentComponent);
          parentSlot.retain(index + 1);
          slots.remove(slots.last);
          if (slots.length > 1) {
            slots.remove(prevSlot);
          }
          parentSlot.insert(paragraph);
          selection.setPosition(paragraph.slots.get(0), 0);
          ev.preventDefault();
          return;
        }
      }
      const nextSlot = ev.target.cutTo(createCodeSlot(), ev.data.index);
      slots.insertAfter(nextSlot, ev.target);
      if (languageGrammar && !isStop) {
        isStop = true;
        const index = nextSlot.index;
        reformat(slots, nextSlot, languageGrammar, blockCommentStartString, blockCommentEndString);
        nextSlot.retain(index);
        isStop = false;
      }
      selection.setPosition(nextSlot, 0);
      ev.preventDefault();
    });
    function emphasize() {
      var _a2;
      const { startSlot, endSlot } = selection;
      let startIndex = slots.indexOf(startSlot);
      const endIndex = slots.indexOf(endSlot) + 1;
      for (; startIndex < endIndex; startIndex++) {
        (_a2 = slots.get(startIndex)) == null ? void 0 : _a2.updateState((draft) => {
          draft.emphasize = true;
        });
      }
    }
    function cancelEmphasize() {
      var _a2;
      const { startSlot, endSlot } = selection;
      let startIndex = slots.indexOf(startSlot);
      const endIndex = slots.indexOf(endSlot) + 1;
      for (; startIndex < endIndex; startIndex++) {
        (_a2 = slots.get(startIndex)) == null ? void 0 : _a2.updateState((draft) => {
          draft.emphasize = false;
        });
      }
    }
    onContextMenu((event) => {
      event.useMenus([{
        iconClasses: ["textbus-icon-source-code"],
        label: i18n.get("components.preComponent.contextMenuLabel"),
        submenu: languageList.map((i) => {
          return {
            label: i.label || i18n.get("components.preComponent.defaultLang"),
            onClick() {
              if (i.value !== data.state.lang) {
                data.state.lang = i.value;
                stateController.update((draft) => {
                  draft.lang = i.value;
                });
              }
            }
          };
        })
      }, {
        // iconClasses:
        label: i18n.get("components.preComponent.changeTheme"),
        submenu: [{
          label: "Light",
          onClick() {
            stateController.update((draft) => {
              draft.theme = "light";
            });
          }
        }, {
          label: "Dark",
          onClick() {
            stateController.update((draft) => {
              draft.theme = "dark";
            });
          }
        }]
      }, {
        label: i18n.get("components.preComponent.emphasize"),
        disabled: !selection.isSelected,
        onClick: emphasize
      }, {
        label: i18n.get("components.preComponent.cancelEmphasize"),
        disabled: !selection.isSelected,
        onClick: cancelEmphasize
      }]);
    });
    onPaste((ev) => {
      const codeList = [];
      const sourceCode = ev.data.text;
      let str = "";
      let isBreak = true;
      for (let i = 0; i < sourceCode.length; i++) {
        const char = sourceCode[i];
        if (char === "\r") {
          if (sourceCode[i + 1] === "\n") {
            i++;
          }
          if (str) {
            codeList.push(str);
            str = "";
          }
          if (!isBreak) {
            codeList.push("");
          } else {
            isBreak = false;
          }
        } else if (char === "\n") {
          if (str) {
            codeList.push(str);
            str = "";
          }
          if (!isBreak) {
            codeList.push("");
          } else {
            isBreak = false;
          }
        } else {
          isBreak = true;
          str += char;
        }
      }
      if (str) {
        codeList.push(str);
      }
      const firstCode = codeList.shift();
      const target = ev.target;
      if (firstCode) {
        target.insert(firstCode);
      }
      const index = slots.indexOf(target);
      if (codeList.length) {
        slots.retain(index + 1);
        const slotList2 = formatCodeLines(
          codeList.map((i) => {
            return {
              code: i,
              emphasize: false
            };
          }),
          !target.state.blockCommentEnd,
          blockCommentStartString,
          blockCommentEndString,
          languageGrammar
        );
        const last = slotList2[slotList2.length - 1];
        slots.insert(...slotList2);
        selection.setPosition(last, last.length);
      } else {
        selection.setPosition(target, target.index);
      }
      ev.preventDefault();
    });
    const ComponentToolbar = useComponentToolbar();
    const LanguageSelector = useSelector({
      items: languageList.map((item) => {
        if (item.label) {
          return item;
        }
        return {
          ...item,
          label: i18n.get("components.preComponent.defaultLang")
        };
      }),
      defaultValue: (_b = data.state) == null ? void 0 : _b.lang
    }, (current) => {
      stateController.update((draft) => {
        draft.lang = current.value;
      });
    });
    const ThemeSelector = useSelector({
      items: [
        {
          label: "Auto",
          value: "auto"
        },
        {
          label: "Light",
          value: "light"
        },
        {
          label: "Dark",
          value: "dark"
        }
      ],
      defaultValue: ((_c = data.state) == null ? void 0 : _c.theme) || "auto"
    }, (current) => {
      stateController.update((draft) => {
        draft.theme = current.value;
      });
    });
    return {
      render(slotRender, renderMode) {
        let lang = "";
        languageList.forEach((i) => {
          if (i.value === data.state.lang) {
            lang = i.label;
          }
        });
        const blockHighlight = slots.toArray().some((i) => {
          var _a2;
          return ((_a2 = i.state) == null ? void 0 : _a2.emphasize) === true;
        });
        return /* @__PURE__ */ jsxs("pre", { class: "tb-pre", lang, "data-theme": data.state.theme || null, children: [
          renderMode === RenderMode.Editing ? /* @__PURE__ */ jsxs(ComponentToolbar, { children: [
            /* @__PURE__ */ jsx(LanguageSelector, {}),
            /* @__PURE__ */ jsx(ThemeSelector, {}),
            /* @__PURE__ */ jsx("button", { type: "button", class: "textbus-toolbar-button", onClick: emphasize, children: i18n.get("components.preComponent.emphasize") }),
            /* @__PURE__ */ jsx("button", { type: "button", class: "textbus-toolbar-button", onClick: cancelEmphasize, children: i18n.get("components.preComponent.cancelEmphasize") })
          ] }) : null,
          /* @__PURE__ */ jsxs("div", { class: "tb-pre-content", children: [
            /* @__PURE__ */ jsx("div", { class: "tb-code-line-number-bg ", style: {
              width: Math.max(String(slots.length).length, 2.5) + "em"
            } }),
            /* @__PURE__ */ jsx("div", { class: "tb-code-content" + (blockHighlight ? " tb-color-content-highlight" : ""), children: slots.toArray().map((item) => {
              return slotRender(item, (children) => {
                var _a2;
                return /* @__PURE__ */ jsx(
                  "div",
                  {
                    class: (((_a2 = item.state) == null ? void 0 : _a2.emphasize) ? "tb-code-line-emphasize " : "") + "tb-code-line",
                    children
                  }
                );
              });
            }) }),
            /* @__PURE__ */ jsx("span", { class: "tb-pre-lang", children: lang })
          ] })
        ] });
      }
    };
  }
});
const preComponentLoader = {
  match(element) {
    return element.tagName === "PRE";
  },
  read(el, injector) {
    const lines = el.querySelectorAll(".tb-code-line");
    let slots = [];
    if (lines.length) {
      slots = Array.from(lines).map((i) => {
        const code = i.innerText.replace(/[\s\n]+$/, "");
        const slot = createCodeSlot();
        slot.updateState((draft) => {
          draft.emphasize = i.classList.contains("tb-code-line-emphasize");
        });
        slot.insert(code);
        return slot;
      });
    } else {
      el.querySelectorAll("br").forEach((br) => {
        br.parentNode.replaceChild(document.createTextNode("\n"), br);
      });
      slots = el.innerText.split("\n").map((code) => {
        const slot = createCodeSlot();
        slot.insert(code);
        return slot;
      });
    }
    return preComponent.createInstance(injector, {
      state: {
        lang: el.getAttribute("lang") || "",
        theme: el.dataset.theme || ""
      },
      slots
    });
  }
};
const animeComponent = defineComponent$1({
  type: ContentType.BlockComponent,
  name: ANIME_COMPONENT_NAME,
  setup(initData) {
    const injector = useContext();
    const commander = injector.get(Commander);
    const componentInstance = useSelf();
    const slots = useSlots(initData.slots);
    const slot = slots.get(0);
    onContentDeleted((ev) => {
      if ((slot == null ? void 0 : slot.sliceContent()[0]) === "\n") {
        commander.removeComponent(componentInstance);
      }
    });
    let state = (initData == null ? void 0 : initData.state) || {
      dataId: "",
      dataEffect: "",
      dataSerial: "",
      dataTitle: "",
      dataState: "inactive"
    };
    const animeController = useState(state);
    animeController.onChange.subscribe((newData) => {
      state = newData;
    });
    return {
      render(slotRender) {
        return /* @__PURE__ */ jsxs(
          "anime-component",
          {
            "data-id": state.dataId,
            "data-effect": state.dataEffect,
            "data-serial": state.dataSerial,
            "data-title": state.dataTitle,
            "data-state": state.dataState,
            children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  class: "anime-component-tab",
                  title: state.dataTitle,
                  "data-serial": state.dataSerial,
                  "data-state": state.dataState,
                  onMouseenter: (ev) => {
                    var _a;
                    const target = ev.target;
                    (_a = target.parentElement) == null ? void 0 : _a.classList.add("anime-component-evoke");
                  },
                  onMouseleave: (ev) => {
                    var _a;
                    const target = ev.target;
                    (_a = target.parentElement) == null ? void 0 : _a.classList.remove("anime-component-evoke");
                  }
                }
              ),
              slotRender(slot, (children) => {
                return /* @__PURE__ */ jsx("div", { class: "anime-component-content", children });
              })
            ]
          }
        );
      }
    };
  }
});
const animeComponentLoader = {
  resources: {
    styles: [``],
    editModeStyles: [
      `
    .anime-component-evoke {
      display: block;
      outline: 1px dashed #aaaaaa30;
    }
    .anime-component-tab:after {
      z-index: 1;
      content: attr(data-serial);
      vertical-align: super;
      position: absolute;
      top: -10px;
      right: 0;
      display:inline-block;
      width:23px;
      height:23px;
      font-size:15px;
      color:white;
      text-align:center;
      line-height:23px;
      border-radius:24px;
      background-color:#c8c9cc;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      pointer-events: auto;
    }
    .anime-component-tab:hover:after {
      cursor: pointer;
      animation: .8s .5s tada infinite;
    }
    .anime-component-tab:hover {
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      border-radius: 3px;
    }
    .anime-component-tab {
      position: relative;
      display: block;
    }
    [data-state="active"]:after { 
      background-color:pink 
    }
    `
    ]
    // 不能采用该方式，因为是查询的是所有后代元素,所以如果动画组件存在嵌套会产生冲突
    // [data-state="active"] .anime-component-tab:after { 
    //   background-color:pink 
    // }
    // [data-state="inactive"] .anime-component-tab:after { 
    //   background-color:#c8c9cc
    // }
    // .anime-component-content > p:empty::before {
    //   content: "在此输入内容";
    //   color: rgba(143, 143, 143, 0.64);
    // }
  },
  match(element) {
    return element.tagName.toLowerCase() === ANIME_COMPONENT;
  },
  read(element, injector, slotParser) {
    const slot = slotParser(new Slot([ContentType.BlockComponent]), element);
    return animeComponent.createInstance(injector, {
      slots: [slot],
      state: {
        dataId: element.dataset.id || "",
        dataEffect: element.dataset.effect || "",
        dataSerial: element.dataset.serial || "",
        dataState: element.dataset.state || "inactive",
        dataTitle: element.dataset.title || ""
      }
    });
  }
};
const animeRootComponent = defineComponent$1({
  type: ContentType.BlockComponent,
  name: "RootComponent",
  setup(data) {
    const injector = useContext();
    const selection = injector.get(Selection);
    const renderer2 = injector.get(Renderer);
    injector.get(RootComponentRef);
    const options = injector.get(EDITOR_OPTIONS);
    const docContainer = injector.get(VIEW_DOCUMENT);
    injector.get(History);
    const self2 = useSelf();
    self2.onStateChange.subscribe((ev) => {
      console.log(ev);
    });
    const slots = useSlots((data == null ? void 0 : data.slots) || [new Slot([
      ContentType.Text,
      ContentType.BlockComponent,
      ContentType.InlineComponent
    ])]);
    onContentInsert((ev) => {
      if (typeof ev.data.content === "string" || ev.data.content.type !== ContentType.BlockComponent) {
        const p2 = paragraphComponent.createInstance(injector);
        const slot = p2.slots.get(0);
        slot.insert(ev.data.content);
        ev.target.insert(p2);
        selection.setPosition(slot, slot.index);
        ev.preventDefault();
      }
    });
    onBreak((ev) => {
      const p2 = paragraphComponent.createInstance(injector);
      const slot = slots.get(0);
      slot.insert(p2);
      selection.setPosition(p2.slots.get(0), 0);
      ev.preventDefault();
    });
    onSlotRemove((ev) => {
      ev.preventDefault();
    });
    const rootNode = useRef();
    const subscription = new Subscription$1();
    const subs = [];
    const addAnimeService = injector.get(AddAnimeService);
    onViewInit(() => {
      subscription.add(fromEvent$1(docContainer, "click").subscribe((ev) => {
        var _a;
        const rect = rootNode.current.getBoundingClientRect();
        const firstSlot = slots.first;
        if (ev.clientY > rect.top + rect.height - 30) {
          const lastContent = firstSlot.getContentAtIndex(firstSlot.length - 1);
          if (!firstSlot.isEmpty && typeof lastContent !== "string" && lastContent.name !== paragraphComponent.name) {
            const index = firstSlot.index;
            firstSlot.retain(firstSlot.length);
            const p2 = paragraphComponent.createInstance(injector);
            firstSlot.insert(p2);
            firstSlot.retain(index);
            selection.setPosition(p2.slots.get(0), 0);
          }
        } else if (ev.target === rootNode.current) {
          let parentComponent = (_a = selection.focusSlot) == null ? void 0 : _a.parent;
          while (parentComponent && parentComponent.parentComponent !== self2) {
            parentComponent = parentComponent.parentComponent;
          }
          if (!parentComponent) {
            return;
          }
          const index = firstSlot.indexOf(parentComponent);
          if (index > -1) {
            if (ev.clientX - rect.left < 4) {
              selection.setPosition(firstSlot, index);
              selection.restore();
            } else if (rect.left + rect.width - ev.clientX < 4) {
              selection.setPosition(firstSlot, index + 1);
              selection.restore();
            }
          }
        }
      }));
      subs.push(
        fromEvent$1(rootNode.current, "mousemove").subscribe((ev) => {
          let nativeNode = ev.target;
          while (nativeNode) {
            const componentInstance = renderer2.getComponentByNativeNode(nativeNode);
            if (componentInstance) {
              addAnimeService.updateActiveComponent(componentInstance === self2 ? null : componentInstance);
              break;
            }
            nativeNode = nativeNode.parentNode;
          }
        })
      );
    });
    onDestroy(() => {
      subscription.unsubscribe();
      subs.forEach((sub) => sub.unsubscribe());
    });
    onCompositionStart(() => {
      var _a;
      (_a = rootNode.current) == null ? void 0 : _a.setAttribute("data-placeholder", "");
    });
    return {
      render(slotRender) {
        return slotRender(slots.get(0), (children) => {
          var _a;
          return new VElement("div", {
            "textbus-document": "true",
            "ref": rootNode,
            "class": "tb-root",
            style: { padding: "8px 0px 30px 0px" },
            "data-placeholder": ((_a = slots.get(0)) == null ? void 0 : _a.isEmpty) ? options.placeholder || "" : ""
          }, children);
        });
      }
    };
  }
});
const animeRootComponentLoader = {
  match() {
    return true;
  },
  read(element, context, slotParser) {
    const slot = new Slot([
      ContentType.Text,
      ContentType.BlockComponent,
      ContentType.InlineComponent
    ]);
    slotParser(slot, element);
    return animeRootComponent.createInstance(context, {
      state: null,
      slots: [slot]
    });
  }
};
const animeIgnoreComponent = defineComponent$1({
  type: ContentType.BlockComponent,
  name: "AnimeIgnoreComponent",
  setup(initData) {
    const injector = useContext();
    const selection = injector.get(Selection);
    onContentInsert((ev) => {
      if (typeof ev.data.content === "string" || ev.data.content.type !== ContentType.BlockComponent) {
        const p2 = paragraphComponent.createInstance(injector);
        const slot2 = p2.slots.get(0);
        slot2.insert(ev.data.content);
        ev.target.insert(p2);
        selection.setPosition(slot2, slot2.index);
        ev.preventDefault();
      }
    });
    onBreak((ev) => {
      const p2 = paragraphComponent.createInstance(injector);
      const slot2 = slots.get(0);
      slot2.insert(p2);
      selection.setPosition(p2.slots.get(0), 0);
      ev.preventDefault();
    });
    const slots = useSlots((initData == null ? void 0 : initData.slots) || [new Slot([ContentType.Text, ContentType.InlineComponent, ContentType.BlockComponent])]);
    const slot = slots.get(0);
    return {
      render(slotRender) {
        return /* @__PURE__ */ jsxs("anime-ignore", { children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              class: "anime-ignore-btn",
              onClick: (ev) => {
                var _a, _b, _c;
                const target = ev.target;
                if ((_a = target.parentElement) == null ? void 0 : _a.classList.contains("anime-ignore-collapse")) {
                  (_b = target.parentElement) == null ? void 0 : _b.classList.remove("anime-ignore-collapse");
                } else {
                  (_c = target.parentElement) == null ? void 0 : _c.classList.add("anime-ignore-collapse");
                }
              }
            }
          ),
          slotRender(slot, (children) => {
            return /* @__PURE__ */ jsx("div", { class: "anime-ignore-container", children });
          })
        ] });
      }
    };
  }
});
const animeIgnoreComponentLoader = {
  resources: {
    styles: [`
      anime-ignore {
        display: block;
        position: relative;
        padding: 8px 8px;
        outline: 3px dotted #aaaaaa30;
      }
      anime-ignore:hover .anime-ignore-btn {
        opacity: 1;
      }
      .anime-ignore-container {
        overflow: hidden;
      }
      .anime-ignore-btn {
        opacity: 0;
        position: absolute;
        left: -38px;
        top: -3px;
        cursor: pointer;
        user-select: none;
        padding: 3px;
        border-radius: var(--tb-borderRadius);
        margin: 3px;
        width: 24px;
        height: 24px;
      }
      .anime-ignore-btn:before {
        content: "";
        position: absolute;
        top: 3px;
        right: 8px;
        border-width: 0 10px 10px 0;
        border-style: solid;
        border-color: transparent rgb(218, 218, 218) transparent transparent;
        transform: rotate(135deg);
        transition: all 0.1s ease-in-out;
      }
      .anime-ignore-collapse .anime-ignore-btn:before {
        transform: rotate(45deg);
      }
      .anime-ignore-expand .anime-ignore-btn:before {}
      .anime-ignore-collapse .anime-ignore-container {
        max-height: 0;
      }
    `]
  },
  match(element) {
    return element.tagName.toLocaleLowerCase() === "anime-ignore";
  },
  read(element, context, slotParser) {
    const slot = new Slot([ContentType.Text, ContentType.BlockComponent, ContentType.InlineComponent]);
    slotParser(slot, element);
    return animeIgnoreComponent.createInstance(context, {
      state: null,
      slots: [slot]
    });
  }
};
const animePlayerComponent = defineComponent$1({
  type: ContentType.BlockComponent,
  name: ANIME_COMPONENT_NAME,
  setup(initData) {
    const injector = useContext();
    const commander = injector.get(Commander);
    const componentInstance = useSelf();
    const slots = useSlots(initData.slots);
    const slot = slots.get(0);
    onContentDeleted((ev) => {
      if ((slot == null ? void 0 : slot.sliceContent()[0]) === "\n") {
        commander.removeComponent(componentInstance);
      }
    });
    let state = (initData == null ? void 0 : initData.state) || {
      dataId: "",
      dataEffect: "",
      dataSerial: "",
      dataTitle: "",
      dataState: ""
    };
    const animeController = useState(state);
    animeController.onChange.subscribe((newData) => {
      state = newData;
    });
    return {
      render(slotRender) {
        return /* @__PURE__ */ jsxs(
          "anime-component",
          {
            "data-id": state.dataId,
            "data-effect": state.dataEffect,
            "data-serial": state.dataSerial,
            "data-title": state.dataTitle,
            "data-state": state.dataState,
            children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  class: "anime-component-tab",
                  title: state.dataTitle,
                  "data-serial": state.dataSerial
                }
              ),
              slotRender(slot, (children) => {
                return /* @__PURE__ */ jsx("div", { class: "anime-component-content", children });
              })
            ]
          }
        );
      }
    };
  }
});
const animePlayerComponentLoader = {
  match(element) {
    return element.tagName.toLowerCase() === ANIME_COMPONENT;
  },
  read(element, injector, slotParser) {
    const slot = slotParser(new Slot([ContentType.BlockComponent]), element);
    return animePlayerComponent.createInstance(injector, {
      slots: [slot],
      state: {
        dataId: element.dataset.id || "",
        dataEffect: element.dataset.effect || "",
        dataSerial: element.dataset.serial || "",
        dataState: element.dataset.state || "",
        dataTitle: element.dataset.title || ""
      }
    });
  }
};
const rootPlayerComponent = defineComponent$1({
  type: ContentType.BlockComponent,
  name: "RootComponent",
  setup(data) {
    const injector = useContext();
    const selection = injector.get(Selection);
    injector.get(Renderer);
    injector.get(RootComponentRef);
    const options = injector.get(EDITOR_OPTIONS);
    injector.get(VIEW_DOCUMENT);
    injector.get(History);
    const self2 = useSelf();
    const subs = [];
    subs.push(self2.onStateChange.subscribe((ev) => {
      console.log(ev);
    }));
    const slots = useSlots((data == null ? void 0 : data.slots) || [new Slot([
      ContentType.Text,
      ContentType.BlockComponent,
      ContentType.InlineComponent
    ])]);
    onContentInsert((ev) => {
      if (typeof ev.data.content === "string" || ev.data.content.type !== ContentType.BlockComponent) {
        const p2 = paragraphComponent$1.createInstance(injector);
        const slot = p2.slots.get(0);
        slot.insert(ev.data.content);
        ev.target.insert(p2);
        selection.setPosition(slot, slot.index);
        ev.preventDefault();
      }
    });
    onBreak((ev) => {
      const p2 = paragraphComponent$1.createInstance(injector);
      const slot = slots.get(0);
      slot.insert(p2);
      selection.setPosition(p2.slots.get(0), 0);
      ev.preventDefault();
    });
    onSlotRemove((ev) => {
      ev.preventDefault();
    });
    const rootNode = useRef();
    onViewInit(() => {
      const rootEventService = injector.get(RootEventService);
      subs.push(
        fromEvent$1(rootNode.current, "contextmenu").subscribe((ev) => {
          rootEventService.handleContextmenu(ev);
        })
      );
    });
    onDestroy(() => {
      subs.forEach((sub) => sub.unsubscribe());
    });
    onCompositionStart(() => {
      var _a;
      (_a = rootNode.current) == null ? void 0 : _a.setAttribute("data-placeholder", "");
    });
    return {
      render(slotRender) {
        return slotRender(slots.get(0), (children) => {
          var _a;
          return new VElement("div", {
            "textbus-document": "true",
            "ref": rootNode,
            "class": "tb-root",
            "data-placeholder": ((_a = slots.get(0)) == null ? void 0 : _a.isEmpty) ? options.placeholder || "" : ""
          }, children);
        });
      }
    };
  }
});
const rootPlayerComponentLoader = {
  match() {
    return true;
  },
  read(element, context, slotParser) {
    const slot = new Slot([
      ContentType.Text,
      ContentType.BlockComponent,
      ContentType.InlineComponent
    ]);
    slotParser(slot, element);
    return rootPlayerComponent.createInstance(context, {
      state: null,
      slots: [slot]
    });
  }
};
function preToolConfigFactory(injector) {
  const i18n = injector.get(I18n);
  const query = injector.get(Query);
  const commander = injector.get(Commander);
  const selection = injector.get(Selection);
  return {
    iconClasses: ["textbus-icon-source-code"],
    tooltip: i18n.get("plugins.toolbar.preTool.tooltip"),
    mini: true,
    options: [{
      label: "JavaScript",
      value: "JavaScript"
    }, {
      label: "HTML",
      value: "HTML"
    }, {
      label: "CSS",
      value: "CSS"
    }, {
      label: "TypeScript",
      value: "TypeScript"
    }, {
      label: "Java",
      value: "Java"
    }, {
      label: "C",
      value: "C"
    }, {
      label: "C++",
      value: "CPP"
    }, {
      label: "C#",
      value: "CSharp"
    }, {
      label: "Swift",
      value: "Swift"
    }, {
      label: "Go",
      value: "Go"
    }, {
      label: "JSON",
      value: "JSON"
    }, {
      label: "Less",
      value: "Less"
    }, {
      label: "SCSS",
      value: "SCSS"
    }, {
      label: "Stylus",
      value: "Stylus"
    }, {
      label: "Jsx",
      value: "Jsx"
    }, {
      label: "Tsx",
      value: "Tsx"
    }, {
      label: i18n.get("plugins.toolbar.preTool.defaultLang"),
      value: "",
      default: true
    }],
    queryState() {
      const state = query.queryComponent(preComponent);
      return {
        state: state.state,
        value: state.value ? state.value.toJSON().state.lang : null
      };
    },
    onChecked(value) {
      const state = query.queryComponent(preComponent);
      if (state.state === QueryStateType.Enabled) {
        state.value.updateState((draft) => {
          draft.lang = value;
        });
      } else {
        const component = preComponent.createInstance(injector, {
          state: {
            lang: value,
            theme: "dark"
          },
          slots: [createCodeSlot$1()]
        });
        commander.insert(component);
        selection.setPosition(component.slots.get(0), 0);
      }
    }
  };
}
function preTool() {
  return new SelectTool(preToolConfigFactory);
}
function letterSpacingToolConfigFactory(injector) {
  const i18n = injector.get(I18n);
  const query = injector.get(Query);
  const commander = injector.get(Commander);
  return {
    tooltip: i18n.get("plugins.toolbar.letterSpacingTool.tooltip"),
    iconClasses: ["textbus-icon-letter-spacing"],
    mini: true,
    options: [{
      label: i18n.get("plugins.toolbar.letterSpacingTool.defaultValueLabel"),
      value: "",
      classes: ["textbus-toolbar-letter-spacing-inherit"],
      default: true
    }, {
      label: "0px",
      value: "0px",
      classes: ["textbus-toolbar-letter-spacing-0"]
    }, {
      label: "1px",
      classes: ["textbus-toolbar-letter-spacing-1"],
      value: "1px"
    }, {
      label: "2px",
      classes: ["textbus-toolbar-letter-spacing-2"],
      value: "2px"
    }, {
      label: "3px",
      classes: ["textbus-toolbar-letter-spacing-3"],
      value: "3px"
    }, {
      label: "4px",
      classes: ["textbus-toolbar-letter-spacing-4"],
      value: "4px"
    }, {
      label: "5px",
      classes: ["textbus-toolbar-letter-spacing-5"],
      value: "5px"
    }],
    queryState() {
      return query.queryFormat(letterSpacingFormatter);
    },
    onChecked(value) {
      if (value) {
        commander.applyFormat(letterSpacingFormatter, value);
      } else {
        commander.unApplyFormat(letterSpacingFormatter);
      }
    }
  };
}
function letterSpacingTool() {
  return new SelectTool(letterSpacingToolConfigFactory);
}
function colorToolCreator(injector, formatter) {
  const query = injector.get(Query);
  const commander = injector.get(Commander);
  return {
    // viewController: {
    //   elementRef: palette.elementRef,
    //   onComplete: palette.onComplete,
    //   onCancel: new Observable<void>(),
    //   reset() {
    //     palette.update()
    //   },
    //   update(newValue: any) {
    //     // palette.update(newValue)
    //   }
    // },
    // onInit(ui: UISegmentDropdown) {
    //   viewer = ui
    // },
    useValue(value) {
      commander.applyFormat(formatter, value);
    },
    queryState() {
      return query.queryFormat(formatter);
    }
  };
}
function rgbaToHex(rgba) {
  const match = rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
  if (!match) {
    return rgba;
  }
  const [, r, g, b, a] = match;
  const toHex = (c) => {
    const hex = parseInt(c, 10).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  const hexColor = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  const hexAlpha = a ? Math.round(parseFloat(a) * 255).toString(16) : "";
  const hexWithAlpha = hexColor + hexAlpha;
  return hexWithAlpha.toLocaleUpperCase();
}
class ColorFormatter {
  constructor(name) {
    __publicField(this, "columned", false);
    __publicField(this, "priority", 0);
    this.name = name;
  }
  render(children, formatValue) {
    return {
      fallbackTagName: "span",
      attach: (host) => {
        host.styles.set("color", rgbaToHex(formatValue));
        host.attrs.set("data-color", rgbaToHex(formatValue));
      }
    };
  }
}
const colorFormatter = new ColorFormatter("color");
class ColorFormatLoader extends Matcher {
  constructor(formatter) {
    super(formatter, {
      styles: {
        color: /.+/
      },
      attrs: [
        {
          key: "data-color"
        }
      ]
    });
  }
  read(node) {
    return {
      formatter: this.target,
      value: this.extractFormatData(node, {
        styleName: "color",
        attrs: ["data-color"]
      }).styles.color
    };
  }
}
const colorFormatLoader = new ColorFormatLoader(colorFormatter);
class TextBackgroundColorFormatter {
  constructor(name, styleName) {
    __publicField(this, "columned", true);
    __publicField(this, "priority", 0);
    this.name = name;
    this.styleName = styleName;
  }
  render(children, formatValue) {
    if (children.length === 1 && children[0] instanceof VElement) {
      const node = children[0];
      if (node instanceof VElement) {
        const reg = new RegExp(`^(${inlineTags.join("|")})$`, "i");
        if (node && reg.test(node.tagName)) {
          node.styles.set(this.styleName, formatValue);
          return node;
        }
      }
    }
    return new VElement("span", {
      "data-bgcolor": rgbaToHex(formatValue),
      style: {
        [this.styleName]: rgbaToHex(formatValue)
      }
    }, children);
  }
}
const textBackgroundColorFormatter = new TextBackgroundColorFormatter("textBackgroundColor", "backgroundColor");
class InlineTagStyleFormatLoader extends Matcher {
  constructor(styleName, formatter, rule, forceMatchTags = false) {
    super(formatter, rule);
    this.styleName = styleName;
    this.forceMatchTags = forceMatchTags;
  }
  match(element) {
    if (this.forceMatchTags) {
      const reg = new RegExp(`^(${inlineTags.join("|")})$`, "i");
      if (!reg.test(element.tagName)) {
        return false;
      }
    }
    return super.match(element);
  }
  read(node) {
    return {
      formatter: this.target,
      value: this.extractFormatData(node, {
        styleName: this.styleName
      }).styles[this.styleName]
    };
  }
}
const textBackgroundColorFormatLoader = new InlineTagStyleFormatLoader(
  "backgroundColor",
  textBackgroundColorFormatter,
  {
    styles: {
      backgroundColor: /.+/
    }
  },
  true
);
class AnimeFormatter {
  constructor() {
    __publicField(this, "name", ANIME_FORMATTER_NAME);
    __publicField(this, "tagName", ANIME);
    __publicField(this, "columned", false);
    __publicField(this, "priority", 0);
  }
  render(children, formatValue, renderMode) {
    const vdom = new VElement(
      ANIME,
      {
        "data-id": formatValue.dataId,
        "data-serial": formatValue.dataSerial,
        "data-effect": formatValue.dataEffect,
        "data-state": formatValue.dataState || "inactive",
        // 默认是未激活状态
        "data-title": formatValue.dataTitle,
        "title": formatValue.dataTitle
        // 鼠标在标记上时显示动画名称
      },
      children
    );
    return vdom;
  }
}
const animeFormatter = new AnimeFormatter();
const animeFormatLoader = {
  match(element) {
    return [ANIME].includes(element.tagName.toLowerCase());
  },
  // 当元素匹配成功时，会调用 read 方法获取样式的值
  read(node) {
    const data = {
      dataId: node.dataset.id,
      dataSerial: node.dataset.serial,
      dataEffect: node.dataset.effect,
      dataState: node.dataset.state,
      dataTitle: node.dataset.title
    };
    return {
      formatter: animeFormatter,
      value: data
    };
  }
};
function colorToolConfigFactory(injector) {
  const i18n = injector.get(I18n).getContext("plugins.toolbar.colorTool");
  return {
    iconClasses: ["textbus-icon-color"],
    tooltip: i18n.get("tooltip"),
    keymap: {
      ctrlKey: true,
      // altKey: true,
      shiftKey: true,
      key: "c"
    },
    ...colorToolCreator(injector, colorFormatter)
  };
}
function colorTool() {
  return new SegmentDropdownTool(colorToolConfigFactory);
}
function textBackgroundToolConfigFactory(injector) {
  const i18n = injector.get(I18n).getContext("plugins.toolbar.textBackgroundColorTool");
  return {
    iconClasses: ["textbus-icon-background-color"],
    tooltip: i18n.get("tooltip"),
    ...colorToolCreator(injector, textBackgroundColorFormatter)
  };
}
function textBackgroundTool() {
  return new SegmentDropdownTool(textBackgroundToolConfigFactory);
}
const _hoisted_1$g = { class: "image-form" };
const _sfc_main$h = /* @__PURE__ */ defineComponent({
  __name: "ImageForm",
  props: {
    onConfirm: { type: Function },
    onConfirmEnd: { type: Function }
  },
  setup(__props) {
    const injector = inject("injector");
    const useClose = inject("useClose");
    const message = useMessage();
    const props = __props;
    const imgToUrlService = injector.get(ImgToUrlService);
    const formRef = ref(null);
    const model = ref({
      src: ""
    });
    const rules = {
      src: [
        {
          required: false
          // validator: (rule: FormItemRule, value: string) => {
          //   return value.length < 100
          // }
        }
      ]
    };
    function handleConfirm(e) {
      var _a;
      (_a = formRef.value) == null ? void 0 : _a.validate((errors) => {
        if (!errors) {
          props.onConfirm && props.onConfirm(model.value);
          props.onConfirmEnd && props.onConfirmEnd();
          useClose();
        } else {
          console.log(errors);
          props.onConfirmEnd && props.onConfirmEnd();
        }
      });
    }
    const handleFinish = (options) => {
      var _a;
      const acceptedImageTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/bmp", "image/svg+xml"];
      if (((_a = options.file.file) == null ? void 0 : _a.type) && !acceptedImageTypes.includes(options.file.file.type)) {
        message.error("非图片类型无法上传");
        return false;
      }
      const reader = new FileReader();
      if (options.file.file) {
        const file = options.file.file;
        reader.readAsDataURL(file);
        reader.onload = async function(event) {
          if (event.target) {
            let src = event.target.result;
            if (typeof src !== "string") {
              return;
            }
            if (ImgToUrlService.isBase64(src)) {
              await imgToUrlService.uploadImg(src).then((url) => {
                src = url;
              }).catch((err) => {
                console.log(err);
                src = "";
              });
            }
            model.value.src = src;
          }
        };
      }
    };
    return (_ctx, _cache) => {
      const _component_n_input = resolveComponent("n-input");
      const _component_n_form_item = resolveComponent("n-form-item");
      const _component_n_button = resolveComponent("n-button");
      const _component_n_upload = resolveComponent("n-upload");
      const _component_n_form = resolveComponent("n-form");
      return openBlock(), createElementBlock("div", _hoisted_1$g, [
        createVNode(_component_n_form, {
          ref_key: "formRef",
          ref: formRef,
          model: model.value,
          rules,
          "show-require-mark": false
        }, {
          default: withCtx(() => [
            createVNode(_component_n_form_item, {
              path: "src",
              label: "图片链接地址"
            }, {
              default: withCtx(() => [
                createVNode(_component_n_input, {
                  value: model.value.src,
                  "onUpdate:value": _cache[0] || (_cache[0] = ($event) => model.value.src = $event),
                  type: "text",
                  placeholder: "请输入图片链接"
                }, null, 8, ["value"])
              ]),
              _: 1
            }),
            createVNode(_component_n_form_item, {
              path: "upload",
              label: "上传图片"
            }, {
              default: withCtx(() => [
                createVNode(_component_n_upload, {
                  "default-upload": false,
                  "file-list": [],
                  onBeforeUpload: handleFinish
                }, {
                  default: withCtx(() => [
                    createVNode(_component_n_button, null, {
                      default: withCtx(() => [
                        createTextVNode("上传文件")
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            createVNode(_component_n_button, {
              block: "",
              onClick: handleConfirm
            }, {
              default: withCtx(() => [
                createTextVNode("确定")
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["model"])
      ]);
    };
  }
});
const ImageForm = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["__scopeId", "data-v-02529d5b"]]);
function imageToolConfigFactory(injector) {
  const i18n = injector.get(I18n);
  const commander = injector.get(Commander);
  return {
    iconClasses: ["textbus-icon-image"],
    tooltip: i18n.get("plugins.toolbar.imageTool.tooltip"),
    queryState() {
      return {
        state: QueryStateType.Normal,
        value: null
      };
    },
    view: h(ImageForm, {
      onConfirm: (res) => {
        if (!res.src) {
          return;
        }
        commander.insert(
          imageComponent.createInstance(injector, {
            state: {
              src: res.src
            }
          })
        );
      }
    }),
    useValue(value) {
    }
  };
}
function imageTool() {
  return new PopoverTool(imageToolConfigFactory);
}
const _hoisted_1$f = { class: "image-form" };
const _sfc_main$g = /* @__PURE__ */ defineComponent({
  __name: "TableForm",
  props: {
    rows: {},
    cols: {},
    onConfirm: { type: Function },
    onConfirmEnd: { type: Function }
  },
  setup(__props) {
    const useClose = inject("useClose");
    const props = __props;
    const formRef = ref(null);
    const model = ref({
      rows: props.rows || 0,
      cols: props.cols || 0,
      useTextbusStyle: true
    });
    const rules = {
      src: [
        {
          required: false
          // validator: (rule: FormItemRule, value: string) => {
          //   return value.length < 100
          // }
        }
      ]
    };
    function handleConfirm(e) {
      var _a;
      (_a = formRef.value) == null ? void 0 : _a.validate((errors) => {
        if (!errors) {
          props.onConfirm && props.onConfirm(model.value);
          props.onConfirmEnd && props.onConfirmEnd();
          useClose();
        } else {
          console.log(errors);
          props.onConfirmEnd && props.onConfirmEnd();
        }
      });
    }
    const selector = ref();
    const subs = [];
    onMounted(() => {
      const map2 = /* @__PURE__ */ new Map();
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
          ((row2, col2) => {
            const cell = document.createElement("div");
            selector.value.appendChild(cell);
            map2.set(cell, {
              row: row2,
              col: col2
            });
          })(row, col);
        }
      }
      let flag = false;
      subs.push(
        fromEvent$1(selector.value, "mouseover").subscribe((ev) => {
          if (flag) {
            return;
          }
          const srcElement = ev.target;
          const config = map2.get(srcElement);
          if (config) {
            map2.forEach((value, key) => {
              if (value.row <= config.row && value.col <= config.col) {
                key.classList.add("textbus-toolbar-table-quick-selector-selected");
              } else {
                key.classList.remove("textbus-toolbar-table-quick-selector-selected");
              }
            });
            model.value.cols = config.col + 1;
            model.value.rows = config.row + 1;
          }
        }),
        fromEvent$1(selector.value, "mouseleave").subscribe((ev) => {
          if (!flag) {
            Array.from(map2.keys()).forEach((el) => el.classList.remove("textbus-toolbar-table-quick-selector-selected"));
          }
          flag = false;
        }),
        fromEvent$1(selector.value, "click").subscribe((ev) => {
          flag = true;
        })
      );
    });
    onUnmounted(() => {
      subs.forEach((i) => i.unsubscribe());
    });
    return (_ctx, _cache) => {
      const _component_n_input_number = resolveComponent("n-input-number");
      const _component_n_form_item = resolveComponent("n-form-item");
      const _component_n_checkbox = resolveComponent("n-checkbox");
      const _component_n_button = resolveComponent("n-button");
      const _component_n_form = resolveComponent("n-form");
      return openBlock(), createElementBlock("div", _hoisted_1$f, [
        createBaseVNode("div", {
          ref_key: "selector",
          ref: selector,
          class: "textbus-toolbar-table-quick-selector"
        }, null, 512),
        createVNode(_component_n_form, {
          ref_key: "formRef",
          ref: formRef,
          model: model.value,
          rules,
          "show-require-mark": false
        }, {
          default: withCtx(() => [
            createVNode(_component_n_form_item, {
              path: "rows",
              label: "表格行数"
            }, {
              default: withCtx(() => [
                createVNode(_component_n_input_number, {
                  value: model.value.rows,
                  "onUpdate:value": _cache[0] || (_cache[0] = ($event) => model.value.rows = $event),
                  min: 0,
                  placeholder: "请输入表格行数"
                }, null, 8, ["value"])
              ]),
              _: 1
            }),
            createVNode(_component_n_form_item, {
              path: "cols",
              label: "表格列数"
            }, {
              default: withCtx(() => [
                createVNode(_component_n_input_number, {
                  value: model.value.cols,
                  "onUpdate:value": _cache[1] || (_cache[1] = ($event) => model.value.cols = $event),
                  min: 0,
                  placeholder: "请输入表格列数"
                }, null, 8, ["value"])
              ]),
              _: 1
            }),
            createVNode(_component_n_form_item, { "show-label": false }, {
              default: withCtx(() => [
                createVNode(_component_n_checkbox, {
                  checked: model.value.useTextbusStyle,
                  "onUpdate:checked": _cache[2] || (_cache[2] = ($event) => model.value.useTextbusStyle = $event),
                  style: { "margin-right": "12px" }
                }, {
                  default: withCtx(() => [
                    createTextVNode(" 使用 Textbus 样式 ")
                  ]),
                  _: 1
                }, 8, ["checked"])
              ]),
              _: 1
            }),
            createVNode(_component_n_button, {
              block: "",
              onClick: handleConfirm
            }, {
              default: withCtx(() => [
                createTextVNode("确定")
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["model"])
      ]);
    };
  }
});
const TableForm = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["__scopeId", "data-v-e7521551"]]);
function tableAddToolConfigFactory(injector) {
  const i18n = injector.get(I18n);
  const commander = injector.get(Commander);
  const selection = injector.get(Selection);
  return {
    iconClasses: ["textbus-icon-table"],
    tooltip: i18n.get("plugins.toolbar.tableAddTool.tooltip"),
    // viewController: form,
    view: h(TableForm, {
      rows: 2,
      cols: 2,
      onConfirm: (value) => {
        function create(rows, columns) {
          const result = [];
          const size2 = rows * columns;
          for (let i = 0; i < size2; i++) {
            result.push(createCell());
          }
          return result;
        }
        const component = tableComponent.createInstance(injector, {
          slots: create(value.rows || 4, value.cols || 6),
          state: {
            useTextbusStyle: value.useTextbusStyle,
            columnCount: value.cols || 6,
            rowCount: value.rows || 4
          }
        });
        commander.insert(component);
        selection.setPosition(component.slots.get(0), 0);
      }
    }),
    queryState() {
      return {
        state: QueryStateType.Normal,
        value: null
      };
    },
    useValue(value) {
      function create(rows, columns) {
        const result = [];
        const size2 = rows * columns;
        for (let i = 0; i < size2; i++) {
          result.push(createCell());
        }
        return result;
      }
      const component = tableComponent.createInstance(injector, {
        slots: create(value.rows || 4, value.cols || 6),
        state: {
          useTextbusStyle: value.useTextbusStyle,
          columnCount: value.cols || 6,
          rowCount: value.rows || 4
        }
      });
      commander.insert(component);
      selection.setPosition(component.slots.get(0), 0);
    }
  };
}
function tableAddTool() {
  return new PopoverTool(tableAddToolConfigFactory);
}
const _hoisted_1$e = { class: "link-form" };
const _sfc_main$f = /* @__PURE__ */ defineComponent({
  __name: "LinkForm",
  props: {
    url: { type: Function },
    onConfirm: { type: Function },
    onConfirmEnd: { type: Function }
  },
  setup(__props) {
    const useClose = inject("useClose");
    const props = __props;
    const formRef = ref(null);
    const model = ref({
      url: props.url() || "",
      target: "_blank"
    });
    const rules = {
      url: [
        {
          required: false,
          validator: (rule, value) => {
            return value.length < 255;
          }
        }
      ]
    };
    function handleConfirm(e) {
      var _a;
      (_a = formRef.value) == null ? void 0 : _a.validate((errors) => {
        if (!errors) {
          props.onConfirm && props.onConfirm(model.value);
          props.onConfirmEnd && props.onConfirmEnd();
          useClose();
        } else {
          props.onConfirmEnd && props.onConfirmEnd();
        }
      });
    }
    return (_ctx, _cache) => {
      const _component_n_input = resolveComponent("n-input");
      const _component_n_form_item = resolveComponent("n-form-item");
      const _component_n_radio = resolveComponent("n-radio");
      const _component_n_flex = resolveComponent("n-flex");
      const _component_n_button = resolveComponent("n-button");
      const _component_n_form = resolveComponent("n-form");
      return openBlock(), createElementBlock("div", _hoisted_1$e, [
        createVNode(_component_n_form, {
          ref_key: "formRef",
          ref: formRef,
          model: model.value,
          rules,
          "show-require-mark": false
        }, {
          default: withCtx(() => [
            createVNode(_component_n_form_item, {
              path: "url",
              label: "外部链接地址"
            }, {
              default: withCtx(() => [
                createVNode(_component_n_input, {
                  value: model.value.url,
                  "onUpdate:value": _cache[0] || (_cache[0] = ($event) => model.value.url = $event),
                  type: "text",
                  placeholder: "请输入链接"
                }, null, 8, ["value"])
              ]),
              _: 1
            }),
            createVNode(_component_n_form_item, {
              path: "window",
              label: "打开窗口方式"
            }, {
              default: withCtx(() => [
                createVNode(_component_n_flex, null, {
                  default: withCtx(() => [
                    createVNode(_component_n_radio, {
                      checked: model.value.target === "_blank",
                      value: "_blank",
                      name: "_blank",
                      onChange: _cache[1] || (_cache[1] = ($event) => model.value.target = "_blank")
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" 新窗口 ")
                      ]),
                      _: 1
                    }, 8, ["checked"]),
                    createVNode(_component_n_radio, {
                      checked: model.value.target === "_self",
                      value: "_self",
                      name: "_self",
                      onChange: _cache[2] || (_cache[2] = ($event) => model.value.target = "_self")
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" 当前窗口 ")
                      ]),
                      _: 1
                    }, 8, ["checked"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            createVNode(_component_n_button, {
              block: "",
              onClick: handleConfirm
            }, {
              default: withCtx(() => [
                createTextVNode("确定")
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["model"])
      ]);
    };
  }
});
const LinkForm = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["__scopeId", "data-v-8b1ace09"]]);
function linkToolConfigFactory(injector) {
  const i18n = injector.get(I18n);
  const query = injector.get(Query);
  const commander = injector.get(Commander);
  const selection = injector.get(Selection);
  const hrefRef = ref("");
  return {
    iconClasses: ["textbus-icon-link"],
    tooltip: i18n.get("plugins.toolbar.linkTool.tooltip"),
    view: h(LinkForm, {
      url: () => hrefRef.value,
      onConfirm: (res) => {
        const { url, target } = res;
        const value = {
          href: url,
          target
        };
        if (selection.isCollapsed) {
          const slot = selection.startSlot;
          slot.getFormatRangesByFormatter(linkFormatter, 0, slot.length).filter((f) => {
            return f.startIndex < selection.startOffset && f.endIndex >= selection.endOffset;
          }).forEach((f) => {
            slot.retain(f.startIndex);
            slot.retain(f.endIndex - f.startIndex, linkFormatter, value);
          });
        }
        commander.applyFormat(linkFormatter, value);
      }
    }),
    queryState() {
      const result = query.queryFormat(linkFormatter);
      const { value } = result;
      if (value) {
        hrefRef.value = value.href;
      }
      return result;
    },
    useValue(value) {
    }
  };
}
function linkTool() {
  return new PopoverTool(linkToolConfigFactory);
}
const _hoisted_1$d = { class: "emoji-form" };
const _hoisted_2$6 = { class: "textbus-toolbar-emoji-menu" };
const _hoisted_3$4 = ["innerHTML"];
const _sfc_main$e = /* @__PURE__ */ defineComponent({
  __name: "EmojiForm",
  props: {
    onConfirm: { type: Function },
    onConfirmEnd: { type: Function }
  },
  setup(__props) {
    const useClose = inject("useClose");
    const props = __props;
    const emoji = [];
    for (let i = 128512; i <= 128591; i++) {
      emoji.push(i.toString(16).toUpperCase());
    }
    function createEmoji(item) {
      return `&#x${item};`;
    }
    function handleConfirm(ev) {
      const target = ev.target;
      const value = target.innerHTML || "";
      props.onConfirm && props.onConfirm(value);
      props.onConfirmEnd && props.onConfirmEnd();
      useClose && useClose();
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$d, [
        createBaseVNode("div", _hoisted_2$6, [
          (openBlock(), createElementBlock(Fragment, null, renderList(emoji, (item) => {
            return createBaseVNode("div", {
              key: item,
              class: "textbus-toolbar-emoji-menu-item",
              onClick: handleConfirm
            }, [
              createBaseVNode("span", {
                innerHTML: createEmoji(item)
              }, null, 8, _hoisted_3$4)
            ]);
          }), 64))
        ])
      ]);
    };
  }
});
const EmojiForm = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["__scopeId", "data-v-e7e4010c"]]);
function emojiToolConfigFactory(injector) {
  const i18n = injector.get(I18n);
  const commander = injector.get(Commander);
  return {
    iconClasses: ["textbus-icon-emoji"],
    tooltip: i18n.get("plugins.toolbar.emojiTool.tooltip"),
    view: h(EmojiForm, {
      onConfirm: (value) => {
        commander.insert(value);
      }
    }),
    queryState() {
      return {
        state: QueryStateType.Normal,
        value: null
      };
    },
    useValue(value) {
    }
  };
}
function emojiTool() {
  return new PopoverTool(emojiToolConfigFactory);
}
const _hoisted_1$c = ["innerHTML"];
const _sfc_main$d = /* @__PURE__ */ defineComponent({
  __name: "ComponentCard",
  props: {
    content: {},
    name: {}
  },
  setup(__props) {
    const useClose = inject("useClose");
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref: "cardRef",
        class: "card",
        onClick: _cache[1] || (_cache[1] = //@ts-ignore
        (...args) => unref(useClose) && unref(useClose)(...args))
      }, [
        createBaseVNode("div", {
          class: "content",
          innerHTML: _ctx.content
        }, null, 8, _hoisted_1$c),
        createBaseVNode("div", {
          class: "name",
          onClick: _cache[0] || (_cache[0] = withModifiers((ev) => ev.preventDefault(), ["stop"]))
        }, toDisplayString(_ctx.name || ""), 1)
      ], 512);
    };
  }
});
const ComponentCard = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["__scopeId", "data-v-c98218a3"]]);
const _sfc_main$c = {};
const _hoisted_1$b = {
  ref: "listRef",
  class: "list"
};
const _hoisted_2$5 = { class: "list-wrapper" };
function _sfc_render$1(_ctx, _cache) {
  return openBlock(), createElementBlock("div", _hoisted_1$b, [
    createBaseVNode("div", _hoisted_2$5, [
      renderSlot(_ctx.$slots, "default", {}, void 0, true)
    ])
  ], 512);
}
const Componentslist = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$1], ["__scopeId", "data-v-23281a6c"]]);
function createViewer(content, name) {
  const card = h(ComponentCard, { content, name });
  return card;
}
function createExample(injector, example, controller) {
  const card = createViewer(example.example, example.name);
  const commander = injector.get(Commander);
  const selection = injector.get(Selection);
  const wrapper = h(card, {
    onClick: (ev) => {
      const t = example.factory(injector);
      if (t instanceof Promise) {
        t.then((instance) => {
          commander.insert(instance);
          selection.selectFirstPosition(instance);
          controller.next();
        });
      } else {
        commander.insert(t);
        selection.selectFirstPosition(t);
        controller.next();
      }
    }
  });
  return wrapper;
}
function componentsToolConfigFactory(injector) {
  const i18n = injector.get(I18n);
  const configs = [
    // {
    //   name: i18n.get('components.imageCardComponent.creator.name'),
    //   // eslint-disable-next-line max-len
    //   example: `<img src="data:image/svg+xml;charset=UTF-8,${encodeURIComponent('<svg width="100" height="70" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#f90"/><stop offset="100%" stop-color="#fff"/></linearGradient></defs><g><rect fill="url(#bg)" height="50" width="100%"/></g><g><path fill="#f00" opacity="0.2" d="M81.25 28.125c0 5.178-4.197 9.375-9.375 9.375s-9.375-4.197-9.375-9.375 4.197-9.375 9.375-9.375 9.375 4.197 9.375 9.375z"></path><path fill="#0e0" opacity="0.3" d="M87.5 81.25h-75v-12.5l21.875-37.5 25 31.25h6.25l21.875-18.75z"></path></g><g><rect fill="#fff" height="20" width="100%" y="50"></rect></g><g><text font-family="Helvetica, Arial, sans-serif" font-size="12" y="63" x="50%" text-anchor="middle" stroke-width="0" stroke="#000" fill="#000000">描述文字</text></g></svg>')}" alt="">`,
    //   factory() {
    //     return imageCardComponent.createInstance(injector)
    //   }
    // },
    // {
    //   name: i18n.get('components.todoListComponent.creator.name'),
    //   // eslint-disable-next-line max-len
    //   example: `<img alt="默认图片" src="data:image/svg+xml;charset=UTF-8,${encodeURIComponent('<svg width="100" height="70" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ><g><rect fill="#fff" height="100%" width="100%"/></g><defs><g id="item"><rect fill="#fff" stroke="#1296db" height="8" width="8" rx="2" x="15" y="12"/><text font-family="Helvetica, Arial, sans-serif" font-size="8" x="28" y="19"  stroke-width="0" stroke="#000" fill="#000000">待办事项...</text></g></defs><use xlink:href="#item"></use><use xlink:href="#item" transform="translate(0, 12)"></use><use xlink:href="#item" transform="translate(0, 24)"></use><use xlink:href="#item" transform="translate(0, 36)"></use></svg>')}">`,
    //   factory() {
    //     return todolistComponent.createInstance(injector, {
    //       slots: [
    //         new Slot<TodoListSlotState>([ContentType.Text, ContentType.InlineComponent], {
    //           active: false,
    //           disabled: false
    //         })
    //       ]
    //     })
    //   }
    // },
    // {
    //   name: i18n.get('components.jumbotronComponent.creator.name'),
    //   // eslint-disable-next-line max-len
    //   example: `<img src="data:image/svg+xml;charset=UTF-8,${encodeURIComponent('<svg width="100" height="70" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#6ad1ec"/><stop offset="100%" stop-color="#fff"/></linearGradient></defs><g><rect fill="url(#bg)" height="100%" width="100%"/></g><path fill="#fff" opacity="0.3" d="M81.25 28.125c0 5.178-4.197 9.375-9.375 9.375s-9.375-4.197-9.375-9.375 4.197-9.375 9.375-9.375 9.375 4.197 9.375 9.375z"></path><path fill="#fff" opacity="0.3"  d="M87.5 81.25h-75v-12.5l21.875-37.5 25 31.25h6.25l21.875-18.75z"></path><text font-family="Helvetica, Arial, sans-serif" font-size="12" x="10" y="25" stroke-width="0.3" stroke="#000" fill="#000000">Hello, world!</text><text font-family="Helvetica, Arial, sans-serif" font-size="6" x="10" y="40" stroke-width="0" stroke="#000" fill="#000000">你好，我是 Textbus，一个给你带来全新体验的富文本开发框架。</text><text font-family="Helvetica, Arial, sans-serif" font-size="6" x="10" y="50" stroke-width="0" stroke="#000" fill="#000000">现在我们开始吧！</text></svg>')}">`,
    //   factory() {
    //     return jumbotronComponent.createInstance(injector)
    //   }
    // },
    // {
    //   name: i18n.get('components.katexComponent.creator.name'),
    //   // eslint-disable-next-line max-len
    //   example: `<img src="data:image/svg+xml;charset=UTF-8,${encodeURIComponent('<svg width="100" height="70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40.541"><path d="M4.618 27.925c-.299.299-.591.478-.874.538-.284.06-1.039.105-2.264.135H0v2.062h.493c.508-.09 2.66-.135 6.456-.135 3.796 0 5.948.045 6.456.135h.493v-2.062h-1.48c-1.764-.029-2.765-.209-3.004-.538-.09-.119-.135-1.584-.135-4.394v-4.259l2.062-2.018a83.544 83.544 0 002.063-1.972c.209-.209.388-.373.538-.493l3.901 5.873c2.331 3.587 3.661 5.62 3.99 6.098.09.179.135.359.135.538 0 .778-.688 1.166-2.062 1.166h-.359v2.062h.493c.628-.09 2.764-.135 6.412-.135.269 0 .673.008 1.211.022.538.015.956.022 1.255.022.298 0 .68.008 1.143.022.463.015.807.03 1.031.045.224.015.366.022.426.022h.359v-2.062h-.942c-1.255-.029-2.152-.194-2.69-.493a3.197 3.197 0 01-1.076-1.031l-5.179-7.779c-3.273-4.917-4.91-7.39-4.91-7.42 0-.029 1.33-1.33 3.99-3.901 2.66-2.57 4.065-3.93 4.215-4.08C26.6 2.817 28.379 2.219 30.62 2.1h.628V.037h-.269c-.03 0-.135.008-.314.022-.179.015-.434.03-.762.045a18.99 18.99 0 01-.852.022c-.209 0-.523.008-.942.022-.419.015-.747.022-.986.022-3.408 0-5.366-.045-5.873-.135h-.448v2.062h.179l.202.022.247.022c.836.209 1.255.643 1.255 1.3-.06.24-.12.404-.179.493-.06.12-2.272 2.317-6.636 6.591l-6.546 6.367-.045-6.95c0-4.663.015-7.024.045-7.084.06-.508.897-.762 2.511-.762h2.062V.037h-.493c-.509.09-2.661.135-6.456.135C3.152.172 1 .127.492.037H0v2.062h1.48c1.225.03 1.98.075 2.264.135.284.06.575.24.874.538v25.153zm34.924-16.858h1.793v-.269c.029-.119.074-.478.135-1.076.239-3.198.836-5.201 1.793-6.008.747-.628 1.763-1.046 3.049-1.255.298-.029 1.15-.045 2.556-.045h1.211c.687 0 1.113.022 1.278.067.164.045.291.202.381.471.029.06.045 4.23.045 12.509v12.375c-.24.329-.613.538-1.121.628-1.076.09-2.421.135-4.035.135h-1.345v2.062h.583c.628-.09 3.377-.135 8.25-.135 4.872 0 7.622.045 8.25.135h.583v-2.062h-1.345c-1.614 0-2.959-.045-4.035-.135-.509-.09-.882-.298-1.121-.628V15.461c0-8.279.015-12.449.045-12.509.09-.269.216-.426.381-.471.164-.045.59-.067 1.278-.067h1.211c1.674 0 2.825.075 3.452.224 1.136.329 1.957.807 2.466 1.435.747.867 1.225 2.75 1.435 5.649.06.598.104.957.135 1.076v.269h1.793v-.269c0-.06-.134-1.763-.404-5.111C67.97 2.34 67.82.636 67.791.576v-.27H40.394v.269c0 .06-.135 1.764-.404 5.111-.269 3.348-.419 5.052-.448 5.111v.27zm60.461 19.593v-2.062h-.359c-.658-.06-1.226-.254-1.704-.583-.478-.329-.717-.702-.717-1.121 0-.209.015-.329.045-.359.029-.09 1.031-1.629 3.004-4.618.448-.687.836-1.293 1.166-1.816.329-.523.605-.956.829-1.3.224-.343.411-.62.56-.829.149-.209.254-.343.314-.404l.135-.135 1.659 2.556a514.118 514.118 0 013.273 5.111c1.076 1.704 1.614 2.6 1.614 2.69 0 .209-.314.397-.942.56-.628.165-1.196.247-1.704.247h-.269v2.062h.493c.687-.09 2.869-.135 6.546-.135 3.318 0 5.201.045 5.649.135H120v-2.062h-1.39c-1.166-.029-1.958-.09-2.376-.179-.419-.09-.747-.269-.986-.538-.09-.09-1.667-2.526-4.73-7.308-3.064-4.782-4.596-7.203-4.596-7.263 0-.029.986-1.584 2.959-4.663 2.092-3.139 3.183-4.753 3.273-4.842 1.016-1.046 2.75-1.614 5.201-1.704h.762V.037h-.359c-.359.09-2.003.135-4.932.135-3.468 0-5.396-.045-5.784-.135h-.404v2.062h.359c.926.09 1.614.389 2.062.897.388.389.493.747.314 1.076 0 .03-.778 1.248-2.331 3.654-1.555 2.406-2.347 3.609-2.376 3.609-.06 0-.979-1.397-2.757-4.192-1.779-2.795-2.668-4.237-2.668-4.327.06-.149.404-.306 1.031-.471.628-.164 1.195-.247 1.704-.247h.224V.037h-.493c-.658.09-2.84.135-6.546.135-3.318 0-5.201-.045-5.649-.135h-.404v2.062h1.525c1.614 0 2.69.224 3.228.673.09.09 1.464 2.212 4.125 6.367 2.66 4.155 3.99 6.262 3.99 6.322 0 .03-1.188 1.868-3.564 5.515a2726.32 2726.32 0 01-3.744 5.739c-.957 1.166-2.765 1.793-5.425 1.883h-.763v2.062h.359c.359-.09 2.002-.135 4.932-.135 3.467 0 5.395.045 5.784.135h.448z"/><path d="M37.736 15.499h-3.429c-2.264 0-3.396-.011-3.396-.034l1.715-5.077 1.681-5.043.672 1.984a629.242 629.242 0 011.715 5.077l1.042 3.093zm-6.153 8.573v-1.547h-.168c-.493 0-.958-.095-1.395-.286-.437-.19-.723-.431-.857-.723a.491.491 0 01-.101-.303c0-.134.224-.863.672-2.185l.672-1.984h7.834l.807 2.387c.538 1.614.807 2.443.807 2.488 0 .403-.785.605-2.353.605h-.437v1.547h.336c.336-.067 1.95-.101 4.841-.101 2.51 0 3.934.034 4.27.101h.303v-1.547h-1.009c-1.166-.022-1.872-.146-2.118-.37a1.261 1.261 0 01-.235-.336c-.516-1.591-1.855-5.581-4.018-11.969C37.271 3.461 36.178.256 36.156.233c-.09-.132-.359-.21-.808-.233h-.303c-.359 0-.572.09-.639.269-.023.023-.611 1.754-1.765 5.194a16100.31 16100.31 0 01-5.262 15.65c-.449.874-1.479 1.345-3.093 1.412h-.504v1.547h.235c.269-.067 1.401-.101 3.396-.101 2.174 0 3.463.034 3.866.101h.304zm36.735 13.734c-.299.299-.591.478-.874.538-.284.06-1.039.105-2.264.135H63.7v2.062h26.229v-.135c.06-.09.381-2.085.964-5.986s.889-5.896.919-5.986v-.135h-1.793v.135c-.03.06-.105.464-.224 1.211-.269 1.793-.613 3.244-1.031 4.349-.509 1.375-1.248 2.399-2.219 3.071-.972.673-2.324 1.114-4.058 1.323-.419.03-1.973.045-4.663.045h-2.287c-1.375 0-2.152-.074-2.331-.224-.09-.06-.15-.164-.179-.314-.03-.06-.045-2.107-.045-6.142v-6.008h2.421c1.943.03 3.139.12 3.587.269.836.24 1.405.666 1.704 1.278.298.613.478 1.547.538 2.802v.897h1.793V18.437h-1.793v.897c-.06 1.255-.24 2.19-.538 2.802-.299.613-.867 1.039-1.704 1.278-.448.15-1.644.24-3.587.269h-2.421v-5.425c0-3.646.015-5.499.045-5.56.09-.298.269-.463.538-.493.239-.06 1.853-.09 4.842-.09 1.733 0 2.75.015 3.049.045 2.451.15 4.177.74 5.179 1.771 1.001 1.031 1.681 2.952 2.04 5.761.06.538.104.852.135.942v.179h1.793v-.179c0-.029-.209-1.763-.628-5.201l-.628-5.201v-.179H63.7v2.062h1.48c1.225.03 1.98.075 2.264.135.284.06.575.24.874.538v25.018z"/></svg>')}">`,
    //   factory() {
    //     return katexComponent.createInstance(injector, {
    //       state: {
    //         source: ''
    //       }
    //     })
    //   }
    // },
    // {
    //   name: i18n.get('components.wordExplainComponent.creator.name'),
    //   // eslint-disable-next-line max-len
    //   example: `<img alt="示例" src="data:image/svg+xml;charset=UTF-8,${encodeURIComponent('<svg width="100" height="70" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><rect fill="#fff" height="100%" width="100%"/></g><defs><g id="item"><rect fill="#eee" height="18" width="90" rx="2" x="5" y="6"/><line x1="26" y1="9" x2="26" y2="20.5" stroke="#000" stroke-dasharray="0.8 0.8" stroke-width="0.1"></line><text font-family="Helvetica, Arial, sans-serif" font-size="6" x="10" y="14" stroke-width="0" stroke="#000" fill="#000000">名词</text><text font-family="Helvetica, Arial, sans-serif" font-size="5" x="12" y="20" stroke-width="0" stroke="#000" fill="#000000">说明</text><text font-family="Helvetica, Arial, sans-serif" font-size="6" x="30" y="14" stroke-width="0" stroke="#000" fill="#000000">详细解释...</text></g></defs><use xlink:href="#item"></use><use xlink:href="#item" transform="translate(0, 20)"></use><use xlink:href="#item" transform="translate(0, 40)"></use></svg>')}">`,
    //   factory() {
    //     const { Text, InlineComponent } = ContentType
    //     const titleSlot = new Slot([Text, InlineComponent])
    //     const subtitleSlot = new Slot([Text, InlineComponent])
    //     const detailSlot = new Slot([Text, InlineComponent])
    //     titleSlot.insert('标题', boldFormatter, true)
    //     subtitleSlot.insert('副标题')
    //     titleSlot.setAttribute(textAlignFormatter, 'right')
    //     subtitleSlot.setAttribute(textAlignFormatter, 'right')
    //     detailSlot.insert('正文...')
    //     return wordExplainComponent.createInstance(injector, {
    //       slots: [titleSlot, subtitleSlot, detailSlot]
    //     })
    //   }
    // },
    // {
    //   name: i18n.get('components.timelineComponent.creator.name'),
    //   // eslint-disable-next-line max-len
    //   example: `<img alt="示例" src="data:image/svg+xml;charset=UTF-8,${encodeURIComponent('<svg width="100" height="70" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><rect fill="#fff" height="100%" width="100%"/></g><defs><g id="item"><circle r="2" cx="10" cy="12"></circle><line x1="10" y1="12" x2="10" y2="24" stroke-width="0.5"></line><text font-family="Helvetica, Arial, sans-serif" font-size="5" x="16" y="14" stroke-width="0" stroke="#000" fill="#000000">事件主题</text><text font-family="Helvetica, Arial, sans-serif" font-size="4.5" x="38" y="13.5" stroke-width="0" stroke="#000" fill="#888">2020-08-08</text><text font-family="Helvetica, Arial, sans-serif" font-size="4.5" x="16" y="20" stroke-width="0" stroke="#000" fill="#000000">详细说明...</text></g></defs><use xlink:href="#item" fill="#1296db" stroke="#1296db"></use><use xlink:href="#item" transform="translate(0, 14)" fill="#15bd9a" stroke="#15bd9a"></use><use xlink:href="#item" transform="translate(0, 28)" fill="#495060" stroke="#495060"></use><use xlink:href="#item" transform="translate(0, 42)" fill="#E74F5E" stroke="#E74F5E"></use></svg>')}">`,
    //   factory() {
    //     return timelineComponent.createInstance(injector)
    //   }
    // },
    // {
    //   name: i18n.get('components.stepsComponent.creator.name'),
    //   // eslint-disable-next-line max-len
    //   example: `<img alt="示例" src="data:image/svg+xml;charset=UTF-8,${encodeURIComponent('<svg width="100" height="70" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><rect fill="#fff" height="100%" width="100%"/></g><defs><g id="item"><circle r="2" cx="10" cy="12"></circle><line x1="12" y1="12" x2="38" y2="12" stroke-width="0.5"></line><text font-family="Helvetica, Arial, sans-serif" font-size="5" x="8" y="22" stroke-width="0" stroke="#000" fill="#000000">标题</text><text font-family="Helvetica, Arial, sans-serif" font-size="4.5" x="8" y="27" stroke-width="0" stroke="#000" fill="#000">描述信息...</text></g></defs><use xlink:href="#item" transform="translate(0, 20)" fill="#15bd9a" stroke="#15bd9a"></use><use xlink:href="#item" transform="translate(30, 20)" fill="#1296db" stroke="#1296db"></use><use xlink:href="#item" transform="translate(60, 20)" fill="#aaa" stroke="#aaa"></use></svg>')}">`,
    //   factory() {
    //     return stepComponent.createInstance(injector)
    //   }
    // },
    // {
    //   name: i18n.get('components.alertComponent.creator.name'),
    //   // eslint-disable-next-line max-len
    //   example: `<img src="data:image/svg+xml;charset=UTF-8,${encodeURIComponent('<svg width="100" height="70" xmlns="http://www.w3.org/2000/svg"><g><rect fill="#fff" height="100%" width="100%"/></g><rect width="90%" height="20" fill="#eee" stroke="#dedede" rx="5" ry="5" x="5" y="25"></rect><text font-family="Helvetica, Arial, sans-serif" font-size="10" x="10" y="35" stroke-width="0" stroke="#000" fill="#000000">文本内容</text></svg>')}">`,
    //   factory() {
    //     return alertComponent.createInstance(injector)
    //   }
    // }
  ];
  const onComplete = new Subject$1();
  const view = h(Componentslist, null, {
    default: () => [
      ...configs.map((i) => {
        return createExample(injector, i, onComplete);
      })
    ]
  });
  return {
    iconClasses: ["textbus-icon-components"],
    tooltip: i18n.get("plugins.toolbar.componentsTool.tooltip"),
    view,
    queryState() {
      return {
        state: QueryStateType.Normal,
        value: null
      };
    },
    useValue() {
    }
  };
}
function componentsTool() {
  return new PopoverTool(componentsToolConfigFactory);
}
const _hoisted_1$a = { class: "temp-dialog" };
const _hoisted_2$4 = { class: "temp-dialog-container" };
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "TempDialog",
  props: {
    bordered: { type: Boolean },
    class: {},
    closable: { type: Boolean },
    closeOnEsc: { type: Boolean },
    content: {},
    maskClosable: { type: Boolean },
    onOpen: { type: Function },
    onClose: { type: Function }
  },
  setup(__props) {
    const props = __props;
    const destory = inject("destory");
    const textbus = inject("injector");
    const themeProvider = textbus.get(ThemeProvider);
    let sub = new Subscription();
    onMounted(() => {
      props.onOpen && props.onOpen();
      sub = fromEvent(document, "keydown").subscribe((ev) => {
        if (ev.key === "Escape") {
          sub.unsubscribe();
          destory();
        }
      });
    });
    onUnmounted(() => {
      props.onClose && props.onClose();
      sub.unsubscribe();
      destory();
    });
    const themeState = ref(themeProvider.theme);
    themeProvider.onThemeUpdate.subscribe((state) => {
      themeState.value = state;
    });
    return (_ctx, _cache) => {
      const _component_n_config_provider = resolveComponent("n-config-provider");
      return openBlock(), createBlock(_component_n_config_provider, {
        theme: themeState.value === "dark" ? unref(darkTheme) : null
      }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1$a, [
            createBaseVNode("div", _hoisted_2$4, [
              _ctx.content ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.content), { key: 0 })) : createCommentVNode("", true)
            ]),
            createBaseVNode("div", {
              class: "temp-dialog-mask",
              onClick: _cache[0] || (_cache[0] = ($event) => unref(destory)())
            })
          ])
        ]),
        _: 1
      }, 8, ["theme"]);
    };
  }
});
const TempDialog = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__scopeId", "data-v-dae8b87e"]]);
var __defProp$a = Object.defineProperty;
var __getOwnPropDesc$a = Object.getOwnPropertyDescriptor;
var __decorateClass$a = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$a(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$a(target, key, result);
  return result;
};
let DialogProvider = class {
  constructor() {
    __publicField(this, "container");
    __publicField(this, "wrapper");
    __publicField(this, "dialog", null);
    __publicField(this, "hanger");
  }
  create(config, injector) {
    this.container = injector.get(VIEW_CONTAINER);
    this.wrapper = this.container.parentNode;
    this.hanger = document.createElement("div");
    this.wrapper.appendChild(this.hanger);
    return new Promise((resolve2, reject) => {
      this.dialog = createApp(TempDialog, {
        ...config
      });
      this.dialog.provide("destory", () => {
        var _a;
        (_a = this.dialog) == null ? void 0 : _a.unmount();
        if (this.wrapper && this.wrapper.contains(this.hanger)) {
          this.wrapper.removeChild(this.hanger);
        }
        resolve2("");
      });
      this.dialog.provide("injector", injector);
      this.dialog.mount(this.hanger);
    });
  }
  destory() {
    var _a, _b;
    (_a = this.dialog) == null ? void 0 : _a.unmount();
    (_b = this.wrapper) == null ? void 0 : _b.removeChild(this.hanger);
  }
};
DialogProvider = __decorateClass$a([
  Injectable()
], DialogProvider);
var __defProp$9 = Object.defineProperty;
var __getOwnPropDesc$9 = Object.getOwnPropertyDescriptor;
var __decorateClass$9 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$9(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$9(target, key, result);
  return result;
};
let AxiosProvider = class {
  constructor() {
    __publicField(this, "axios");
    __publicField(this, "uploadImgUrl");
    this.axios = null;
    this.uploadImgUrl = "";
  }
  set(args) {
    const { hostname, accessToken, uploadImgUrl } = args;
    this.axios = axios.create({
      baseURL: hostname,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    this.uploadImgUrl = uploadImgUrl;
  }
  uploadImg(img) {
    return new Promise((resolve2, reject) => {
      const formdata = new FormData();
      const file = base64ImgtoFile(img);
      formdata.append("file", file);
      if (this.axios) {
        this.axios.post(this.uploadImgUrl, formdata).then((res) => {
          const url = res.config.baseURL + res.data;
          resolve2(url);
        }).catch((err) => reject(err));
      } else {
        reject("未设置请求体");
      }
    });
  }
  destory() {
    this.axios = null;
  }
};
AxiosProvider = __decorateClass$9([
  Injectable()
], AxiosProvider);
const base64ImgtoFile = (baseUrl, filename = "file") => {
  const arr = baseUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const suffix = mime.split("/")[1];
  const bstr = window.atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], `${filename}.${suffix}`, {
    type: mime
  });
};
var __defProp$8 = Object.defineProperty;
var __getOwnPropDesc$8 = Object.getOwnPropertyDescriptor;
var __decorateClass$8 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$8(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$8(target, key, result);
  return result;
};
let ColorProvider = class {
  constructor() {
    __publicField(this, "colorOptions");
    this.colorOptions = /* @__PURE__ */ new Map([
      ["#000000", "#ffffff"],
      ["#FF5A5F", "#FF0000"],
      ["#FFA500", "#FF8C00"],
      ["#FFD700", "#FFFF00"],
      ["#008000", "#008000"],
      ["#00CED1", "#00FFFF"],
      ["#007FFF", "#0000FF"],
      ["#8A2BE2", "#8B008B"]
    ]);
  }
  getColorOptions() {
    const options = [];
    for (const key of this.colorOptions.keys()) {
      options.push(key);
    }
    return options;
  }
  destory() {
    this.colorOptions.clear();
  }
};
ColorProvider = __decorateClass$8([
  Injectable()
], ColorProvider);
var __defProp$7 = Object.defineProperty;
var __getOwnPropDesc$7 = Object.getOwnPropertyDescriptor;
var __decorateClass$7 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$7(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$7(target, key, result);
  return result;
};
let Structurer = class {
  constructor() {
    // injector!: Injector
    /** 布局 */
    __publicField(this, "editorRef", null);
    __publicField(this, "rootRef", null);
    __publicField(this, "scrollerRef", null);
    __publicField(this, "controllerRef", null);
    __publicField(this, "toolbarRef", null);
  }
  setup(config) {
    const { rootRef, editorRef, scrollerRef, toolbarRef, controllerRef } = config;
    this.rootRef = rootRef || null;
    this.editorRef = editorRef || null;
    this.scrollerRef = scrollerRef || null;
    this.controllerRef = controllerRef || null;
    this.toolbarRef = toolbarRef || null;
  }
  destory() {
    this.rootRef = null;
    this.editorRef = null;
    this.scrollerRef = null;
    this.controllerRef = null;
    this.toolbarRef = null;
  }
};
Structurer = __decorateClass$7([
  Injectable()
], Structurer);
var __defProp$6 = Object.defineProperty;
var __getOwnPropDesc$6 = Object.getOwnPropertyDescriptor;
var __decorateClass$6 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$6(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$6(target, key, result);
  return result;
};
let ThemeProvider = class {
  constructor() {
    /** 主题配置 */
    __publicField(this, "themeUpdateEvent", new Subject$1());
    __publicField(this, "onThemeUpdate");
    __publicField(this, "theme", "light");
    __publicField(this, "subs", []);
    __publicField(this, "editorHost", null);
    __publicField(this, "toolbarHost", null);
    __publicField(this, "layout", null);
    this.onThemeUpdate = this.themeUpdateEvent.asObservable();
  }
  setup(injector) {
    this.layout = injector.get(Layout);
    this.editorHost = this.layout.container;
    this.layout.middle.setAttribute("data-color", "#000000");
    const structurer = injector.get(Structurer);
    this.toolbarHost = structurer.toolbarRef;
    this.subs.push(
      this.onThemeUpdate.subscribe((value) => {
        switch (value) {
          case "dark":
            this.updateTheme("data-theme", "dark-theme");
            break;
          case "light":
            this.updateTheme("data-theme", "light-theme");
            break;
          default:
            return;
        }
      })
    );
  }
  /** 更新主题 */
  handleThemeUpdate(value) {
    this.theme = value;
    this.themeUpdateEvent.next(value);
  }
  updateTheme(attrName, themeName) {
    var _a, _b;
    (_a = this.toolbarHost) == null ? void 0 : _a.setAttribute(attrName, themeName);
    (_b = this.editorHost) == null ? void 0 : _b.setAttribute(attrName, themeName);
  }
  destory() {
    this.toolbarHost = null;
    this.editorHost = null;
    this.subs.forEach((i) => i.unsubscribe());
  }
};
ThemeProvider = __decorateClass$6([
  Injectable()
], ThemeProvider);
var __defProp$5 = Object.defineProperty;
var __getOwnPropDesc$5 = Object.getOwnPropertyDescriptor;
var __decorateClass$5 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$5(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$5(target, key, result);
  return result;
};
const DURATION = 1e3;
const bounce = {
  bounceIn(target) {
    return anime({
      targets: target,
      scale: [0, 1],
      opacity: [0, 1],
      duration: DURATION
    });
  },
  bounceInDown(target) {
    return anime({
      targets: target,
      translateY: [-100, 0],
      scale: [0, 1],
      opacity: [0, 1],
      duration: DURATION
    });
  },
  bounceInLeft(target) {
    return anime({
      targets: target,
      translateX: [-100, 0],
      scale: [0, 1],
      opacity: [0, 1],
      duration: DURATION
    });
  },
  bounceInRight(target) {
    return anime({
      targets: target,
      translateX: [100, 0],
      scale: [0, 1],
      opacity: [0, 1],
      duration: DURATION
    });
  },
  bounceInUp(target) {
    return anime({
      targets: target,
      translateY: [100, 0],
      scale: [0, 1],
      opacity: [0, 1],
      duration: DURATION
    });
  }
};
const fide = {
  fideIn(target) {
    return anime({
      targets: target,
      opacity: [0, 1],
      easing: "easeOutQuad",
      duration: DURATION
    });
  },
  fideInDown(target) {
    return anime({
      targets: target,
      translateY: [-100, 0],
      opacity: [0, 1],
      easing: "easeOutQuad",
      duration: DURATION
    });
  },
  fideInLeft(target) {
    return anime({
      targets: target,
      translateX: [-100, 0],
      opacity: [0, 1],
      easing: "easeOutQuad",
      duration: DURATION
    });
  },
  fideInRight(target) {
    return anime({
      targets: target,
      translateX: [100, 0],
      opacity: [0, 1],
      easing: "easeOutQuad",
      duration: DURATION
    });
  },
  fideInUp(target) {
    return anime({
      targets: target,
      translateY: [100, 0],
      opacity: [0, 1],
      easing: "easeOutQuad",
      duration: DURATION
    });
  }
};
const filp = {
  filpInX(target) {
    return anime({
      targets: target,
      rotateX: [-180, 0],
      opacity: [0, 1],
      duration: DURATION * 2
    });
  },
  filpInY(target) {
    return anime({
      targets: target,
      rotateY: [-180, 0],
      opacity: [0, 1],
      duration: DURATION * 2
    });
  }
};
let AnimeProvider = class {
  constructor() {
    __publicField(this, "effectsMap");
    this.effectsMap = /* @__PURE__ */ new Map([
      ["bounceIn", { name: "弹入", applyEffect: bounce.bounceIn }],
      ["bounceInDown", { name: "向下弹入", applyEffect: bounce.bounceInDown }],
      ["bounceInLeft", { name: "自左弹入", applyEffect: bounce.bounceInLeft }],
      ["bounceInRight", { name: "自右弹入", applyEffect: bounce.bounceInRight }],
      ["bounceInUp", { name: "向上弹入", applyEffect: bounce.bounceInUp }],
      ["fideIn", { name: "渐入", applyEffect: fide.fideIn }],
      ["fideInDown", { name: "向下渐入", applyEffect: fide.fideInDown }],
      ["fideInUp", { name: "向上渐入", applyEffect: fide.fideInUp }],
      ["fideInLeft", { name: "自左渐入", applyEffect: fide.fideInLeft }],
      ["fideInRight", { name: "自右渐入", applyEffect: fide.fideInRight }],
      ["filpInX", { name: "沿X轴翻转进入", applyEffect: filp.filpInX }],
      ["filpInY", { name: "沿Y轴翻转进入", applyEffect: filp.filpInY }]
    ]);
  }
  getAnime(key) {
    return this.effectsMap.get(key);
  }
  getOptions() {
    const animeOptions = [];
    this.effectsMap.forEach((value, key) => {
      animeOptions.push({
        label: value.name,
        value: key,
        applyEffect: value.applyEffect,
        disabled: false,
        default: false
      });
    });
    return animeOptions;
  }
  getRandomAnime() {
    const randomEntry = getRandomEntryFromMap(this.effectsMap);
    return randomEntry ?? { key: "fideIn", value: { name: "渐入", applyEffect: fide.fideIn } };
  }
  destory() {
    this.effectsMap.clear();
  }
};
AnimeProvider = __decorateClass$5([
  Injectable()
], AnimeProvider);
function getRandomEntryFromMap(map2) {
  const size2 = map2.size;
  const randomIndex = Math.floor(Math.random() * size2);
  let currentIndex = 0;
  for (const [key, value] of map2) {
    if (currentIndex === randomIndex) {
      return { key, value };
    }
    currentIndex++;
  }
}
var __defProp$4 = Object.defineProperty;
var __getOwnPropDesc$4 = Object.getOwnPropertyDescriptor;
var __decorateClass$4 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$4(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$4(target, key, result);
  return result;
};
let AnimeUtilsProvider = class {
  // private anime!: AnimeProvider
  constructor() {
    __publicField(this, "containerRef");
    __publicField(this, "renderer");
    __publicField(this, "selection");
    __publicField(this, "scrollerRef");
    __publicField(this, "injector");
  }
  setup(injector, scrollerRef) {
    this.injector = injector;
    this.containerRef = injector.get(VIEW_DOCUMENT);
    this.scrollerRef = scrollerRef;
    this.renderer = injector.get(Renderer);
    this.selection = injector.get(Selection);
  }
  /** 通过动画块 id 定位动画块位置 */
  locateAnimeBlock(aniId) {
    const element = this.containerRef.querySelector(`[data-id="${aniId}"]`);
    element && this.applyNativeScroll(element, this.containerRef, this.scrollerRef);
    const location = this.renderer.getLocationByNativeNode(element);
    if ((element == null ? void 0 : element.tagName.toLowerCase()) !== ANIME_COMPONENT) {
      if (location) {
        this.selection.setBaseAndExtent(location.slot, location.startIndex, location.slot, location.endIndex);
        this.selection.restore();
      }
    }
  }
  /** 计算并返回新建动画标记的编号 */
  generateAnimeSerial() {
    if (!this.containerRef)
      return 1;
    const serialArr = [];
    const animeFormatsArr = this.containerRef.getElementsByTagName(ANIME);
    const animeComponentsArr = this.containerRef.getElementsByTagName(ANIME_COMPONENT);
    const anime_amount = animeFormatsArr.length + animeComponentsArr.length;
    if (!anime_amount) {
      return 1;
    }
    for (let i = 0; i < animeFormatsArr.length; i++) {
      const serial = animeFormatsArr[i].dataset.serial;
      serial && serialArr.push(Number(serial));
    }
    for (let i = 0; i < animeComponentsArr.length; i++) {
      const serial = animeComponentsArr[i].dataset.serial;
      serial && serialArr.push(Number(serial));
    }
    let maxSerial = 1;
    if (serialArr.length !== 0) {
      maxSerial = Math.max(...serialArr);
      return maxSerial + 1;
    } else {
      return maxSerial;
    }
  }
  /** 生成动画块 Id */
  generateAnimeId() {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let uuid = "";
    do {
      uuid = "";
      for (let i = 0; i < 8; i++) {
        uuid += chars[Math.floor(Math.random() * 62)];
      }
    } while (this.containerRef.querySelector(`[data-id="${uuid}"]`));
    return uuid;
  }
  /**
   * 获取最外层（祖先）元素到顶部的距离
   * @param el 目标元素
   * @returns 返回距离
   */
  getTopDistance(el) {
    let i = el.offsetTop;
    while (el.offsetParent) {
      el = el.offsetParent;
      i += el.offsetTop;
    }
    return i;
  }
  /**
   * 应用原生页面滚动
   * @param el 元素对象
   * @param scrollerRef // 滚动层 
   * @param offset // 偏移值
   */
  applyNativeScroll(el, container, scrollerRef, offset) {
    if (!container || !scrollerRef)
      return console.error("无法获取容器层或滚动层，请检查依赖！");
    const offsetVal = offset || scrollerRef.clientHeight / 3;
    const top = this.getTopDistance(el) - container.offsetTop;
    const timeout = setTimeout(() => {
      scrollerRef.scrollTo({ top: top - offsetVal, behavior: "smooth" });
      clearTimeout(timeout);
    }, 0);
  }
  // 可选，编辑器销毁时调用
  destory() {
  }
};
AnimeUtilsProvider = __decorateClass$4([
  Injectable()
], AnimeUtilsProvider);
const animeUtilsProvider = {
  provide: AnimeUtilsProvider,
  useClass: AnimeUtilsProvider
};
var __defProp$3 = Object.defineProperty;
var __getOwnPropDesc$3 = Object.getOwnPropertyDescriptor;
var __decorateClass$3 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$3(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$3(target, key, result);
  return result;
};
let AnimeStateProvider = class {
  constructor() {
    __publicField(this, "commander");
    __publicField(this, "selection");
    __publicField(this, "renderer");
    __publicField(this, "container");
    // private animeUpdateEvent: Subject<AnimeState>
    // onAnimeUpdate: Observable<AnimeState>
    // private scrollerRef!: HTMLElement | null
    __publicField(this, "input");
  }
  setup(injector, scrollerRef) {
    this.input = injector.get(Input);
    this.commander = injector.get(Commander);
    this.selection = injector.get(Selection);
    this.renderer = injector.get(Renderer);
    this.container = injector.get(Layout).container;
  }
  // 启动激活
  setActive(aniId) {
    const elements = this.container.querySelectorAll(`[data-id="${aniId}"]`);
    if (elements.length !== 0) {
      elements.forEach((item) => {
        this.handleStateUpdate(item, aniId, { state: "active" });
      });
    }
  }
  // 取消激活
  setInactive(aniId) {
    const elements = this.container.querySelectorAll(`[data-id="${aniId}"]`);
    if (elements.length !== 0) {
      elements.forEach((item) => {
        this.handleStateUpdate(item, aniId, { state: "inactive" });
      });
    }
  }
  // 更新编号
  updateSerial(aniId, serial) {
    const elements = this.container.querySelectorAll(`[data-id="${aniId}"]`);
    if (elements.length !== 0) {
      elements.forEach((item) => {
        this.handleStateUpdate(item, aniId, { serial });
      });
    }
  }
  /** 更新动画的状态 */
  handleStateUpdate(element, aniId, state) {
    if (element.tagName.toLowerCase() === ANIME) {
      this.setFormatterState(element, state);
    } else {
      this.setComponentStateByElement(element, state);
    }
  }
  // 更新 Formatter 的状态
  setFormatterState(element, state) {
    const location = this.renderer.getLocationByNativeNode(element);
    if (location) {
      this.selection.setAnchor(location.slot, location.startIndex);
      this.selection.setFocus(location.slot, location.endIndex);
      const dataId = element.dataset.id;
      const dataSerial = element.dataset.serial;
      const dataEffect = element.dataset.effect;
      const dataState = element.dataset.state;
      const title = element.title;
      this.commander.applyFormat(animeFormatter, {
        dataId: state.id !== void 0 ? state.id : dataId,
        dataSerial: state.serial !== void 0 ? state.serial.toString() : dataSerial,
        dataEffect: state.effect !== void 0 ? state.effect : dataEffect,
        dataState: state.state !== void 0 ? state.state : dataState,
        title
      });
      this.selection.toNext();
    }
  }
  // 通过 element 查询 component，通过 compoent 实例直接更新其状态
  setComponentStateByElement(element, state) {
    const vNode = this.renderer.getVNodeByNativeNode(element);
    const location = this.renderer.getLocationByVNode(vNode);
    const component = location.slot.sliceContent(location.startIndex, location.endIndex)[0];
    if (typeof component !== "string") {
      if (component.name === ANIME_COMPONENT_NAME) {
        component.updateState((draft) => {
          if (state.id !== void 0)
            draft.dataId = state.id;
          if (state.effect !== void 0)
            draft.dataEffect = state.effect;
          if (state.serial !== void 0)
            draft.dataSerial = state.serial.toString();
          if (state.state !== void 0)
            draft.dataState = state.state;
        });
      }
    }
  }
  // 可选，编辑器销毁时调用
  destory() {
  }
};
AnimeStateProvider = __decorateClass$3([
  Injectable()
], AnimeStateProvider);
var __defProp$2 = Object.defineProperty;
var __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor;
var __decorateClass$2 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$2(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$2(target, key, result);
  return result;
};
let AnimeAutoProvider = class {
  constructor() {
    __publicField(this, "commander");
    __publicField(this, "selection");
    __publicField(this, "renderer");
    __publicField(this, "rootComponent");
    __publicField(this, "anime");
    __publicField(this, "addAnimeService");
    __publicField(this, "animeUtilsProvider");
    __publicField(this, "structurer");
    __publicField(this, "injector");
  }
  setup(injector) {
    this.injector = injector;
    this.commander = injector.get(Commander);
    this.selection = injector.get(Selection);
    this.renderer = injector.get(Renderer);
    this.rootComponent = injector.get(RootComponentRef);
    this.anime = injector.get(AnimeProvider);
    this.addAnimeService = injector.get(AddAnimeService);
    this.animeUtilsProvider = injector.get(AnimeUtilsProvider);
    this.structurer = injector.get(Structurer);
  }
  /**
   * 自动添加动画预设
   * @param selectAnimeOption 指定一种动画，如果提供该选项，则所有自动添加的预设都会采用该动画
   */
  autoAdd(selectAnimeOption) {
    const slots = this.rootComponent.component.slots.toArray();
    const group = slots.map((slot) => slot.sliceContent());
    for (let i = 0; i < group.length; i++) {
      const components = group[i];
      outerLoop:
        for (let k = 0; k < components.length; k++) {
          const component = components[k];
          if (typeof component !== "string") {
            if (["RootComponent", "AnimeIgnoreComponent", ANIME_COMPONENT_NAME].includes(component.name))
              continue;
            if (["ParagraphComponent"].includes(component.name)) {
              console.log("formatter anime");
              component.slots.toArray().forEach((slot) => {
                setTimeout(() => {
                  this.addFormatterAnime(slot, selectAnimeOption);
                }, 0);
              });
              continue;
            }
            let parentComponent = component.parentComponent;
            while (parentComponent) {
              if (parentComponent && parentComponent.name === "RootComponent")
                break;
              if (parentComponent && parentComponent.name === "AnimeIgnoreComponent")
                continue outerLoop;
              if (parentComponent && parentComponent.name === "AnimeComponent")
                continue outerLoop;
              parentComponent = parentComponent.parentComponent;
            }
            if ([ContentType.InlineComponent, ContentType.Text].includes(component.type)) {
              console.log("行内组件或文本组件");
              component.slots.toArray().forEach((slot) => {
                setTimeout(() => {
                  this.addFormatterAnime(slot, selectAnimeOption);
                }, 0);
              });
              continue;
            }
            setTimeout(() => {
              this.addComponentAnime(component, selectAnimeOption);
            }, 0);
            if (["ListComponent"].includes(component.name)) {
              component.slots.toArray().forEach((slot) => {
                setTimeout(() => {
                  this.addFormatterAnime(slot, selectAnimeOption);
                }, 0);
              });
            }
          }
        }
    }
  }
  /**
   * 添加组件动画
   * @param componentInstance 组件
   * @param selectAnimeOption 指定一种动画，不传的时候会在动画列表中随机选择
   */
  addComponentAnime(componentInstance, selectAnimeOption) {
    if (!componentInstance)
      return;
    const id = this.animeUtilsProvider.generateAnimeId();
    const serial = this.animeUtilsProvider.generateAnimeSerial().toString();
    const animeOption = selectAnimeOption || this.anime.getRandomAnime();
    try {
      const slot = new Slot([ContentType.BlockComponent]);
      const anime2 = animeComponent.createInstance(this.injector, {
        slots: [slot],
        state: {
          dataId: id,
          dataEffect: animeOption.key,
          dataSerial: serial.toString(),
          dataState: "",
          dataTitle: animeOption.value.name
        }
      });
      this.commander.replaceComponent(componentInstance, anime2);
      slot.insert(componentInstance);
    } catch (error) {
      console.log(error);
    }
  }
  /**
   * 添加格式动画
   * @param slot 插槽
   * @param selectAnimeOption 指定一种动画，不传的时候会在动画列表中随机选择
   */
  addFormatterAnime(slot, selectAnimeOption) {
    try {
      if (slot.sliceContent()[0] !== "\n") {
        const id = this.animeUtilsProvider.generateAnimeId();
        const serial = this.animeUtilsProvider.generateAnimeSerial().toString();
        const animeOption = this.anime.getRandomAnime();
        slot.applyFormat(animeFormatter, {
          startIndex: 0,
          endIndex: slot.length,
          value: {
            dataId: id,
            dataSerial: serial,
            dataEffect: animeOption.key,
            dataState: "",
            dataTitle: animeOption.value.name
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  destory() {
  }
};
AnimeAutoProvider = __decorateClass$2([
  Injectable()
], AnimeAutoProvider);
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$1(target, key, result);
  return result;
};
const UpdateState = (target, propertyKey, descriptor) => {
  const fn = descriptor.value;
  descriptor.value = function(...args) {
    const result = fn.apply(this, args);
    this["stateUpdateEvent"].next(propertyKey);
    return result;
  };
  return descriptor;
};
let Player = class {
  constructor() {
    __publicField(this, "stateUpdateEvent", new Subject());
    __publicField(this, "onStateUpdate", this.stateUpdateEvent.asObservable());
    __publicField(this, "subtitleUpdataEvent", new Subject());
    __publicField(this, "onSubtitleUpdate", this.subtitleUpdataEvent.asObservable());
    __publicField(this, "rateChangeEvent", new Subject());
    __publicField(this, "onRateChange", this.rateChangeEvent.asObservable());
    __publicField(this, "volumeChangeEvent", new Subject());
    __publicField(this, "onVolumeChange", this.volumeChangeEvent.asObservable());
    __publicField(this, "playOverEvent", new Subject());
    __publicField(this, "onPlayOver", this.playOverEvent.asObservable());
    __publicField(this, "injector");
    __publicField(this, "anime");
    __publicField(this, "data", []);
    // 数据
    __publicField(this, "sourceData", []);
    // 源数据
    __publicField(this, "scrollerRef");
    // 滚动条
    __publicField(this, "rootRef");
    // 课程最外层容器
    __publicField(this, "containerRef");
    __publicField(this, "subs", []);
    __publicField(this, "scrollerSub");
    __publicField(this, "timer");
    __publicField(this, "scrollTimer");
    /** 公开状态 */
    __publicField(this, "subtitle", "");
    __publicField(this, "rate", 1);
    __publicField(this, "volume", 1);
    __publicField(this, "isPlaying", false);
    __publicField(this, "isPause", false);
    __publicField(this, "currentTime", 0);
    // 当前片段播放时间
    __publicField(this, "totalTime", 0);
    // 当前总播放时间
    __publicField(this, "scrollTop", 0);
    /** 临时记录 */
    __publicField(this, "total", 0);
    __publicField(this, "animeCount", 0);
    __publicField(this, "subtitleCount", 0);
    __publicField(this, "keyframeHistory", []);
    /** 微课数据 */
    __publicField(this, "audio", null);
    __publicField(this, "duration", 0);
    // private promoterSequence: string[] = []
    __publicField(this, "keyframeSequence", []);
    __publicField(this, "subtitleSequence", []);
    __publicField(this, "subtitleKeyframeSequence", []);
    __publicField(this, "animeElementSequence", []);
  }
  setup(injector, scrollerRef) {
    const structurer = injector.get(Structurer);
    this.scrollerRef = scrollerRef || structurer.scrollerRef;
    this.containerRef = injector.get(Layout).container;
    this.anime = injector.get(AnimeProvider);
    this.injector = injector;
  }
  loadData(data) {
    return new Promise((resolve2, reject) => {
      this.sourceData = data;
      const audioSequence = data.map((item) => {
        return loadAudio(item.audio);
      });
      return Promise.all(audioSequence).then((audios) => {
        this.data = data.map((item, index) => {
          return {
            audio: audios[index],
            duration: item.duration,
            animeElementSequence: item.promoterSequence.map((item2) => {
              return this.scrollerRef.querySelectorAll(`[data-id="${item2}"]`);
            }),
            keyframeSequence: item.keyframeSequence,
            subtitleSequence: item.subtitleSequence,
            subtitleKeyframeSequence: item.subtitleKeyframeSequence
          };
        });
        resolve2(this.data);
      }).catch((error) => {
        console.error("音频文件加载失败：" + error);
        return;
      });
    });
  }
  /** 递归播放多个项目 */
  playMulti(args) {
    const { data, index, startPoint } = args;
    if (index < data.length) {
      const { audio, duration, animeElementSequence, keyframeSequence, subtitleSequence, subtitleKeyframeSequence } = data[index];
      this.audio = audio;
      this.duration = duration;
      this.animeElementSequence = animeElementSequence;
      this.keyframeSequence = keyframeSequence;
      this.subtitleSequence = subtitleSequence || [];
      this.subtitleKeyframeSequence = subtitleKeyframeSequence || [];
      if (!this.audio)
        return console.warn("音频未加载完成或已失效");
      if (this.isPlaying)
        return console.warn("正在播放中");
      if (startPoint) {
        if (startPoint[index].startIndex) {
          this.setAnimeVisible(false, startPoint[index].startIndex);
          this.animeCount = startPoint[index].startIndex;
          this.subtitleCount = startPoint[index].startIndex;
        }
        if (startPoint[index].startTime) {
          if (this.duration < startPoint[index].startTime) {
            this.clear();
            this.setAnimeVisible(true);
            return console.warn("设置时长溢出！");
          }
          this.audio.currentTime = startPoint[index].startTime;
        }
      } else {
        this.setAnimeVisible(false);
        this.animeCount = 0;
        this.subtitleCount = 0;
      }
      this.isPlaying = true;
      this.rate = this.audio.playbackRate;
      this.volume = this.audio.volume;
      this.stateUpdateEvent.next("");
      const hasSubtitle = subtitleSequence && subtitleSequence.length > 0 && subtitleKeyframeSequence && subtitleKeyframeSequence.length > 0;
      this.timer = setInterval(() => {
        if (hasSubtitle) {
          if (this.audio.currentTime > subtitleKeyframeSequence[this.subtitleCount]) {
            this.subtitle = this.subtitleSequence[this.subtitleCount];
            this.subtitleUpdataEvent.next(this.subtitle);
            this.subtitleCount++;
          }
        }
        if (this.audio.currentTime > keyframeSequence[this.animeCount]) {
          animeElementSequence[this.animeCount].forEach((el) => {
            this.applyPlay(el, this.containerRef, this.scrollerRef);
          });
          this.keyframeHistory[this.animeCount] = this.keyframeSequence[this.animeCount];
          this.animeCount++;
        }
        this.currentTime = this.audio.currentTime;
        this.totalTime = this.total + this.audio.currentTime;
      }, 50);
      this.audio.play();
      this.audio.onvolumechange = () => {
        var _a;
        this.volumeChangeEvent.next((_a = this.audio) == null ? void 0 : _a.volume);
      };
      this.audio.onratechange = () => {
        var _a;
        this.rateChangeEvent.next((_a = this.audio) == null ? void 0 : _a.playbackRate);
      };
      this.audio.addEventListener("ended", () => {
        this.clear();
        clearInterval(this.timer);
        this.total += duration;
        this.playMulti({ data, index: index + 1, startPoint });
      });
    } else {
      this.clear();
      this.total = 0;
      this.totalTime = 0;
      this.setAnimeVisible(true);
      this.stateUpdateEvent.next("");
      this.playOverEvent.next("");
      this.scrollerSub = fromEvent(this.scrollerRef, "scroll").subscribe((ev) => {
        this.showIgnoreComponent();
        this.scrollerSub.unsubscribe();
        clearTimeout(timer);
      });
      const timer = setTimeout(() => {
        this.showIgnoreComponent();
        this.scrollerSub.unsubscribe();
        clearTimeout(timer);
      }, 5e3);
    }
  }
  start() {
    this.hideIgnoreComponent();
    this.init();
    this.playMulti({ data: this.data, index: 0 });
  }
  startHere(startTime, startIndex) {
    this.clear();
    this.playMulti({ data: this.data, index: 0, startPoint: [{ startTime, startIndex }] });
  }
  pause() {
    var _a;
    if (this.isPlaying) {
      (_a = this.audio) == null ? void 0 : _a.pause();
      this.scrollTop = this.scrollerRef.scrollTop;
      this.isPlaying = false;
      this.isPause = true;
    }
  }
  resume() {
    var _a;
    if (!this.isPlaying && this.isPause) {
      (_a = this.audio) == null ? void 0 : _a.play();
      this.isPlaying = true;
      this.isPause = false;
      this.scrollerRef.scrollTop = this.scrollTop;
    }
  }
  rewind() {
    if (!this.audio || !this.isPlaying)
      return;
    if (this.audio.currentTime > 2) {
      this.audio.currentTime -= 2;
      for (let index = this.keyframeHistory.length - 1; index >= 0; index--) {
        if (this.keyframeHistory[index] > this.audio.currentTime) {
          this.animeElementSequence[index].forEach((el) => {
            el.style.opacity = "0";
          });
          this.animeCount = index;
        } else {
          break;
        }
      }
    }
  }
  forward() {
    if (!this.audio || !this.isPlaying)
      return;
    if (this.audio.currentTime < this.audio.duration - 2) {
      this.audio.currentTime += 2;
    }
  }
  speedUp() {
    if (!this.audio)
      return;
    if (this.audio.playbackRate >= 2) {
      return;
    }
    this.audio.playbackRate += 0.2;
    this.rate = this.audio.playbackRate;
    this.rateChangeEvent.next(this.rate);
  }
  speedDown() {
    if (!this.audio)
      return;
    if (this.audio.playbackRate <= 0.5) {
      return;
    }
    this.audio.playbackRate -= 0.2;
    this.rate = this.audio.playbackRate;
    this.rateChangeEvent.next(this.rate);
  }
  volumeUp() {
    if (!this.audio)
      return;
    if (this.volume >= 1 || this.audio.volume >= 1)
      return;
    if (this.volume >= 0.9) {
      this.audio.volume = 1;
    } else {
      this.audio.volume += 0.1;
    }
    this.volume = this.audio.volume;
  }
  volumeDown() {
    if (!this.audio)
      return;
    if (this.volume <= 0 || this.audio.volume <= 0)
      return;
    if (this.volume <= 0.1) {
      this.audio.volume = 0;
    } else {
      this.audio.volume -= 0.1;
    }
    this.volume = this.audio.volume;
  }
  replay() {
    this.init();
    this.start();
  }
  stop() {
    this.init();
    this.setAnimeVisible(true);
    this.playOverEvent.next("");
    this.scrollerSub = fromEvent(this.scrollerRef, "scroll").subscribe((ev) => {
      this.showIgnoreComponent();
      this.scrollerSub.unsubscribe();
    });
  }
  clear() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.animeCount = 0;
    this.subtitleCount = 0;
    this.keyframeHistory = [];
    this.subtitle = "";
    this.isPlaying = false;
    this.isPause = false;
    this.currentTime = 0;
    this.scrollTop = this.scrollerRef.scrollTop;
    clearInterval(this.timer);
    this.subtitleUpdataEvent.next(this.subtitle);
  }
  /** 初始化 */
  init() {
    this.scrollerRef.scrollTop = 0;
    this.total = 0;
    this.totalTime = 0;
    this.clear();
  }
  hideIgnoreComponent() {
    const container = this.injector.get(VIEW_CONTAINER);
    const elements = container.querySelectorAll("anime-ignore");
    elements.forEach((el) => {
      el.style.display = "none";
    });
  }
  showIgnoreComponent() {
    const container = this.injector.get(VIEW_CONTAINER);
    const elements = container.querySelectorAll("anime-ignore");
    elements.forEach((el) => {
      el.style.display = "block";
    });
  }
  /** 设置动画可见状态 */
  setAnimeVisible(visible, startPoint = 0) {
    this.animeElementSequence.forEach((item, index) => {
      if (index >= startPoint) {
        item.forEach((el) => {
          el.style.opacity = visible ? "1" : "0";
        });
      }
    });
  }
  /** 动画播放函数 */
  applyPlay(el, container, scroller) {
    this.applyAnime(el.dataset.effect, el);
    this.applyScroll({
      el,
      scroller,
      container,
      commonRollSpeed: 1,
      commonReservedZone: 300,
      overflowTopRollSpeed: 2,
      overflowTopReservedZone: 200,
      overflowBottomRollSpeed: 2,
      overflowBottomReservedZone: 200
    });
  }
  /** 应用动画播放控制 */
  applyAnime(effectValue, el) {
    const display = el.style.display;
    switch (el.tagName.toLocaleLowerCase()) {
      case "anime":
        el.style.display = "inline-block";
        break;
      case "anime-component":
        el.style.display = "block";
        break;
    }
    const anime2 = this.anime.getAnime(effectValue);
    if (anime2) {
      anime2.applyEffect(el).finished.then(() => {
        el.style.display = display;
      });
    } else {
      el.style.display = display;
    }
  }
  /** 应用页面滚动 */
  applyScroll(args) {
    const {
      el,
      scroller,
      container,
      commonRollSpeed,
      commonReservedZone,
      overflowTopRollSpeed,
      overflowTopReservedZone,
      overflowBottomRollSpeed,
      overflowBottomReservedZone
    } = args;
    const Horizon = scroller.clientHeight;
    const Scrolled = scroller.scrollTop;
    const Node2Top = getTopDistance(el) - container.offsetTop;
    const NodeHeight = el.clientHeight;
    const Node2HorizonBottom = Horizon + Scrolled - Node2Top - NodeHeight;
    if (Node2Top < Scrolled) {
      this.clearInterval();
      let Node2HorizonTop = Scrolled - Node2Top;
      let rollSpeed = Math.round((Node2HorizonTop + overflowTopReservedZone) / (30 / overflowTopRollSpeed));
      if (rollSpeed < 10)
        rollSpeed = 10;
      this.scrollTimer = setInterval(() => {
        scroller.scrollTop -= rollSpeed;
        Node2HorizonTop -= rollSpeed;
        if (Node2HorizonTop <= -overflowTopReservedZone) {
          this.clearInterval();
          return;
        }
      }, 10);
    } else if (Node2HorizonBottom < 0) {
      this.clearInterval();
      let Node2HorizonBottomAbs = Math.abs(Node2HorizonBottom);
      let rollSpeed = Math.round((Node2HorizonBottomAbs + overflowBottomReservedZone) / (30 / overflowBottomRollSpeed));
      if (rollSpeed < 10)
        rollSpeed = 10;
      this.scrollTimer = setInterval(() => {
        scroller.scrollTop += rollSpeed;
        Node2HorizonBottomAbs -= rollSpeed;
        if (Node2HorizonBottomAbs < -overflowBottomReservedZone) {
          this.clearInterval();
          return;
        }
      }, 10);
    } else if (Node2HorizonBottom < 200 && Node2HorizonBottom > 0) {
      this.clearInterval();
      let sum = 0;
      this.scrollTimer = setInterval(() => {
        scroller.scrollTop += 10 * commonRollSpeed;
        sum += 10 * commonRollSpeed;
        if (sum > commonReservedZone) {
          this.clearInterval();
          return;
        }
      }, 20);
    } else {
      this.clearInterval();
      return;
    }
  }
  /** 翻页播放模式（待开发） */
  applyFilpPlay(el, container, scroller) {
    this.applyAnime(el.dataset.effect, el);
  }
  /** 应用翻页（待开发） */
  applyFlip(args) {
    const { el, scroller, container } = args;
    scroller.clientHeight;
    scroller.scrollTop;
    getTopDistance(el) - container.offsetTop;
    el.clientHeight;
  }
  /** 立即取消当前滚动事务 */
  clearInterval() {
    clearInterval(this.scrollTimer);
  }
  /**
   * 应用原生页面滚动
   * @param el 元素对象
   * @param scrollerRef // 滚动层
   * @param offset // 偏移值
   */
  applyNativeScroll(el, container, scrollerRef, offset) {
    if (!container || !scrollerRef)
      return console.error("无法获取容器层或滚动层，请检查依赖！");
    const offsetVal = offset || scrollerRef.clientHeight / 3;
    const top = getTopDistance(el) - container.offsetTop;
    const timeout = setTimeout(() => {
      scrollerRef.scrollTo({ top: top - offsetVal, behavior: "smooth" });
      clearTimeout(timeout);
    }, 0);
  }
  /** 将片段数据解析成播放所需数据 */
  parseData(data) {
    const { audio, duration, promoters, timestamps } = data;
    const keyframeSequence = [];
    let promoterSequence = [];
    if (timestamps.length > 0 && timestamps.length === promoters.length) {
      promoterSequence = promoters.filter((item, index) => {
        if (item !== null) {
          keyframeSequence.push(timestamps[index]);
          return item;
        }
      });
    } else {
      const section = duration / promoters.length;
      promoterSequence = promoters.filter((item, index) => {
        if (item !== null) {
          keyframeSequence.push(Number((section * index).toFixed(3)));
          return item;
        }
      });
    }
    return { audio, duration, promoterSequence, keyframeSequence };
  }
  /** 将音频时长（duration）转化成 HH:MM:SS 格式 */
  durationFormat(duration) {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor(duration % 3600 / 60);
    const seconds = Math.floor(duration % 60);
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    return `${hours ? formattedHours + ":" : ""}${formattedMinutes}:${formattedSeconds}`;
  }
  destory() {
    var _a;
    this.init();
    this.subs.forEach((sub) => sub.unsubscribe());
    if (this.audio) {
      this.audio.src = "";
      this.audio = null;
    }
    (_a = this.data) == null ? void 0 : _a.forEach((item) => {
      if (item.audio) {
        item.audio.src = "";
      }
    });
    try {
      this.data.length = 0;
      this.data = null;
      this.sourceData.length = 0;
      this.sourceData = null;
      this.keyframeHistory.length = 0;
      this.keyframeHistory = null;
      this.keyframeSequence.length = 0;
      this.keyframeSequence = null;
      this.subtitleSequence.length = 0;
      this.subtitleSequence = null;
      this.subtitleKeyframeSequence.length = 0;
      this.subtitleKeyframeSequence = null;
      this.animeElementSequence.length = 0;
      this.animeElementSequence = null;
    } catch (error) {
      console.error(error);
    }
  }
};
__decorateClass$1([
  UpdateState
], Player.prototype, "start", 1);
__decorateClass$1([
  UpdateState
], Player.prototype, "startHere", 1);
__decorateClass$1([
  UpdateState
], Player.prototype, "pause", 1);
__decorateClass$1([
  UpdateState
], Player.prototype, "resume", 1);
__decorateClass$1([
  UpdateState
], Player.prototype, "rewind", 1);
__decorateClass$1([
  UpdateState
], Player.prototype, "forward", 1);
__decorateClass$1([
  UpdateState
], Player.prototype, "speedUp", 1);
__decorateClass$1([
  UpdateState
], Player.prototype, "speedDown", 1);
__decorateClass$1([
  UpdateState
], Player.prototype, "volumeUp", 1);
__decorateClass$1([
  UpdateState
], Player.prototype, "volumeDown", 1);
__decorateClass$1([
  UpdateState
], Player.prototype, "replay", 1);
__decorateClass$1([
  UpdateState
], Player.prototype, "stop", 1);
__decorateClass$1([
  UpdateState
], Player.prototype, "clear", 1);
Player = __decorateClass$1([
  Injectable()
], Player);
function getTopDistance(el) {
  let i = el.offsetTop;
  while (el.offsetParent) {
    el = el.offsetParent;
    i += el.offsetTop;
  }
  return i;
}
function loadAudio(src) {
  return new Promise((resolve2, reject) => {
    const audio = new Audio(src);
    audio.addEventListener("canplaythrough", () => {
      resolve2(audio);
    });
    audio.addEventListener("error", (error) => {
      reject(error);
    });
    audio.load();
  });
}
function audioToolConfigFactory(injector) {
  const i18n = injector.get(I18n);
  const query = injector.get(Query);
  const commander = injector.get(Commander);
  i18n.getContext("plugins.toolbar.audioTool.view");
  return {
    iconClasses: ["textbus-icon-music"],
    tooltip: i18n.get("plugins.toolbar.audioTool.tooltip"),
    // viewController: form,
    view: h("span", {}, ["音频"]),
    queryState() {
      const state = query.queryComponent(audioComponent);
      if (state.state === QueryStateType.Enabled) {
        return {
          state: QueryStateType.Enabled,
          value: state.value.extends.toJSON()
        };
      }
      return {
        state: state.state,
        value: null
      };
    },
    useValue(value) {
      if (value) {
        const state = query.queryComponent(audioComponent);
        if (state.state === QueryStateType.Enabled) {
          state.value.extends.mergeProps(value);
        } else {
          commander.insert(audioComponent.createInstance(injector, {
            state: value
          }));
        }
      }
    }
  };
}
function defaultGroupToolFactory(injector) {
  const i18n = injector.get(I18n);
  return {
    iconClasses: ["textbus-icon-plus"],
    options: [
      {
        ...preToolConfigFactory(injector),
        type: ToolType.Select,
        label: i18n.get("plugins.toolbar.insertObjectTool.sourceCode")
      },
      {
        ...lineHeightToolConfigFactory(injector),
        type: ToolType.Select,
        label: i18n.get("plugins.toolbar.insertObjectTool.lineHeight")
      },
      {
        ...letterSpacingToolConfigFactory(injector),
        type: ToolType.Select,
        label: i18n.get("plugins.toolbar.insertObjectTool.letterSpacing")
      },
      {
        ...emojiToolConfigFactory(injector),
        type: ToolType.Render,
        label: i18n.get("plugins.toolbar.insertObjectTool.emoji")
      },
      {
        ...audioToolConfigFactory(injector),
        type: ToolType.Dialog,
        label: i18n.get("plugins.toolbar.insertObjectTool.audio")
      },
      // {
      //   ...videoToolConfigFactory(injector),
      //   type: ToolType.Dialog,
      //   label: i18n.get('plugins.toolbar.insertObjectTool.video')
      // },
      {
        ...superscriptToolConfigFactory(injector),
        type: ToolType.Button,
        label: i18n.get("plugins.toolbar.insertObjectTool.superscript")
      },
      {
        ...subscriptToolConfigFactory(injector),
        type: ToolType.Button,
        label: i18n.get("plugins.toolbar.insertObjectTool.subscript")
      },
      {
        ...codeToolConfigFactory(injector),
        type: ToolType.Button,
        label: i18n.get("plugins.toolbar.insertObjectTool.code")
      },
      {
        ...blockquoteToolConfigFactory(injector),
        type: ToolType.Button,
        label: i18n.get("plugins.toolbar.insertObjectTool.blockquote")
      },
      {
        ...leftToRightToolConfigFactory(injector),
        type: ToolType.Button,
        label: i18n.get("plugins.toolbar.insertObjectTool.leftToRight")
      },
      {
        ...rightToLeftToolConfigFactory(injector),
        type: ToolType.Button,
        label: i18n.get("plugins.toolbar.insertObjectTool.rightToLeft")
      }
    ]
  };
}
function defaultGroupTool() {
  return new DropdownTool(defaultGroupToolFactory);
}
const _hoisted_1$9 = { class: "segment-popover-tool" };
const _hoisted_2$3 = ["title"];
const _hoisted_3$3 = { class: "content" };
const _hoisted_4$2 = { class: "list" };
const _hoisted_5 = ["onClick", "onMouseenter"];
const _hoisted_6 = { class: "option-label" };
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "UIAnimePopover",
  props: {
    iconClasses: {},
    keymap: {},
    tooltip: {},
    options: {},
    onSelected: { type: Function },
    currentValue: { type: Function },
    highlight: { type: Function },
    disabled: { type: Function }
  },
  setup(__props) {
    const injector = inject("injector");
    const keyboard = injector == null ? void 0 : injector.get(Keyboard);
    const props = __props;
    const state = reactive({
      currentValue: computed(() => {
        if (props.currentValue())
          return props.currentValue().dataEffect || "";
        return "";
      }),
      // highlight: computed(() => props.highlight()),
      disabled: computed(() => props.disabled())
    });
    const isShow = ref(false);
    const isLock = ref(false);
    const btnRef = ref();
    const currentOption = ref(props.options[0]);
    function handleSelect(option) {
      console.log(option);
      currentOption.value = option;
      props.onSelected({ value: option.value, label: option.label });
      if (isLock.value)
        return;
      isShow.value = false;
    }
    function handleLeftBtnClick() {
      props.onSelected({ value: currentOption.value.value, label: currentOption.value.label });
    }
    function handleClickoutside(ev) {
      if (btnRef.value === ev.target || isLock.value)
        return;
      isShow.value = false;
    }
    if (props.keymap) {
      keyboard == null ? void 0 : keyboard.addShortcut({
        keymap: props.keymap,
        action: () => {
          if (!state.disabled && currentOption.value) {
            props.onSelected(currentOption.value);
          }
        }
      });
    }
    return (_ctx, _cache) => {
      const _component_n_popover = resolveComponent("n-popover");
      return openBlock(), createElementBlock("div", _hoisted_1$9, [
        createVNode(_component_n_popover, {
          trigger: "click",
          placement: "bottom-start",
          to: false,
          "show-arrow": false,
          show: isShow.value,
          disabled: state.disabled,
          onClickoutside: handleClickoutside
        }, {
          trigger: withCtx(() => [
            createBaseVNode("div", {
              class: normalizeClass(["trigger", state.disabled ? "disabled" : ""]),
              title: _ctx.tooltip
            }, [
              createBaseVNode("div", {
                class: "selector-left-btn",
                onClick: handleLeftBtnClick
              }, [
                createBaseVNode("span", null, toDisplayString(currentOption.value.label), 1)
              ]),
              createBaseVNode("div", {
                ref_key: "btnRef",
                ref: btnRef,
                class: "selector-right-btn",
                onClick: _cache[0] || (_cache[0] = ($event) => isShow.value = !isShow.value)
              }, [
                createVNode(unref(UIIcon$1), {
                  class: normalizeClass(["selector-caret", isShow.value ? "active" : ""]),
                  icon: "textbus-dropdown-caret"
                }, null, 8, ["class"])
              ], 512)
            ], 10, _hoisted_2$3)
          ]),
          default: withCtx(() => [
            createBaseVNode("div", _hoisted_3$3, [
              createBaseVNode("div", _hoisted_4$2, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.options, (option) => {
                  return openBlock(), createElementBlock("div", {
                    key: option.value,
                    class: normalizeClass([
                      "option",
                      state.currentValue === option.value ? "using" : ""
                    ]),
                    onClick: ($event) => handleSelect(option),
                    onMouseenter: withModifiers(($event) => option.applyEffect($event.target.firstChild), ["self"])
                  }, [
                    createBaseVNode("div", _hoisted_6, toDisplayString(option.label), 1)
                  ], 42, _hoisted_5);
                }), 128))
              ]),
              createBaseVNode("div", {
                class: "lock",
                onClick: _cache[1] || (_cache[1] = ($event) => isLock.value = !isLock.value)
              }, [
                createVNode(unref(UIIcon$1), {
                  icon: isLock.value ? `${unref(MaterialTypeEnum$1).FILLED}lock` : `${unref(MaterialTypeEnum$1).FILLED}lock_open`
                }, null, 8, ["icon"])
              ])
            ])
          ]),
          _: 1
        }, 8, ["show", "disabled"])
      ]);
    };
  }
});
const AnimePopover = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-1ccc9bc2"]]);
class AnimeSegmentPopoverTool {
  constructor(factory) {
    __publicField(this, "config");
    __publicField(this, "controller");
    __publicField(this, "isHighlight");
    __publicField(this, "isDisabled");
    __publicField(this, "currentValue");
    this.factory = factory;
    this.isHighlight = ref(false);
    this.isDisabled = ref(false);
    this.currentValue = ref("");
  }
  setup(injector) {
    const anime2 = injector.get(AnimeProvider);
    const animeOptions = anime2.getOptions();
    const config = this.factory(injector);
    this.controller = injector.get(Controller$1);
    this.config = config;
    const segmentPopover = h(AnimePopover, {
      tooltip: config.tooltip,
      keymap: config.keymap,
      iconClasses: config.iconClasses,
      options: animeOptions,
      onSelected: (state) => {
        config.useValue && config.useValue(state);
      },
      currentValue: () => this.currentValue.value,
      highlight: () => this.isHighlight.value,
      disabled: () => this.isDisabled.value
    });
    this.controller.onReadonlyStateChange.subscribe((v) => {
      this.isDisabled.value = v;
    });
    return segmentPopover;
  }
  disabled(is) {
    if (is) {
      this.isDisabled.value = true;
      this.isHighlight.value = false;
    }
  }
  refreshState() {
    if (!this.config.queryState) {
      return;
    }
    if (this.controller.readonly) {
      this.isDisabled.value = true;
      this.isHighlight.value = false;
      return;
    }
    const state = this.config.queryState();
    this.currentValue.value = state.value;
    switch (state.state) {
      case QueryStateType.Enabled:
        this.isDisabled.value = false;
        this.isHighlight.value = true;
        break;
      case QueryStateType.Normal:
        this.isDisabled.value = false;
        this.isHighlight.value = false;
        break;
      case QueryStateType.Disabled:
        this.isDisabled.value = true;
        this.isHighlight.value = false;
        break;
    }
  }
  onDestroy() {
    var _a, _b;
    (_b = (_a = this.config).onDestroy) == null ? void 0 : _b.call(_a);
  }
}
function animeToolConfigFactory(injector) {
  const query = injector.get(Query);
  const commander = injector.get(Commander);
  injector.get(Layout);
  const selection = injector.get(Selection);
  const animeUtilsProvider2 = injector.get(AnimeUtilsProvider);
  return {
    // options: [],
    keymap: {
      ctrlKey: true,
      key: "`"
    },
    queryState() {
      return query.queryFormat(animeFormatter);
    },
    useValue(state) {
      const component = selection.commonAncestorComponent;
      let parentComponent = component == null ? void 0 : component.parentComponent;
      while (parentComponent) {
        if (parentComponent && parentComponent.name === "RootComponent")
          break;
        if (parentComponent && parentComponent.name === "AnimeIgnoreComponent") {
          alert("无法在该组件内设置动画元素");
          return;
        }
        parentComponent = parentComponent.parentComponent;
      }
      const blocks = selection.getGreedyRanges();
      const isIgnore = blocks.some((block) => {
        var _a;
        return ((_a = block.slot.parent) == null ? void 0 : _a.name) === "AnimeIgnoreComponent";
      });
      if (isIgnore) {
        alert("无法在该组件内设置动画元素");
        return;
      }
      const dataSerial = animeUtilsProvider2.generateAnimeSerial().toString();
      const dataId = animeUtilsProvider2.generateAnimeId();
      commander.applyFormat(animeFormatter, {
        dataId,
        dataSerial,
        dataEffect: state.value,
        dataState: "",
        dataTitle: state.label
      });
    }
  };
}
function animeTool() {
  return new AnimeSegmentPopoverTool(animeToolConfigFactory);
}
function animeBadgeVisibleToolConfigFactory(injector, updateState) {
  const layout = injector.get(Layout);
  const container = layout.container;
  return {
    iconClasses: [`${MaterialTypeEnum.FILLED}bubble_chart`, `${MaterialTypeEnum.OUTLINED}bubble_chart`],
    // iconClasses: [`textbus-icon-bold`],
    // label: '隐藏标记',
    tooltip: "隐藏动画标记",
    onClick() {
      if (container.classList.contains("anime-badge-hidden")) {
        container.classList.remove("anime-badge-hidden");
        updateState({
          iconIndex: 0
        });
        return;
      }
      container.classList.add("anime-badge-hidden");
      updateState({
        iconIndex: 1
      });
    }
  };
}
function animeBadgeVisibleTool() {
  return new SwitchButtonTool(animeBadgeVisibleToolConfigFactory);
}
function animeElementVisibleToolConfigFactory(injector, updateState) {
  const layout = injector.get(Layout);
  const container = layout.container;
  return {
    iconClasses: [`${MaterialTypeEnum.FILLED}visibility`, `${MaterialTypeEnum.FILLED}visibility_off`],
    // label: '隐藏动画',
    tooltip: "隐藏动画元素",
    onClick() {
      if (container.classList.contains("anime-element-hidden")) {
        container.classList.remove("anime-element-hidden");
        updateState({
          iconIndex: 0
        });
        return;
      }
      container.classList.add("anime-element-hidden");
      updateState({
        iconIndex: 1
      });
    }
  };
}
function animeElementVisibleTool() {
  return new SwitchButtonTool(animeElementVisibleToolConfigFactory);
}
function animeIgnoreToolConfigFactory(injector) {
  const query = injector.get(Query);
  const commander = injector.get(Commander);
  const selection = injector.get(Selection);
  return {
    tooltip: "动画忽略",
    iconClasses: [`${MaterialTypeEnum.FILLED}select_all`],
    size: 24,
    queryState() {
      const animeIgnore = query.queryComponent(animeIgnoreComponent);
      return {
        state: animeIgnore.state,
        value: animeIgnore.state === QueryStateType.Enabled ? "ignore" : null
      };
    },
    onClick: () => {
      const component = selection.commonAncestorComponent;
      let parentComponent = component == null ? void 0 : component.parentComponent;
      while (parentComponent) {
        if (parentComponent && parentComponent.name === "RootComponent")
          break;
        if (parentComponent && parentComponent.name === "AnimeIgnoreComponent") {
          alert("动画忽略组件内部不能再嵌套动画忽略组件");
          return;
        }
        parentComponent = parentComponent.parentComponent;
      }
      commander.insert(animeIgnoreComponent.createInstance(injector));
    }
  };
}
function animeIgnoreTool() {
  return new ButtonTool$2(animeIgnoreToolConfigFactory);
}
function outlineToolConfigFactory(injector, updateState) {
  const outlineService = injector.get(OutlineService);
  return {
    iconClasses: [`${MaterialTypeEnum$1.FILLED}view_sidebar`],
    tooltip: "大纲视图",
    // label: '大纲视图',
    keymap: {
      ctrlKey: true,
      key: ";"
    },
    onClick() {
      outlineService.handleExpand();
      updateState({
        highlight: outlineService.isExpanded
      });
    }
  };
}
function outlineTool() {
  return new SwitchButtonTool(outlineToolConfigFactory);
}
const _hoisted_1$8 = {
  ref: "toolbarRef",
  class: "inline-toolbar"
};
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "InlineToolbarView",
  props: {
    cmpts: {}
  },
  setup(__props) {
    useCssVars((_ctx) => ({
      "3ff33d7c": unref(themeVars).baseColor
    }));
    const themeVars = useThemeVars();
    const props = __props;
    const toolbarData = computed(() => {
      return props.cmpts.map((item) => {
        item.key = UUID.v4();
        return item;
      });
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$8, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(toolbarData.value, (node) => {
          return openBlock(), createBlock(resolveDynamicComponent(node), {
            class: "tool-item",
            key: node.key
          });
        }), 128))
      ], 512);
    };
  }
});
const InlineToolbarView = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-12ced4d8"]]);
makeError("Toolbar");
class InlineToolbarPlugin {
  constructor(toolFactories = [], scroller) {
    __publicField(this, "toolbarRef");
    __publicField(this, "toolWrapper");
    __publicField(this, "subsA", []);
    __publicField(this, "subsB", []);
    __publicField(this, "tools");
    __publicField(this, "toolbarWidth");
    __publicField(this, "toolbarHeight");
    __publicField(this, "components", []);
    __publicField(this, "toolbarView", null);
    this.toolFactories = toolFactories;
    this.scroller = scroller;
    this.tools = this.toolFactories.map((i) => {
      return Array.isArray(i) ? i.map((j) => j()) : i();
    });
    this.toolbarWidth = 300;
    this.toolbarHeight = 50;
  }
  setup(injector) {
    const selection = injector.get(Selection);
    const layout = injector.get(Layout);
    injector.get(Renderer);
    const editor = injector.get(Editor);
    const nativeSelectionBridge = injector.get(SelectionBridge);
    const container = layout.container;
    this.toolbarRef = createElement("div", {
      classes: ["textbus-fast-toolbar"],
      children: [
        this.toolWrapper = createElement("div", {
          classes: ["textbus-fast-toolbar-wrapper"]
        })
      ]
    });
    this.tools.forEach((tool) => {
      if (Array.isArray(tool)) {
        const groupWrapper = [];
        tool.forEach((t) => {
          groupWrapper.push(t.setup(injector, this.toolWrapper));
        });
        this.components.push(h("div", { class: "group-wrapper" }, groupWrapper));
        return;
      }
      this.components.push(tool.setup(injector, this.toolWrapper));
    });
    this.toolbarView = createApp(h(_sfc_main$s, null, {
      default: () => h(InlineToolbarView, { cmpts: this.components })
    }));
    this.toolbarView.provide("injector", injector);
    this.toolbarView.mount(this.toolWrapper);
    this.subsA.push(
      selection.onChange.pipe(auditTime(300)).subscribe(() => {
        if (this.subsB.length === 0) {
          this.subsB.push(
            // 浏览器窗口缩放的时候更新（必要性不高）
            // fromEvent(window, 'resize').subscribe(() => {
            //   this.onSelectionChange(
            //     document,
            //     selection,
            //     nativeSelectionBridge,
            //     container
            //   )
            // }),
            fromEvent$1(container, "mouseup").pipe(auditTime(5)).subscribe(() => {
              this.onSelectionChange(
                document,
                selection,
                nativeSelectionBridge,
                container
              );
            }),
            /** 输入新内容时更新/关闭工具条 */
            editor.onChange.subscribe(() => {
              this.onSelectionChange(
                document,
                selection,
                nativeSelectionBridge,
                container
              );
            })
          );
        }
      })
    );
  }
  onDestroy() {
    var _a;
    this.subsA.forEach((i) => i.unsubscribe());
    this.subsB.forEach((i) => i.unsubscribe());
    this.components.length = 0;
    this.components = [];
    (_a = this.toolbarView) == null ? void 0 : _a.unmount();
    this.toolFactories.length = 0;
    this.toolFactories = [];
    this.tools.length = 0;
    this.tools = [];
  }
  onSelectionChange(document2, selection, bridge, container) {
    var _a;
    const nativeSelection = document2.getSelection();
    const firstNativeRange = nativeSelection.rangeCount ? nativeSelection.getRangeAt(0) : null;
    if (!nativeSelection.isCollapsed) {
      if (firstNativeRange) {
        const focusNode = firstNativeRange.commonAncestorContainer;
        if (focusNode) {
          const node = focusNode.nodeType === Node.TEXT_NODE ? focusNode.parentNode : focusNode;
          if (node) {
            const rect = bridge.getRect({
              slot: selection.startSlot,
              offset: selection.startOffset
            });
            const containerRect = container.getBoundingClientRect();
            const containerLeft = containerRect.left;
            const containerTop = containerRect.top;
            const containerRight = containerRect.right;
            const scrollerRect = this.scroller.getBoundingClientRect();
            let toolbarTop = rect.top - this.toolbarHeight;
            if (toolbarTop - scrollerRect.top < 0)
              toolbarTop = rect.top + rect.height;
            let toolbarLeft = rect.left;
            const toolbarRight = toolbarLeft + this.toolbarWidth;
            const coe = 23;
            if (toolbarRight > containerRight) {
              const offsetValue = toolbarRight - containerRight;
              toolbarLeft = toolbarLeft - offsetValue + coe;
            }
            Object.assign(this.toolbarRef.style, {
              left: toolbarLeft - containerLeft - coe + "px",
              top: toolbarTop - containerTop + "px"
            });
            if (!this.toolbarRef.parentNode) {
              container.appendChild(this.toolbarRef);
              this.toolbarWidth = this.toolWrapper.offsetWidth;
            }
            return;
          }
        }
      }
    } else {
      (_a = this.toolbarRef.parentNode) == null ? void 0 : _a.removeChild(this.toolbarRef);
    }
  }
}
class Clipboard {
  constructor() {
    __publicField(this, "subs", []);
    __publicField(this, "editorHost", null);
    __publicField(this, "toolbarHost", null);
    __publicField(this, "layout", null);
  }
  setup(injector) {
    this.layout = injector.get(Layout);
    this.editorHost = this.layout.container;
    const structurer = injector.get(Structurer);
    this.toolbarHost = structurer.toolbarRef;
  }
  onDestroy() {
    this.subs.forEach((i) => i.unsubscribe());
  }
}
class ContextMenu {
  constructor() {
    __publicField(this, "eventFromSelf", false);
    __publicField(this, "subs", []);
    __publicField(this, "menuSubscriptions", []);
    __publicField(this, "submenuSubscriptions", []);
    __publicField(this, "menu", null);
    __publicField(this, "submenu", null);
  }
  setup(injector) {
    const container = injector.get(VIEW_CONTAINER);
    const i18n = injector.get(I18n);
    const selection = injector.get(Selection);
    const commander = injector.get(Commander);
    const rootComponentRef = injector.get(RootComponentRef);
    const message = injector.get(Message);
    const parser = injector.get(Parser);
    const renderer2 = injector.get(Renderer);
    this.subs.push(
      fromEvent$1(document, "mousedown").subscribe(() => {
        this.hide();
      }),
      fromEvent$1(container, "contextmenu").subscribe((ev) => {
        const nativeSelection = document.getSelection();
        const focusNode = nativeSelection.focusNode;
        const offset = nativeSelection.focusOffset;
        const isCollapsed = nativeSelection.isCollapsed;
        setTimeout(() => {
          if (isCollapsed) {
            if (!nativeSelection.isCollapsed) {
              nativeSelection.collapse(focusNode, offset);
            }
          }
        });
        const menus = ContextMenu.makeContextmenu(ev.target, selection, renderer2);
        const defaultMenus = [{
          iconClasses: ["textbus-icon-copy"],
          label: i18n.get("editor.copy"),
          disabled: selection.isCollapsed,
          onClick: () => {
            commander.copy();
          }
        }, {
          iconClasses: ["textbus-icon-paste"],
          label: i18n.get("editor.paste"),
          // disabled: true,
          onClick: () => {
            navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
              console.log(result);
              if (result.state === "granted") {
                navigator.clipboard.read().then((items) => {
                  const item = items[0];
                  item.types.filter((i) => i === "text/html").forEach((type) => {
                    item.getType(type).then((blob) => {
                      return blob.text();
                    }).then((text) => {
                      const div = document.createElement("div");
                      div.innerHTML = text;
                      commander.paste(parser.parse(text, new Slot([
                        ContentType.BlockComponent,
                        ContentType.Text,
                        ContentType.InlineComponent
                      ])), div.innerText);
                    });
                  });
                });
              } else {
                message.danger(i18n.get("editor.input.canNotAccessClipboard"));
              }
            });
          }
        }, {
          iconClasses: ["textbus-icon-cut"],
          label: i18n.get("editor.cut"),
          disabled: selection.isCollapsed,
          onClick: () => {
            commander.cut();
          }
        }, {
          iconClasses: ["textbus-icon-select"],
          label: i18n.get("editor.selectAll"),
          onClick: () => {
            selection.selectAll();
          }
        }];
        this.menu = this.show(
          [
            ...menus,
            defaultMenus,
            [{
              label: i18n.get("editor.insertParagraphBefore"),
              iconClasses: ["textbus-icon-insert-paragraph-before"],
              disabled: selection.commonAncestorComponent === rootComponentRef.component,
              onClick: () => {
                const component = paragraphComponent$1.createInstance(injector);
                const ref2 = selection.commonAncestorComponent;
                if (ref2) {
                  commander.insertBefore(component, ref2);
                  selection.selectFirstPosition(component);
                }
              }
            }, {
              label: i18n.get("editor.insertParagraphAfter"),
              iconClasses: ["textbus-icon-insert-paragraph-after"],
              disabled: selection.commonAncestorComponent === rootComponentRef.component,
              onClick: () => {
                const component = paragraphComponent$1.createInstance(injector);
                const ref2 = selection.commonAncestorComponent;
                if (ref2) {
                  commander.insertAfter(component, ref2);
                  selection.selectFirstPosition(component);
                }
              }
            }]
          ],
          ev.clientX,
          ev.clientY,
          this.menuSubscriptions
        );
        ev.preventDefault();
      })
    );
  }
  destroy() {
    this.hide();
    this.subs.forEach((i) => i.unsubscribe());
    this.subs = [];
  }
  static makeContextmenu(source, selection, renderer2) {
    const startSlot = selection.startSlot;
    if (!startSlot) {
      return [];
    }
    let component = null;
    do {
      const location = renderer2.getLocationByNativeNode(source);
      if (location) {
        const current = location.slot.getContentAtIndex(location.startIndex);
        if (location.endIndex - location.startIndex === 1 && typeof current === "object") {
          component = current;
        } else {
          component = location.slot.parent;
        }
        break;
      } else {
        source = source.parentNode;
      }
    } while (source);
    if (!component) {
      component = selection.commonAncestorComponent;
    }
    if (!component) {
      return [];
    }
    return triggerContextMenu(component);
  }
  hide() {
    var _a, _b, _c, _d;
    this.menuSubscriptions.forEach((i) => i.unsubscribe());
    this.menuSubscriptions = [];
    (_b = (_a = this.menu) == null ? void 0 : _a.parentNode) == null ? void 0 : _b.removeChild(this.menu);
    (_d = (_c = this.submenu) == null ? void 0 : _c.parentNode) == null ? void 0 : _d.removeChild(this.submenu);
  }
  show(menus, x, y, subs) {
    let groups;
    const container = createElement("div", {
      classes: ["textbus-contextmenu"],
      children: [
        createElement("div", {
          classes: ["textbus-contextmenu-container"],
          children: [
            groups = createElement("div", {
              classes: ["textbus-contextmenu-groups"]
            })
          ]
        })
      ]
    });
    subs.push(
      fromEvent$1(container, "contextmenu").subscribe((ev) => {
        ev.preventDefault();
      }),
      fromEvent$1(document, "mousedown").subscribe(() => {
        if (!this.eventFromSelf) {
          this.hide();
        }
      }),
      fromEvent$1(window, "resize").subscribe(() => {
        setPosition();
      })
    );
    const setPosition = () => {
      const clientWidth = document.documentElement.clientWidth;
      const clientHeight = document.documentElement.clientHeight;
      if (x + menuWidth >= clientWidth) {
        x -= menuWidth;
      }
      if (y + menuHeight >= clientHeight - 20) {
        y = clientHeight - menuHeight - 20;
      }
      if (y < 20) {
        y = 20;
      }
      Object.assign(container.style, {
        left: x + "px",
        top: y + "px"
      });
      container.style.maxHeight = clientHeight - y - 20 + "px";
    };
    let itemCount = 0;
    const wrappers = [];
    menus.forEach((actions) => {
      itemCount += actions.length;
      if (actions.length === 0) {
        return;
      }
      groups.appendChild(createElement("div", {
        classes: ["textbus-contextmenu-group"],
        children: actions.map((item) => {
          if (Array.isArray(item.submenu)) {
            return {
              ...ContextMenu.createMenuView(item, true),
              item
            };
          }
          return {
            ...ContextMenu.createMenuView(item),
            item
          };
        }).map((i) => {
          const { wrapper, btn, item } = i;
          wrappers.push(wrapper);
          subs.push(
            fromEvent$1(btn, "mouseenter").subscribe(() => {
              var _a;
              if (item.disabled) {
                return;
              }
              if (subs === this.menuSubscriptions) {
                if (this.submenu) {
                  (_a = this.submenu.parentNode) == null ? void 0 : _a.removeChild(this.submenu);
                  this.submenuSubscriptions.forEach((i2) => i2.unsubscribe());
                  this.submenuSubscriptions = [];
                }
                wrappers.forEach((i2) => i2.classList.remove("textbus-contextmenu-item-active"));
                if (Array.isArray(item.submenu)) {
                  const rect = wrapper.getBoundingClientRect();
                  const submenu = this.show(
                    [item.submenu],
                    rect.left + rect.width,
                    rect.top,
                    this.submenuSubscriptions
                  );
                  wrapper.classList.add("textbus-contextmenu-item-active");
                  this.submenu = submenu;
                }
              }
            })
          );
          if (!item.disabled && typeof item.onClick === "function") {
            btn.addEventListener("mousedown", (ev) => {
              this.eventFromSelf = true;
              ev.stopPropagation();
            });
            btn.addEventListener("click", () => {
              this.hide();
              item.onClick();
              this.eventFromSelf = false;
            });
          }
          return i.wrapper;
        })
      }));
    });
    const menuWidth = 180 + 10;
    const menuHeight = itemCount * 26 + menus.length * 10 + menus.length + 10;
    setPosition();
    document.body.appendChild(container);
    return container;
  }
  static createMenuView(item, isHostNode = false) {
    const btn = createElement("button", {
      attrs: {
        type: "button"
      },
      classes: ["textbus-contextmenu-item-btn"],
      props: {
        disabled: item.disabled
      },
      children: [
        createElement("span", {
          classes: ["textbus-contextmenu-item-icon"],
          children: [
            createElement("span", {
              classes: item.iconClasses || []
            })
          ]
        }),
        createElement("span", {
          classes: ["textbus-contextmenu-item-label"],
          children: [createTextNode(item.label)]
        }),
        isHostNode ? createElement("span", {
          classes: ["textbus-contextmenu-item-arrow"]
        }) : null
      ]
    });
    const wrapper = createElement("div", {
      classes: item.disabled ? ["textbus-contextmenu-item", "textbus-contextmenu-item-disabled"] : ["textbus-contextmenu-item"],
      children: [
        btn
      ]
    });
    return {
      wrapper,
      btn
    };
  }
}
const _hoisted_1$7 = {
  ref: "toolRef",
  class: "tool"
};
const _hoisted_2$2 = { class: "left-btn-txt" };
const _hoisted_3$2 = ["onClick", "onMouseenter"];
const _hoisted_4$1 = { class: "option-label" };
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "AddAnimeTool",
  setup(__props) {
    const injector = inject("injector");
    const anime2 = injector.get(AnimeProvider);
    const animeOptions = anime2.getOptions();
    const addAnimeService = injector.get(AddAnimeService);
    const animeUtilsProvider2 = injector.get(AnimeUtilsProvider);
    const structurer = injector.get(Structurer);
    const commander = injector.get(Commander);
    const renderer2 = injector.get(Renderer);
    const layout = injector.get(Layout);
    const editor = injector.get(Editor);
    const container = layout.container;
    const scrollerRef = structurer.scrollerRef;
    const caretRef = ref();
    const triggerRef = ref();
    const isPopoverShow = ref(false);
    let currentElement = null;
    let currentComponent = null;
    const position = reactive({
      left: 0,
      top: 0,
      show: false
    });
    const exclude = ["RootComponent", "ParagraphComponent", "BlockComponent", "AnimeIgnoreComponent", ANIME_COMPONENT_NAME];
    const subscription = addAnimeService.onComponentActive.subscribe((component) => {
      var _a;
      if (editor.readonly) {
        position.show = false;
        isPopoverShow.value = false;
        return;
      }
      if (!component) {
        position.show = false;
        isPopoverShow.value = false;
        return;
      }
      isPopoverShow.value = false;
      if (exclude.includes(component.name)) {
        if (component.parentComponent) {
          if (exclude.includes((_a = component.parentComponent) == null ? void 0 : _a.name)) {
            return;
          }
          component = component.parentComponent;
        }
      }
      let parentComponent = component.parentComponent;
      while (parentComponent) {
        if (parentComponent && parentComponent.name === "RootComponent")
          break;
        if (parentComponent && parentComponent.name === "AnimeIgnoreComponent")
          return;
        parentComponent = parentComponent.parentComponent;
      }
      if ([ContentType.InlineComponent, ContentType.Text].includes(component.type))
        return;
      if (component.parentComponent && component.parentComponent.name === "AnimeComponent")
        return;
      const vNode = renderer2.getVNodeByComponent(component);
      const nativeNode = renderer2.getNativeNodeByVNode(vNode);
      const containerRect = container.getBoundingClientRect();
      const rect = nativeNode.getBoundingClientRect();
      const top = rect.top - containerRect.top;
      position.left = nativeNode.offsetLeft;
      position.top = top;
      position.show = true;
      currentComponent = component;
      currentElement = nativeNode;
    });
    const currentOption = reactive({
      effect: animeOptions[0].value,
      title: animeOptions[0].label
    });
    const offsetVal = computed(() => {
      return currentOption.title.length * 14;
    });
    function addAnime(componentInstance) {
      if (!componentInstance)
        return;
      const id = animeUtilsProvider2.generateAnimeId();
      const serial = animeUtilsProvider2.generateAnimeSerial().toString();
      try {
        const slot = new Slot([ContentType.BlockComponent]);
        const anime22 = animeComponent.createInstance(injector, {
          slots: [slot],
          state: {
            dataId: id,
            dataEffect: currentOption.effect,
            dataSerial: serial.toString(),
            dataState: "",
            dataTitle: currentOption.title
          }
        });
        commander.replaceComponent(componentInstance, anime22);
        slot.insert(componentInstance);
      } catch (error) {
        console.log(error);
      }
    }
    function handleClick() {
      if (currentComponent) {
        addAnime(currentComponent);
      }
      position.show = false;
      isPopoverShow.value = false;
      currentComponent = null;
    }
    function handleSelect(option) {
      currentOption.effect = option.value;
      currentOption.title = option.label;
      if (currentComponent) {
        addAnime(currentComponent);
      }
      position.show = false;
      isPopoverShow.value = false;
      currentComponent = null;
    }
    function handleMouseMove() {
      position.show = true;
      if (currentElement)
        currentElement.style.outline = "1px dashed #aaaaaa30";
    }
    function handleMouseLeave() {
      if (currentElement)
        currentElement.style.outline = "none";
    }
    function handleClickoutside(ev) {
      if (caretRef.value === ev.target) {
        return;
      }
      position.show = false;
      isPopoverShow.value = false;
    }
    onUnmounted(() => {
      subscription.unsubscribe();
    });
    return (_ctx, _cache) => {
      const _component_n_popover = resolveComponent("n-popover");
      return openBlock(), createBlock(unref(_sfc_main$s), null, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1$7, [
            createBaseVNode("div", {
              ref: "btnRef",
              class: "tool-btn",
              style: normalizeStyle({
                left: position.left - offsetVal.value + "px",
                top: position.top + "px",
                opacity: position.show && unref(currentComponent) ? 1 : 0,
                scale: position.show && unref(currentComponent) ? 1 : 0
              }),
              onMousemove: handleMouseMove,
              onMouseleave: handleMouseLeave
            }, [
              createVNode(_component_n_popover, {
                trigger: "click",
                placement: "right",
                raw: true,
                to: unref(scrollerRef) || false,
                "show-arrow": false,
                show: isPopoverShow.value,
                style: {
                  marginLeft: "0!important",
                  borderRadius: "6px"
                },
                onClickoutside: handleClickoutside
              }, {
                trigger: withCtx(() => [
                  createBaseVNode("div", {
                    class: "trigger",
                    ref_key: "triggerRef",
                    ref: triggerRef
                  }, [
                    createBaseVNode("div", {
                      class: "left-btn",
                      onClick: _cache[0] || (_cache[0] = ($event) => handleClick())
                    }, [
                      createBaseVNode("span", _hoisted_2$2, toDisplayString(currentOption.title), 1)
                    ]),
                    createBaseVNode("div", {
                      class: "right-btn",
                      ref_key: "caretRef",
                      ref: caretRef,
                      onClick: _cache[1] || (_cache[1] = ($event) => isPopoverShow.value = !isPopoverShow.value)
                    }, [
                      createVNode(unref(UIIcon$1), {
                        class: normalizeClass(["caret", isPopoverShow.value ? "active" : ""]),
                        icon: "textbus-dropdown-caret"
                      }, null, 8, ["class"])
                    ], 512)
                  ], 512)
                ]),
                default: withCtx(() => [
                  createBaseVNode("div", {
                    class: "content",
                    onMousemove: handleMouseMove,
                    onMouseleave: handleMouseLeave
                  }, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(unref(animeOptions), (option) => {
                      return openBlock(), createElementBlock("div", {
                        key: option.value,
                        class: normalizeClass(["option"]),
                        onClick: ($event) => handleSelect(option),
                        onMouseenter: withModifiers(($event) => option.applyEffect($event.target.firstChild), ["self"])
                      }, [
                        createBaseVNode("div", _hoisted_4$1, toDisplayString(option.label), 1)
                      ], 40, _hoisted_3$2);
                    }), 128))
                  ], 32)
                ]),
                _: 1
              }, 8, ["to", "show"])
            ], 36)
          ], 512)
        ]),
        _: 1
      });
    };
  }
});
const AddAnimeTool = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-4e1849e8"]]);
class AnimeComponentSupport {
  constructor() {
    // private commander!: Commander;
    // private selection!: Selection;
    // private renderer!: Renderer;
    __publicField(this, "app", null);
    __publicField(this, "host", null);
    __publicField(this, "viewDocument", null);
  }
  setup(injector) {
    this.app = createApp(AddAnimeTool).provide("injector", injector);
    this.viewDocument = injector.get(VIEW_DOCUMENT);
    this.host = document.createElement("div");
    this.viewDocument.appendChild(this.host);
    this.app.mount(this.host);
  }
  onDestroy() {
    var _a;
    (_a = this.app) == null ? void 0 : _a.unmount();
    if (this.viewDocument && this.host) {
      this.viewDocument.removeChild(this.host);
    }
  }
}
const _hoisted_1$6 = { class: "tools" };
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "ControllerView",
  props: {
    cmpts: {}
  },
  setup(__props) {
    const injector = inject("injector");
    const player = injector.get(Player);
    const props = __props;
    elementResizeDetector$1();
    useThemeVars();
    const controllerData = ref([]);
    const controllerRef = ref(null);
    onBeforeMount(() => {
      controllerData.value = props.cmpts.map((vnode) => {
        vnode.key = UUID.v4();
        return vnode;
      });
    });
    const subs = [];
    const isPlaying = ref(false);
    onMounted(() => {
      subs.push(
        player.onStateUpdate.subscribe(() => {
          if (player.isPlaying || player.isPause) {
            isPlaying.value = true;
          }
        }),
        player.onPlayOver.subscribe(() => {
          isPlaying.value = false;
        })
      );
    });
    onUnmounted(() => {
      subs.forEach((sub) => sub.unsubscribe());
      controllerData.value = [];
    });
    return (_ctx, _cache) => {
      return isPlaying.value ? (openBlock(), createElementBlock("div", {
        key: 0,
        ref_key: "controllerRef",
        ref: controllerRef,
        class: "controller"
      }, [
        createBaseVNode("div", _hoisted_1$6, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(controllerData.value, (node) => {
            return openBlock(), createBlock(resolveDynamicComponent(node), {
              class: "tool-item",
              key: node.key
            });
          }), 128))
        ])
      ], 512)) : createCommentVNode("", true);
    };
  }
});
const ControllerView$1 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-4f71b30d"]]);
makeError("Toolbar");
class PreviewPlayerController {
  constructor(toolFactories = [], host) {
    __publicField(this, "subs", []);
    __publicField(this, "tools");
    __publicField(this, "components", []);
    __publicField(this, "app", null);
    this.host = host;
    this.tools = toolFactories.map((i) => {
      return Array.isArray(i) ? i.map((j) => j()) : i();
    });
  }
  setup(injector) {
    const player = injector.get(Player);
    this.tools.forEach((tool) => {
      if (Array.isArray(tool)) {
        const groupWrapper = [];
        tool.forEach((t) => {
          groupWrapper.push(t.setup(injector, this.host));
        });
        this.components.push(h("div", { class: "group-wrapper" }, groupWrapper));
        return;
      }
      this.components.push(tool.setup(injector, this.host));
    });
    this.app = createApp(h(_sfc_main$s, null, {
      default: () => h(ControllerView$1, { cmpts: this.components })
    }));
    this.app.provide("injector", injector);
    this.app.mount(this.host);
    const tools = this.tools.flat();
    this.subs.push(
      player.onStateUpdate.subscribe(() => {
        tools.forEach((tool) => {
          tool.refreshState();
        });
      })
    );
  }
  onDestroy() {
    var _a;
    this.tools.length = 0;
    this.tools = [];
    this.components.length = 0;
    this.components = [];
    (_a = this.app) == null ? void 0 : _a.unmount();
    this.subs.forEach((i) => i.unsubscribe());
    this.host = null;
  }
}
const _hoisted_1$5 = ["data-keymap", "title"];
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "UIButton",
  props: {
    iconClasses: {},
    iconIndex: { type: Function },
    iconSize: {},
    tooltip: {},
    onClick: { type: Function },
    keymap: {},
    highlight: { type: Function },
    disabled: { type: Function }
  },
  setup(__props) {
    useCssVars((_ctx) => ({
      "cf5c1654": unref(themeVars).buttonColor2Hover,
      "770f593c": unref(themeVars).buttonColor2Pressed
    }));
    const themeVars = useThemeVars();
    const props = __props;
    const state = reactive({
      highlight: computed(() => {
        var _a;
        return (_a = props.highlight) == null ? void 0 : _a.call(props);
      }),
      disabled: computed(() => {
        var _a;
        return (_a = props.disabled) == null ? void 0 : _a.call(props);
      }),
      iconIndex: computed(() => {
        var _a;
        return (_a = props.iconIndex) == null ? void 0 : _a.call(props);
      })
    });
    function handleClick() {
      props.onClick && props.onClick();
    }
    return (_ctx, _cache) => {
      const _component_n_button = resolveComponent("n-button");
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["button-tool", state.highlight ? "active" : ""]),
        "data-keymap": JSON.stringify(_ctx.keymap),
        title: _ctx.tooltip,
        onClick: handleClick
      }, [
        createVNode(_component_n_button, {
          class: "btn",
          block: "",
          text: "",
          size: "large",
          disabled: state.disabled
        }, {
          default: withCtx(() => {
            var _a;
            return [
              ((_a = _ctx.iconClasses) == null ? void 0 : _a.length) ? (openBlock(), createBlock(unref(UIIcon$1), {
                key: 0,
                icon: _ctx.iconClasses ? _ctx.iconClasses[state.iconIndex || 0] : "",
                size: _ctx.iconSize || 24
              }, null, 8, ["icon", "size"])) : createCommentVNode("", true)
            ];
          }),
          _: 1
        }, 8, ["disabled"])
      ], 10, _hoisted_1$5);
    };
  }
});
const UIButton$1 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-9b9feecc"]]);
let ButtonTool$1 = class ButtonTool2 {
  // params: Writable<UIButtonDefineProps> = {}
  constructor(factory) {
    __publicField(this, "config");
    __publicField(this, "controller");
    __publicField(this, "isHighlight");
    __publicField(this, "isDisabled");
    __publicField(this, "iconIndex");
    this.factory = factory;
    this.isHighlight = ref(false);
    this.isDisabled = ref(false);
    this.iconIndex = ref(0);
  }
  setup(injector) {
    this.config = this.factory(injector);
    this.controller = injector.get(Controller$1);
    this.isDisabled.value = this.config.disabled || false;
    const keyboard = injector.get(Keyboard);
    const viewer = h(UIButton$1, {
      ...this.config,
      iconIndex: () => this.iconIndex.value,
      highlight: () => this.isHighlight.value,
      disabled: () => this.isDisabled.value
    });
    if (this.config.keymap) {
      keyboard.addShortcut({
        keymap: this.config.keymap,
        action: () => {
          this.config.onClick();
        }
      });
    }
    return viewer;
  }
  refreshState() {
    if (this.config.updateState) {
      const state = this.config.updateState();
      if (!state)
        return;
      this.iconIndex.value = state.iconIndex === void 0 ? 0 : state.iconIndex;
      this.isDisabled.value = state.disabled === void 0 ? false : state.disabled;
    }
  }
  disabled(is) {
    if (is) {
      this.isDisabled.value = true;
      this.isHighlight.value = false;
    }
  }
  onDestroy() {
    var _a, _b;
    (_b = (_a = this.config).onDestroy) == null ? void 0 : _b.call(_a);
  }
};
function startToolConfigFactory$1(injector) {
  const player = injector.get(Player);
  return {
    iconClasses: [`${MaterialTypeEnum$1.FILLED}play_arrow`, `${MaterialTypeEnum$1.FILLED}pause`],
    tooltip: "开始",
    keymap: {
      ctrlKey: true,
      key: "1"
    },
    updateState() {
      return { iconIndex: player.isPlaying ? 1 : 0 };
    },
    onClick() {
      if (!player.isPlaying && !player.isPause)
        return player.start();
      if (player.isPlaying && !player.isPause)
        return player.pause();
      if (!player.isPlaying && player.isPause)
        return player.resume();
    }
  };
}
function preview_startTool() {
  return new ButtonTool$1(startToolConfigFactory$1);
}
function rewindToolConfigFactory$1(injector) {
  const player = injector.get(Player);
  return {
    iconClasses: [`${MaterialTypeEnum$1.FILLED}replay_5`],
    tooltip: "倒退",
    // keymap: {
    //   ctrlKey: true,
    //   key: '1'
    // },
    updateState() {
      return {};
    },
    onClick() {
      player.rewind();
    }
  };
}
function preview_rewindTool() {
  return new ButtonTool$1(rewindToolConfigFactory$1);
}
function forwardToolConfigFactory$1(injector) {
  const player = injector.get(Player);
  return {
    iconClasses: [`${MaterialTypeEnum$1.FILLED}forward_5`],
    tooltip: "快进",
    // keymap: {
    //   ctrlKey: true,
    //   key: '1'
    // },
    updateState() {
      return {};
    },
    onClick() {
      player.forward();
    }
  };
}
function preview_forwardTool() {
  return new ButtonTool$1(forwardToolConfigFactory$1);
}
function stopToolConfigFactory$1(injector) {
  const player = injector.get(Player);
  return {
    iconClasses: [`${MaterialTypeEnum$1.FILLED}stop`],
    tooltip: "停止",
    disabled: true,
    // keymap: {
    //   ctrlKey: true,
    //   key: '1'
    // },
    updateState() {
      return { disabled: !(player.isPlaying === false && player.isPause === true || player.isPlaying === true && player.isPause === false) };
    },
    onClick() {
      player.stop();
    }
  };
}
function preview_stopTool() {
  return new ButtonTool$1(stopToolConfigFactory$1);
}
const _hoisted_1$4 = { class: "effect-options" };
const _hoisted_2$1 = { class: "effect-options-list" };
const _hoisted_3$1 = ["onClick", "onMouseenter"];
const _hoisted_4 = { class: "option-label" };
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "AnimeEffectOptions",
  props: {
    options: {},
    onSelect: { type: Function }
  },
  setup(__props) {
    const props = __props;
    function handleSelect(option) {
      props.onSelect(option.label, option.value);
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$4, [
        createBaseVNode("div", _hoisted_2$1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.options, (option) => {
            return openBlock(), createElementBlock("div", {
              key: option.value,
              class: normalizeClass(["option"]),
              onClick: ($event) => handleSelect(option),
              onMouseenter: withModifiers(($event) => option.applyEffect($event.target.firstChild), ["self"])
            }, [
              createBaseVNode("div", _hoisted_4, toDisplayString(option.label), 1)
            ], 40, _hoisted_3$1);
          }), 128))
        ])
      ]);
    };
  }
});
const AnimeEffectOptions = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-1f0fa8c6"]]);
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "Dropdown",
  props: {
    show: { type: Function },
    x: { type: Function },
    y: { type: Function },
    options: { type: Function },
    to: {}
  },
  emits: ["select", "clickoutside"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const state = reactive({
      show: computed(() => {
        var _a;
        return (_a = props.show) == null ? void 0 : _a.call(props);
      }),
      x: computed(() => {
        var _a;
        return (_a = props.x) == null ? void 0 : _a.call(props);
      }),
      y: computed(() => {
        var _a;
        return (_a = props.y) == null ? void 0 : _a.call(props);
      }),
      options: computed(() => {
        var _a;
        return (_a = props.options) == null ? void 0 : _a.call(props);
      })
    });
    const emits = __emit;
    return (_ctx, _cache) => {
      const _component_n_dropdown = resolveComponent("n-dropdown");
      return openBlock(), createBlock(unref(_sfc_main$s), null, {
        default: withCtx(() => [
          createVNode(_component_n_dropdown, {
            show: state.show,
            placement: "bottom-start",
            options: state.options,
            to: _ctx.to,
            x: state.x,
            y: state.y,
            onClickoutside: _cache[0] || (_cache[0] = ($event) => emits("clickoutside")),
            onSelect: _cache[1] || (_cache[1] = ($event) => emits("select"))
          }, null, 8, ["show", "options", "to", "x", "y"])
        ]),
        _: 1
      });
    };
  }
});
class AnimeContextmenuPlugin {
  constructor() {
    __publicField(this, "commander");
    __publicField(this, "selection");
    __publicField(this, "renderer");
    __publicField(this, "subs", []);
    __publicField(this, "contextmenu", null);
    __publicField(this, "anime");
    __publicField(this, "animeOptions", []);
    __publicField(this, "scrollSubscription", null);
    __publicField(this, "injector");
    __publicField(this, "container", null);
    __publicField(this, "scrollerRef", null);
    __publicField(this, "showRef", ref(false));
    __publicField(this, "xRef", ref(0));
    __publicField(this, "yRef", ref(0));
    __publicField(this, "Options", ref([]));
    __publicField(this, "host", null);
  }
  setup(injector) {
    this.injector = injector;
    this.commander = injector.get(Commander);
    this.selection = injector.get(Selection);
    this.renderer = injector.get(Renderer);
    this.anime = injector.get(AnimeProvider);
    this.animeOptions = this.anime.getOptions();
    const structurer = this.injector.get(Structurer);
    this.container = this.injector.get(VIEW_CONTAINER);
    this.scrollerRef = structurer.scrollerRef;
    this.host = createElement("div");
    this.contextmenu = createApp(_sfc_main$4, {
      show: () => this.showRef.value,
      x: () => this.xRef.value,
      y: () => this.yRef.value,
      options: () => this.Options.value,
      to: this.scrollerRef,
      onSelect: () => {
        this.hide();
      },
      onClickoutside: () => {
        this.hide();
      }
    });
    this.contextmenu.provide("injector", injector);
    this.contextmenu.mount(this.host);
    this.subs.push(
      fromEvent(this.container, "contextmenu").subscribe((ev) => {
        const target = ev.target;
        if (target.tagName.toLocaleLowerCase() === "anime") {
          ev.preventDefault();
          ev.stopPropagation();
          const { x, y, options } = this.createFormatMenu(target);
          this.xRef.value = x;
          this.yRef.value = y;
          this.Options.value = options;
          this.show();
        }
        if (target.classList.contains("anime-component-tab")) {
          const node = target.parentElement;
          if ((node == null ? void 0 : node.tagName.toLocaleLowerCase()) === "anime-component") {
            ev.preventDefault();
            ev.stopPropagation();
            const component = this.renderer.getComponentByNativeNode(node);
            if (component) {
              const { x, y, options } = this.createComponentMenu(target, component);
              this.xRef.value = x;
              this.yRef.value = y;
              this.Options.value = options;
              this.show();
            }
          }
        }
      }),
      // 滚动时隐藏菜单
      fromEvent(this.scrollerRef, "scroll").subscribe(() => {
        this.hide();
      })
    );
  }
  show() {
    var _a;
    this.showRef.value = true;
    this.host && ((_a = this.container) == null ? void 0 : _a.appendChild(this.host));
  }
  hide() {
    var _a, _b;
    this.showRef.value = false;
    (_b = (_a = this.host) == null ? void 0 : _a.parentNode) == null ? void 0 : _b.removeChild(this.host);
  }
  createFormatMenu(target) {
    const { x, y } = getTextNodeEndPosition(target);
    const position = {
      x: x + 10,
      y
    };
    const menus = [
      {
        key: "remove",
        // icon: () => h(UIIcon, { icon: 'material-icons-filled-' }),
        label: "移除",
        props: {
          onClick: () => {
            this.removeAnimeFormatter(target);
          }
        }
      },
      {
        key: "update",
        // icon: () => h(UIIcon, { icon: 'material-icons-filled-' }),
        label: "修改",
        children: [
          {
            key: "options",
            type: "render",
            render: () => h(AnimeEffectOptions, {
              options: this.animeOptions,
              onSelect: (name, value) => {
                this.updataAnimeFormatter(target, { name, value });
                this.hide();
              }
            })
          }
        ]
      },
      {
        key: "test",
        label: "动画效果预览",
        props: {
          onClick: () => {
            const dataEffect = target.dataset.effect;
            this.playAnime(target, dataEffect);
          }
        }
      }
    ];
    return { x: position.x, y: position.y, options: menus };
  }
  createComponentMenu(target, component) {
    const rect = target.getBoundingClientRect();
    const position = {
      x: rect.x + rect.width,
      y: rect.y
    };
    const menus = [
      {
        key: "remove",
        // icon: () => h(UIIcon, { icon: 'material-icons-filled-' }),
        label: "移除",
        props: {
          onClick: () => {
            this.removeAnimeComponent(component);
          }
        }
      },
      {
        key: "update",
        // icon: () => h(UIIcon, { icon: 'material-icons-filled-' }),
        label: "修改",
        children: [
          {
            key: "options",
            type: "render",
            render: () => h(AnimeEffectOptions, {
              options: this.animeOptions,
              onSelect: (name, value) => {
                this.updataAnimeComponent(component, { name, value });
                this.hide();
              }
            })
          }
        ]
      },
      {
        key: "test",
        label: "动画效果预览",
        props: {
          onClick: () => {
            const dataEffect = component.state.dataEffect;
            const vnode = this.renderer.getVNodeByComponent(component);
            const nativeNode = this.renderer.getNativeNodeByVNode(vnode);
            this.playAnime(nativeNode, dataEffect);
          }
        }
      }
    ];
    return { x: position.x, y: position.y, options: menus };
  }
  /** 更新动画特效 */
  updataAnimeFormatter(dom, option) {
    const location = this.renderer.getLocationByNativeNode(dom);
    if (location) {
      this.selection.setAnchor(location.slot, location.startIndex);
      this.selection.setFocus(location.slot, location.endIndex);
      const dataId = dom.dataset.id;
      const dataSerial = dom.dataset.serial;
      const dataState = dom.dataset.state;
      this.commander.applyFormat(animeFormatter, {
        dataId,
        dataSerial,
        dataState,
        dataEffect: option.value,
        dataTitle: option.name
      });
    }
  }
  updataAnimeComponent(component, option) {
    component.updateState((draft) => {
      draft.dataEffect = option.value;
      draft.dataTitle = option.name;
    });
  }
  /** 移除动画标记 */
  removeAnimeFormatter(dom) {
    const location = this.renderer.getLocationByNativeNode(dom);
    if (location) {
      this.selection.setAnchor(location.slot, location.startIndex);
      this.selection.setFocus(location.slot, location.endIndex);
      this.commander.unApplyFormat(animeFormatter);
    }
  }
  removeAnimeComponent(component) {
    component.slots.toArray().forEach((slot) => {
      slot.sliceContent().forEach((content) => {
        if (typeof content !== "string") {
          this.commander.replaceComponent(component, content);
        }
      });
    });
  }
  /** 测试动画效果 */
  playAnime(target, effect) {
    const display = target.style.display;
    target.style.display = "block";
    const anime2 = this.anime.getAnime(effect);
    if (anime2) {
      anime2.applyEffect(target).finished.then(() => {
        target.style.display = display;
      });
    } else {
      target.style.display = display;
    }
  }
  // 可选，编辑器销毁时调用
  onDestroy() {
    var _a;
    console.log("anime contextmenu 销毁");
    this.subs.forEach((sub) => sub.unsubscribe());
    (_a = this.contextmenu) == null ? void 0 : _a.unmount();
    this.animeOptions = [];
    this.hide();
    this.host = null;
  }
}
function getTextNodeEndPosition(element) {
  const lastChild = element.lastChild;
  if (!lastChild) {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.x + rect.width,
      y: rect.y
    };
  }
  if (lastChild.nodeType === Node.TEXT_NODE) {
    const range = document.createRange();
    range.setStart(lastChild, lastChild.length);
    range.setEnd(lastChild, lastChild.length);
    const rect = range.getBoundingClientRect();
    return {
      x: rect.x + rect.width,
      y: rect.y
    };
  } else {
    return getTextNodeEndPosition(lastChild);
  }
}
class AnimeClickPlugin {
  constructor() {
    __publicField(this, "commander");
    __publicField(this, "selection");
    __publicField(this, "renderer");
    __publicField(this, "subs", []);
    __publicField(this, "injector");
    __publicField(this, "document", null);
  }
  setup(injector) {
    this.injector = injector;
    this.commander = injector.get(Commander);
    this.selection = injector.get(Selection);
    this.renderer = injector.get(Renderer);
    injector.get(Layout);
    this.injector.get(Structurer);
    this.document = this.injector.get(VIEW_DOCUMENT);
    this.subs.push(
      fromEvent(this.document, "click").subscribe((ev) => {
        const target = ev.target;
        if (target.tagName.toLocaleLowerCase() === "anime") {
          ev.preventDefault();
          ev.stopPropagation();
        }
        if (target.classList.contains("anime-component-tab")) {
          const node = target.parentElement;
          if ((node == null ? void 0 : node.tagName.toLocaleLowerCase()) === "anime-component") {
            ev.preventDefault();
            ev.stopPropagation();
            this.renderer.getComponentByNativeNode(node);
          }
        }
      })
    );
  }
  // 可选，编辑器销毁时调用
  onDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
const _hoisted_1$3 = {
  ref: "toolRef",
  class: "tool"
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "ContextmenuTool",
  setup(__props) {
    const injector = inject("injector");
    const rootEvent = injector.get(RootEventService);
    const player = injector.get(Player);
    const subs = [];
    let currentElement = null;
    let animeElements = ref([]);
    const position = reactive({
      x: 0,
      y: 0,
      show: false
    });
    subs.push(
      rootEvent.onComponentContextmenu.subscribe((ev) => {
        var _a;
        if (!ev)
          return;
        position.show = false;
        nextTick().then(() => {
          position.show = true;
          position.x = ev.clientX;
          position.y = ev.clientY;
        });
        let nativeNode = ev.target;
        while (nativeNode) {
          if ((_a = nativeNode.parentElement) == null ? void 0 : _a.classList.contains("tb-root")) {
            currentElement = nativeNode;
          }
          if (nativeNode.classList.contains("tb-root")) {
            break;
          }
          if (["anime", "anime-component"].includes(nativeNode.tagName.toLocaleLowerCase())) {
            const animeId = nativeNode.dataset.id;
            if (animeId)
              animeElements.value.push(animeId);
          }
          nativeNode = nativeNode.parentNode;
        }
        if (animeElements.value.length > 0) {
          ev.preventDefault();
        }
        setActive();
        getOptions();
      })
    );
    const options = ref([]);
    function getOptions() {
      const sourceData = player.sourceData[0];
      const sequence = sourceData.keyframeSequence.map((keyframe, index) => {
        if (animeElements.value.includes(sourceData.promoterSequence[index])) {
          return { keyframe, index };
        }
        return null;
      });
      const points = sequence.filter((i) => i !== null);
      options.value = [
        {
          key: "play-here",
          label: "从此位置播放",
          show: points.length > 0,
          children: [
            ...points.map((point) => {
              return {
                key: _.uniqueId(),
                label: dayjs().set("minute", point.keyframe / 60).set("second", point.keyframe % 60).format("mm:ss"),
                props: {
                  onClick: () => {
                    player.startHere(point.keyframe, point.index);
                    setInactive();
                  }
                }
              };
            })
          ],
          props: {
            onClick: () => {
              player.startHere(points[0].keyframe, points[0].index);
              setInactive();
            }
          }
        },
        {
          key: "quote",
          label: "引用",
          props: {
            onClick: () => {
              setInactive();
            }
          }
        }
      ];
    }
    let original = {
      display: "",
      outline: ""
    };
    function setActive() {
      position.show = true;
      if (currentElement) {
        original = {
          display: currentElement.style.display,
          outline: currentElement.style.outline
        };
        currentElement.style.display = "block";
        currentElement.style.outline = "1px dashed #aaaaaa30";
      }
    }
    function setInactive() {
      position.show = false;
      if (currentElement) {
        currentElement.style.display = original.display;
        currentElement.style.outline = original.outline;
        original = {
          display: "",
          outline: ""
        };
      }
      animeElements.value = [];
    }
    function handleClickoutside(ev) {
      setInactive();
    }
    onUnmounted(() => {
      subs.forEach((sub) => sub.unsubscribe());
    });
    return (_ctx, _cache) => {
      const _component_n_dropdown = resolveComponent("n-dropdown");
      return openBlock(), createBlock(unref(_sfc_main$s), null, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1$3, [
            createVNode(_component_n_dropdown, {
              placement: "bottom-start",
              trigger: "manual",
              x: position.x,
              y: position.y,
              options: options.value,
              show: position.show,
              "on-clickoutside": handleClickoutside
            }, null, 8, ["x", "y", "options", "show"])
          ], 512)
        ]),
        _: 1
      });
    };
  }
});
const ContextmenuTool = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-a4aba4e4"]]);
class PlayerContextMenuPlugin {
  constructor() {
    // private commander!: Commander;
    // private selection!: Selection;
    // private renderer!: Renderer;
    __publicField(this, "app", null);
    __publicField(this, "host", null);
    __publicField(this, "viewDocument", null);
  }
  setup(injector) {
    this.app = createApp(ContextmenuTool).provide("injector", injector);
    this.viewDocument = injector.get(VIEW_DOCUMENT);
    this.host = document.createElement("div");
    this.viewDocument.appendChild(this.host);
    this.app.mount(this.host);
  }
  onDestroy() {
    var _a;
    (_a = this.app) == null ? void 0 : _a.unmount();
    if (this.viewDocument && this.host) {
      this.viewDocument.removeChild(this.host);
    }
  }
}
const _hoisted_1$2 = ["data-keymap", "title"];
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "UIButton",
  props: {
    iconClasses: {},
    iconIndex: { type: Function },
    iconSize: {},
    tooltip: {},
    onClick: { type: Function },
    keymap: {},
    highlight: { type: Function },
    disabled: { type: Function }
  },
  setup(__props) {
    useCssVars((_ctx) => ({
      "269d3ea4": unref(themeVars).buttonColor2Hover,
      "31432f14": unref(themeVars).buttonColor2Pressed
    }));
    const themeVars = useThemeVars();
    const props = __props;
    const state = reactive({
      highlight: computed(() => {
        var _a;
        return (_a = props.highlight) == null ? void 0 : _a.call(props);
      }),
      disabled: computed(() => {
        var _a;
        return (_a = props.disabled) == null ? void 0 : _a.call(props);
      }),
      iconIndex: computed(() => {
        var _a;
        return (_a = props.iconIndex) == null ? void 0 : _a.call(props);
      })
    });
    function handleClick() {
      props.onClick && props.onClick();
    }
    return (_ctx, _cache) => {
      const _component_n_button = resolveComponent("n-button");
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["button-tool", state.highlight ? "active" : ""]),
        "data-keymap": JSON.stringify(_ctx.keymap),
        title: _ctx.tooltip,
        onClick: handleClick
      }, [
        createVNode(_component_n_button, {
          class: "btn",
          block: "",
          text: "",
          size: "large",
          disabled: state.disabled
        }, {
          default: withCtx(() => {
            var _a;
            return [
              ((_a = _ctx.iconClasses) == null ? void 0 : _a.length) ? (openBlock(), createBlock(unref(UIIcon$1), {
                key: 0,
                icon: _ctx.iconClasses ? _ctx.iconClasses[state.iconIndex || 0] : "",
                size: _ctx.iconSize || 24
              }, null, 8, ["icon", "size"])) : createCommentVNode("", true)
            ];
          }),
          _: 1
        }, 8, ["disabled"])
      ], 10, _hoisted_1$2);
    };
  }
});
const UIButton = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-f49885b6"]]);
const _sfc_main$1 = {};
const _hoisted_1$1 = {
  xmlns: "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  viewBox: "0 0 24 24"
};
const _hoisted_2 = /* @__PURE__ */ createBaseVNode("path", {
  d: "M19 9H5c-.55 0-1 .45-1 1s.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1zM5 15h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1s.45 1 1 1z",
  fill: "currentColor"
}, null, -1);
const _hoisted_3 = [
  _hoisted_2
];
function _sfc_render(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$1, _hoisted_3);
}
const DragHandle = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render]]);
const _hoisted_1 = { class: "tools" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ControllerView",
  props: {
    cmpts: {}
  },
  setup(__props) {
    const injector = inject("injector");
    injector.get(Player);
    const structurer = injector.get(Structurer);
    const rootRef = structurer.rootRef;
    const props = __props;
    const message = useMessage();
    const subs = [];
    const controllerData = ref([]);
    const controllerRef = ref(null);
    const isFixed = ref(false);
    const isAutoHide = ref(false);
    const isControllerShow = ref(true);
    onBeforeMount(() => {
      controllerData.value = props.cmpts.map((vnode) => {
        vnode.key = UUID.v4();
        return vnode;
      });
    });
    const draggerRef = ref(null);
    const rect = rootRef.getBoundingClientRect();
    const { x, y, style } = useDraggable(controllerRef, {
      initialValue: { x: rect.width - 100, y: rect.height / 2 },
      containerElement: rootRef,
      preventDefault: true,
      // 阻止默认事件 (阻止拖拽时选中文本)
      stopPropagation: true
      // 阻止冒泡
    });
    window.onresize = function() {
      if (x.value > rect.width) {
        x.value = rect.width - 100;
      }
      if (y.value > rect.height) {
        y.value = rect.height - 100;
      }
      isFixed.value = false;
    };
    function handleChange() {
      x.value = rect.width - 100;
      y.value = rect.height / 2 - controllerRef.value.clientHeight / 2;
      isFixed.value = !isFixed.value;
      isFixed.value ? message.create("开启控制器拖拽") : message.create("关闭控制器拖拽");
      if (isFixed.value) {
        subs.forEach((sub) => sub.unsubscribe());
      }
    }
    function handleHideController() {
      if (isFixed.value)
        return;
      isAutoHide.value = !isAutoHide.value;
      if (isAutoHide.value) {
        subs.push(
          fromEvent(rootRef, "mousemove").pipe(auditTime$1(100)).subscribe((ev) => {
            isControllerShow.value = rect.right - ev.clientX < 100;
          })
        );
        message.create("开启控制器自动隐藏");
      } else {
        subs.forEach((sub) => sub.unsubscribe());
        message.create("关闭控制器自动隐藏");
      }
    }
    onUnmounted(() => {
      subs.forEach((sub) => sub.unsubscribe());
      controllerData.value = [];
      window.onresize = function() {
      };
    });
    return (_ctx, _cache) => {
      const _component_n_icon = resolveComponent("n-icon");
      return withDirectives((openBlock(), createElementBlock("div", {
        ref_key: "controllerRef",
        ref: controllerRef,
        class: normalizeClass(["controller", isFixed.value ? "fixed" : ""]),
        style: normalizeStyle(unref(style))
      }, [
        createBaseVNode("div", {
          ref_key: "draggerRef",
          ref: draggerRef,
          class: "dragger",
          style: normalizeStyle({ cursor: isFixed.value ? "move" : "pointer" }),
          onDblclick: handleChange
        }, [
          createVNode(_component_n_icon, {
            component: unref(DragHandle),
            size: 24
          }, null, 8, ["component"])
        ], 36),
        createBaseVNode("div", _hoisted_1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(controllerData.value, (node) => {
            return openBlock(), createBlock(resolveDynamicComponent(node), {
              class: "tool-item",
              key: node.key
            });
          }), 128))
        ]),
        createBaseVNode("div", {
          class: "footer",
          onDblclick: handleHideController
        }, null, 32)
      ], 6)), [
        [vShow, isControllerShow.value]
      ]);
    };
  }
});
const ControllerView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-54315ef5"]]);
makeError("Toolbar");
class Controller {
  constructor(toolFactories = [], host) {
    __publicField(this, "subs", []);
    __publicField(this, "tools");
    __publicField(this, "components", []);
    __publicField(this, "app", null);
    this.host = host;
    this.tools = toolFactories.map((i) => {
      return Array.isArray(i) ? i.map((j) => j()) : i();
    });
  }
  setup(injector) {
    const player = injector.get(Player);
    this.tools.forEach((tool) => {
      if (Array.isArray(tool)) {
        const groupWrapper = [];
        tool.forEach((t) => {
          groupWrapper.push(t.setup(injector, this.host));
        });
        this.components.push(h("div", { class: "group-wrapper" }, groupWrapper));
        return;
      }
      this.components.push(tool.setup(injector, this.host));
    });
    this.app = createApp(h(_sfc_main$s, null, {
      default: () => h(ControllerView, { cmpts: this.components })
    }));
    this.app.provide("injector", injector);
    this.app.mount(this.host);
    const tools = this.tools.flat();
    this.subs.push(
      player.onStateUpdate.subscribe(() => {
        tools.forEach((tool) => {
          tool.refreshState();
        });
      })
    );
  }
  onDestroy() {
    var _a;
    this.tools.length = 0;
    this.tools = [];
    this.components.length = 0;
    this.components = [];
    (_a = this.app) == null ? void 0 : _a.unmount();
    this.subs.forEach((i) => i.unsubscribe());
    this.host = null;
  }
}
class ButtonTool3 {
  // params: Writable<UIButtonDefineProps> = {}
  constructor(factory) {
    __publicField(this, "config");
    __publicField(this, "controller");
    __publicField(this, "isHighlight");
    __publicField(this, "isDisabled");
    __publicField(this, "iconIndex");
    this.factory = factory;
    this.isHighlight = ref(false);
    this.isDisabled = ref(false);
    this.iconIndex = ref(0);
  }
  setup(injector) {
    this.config = this.factory(injector);
    this.controller = injector.get(Controller$1);
    this.isDisabled.value = this.config.disabled || false;
    const keyboard = injector.get(Keyboard);
    const viewer = h(UIButton, {
      ...this.config,
      iconIndex: () => this.iconIndex.value,
      highlight: () => this.isHighlight.value,
      disabled: () => this.isDisabled.value
    });
    if (this.config.keymap) {
      keyboard.addShortcut({
        keymap: this.config.keymap,
        action: () => {
          this.config.onClick();
        }
      });
    }
    return viewer;
  }
  refreshState() {
    if (this.config.queryState) {
      const state = this.config.queryState();
      if (!state)
        return;
      this.iconIndex.value = state.iconIndex === void 0 ? 0 : state.iconIndex;
      this.isDisabled.value = state.disabled === void 0 ? false : state.disabled;
    }
  }
  disabled(is) {
    if (is) {
      this.isDisabled.value = true;
      this.isHighlight.value = false;
    }
  }
  onDestroy() {
    var _a, _b;
    (_b = (_a = this.config).onDestroy) == null ? void 0 : _b.call(_a);
  }
}
function startToolConfigFactory(injector) {
  const player = injector.get(Player);
  return {
    iconClasses: [`${MaterialTypeEnum$1.FILLED}play_arrow`, `${MaterialTypeEnum$1.FILLED}pause`],
    tooltip: "开始",
    keymap: {
      ctrlKey: true,
      key: "1"
    },
    queryState() {
      return { iconIndex: player.isPlaying ? 1 : 0 };
    },
    onClick() {
      if (!player.isPlaying && !player.isPause)
        return player.start();
      if (player.isPlaying && !player.isPause)
        return player.pause();
      if (!player.isPlaying && player.isPause)
        return player.resume();
    }
  };
}
function startTool() {
  return new ButtonTool3(startToolConfigFactory);
}
function rewindToolConfigFactory(injector) {
  const player = injector.get(Player);
  return {
    iconClasses: [`${MaterialTypeEnum$1.FILLED}replay_5`],
    tooltip: "倒退",
    // keymap: {
    //   ctrlKey: true,
    //   key: '1'
    // },
    queryState() {
      return {};
    },
    onClick() {
      player.rewind();
    }
  };
}
function rewindTool() {
  return new ButtonTool3(rewindToolConfigFactory);
}
function forwardToolConfigFactory(injector) {
  const player = injector.get(Player);
  return {
    iconClasses: [`${MaterialTypeEnum$1.FILLED}forward_5`],
    tooltip: "快进",
    // keymap: {
    //   ctrlKey: true,
    //   key: '1'
    // },
    queryState() {
      return {};
    },
    onClick() {
      player.forward();
    }
  };
}
function forwardTool() {
  return new ButtonTool3(forwardToolConfigFactory);
}
function replayToolConfigFactory(injector) {
  const player = injector.get(Player);
  return {
    iconClasses: [`${MaterialTypeEnum$1.FILLED}replay`],
    tooltip: "重播",
    // keymap: {
    //   ctrlKey: true,
    //   key: '1'
    // },
    queryState() {
      return {};
    },
    onClick() {
      player.replay();
    }
  };
}
function replayTool() {
  return new ButtonTool3(replayToolConfigFactory);
}
function speedDownToolConfigFactory(injector) {
  const player = injector.get(Player);
  return {
    iconClasses: [`${MaterialTypeEnum$1.FILLED}keyboard_double_arrow_up`],
    tooltip: "减速",
    // keymap: {
    //   ctrlKey: true,
    //   key: '1'
    // },
    queryState() {
      return {};
    },
    onClick() {
      player.speedDown();
    }
  };
}
function speedDownTool() {
  return new ButtonTool3(speedDownToolConfigFactory);
}
function speedUpToolConfigFactory(injector) {
  const player = injector.get(Player);
  return {
    iconClasses: [`${MaterialTypeEnum$1.FILLED}keyboard_double_arrow_down`],
    tooltip: "加速",
    // keymap: {
    //   ctrlKey: true,
    //   key: '1'
    // },
    queryState() {
      return {};
    },
    onClick() {
      player.speedUp();
    }
  };
}
function speedUpTool() {
  return new ButtonTool3(speedUpToolConfigFactory);
}
function stopToolConfigFactory(injector) {
  const player = injector.get(Player);
  return {
    iconClasses: [`${MaterialTypeEnum$1.FILLED}stop`],
    tooltip: "停止",
    disabled: true,
    // keymap: {
    //   ctrlKey: true,
    //   key: '1'
    // },
    queryState() {
      return { disabled: !(player.isPlaying === false && player.isPause === true || player.isPlaying === true && player.isPause === false) };
    },
    onClick() {
      player.stop();
    }
  };
}
function stopTool() {
  return new ButtonTool3(stopToolConfigFactory);
}
function volumeDownToolConfigFactory(injector) {
  const player = injector.get(Player);
  return {
    iconClasses: [`${MaterialTypeEnum$1.FILLED}volume_down`, `${MaterialTypeEnum$1.FILLED}volume_off`],
    tooltip: "降低音量",
    // keymap: {
    //   ctrlKey: true,
    //   key: '1'
    // },
    queryState() {
      return { iconIndex: player.volume > 0 ? 0 : 1, disabled: player.volume <= 0 };
    },
    onClick() {
      player.volumeDown();
    }
  };
}
function volumeDownTool() {
  return new ButtonTool3(volumeDownToolConfigFactory);
}
function volumeUpToolConfigFactory(injector) {
  const player = injector.get(Player);
  return {
    iconClasses: [`${MaterialTypeEnum$1.FILLED}volume_up`],
    tooltip: "增大音量",
    // keymap: {
    //   ctrlKey: true,
    //   key: '1'
    // },
    queryState() {
      return { disabled: player.volume >= 1 };
    },
    onClick() {
      player.volumeUp();
    }
  };
}
function volumeUpTool() {
  return new ButtonTool3(volumeUpToolConfigFactory);
}
var __defProp2 = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp2(target, key, result);
  return result;
};
function canInsert(content, target) {
  const insertType = typeof content === "string" ? ContentType.Text : content.type;
  return target.schema.includes(insertType);
}
let CustomCommander = class extends Commander {
  constructor(selection, injector, registry, rootComponentRef) {
    super(selection, injector, registry, rootComponentRef);
  }
  /**
   * 在当前选区粘贴新内容，当选区未闭合时，会先删除选区内容，再粘贴新内容
   * @param pasteSlot 要粘贴的数据
   * @param text 要粘贴的文本
   */
  paste(pasteSlot, text) {
    if (pasteSlot.isEmpty) {
      return false;
    }
    const selection = this.selection;
    if (!selection.isSelected) {
      return false;
    }
    if (!selection.isCollapsed) {
      this.delete();
    }
    const component = selection.commonAncestorComponent;
    const slot = selection.commonAncestorSlot;
    const event = new Event(slot, {
      index: selection.startOffset,
      data: pasteSlot,
      text
    });
    invokeListener(component, "onPaste", event);
    if (!event.isPrevented) {
      const delta = pasteSlot.toDelta();
      const afterDelta = new DeltaLite();
      while (delta.length) {
        const { insert, formats } = delta.shift();
        const filterFormats = formats.filter((format2) => {
          if (format2[0].name === "color" && format2[1] === "rgb(255, 255, 255)")
            return false;
          return !["textBackgroundColor", "fontFamily"].includes(format2[0].name);
        });
        const commonAncestorSlot = selection.commonAncestorSlot;
        if (typeof insert !== "string") {
          insert.slots.toArray().forEach((slot2) => {
            slot2.cleanFormats((formatter) => {
              if (formatter.name === "color") {
                if (slot2.getFormats().some((format2) => format2.formatter.name === "color" && format2.value === "rgb(255, 255, 255)"))
                  return false;
              }
              return !["textBackgroundColor", "fontFamily"].includes(formatter.name);
            });
            slot2.cleanAttributes((attribute) => {
              return !["blockBackgroundColor"].includes(attribute.name);
            });
          });
        }
        if (canInsert(insert, commonAncestorSlot)) {
          this.insert(insert, filterFormats);
          continue;
        }
        afterDelta.push(...commonAncestorSlot.cut(selection.startOffset).toDelta());
        const parentComponent = commonAncestorSlot.parent;
        if (commonAncestorSlot === parentComponent.slots.last) {
          this.insert(insert, filterFormats);
          continue;
        }
        if (parentComponent.separable) {
          const index = parentComponent.slots.indexOf(commonAncestorSlot);
          const nextSlots = parentComponent.slots.cut(index + 1);
          const nextComponent = this.registry.createComponentByData(parentComponent.name, {
            state: typeof parentComponent.state === "object" && parentComponent.state !== null ? JSON.parse(JSON.stringify(parentComponent.state)) : parentComponent.state,
            slots: nextSlots
          });
          afterDelta.push({
            insert: nextComponent,
            formats: []
          });
          this.insert(insert, filterFormats);
          continue;
        }
        if (typeof insert === "string") {
          this.insert(insert, filterFormats);
          continue;
        }
        for (const childSlot of insert.slots.toArray()) {
          delta.unshift(...childSlot.toDelta());
        }
      }
      const snapshot = this.selection.createSnapshot();
      while (afterDelta.length) {
        const { insert, formats } = afterDelta.shift();
        const filterFormats = formats.filter((format2) => {
          return !["textBackgroundColor", "fontFamily"].includes(format2[0].name);
        });
        this.insert(insert, filterFormats);
      }
      snapshot.restore();
      const currentContent = selection.startSlot.getContentAtIndex(selection.startOffset);
      if (currentContent && typeof currentContent !== "string" && currentContent.type === ContentType.BlockComponent && currentContent.slots.length > 0) {
        selection.toNext();
      }
    }
    return !event.isPrevented;
  }
  /**
   * 在当前选区插入新内容，当选区未闭合时，会先删除选区内容，再插入新的内容
   * 在插入新内容时，write 方法还会把相邻的样式应用到新内容上
   * @param content 新插入的内容
   * @param formats 新的格式
   */
  // write(content: string | ComponentInstance, formats?: Formats): boolean
  // write<T extends FormatValue>(content: string | ComponentInstance, formatter?: Formatter<T>, value?: T): boolean
  // write<T extends FormatValue>(content: string | ComponentInstance, formatter?: Formatter<T> | Formats, value?: T): boolean {
  //   const selection = this.selection
  //   const canInsert = selection.isCollapsed ? true : this.delete()
  //   if (!canInsert) {
  //     return false
  //   }
  //   const position = getInsertPosition(selection.startSlot!, selection.startOffset!, content)
  //   if (!position) {
  //     return false
  //   }
  //   let formats = position.slot.extractFormatsByIndex(position.offset).filter(i => {
  //     // 动画格式换行不继承
  //     return i[0].name !== 'AnimeFormatter'
  //   })
  //   if (formatter) {
  //     if (Array.isArray(formatter)) {
  //       formats = [...formats, ...formatter]
  //     } else {
  //       formats.push([formatter, value as FormatValue])
  //     }
  //   }
  //   return this.insert(content, formats)
  // }
  /**
  * 在当前选区内触发换行操作，如果选区未闭合，则先删除选区内容，再触发回车操作
  */
  //  break(): boolean {
  //   const selection = this.selection
  //   if (!selection.isSelected) {
  //     return false
  //   }
  //   if (!selection.isCollapsed) {
  //     const isCollapsed = this.delete(false)
  //     if (!isCollapsed) {
  //       return false
  //     }
  //   }
  //   const startSlot = this.selection.startSlot!
  //   const event = new Event<Slot, BreakEventData>(startSlot, {
  //     index: this.selection.startOffset!
  //   })
  //   invokeListener(startSlot.parent!, 'onBreak', event)
  //   if (!event.isPrevented) {
  //     const startOffset = this.selection.startOffset!
  //     const isToEnd = startOffset === startSlot.length || startSlot.isEmpty
  //     const content = isToEnd ? '\n\n' : '\n'
  //     const isInserted = this.write(content)
  //     if (isInserted && isToEnd) {
  //       this.selection.setPosition(startSlot, startOffset + 1)
  //     }
  //   }
  //   return !event.isPrevented
  // }
};
CustomCommander = __decorateClass([
  Injectable()
], CustomCommander);
const EDITOR_VERSION = "0.0.1";
export {
  ANIME,
  ANIME_COMPONENT,
  ANIME_COMPONENT_NAME,
  ANIME_FORMATTER_NAME,
  AddAnimeService,
  AnimeAutoProvider,
  AnimeClickPlugin,
  AnimeComponentSupport,
  AnimeContextmenuPlugin,
  AnimeEventService,
  AnimeFormatter,
  AnimePlayerFormatter,
  AnimeProvider,
  AnimeStateProvider,
  AnimeUtilsProvider,
  AxiosProvider,
  ButtonTool$2 as ButtonTool,
  Clipboard,
  CodeStyleFormatter,
  ColorProvider,
  ContextMenu,
  Controller,
  CustomCommander,
  DialogProvider,
  DropdownTool,
  EDITOR_VERSION,
  Img2base64Service,
  ImgToUrlService,
  InlineTagStyleFormatLoader,
  InlineToolbarPlugin,
  MaterialTypeEnum$1 as MaterialTypeEnum,
  OutlinePlugin,
  OutlineService,
  Player,
  PlayerContextMenuPlugin,
  PopoverTool,
  PreviewPlayerController,
  ResizeService,
  RootEventService,
  SegmentDropdownTool,
  SelectTool,
  Structurer,
  SwitchButtonTool,
  TextBackgroundColorFormatter,
  ThemeProvider,
  ToolType,
  Toolbar,
  _sfc_main$s as UIConfig,
  UIIcon$1 as UIIcon,
  animeBadgeVisibleTool,
  animeBadgeVisibleToolConfigFactory,
  animeComponent,
  animeComponentLoader,
  animeElementVisibleTool,
  animeElementVisibleToolConfigFactory,
  animeFormatLoader,
  animeFormatter,
  animeIgnoreComponent,
  animeIgnoreComponentLoader,
  animeIgnoreTool,
  animeIgnoreToolConfigFactory,
  animePlayerComponent,
  animePlayerComponentLoader,
  animePlayerFormatLoader,
  animePlayerFormatter,
  animeRootComponent,
  animeRootComponentLoader,
  animeTool,
  animeToolConfigFactory,
  animeUtilsProvider,
  blockquoteTool,
  blockquoteToolConfigFactory,
  boldTool,
  boldToolConfigFactory,
  cleanTool,
  cleanToolConfigFactory,
  codeStyleFormatter,
  codeStyles,
  codeTool,
  codeToolConfigFactory,
  colorFormatLoader,
  colorFormatter,
  colorTool,
  colorToolConfigFactory,
  componentsTool,
  componentsToolConfigFactory,
  createCodeSlot,
  defaultGroupTool,
  defaultGroupToolFactory,
  emojiTool,
  emojiToolConfigFactory,
  fontFamilyTool,
  fontFamilyToolConfigFactory,
  fontSizeTool,
  fontSizeToolConfigFactory,
  formatPainterTool,
  formatPainterToolConfigFactory,
  forwardTool,
  forwardToolConfigFactory,
  headingTool,
  headingToolConfigFactory,
  historyBackTool,
  historyBackToolConfigFactory,
  historyForwardTool,
  historyForwardToolConfigFactory,
  imageB2UComponent,
  imageB2UComponentLoader,
  imageTool,
  imageToolConfigFactory,
  imageU2BComponent,
  imageU2BComponentLoader,
  insertParagraphAfterTool,
  insertParagraphAfterToolConfigFactory,
  insertParagraphBeforeTool,
  insertParagraphBeforeToolConfigFactory,
  isSupportFont,
  italicTool,
  italicToolConfigFactory,
  languageList,
  leftToRightTool,
  leftToRightToolConfigFactory,
  letterSpacingTool,
  letterSpacingToolConfigFactory,
  lineHeightTool,
  lineHeightToolConfigFactory,
  linkTool,
  linkToolConfigFactory,
  olTool,
  olToolConfigFactory,
  onAnimePlayerFormatterContextmenu,
  outlineTool,
  outlineToolConfigFactory,
  paragraphComponent,
  paragraphComponentLoader,
  preComponent,
  preComponentLoader,
  preTool,
  preToolConfigFactory,
  preview_forwardTool,
  preview_rewindTool,
  preview_startTool,
  preview_stopTool,
  replayTool,
  replayToolConfigFactory,
  rewindTool,
  rewindToolConfigFactory,
  rightToLeftTool,
  rightToLeftToolConfigFactory,
  rootComponent,
  rootComponentLoader,
  rootPlayerComponent,
  rootPlayerComponentLoader,
  speedDownTool,
  speedDownToolConfigFactory,
  speedUpTool,
  speedUpToolConfigFactory,
  startTool,
  startToolConfigFactory,
  stopTool,
  stopToolConfigFactory,
  strikeThroughTool,
  strikeThroughToolConfigFactory,
  subscriptTool,
  subscriptToolConfigFactory,
  superscriptTool,
  superscriptToolConfigFactory,
  tableAddTool,
  tableAddToolConfigFactory,
  tableRemoveTool,
  tableRemoveToolConfigFactory,
  textAlignTool,
  textAlignToolConfigFactory,
  textBackgroundColorFormatLoader,
  textBackgroundColorFormatter,
  textBackgroundTool,
  textBackgroundToolConfigFactory,
  textIndentTool,
  textIndentToolConfigFactory,
  ulTool,
  ulToolConfigFactory,
  underlineTool,
  underlineToolConfigFactory,
  unlinkTool,
  unlinkToolConfigFactory,
  volumeDownTool,
  volumeDownToolConfigFactory,
  volumeUpTool,
  volumeUpToolConfigFactory
};
