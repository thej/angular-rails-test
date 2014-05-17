/**
* testApp Module
*
* Description
*/

// var testApp = angular.module('testApp', []);


// testApp.controller('ArticlesCtrl', ['$scope', function($scope){
// 	$scope.articles = [
// 	  { id: 1, name: "Pizza Vegetaria", price: 5 },
// 	  { id: 2, name: "Pizza Salami",    price: 5.5 },
// 	  { id: 3, name: "Pizza Thunfisch", price: 6 }
// 	];
// }]);

var testApp = angular.module('testApp', ['ngResource', 'ngAnimate', 'ngRoute']);


//Routes
testApp.config(function($routeProvider) {
  $routeProvider
    .when('/articles', { templateUrl: 'articles.html' })
    .when('/', { templateUrl: 'start.html' })
    .otherwise({ redirectTo: '/' });
})

testApp.controller('ArticlesCtrl', ['$scope', 'Article', 'Articles', 'Cart', function($scope, Article, Articles, Cart){
	$scope.articles = Articles.query();
	$scope.cart = Cart

	$scope.newArticle = {
		name: "Give it a name"
	};

	$scope.create = function(){
		Articles.save($scope.newArticle, function(resource){ //success
			$scope.articles.push(resource);
			$scope.newArticle = {};
		}, function(response){ //failure
			console.log("Error " + response.status);
		});
	}

	$scope.deleteArticle = function (articleId) {
	    Article.delete({ id: articleId });
	    $scope.articles = Article.query();
    };


}]);

// Cart controller
testApp.controller('CartCtrl', ['$scope', 'Cart', function($scope, Cart){
	$scope.cart = Cart;
}]);

// Article Factory
testApp.factory('Articles', ['$resource', function($resource){
	return $resource('/articles.json');
}]);

testApp.factory('Article', ['$resource', function ($resource) {
    return $resource('/articles/:id.json', {}, {
        show: { method: 'GET' },
        update: { method: 'PUT', params: {id: '@id'} },
        delete: { method: 'DELETE', params: {id: '@id'} }
    });
}]);

// Cart Factory
testApp.factory('Cart', [function(){
	var items = [];
	return {
		getItems: function(){
			return items;
		},
		addItem: function(item) {
			items.push(item);
		},
		sum: function() {
        	return items.reduce(function(total, item) {
        		return total + item.price;
        	}, 0);
      	}
	}
}]);

// price directive
// Syntax: <price value="article.price" />
testApp.directive('price', function(){
	return {
		restrict: 'E',
		scope: {
			value: '='
		},
		template: '<span ng-show="value == 0">kostenlos</span>' +
      		'<span ng-show="value > 0">{{value | currency}}</span>'
	}
});


// Filter for titleizing a string
testApp.filter('titleize', function(){
	return function(text) {
		if (text == null) return '';
		return String(text).replace(/(?:^|\s)\S/g, function(c){
			return c.toUpperCase();
		});
	};
});