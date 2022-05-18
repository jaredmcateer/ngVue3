var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { d as defineComponent, c as createElementBlock, a as createBaseVNode, t as toDisplayString, n as normalizeProps, h as guardReactiveProps, F as Fragment, o as openBlock } from "./runtime-dom.esm-bundler.3037667d.js";
import { u as useNgVue, a as angular_1, n as ngVueComponent } from "./main.e8843549.js";
const _hoisted_1 = /* @__PURE__ */ createBaseVNode("p", null, [
  /* @__PURE__ */ createBaseVNode("a", { href: "https://vuejs.org/guide/overview.html" }, "Vue.js")
], -1);
const _sfc_main = /* @__PURE__ */ defineComponent({
  props: {
    firstName: null,
    lastName: null,
    description: null
  },
  emits: ["update-description"],
  setup(__props, { emit }) {
    const props = __props;
    const onButtonClick = () => {
      emit("update-description", props.description.toUpperCase());
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("div", null, [
          createBaseVNode("span", null, " Hi, " + toDisplayString(__props.firstName) + " " + toDisplayString(__props.lastName), 1),
          createBaseVNode("p", null, toDisplayString(__props.description), 1)
        ]),
        createBaseVNode("div", normalizeProps(guardReactiveProps(_ctx.$attrs)), [
          _hoisted_1,
          createBaseVNode("button", {
            onClick: _cache[0] || (_cache[0] = ($event) => onButtonClick())
          }, "Update description from Vue")
        ], 16)
      ], 64);
    };
  }
});
const ngVue = useNgVue();
angular_1.module("vue.components", [ngVue]).controller("MainController", class MainController {
  constructor() {
    __publicField(this, "person", {
      firstName: "Barb",
      lastName: "Ara",
      description: "ngVue 3 supports components using the Composition API"
    });
    __publicField(this, "foo", "my-class");
  }
  updateDescription(description) {
    this.person.description = description;
  }
}).directive(...ngVueComponent("myComponent", _sfc_main));
