import angular from "angular";

function getTypeOf(value: any): "Object" | "Array" | "String" {
  return value.constructor.name;
}

export interface NgVueDirective {
  name: string;
  value?: any;
  modifiers?: Record<string, any>;
  arg?: string;
}

const transformers = {
  Object: (value: NgVueDirective) => [value],
  Array: (value: NgVueDirective[]) => value,
  String: (value: string): NgVueDirective[] =>
    value
      .split(/\s*,\s*/g)
      .filter(Boolean)
      .map((name) => ({ name })),
};

/**
 * v-directives:
 *   - Array:  [{name: string, value: *, modifiers: Object, params: Object}]
 *   - Object: {name: string, value: *, modifiers: Object, params: Object}
 *   - String: A single directive name or multi-directive names separated by commas
 *
 * Known issue, this is only evaluated once, which means that the directive
 * won't be reactive without extra work
 *
 * @param directiveExpression - The string from the vDirective attribute
 * @param scope - Angular scope
 */
export function evaluateDirectives(directiveExpression: string, scope: ng.IScope) {
  if (!directiveExpression) return [];

  const directives = scope.$eval(directiveExpression);
  const transformer = transformers[getTypeOf(directives)];

  return transformer ? transformer(directives) : [];
}
