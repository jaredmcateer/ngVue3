<script setup lang="ts">
import { ref } from "vue";

const html = ref(`<div ng-controller="MyController as ctrl">
  <my-component
    v-props="ctrl.user"
    v-props-is-admin="ctrl.isAdmin"
    v-on-button-clicked="ctrl.handleClick"
  ></my-component>
</div>
`);

const template = ref(`<template>
  <!-- Multiple root elements allowed in Vue3 -->
  <div>{{ salutation }}</div>
  <button v-if="isAdmin" @click="onButtonClicked">Click Me</button>
</template>
`);

const angular = ref(`import {ngVueComponent, useNgVue} from '@jaredmcateer/ngvue3';
import MyComponent from './MyComponent.vue';

// Setups ngVue angular module and returns module name
const ngVue = useNgVue();

angular.module('myModule', [ngVue])
  .controller('MyController', class MyController {
    constructor() {
      this.isAdmin = true;
      this.user = {firstName: 'Barb', lastName: 'Ara'};

      this.handleClick = () => {
        this.admin = false;
      }
    }
  })
  // ngVueComponent is a helper function that reduces boiler plate;
  // .directive('myComponent', ['createVueComponent', (createVueComponent) => createVueComponent(MyComponent)])
  .directive(...ngVueComponent('myComponent', MyComponent));
`);

const optionsApi = ref(`import { defineComponent } from "vue";

export default defineComponent({
  props: {
    firstName: { type: String, default: "Not" },
    lastName: { type: String, default: "Sure" },
    isAdmin: { type: Boolean, default: false },
  },
  emits: ["button-clicked"],
  computed: {
    salutation(): string {
      const prefix = this.isAdmin ? "Hello," : "Welcome,";
      return \`\${prefix} \${this.firstName} \${this.lastName}\`;
    },
  },
  methods: {
    onButtonClicked() {
      this.$emit("button-clicked");
    },
  },
});
`);

const compositionApi = ref(`import { defineComponent, computed } from "vue";

export default defineComponent({
  props: {
    firstName: { type: String, default: "Not" },
    lastName: { type: String, default: "Sure" },
    isAdmin: { type: Boolean, default: false },
  },
  emits: ["button-clicked"],
  setup(props, context) {
    const salutation = computed(() => {
      const prefix = props.isAdmin ? "Hello," : "Welcome,";
      return \`\${prefix} \${props.firstName} \${props.lastName}\`;
    });

    const onButtonClicked = () => context.emit("button-clicked");

    return { salutation, onButtonClicked };
  },
});
`);

const scriptSetup = ref(`
import { computed, PropType } from "vue";

const props = defineProps({
  firstName: { type: String, default: "Not" },
  lastName: { type: String, default: "Sure" },
  isAdmin: { type: Boolean, default: false },
});
const emit = defineEmits(["button-clicked"]);

const salutation = computed(() => {
  const prefix = props.isAdmin ? "Hello," : "Welcome,";
  return \`\${prefix} \${props.firstName} \${props.lastName}\`;
});

const onButtonClicked = () => emit("button-clicked");
`);
</script>

<template>
  <h1 class="header"><img src="../public/favicon/android-chrome-192x192.png" />ngVue 3</h1>
  <h2>Use Vue 3 inside Angular 1.x</h2>
  <p>
    Based off the excellent work by <a href="https://github.com/dorayx">Doray Hong</a> and
    <a href="https://github.com/nicolaspayot">Nicolas Payot</a> in the first iteration of
    <a href="https://github.com/ngVue/ngVue">ngVue</a> (which is recommended if you need to support
    Vue 2).
  </p>

  <p>
    ngVue 3 is a rewrite of the original vue package and while it behaves mostly the same there are
    additional caveats.
  </p>

  <ul>
    <li>
      <pre v-highlightjs><code class="typescript">useNgVue()</code></pre>
      instead of just importing the module
    </li>
    <li>
      Components can be at the root level of your document
      <ul>
        <li>Vue 2 used to use outerHTML to replace its container</li>
        <li>
          Vue 3 uses innerHTML and allows multiple elements at the root level. As a consequence your
          ngVue directive won't be deleted in the DOM
        </li>
        <li>
          ngVue 3 will strip all the attributes, props and events handler properties that it pulls
          into the component
        </li>
      </ul>
    </li>
    <li>
      <pre
        v-highlightjs
      ><code class="html">{{"<vue-component name='my-component'></vue-component>"}}</code></pre>
      has been removed.
    </li>
    <li>
      Filters plugin has been removed
      <ul>
        <li>Global filters don't exist in Vue 3, use importable functions/computed methods</li>
      </ul>
    </li>
    <li>
      The global Vue singleton has been replaced with instanced Apps so:
      <ul>
        <li>Root instance access has removed</li>
        <li>Root props have been removed</li>
        <li>Root lifecycle hooks have been removed</li>
      </ul>
    </li>
    <li><code>class</code> and <code>style</code> will fall through</li>
    <li>
      <code>ng-class</code> and <code>ng-style</code> will not
      <ul>
        <li>
          Their behaviour was pretty broken in the previous iteration and separating them makes more
          sense
        </li>
      </ul>
    </li>
  </ul>

  <h3>Examples</h3>
  <p>
    Under the hood Vue 3 uses the Composition API for everything, however the following are example
    of usage with the various styles you have available
  </p>

  <h4>Implementation</h4>

  <h5>Angular</h5>
  <pre v-highlightjs><code class="typescript">{{angular}}</code></pre>

  <h5>HTML</h5>
  <pre v-highlightjs><code class="html">{{html}}</code></pre>

  <h5>Vue Template</h5>
  <pre v-highlightjs><code class="html">{{template}}</code></pre>

  <h5>Options Api</h5>
  <a href="/examples/options-api/index.html">Demo</a>
  <p>This is the classic Vue style.</p>
  <pre v-highlightjs><code class="typescript">{{optionsApi}}</code></pre>

  <h5>Composition API (w/ setup function)</h5>
  <a href="/examples/composition-api/index.html">Demo</a>
  <p>This option is available as a non-build style alternative to the Options API</p>
  <pre v-highlightjs><code class="typescript">{{compositionApi}}</code></pre>

  <h5>Script Setup</h5>
  <a href="/examples/script-setup/index.html">Demo</a>
  <p>
    The cadillac of Vue 3, it adds compiler macros that reduce the amount of boilerplate needed by
    the standard Composition API style.
  </p>
  <pre v-highlightjs><code class="typescript">{{scriptSetup}}</code></pre>
</template>

<style lang="scss">
h1.header {
  display: flex;
  align-items: center;
  img {
    height: 6rem;
    margin-right: 1rem;
  }
}
#app ul li {
  pre,
  pre code.hljs {
    display: inline;
    padding: 0;
  }
}
</style>
