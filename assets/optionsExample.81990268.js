var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { d as defineComponent, c as createElementBlock, a as createBaseVNode, t as toDisplayString, n as normalizeProps, h as guardReactiveProps, F as Fragment, o as openBlock } from "./runtime-dom.esm-bundler.3037667d.js";
import { u as useNgVue, a as angular_1, n as ngVueComponent } from "./main.e10db4eb.js";
import { _ as _export_sfc } from "./plugin-vue_export-helper.21dcd24c.js";
const _sfc_main = defineComponent({
  props: {
    firstName: String,
    lastName: String,
    description: String
  },
  emits: ["update-description"],
  methods: {
    onButtonClick() {
      this.$emit("update-description", this.description.toUpperCase());
    }
  }
});
const _hoisted_1 = /* @__PURE__ */ createBaseVNode("p", null, [
  /* @__PURE__ */ createBaseVNode("a", { href: "https://vuejs.org/guide/overview.html" }, "Vue.js")
], -1);
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(Fragment, null, [
    createBaseVNode("div", null, [
      createBaseVNode("span", null, " Hi, " + toDisplayString(_ctx.firstName) + " " + toDisplayString(_ctx.lastName), 1),
      createBaseVNode("p", null, toDisplayString(_ctx.description), 1)
    ]),
    createBaseVNode("div", normalizeProps(guardReactiveProps(_ctx.$attrs)), [
      _hoisted_1,
      createBaseVNode("button", {
        onClick: _cache[0] || (_cache[0] = ($event) => _ctx.onButtonClick())
      }, "Update description from Vue")
    ], 16)
  ], 64);
}
var Component = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
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
}).directive(...ngVueComponent("myComponent", Component));
