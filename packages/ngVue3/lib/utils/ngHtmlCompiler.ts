import angular from "angular";

export function ngHtmlCompiler($compile: ng.ICompileService) {
  return (html: string, scope: ng.IScope): JQLite => {
    const element = angular.element(html);
    $compile(element)(scope);
    scope.$digest();
    return element;
  };
}
