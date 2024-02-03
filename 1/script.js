angular.module('app', ['hljs'])
.controller('CodeCtrl', ['$scope', function($scope) {
  $scope.code = [
    { language: 'html', source: '<p>Hello World!</p>' },
    { language: 'css', source: 'p:after { content: "Hello World"; }' },
    { title: 'JS', language: 'javascript', source: 'alert(\'Hello World!\');' },
    { language: 'php', source: '<!--?php echo="Hello World!" ?-->' },
  ];
}])











.directive('codebox', function() {
  return {
    restrict: 'EA',
    replace: true,
    template:
      '<div class="codebox">' +
      '  <div class="codebox-header codebox-{{language | lowercase}}">{{title || (language | uppercase)}}</div>' +
      '  <div class="codebox-content">' +
      '  <hljs language="{{language | lowercase}}" source="source"><ng-transclude></ng-transclude></hljs>' +
      '  </div>' +
      '</div>',
    scope: {
      title: '@',
      language: '@',
      source: '='
    }
  };
})

.directive('codetabs', function() {
  return {
    restrict: 'EA',
    transclude: true,
    scope: {},
    controller: ['$scope', function($scope) {
      var tabs = $scope.tabs = [];
      
      $scope.select = function(tab) {
        angular.forEach(tabs, function(tab) {
          tab.selected = false;
        });
        tab.selected = true;
      }
 
      this.addPane = function(tab) {
        if (tabs.length == 0) { $scope.select(tab); }
        tabs.push(tab);
      }
    }],
    template:
      '<div class="codebox">' +
      '  <div class="codetabs-header">' +
      '    <ul>' +
      '      <li ng-repeat="tab in tabs" ng-class="{active: tab.selected}" class="codebox-{{tab.language | lowercase}}">'+
      '        <a href="" ng-click="select(tab)">{{tab.title || (tab.language | uppercase)}}</a>' +
      '      </li>' +
      '    </ul>' +
      '  </div>' +
      '  <div class="codebox-content" ng-transclude></div>' +
      '</div>',
    replace: true
  };
}).
directive('codetab', function() {
  return {
    require: '^codetabs',
    restrict: 'EA',
    transclude: true,
    scope: {
      title: '@',
      language: '@',
      source: '='
    },
    link: function(scope, element, attrs, tabsCtrl) {
      tabsCtrl.addPane(scope);
    },
    template:
      //'<div class="codetab-content" ng-class="{active: selected}" ng-transclude></div>',
      '<div class="codetab-content" ng-class="{active: selected}">' +
      //'  <pre><code data-language="{{language | lowercase}}">{{source}}</code></pre>' +
      '  <hljs language="{{language | lowercase}}" source="source"><ng-transclude></ng-transclude></hljs>' +
      '</div>',
    replace: true
  };
})