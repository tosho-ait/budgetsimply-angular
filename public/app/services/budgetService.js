angular.module('budgetService', [])

.factory('Budget', function($http) {

	var budgetFactory = {};

	budgetFactory.all = function() {
		return $http.get('/api/budgt/');
	};

	budgetFactory.create = function(name) {
		return $http.post('/api/budgt/', {name: name});
	};

	budgetFactory.addExpense = function(budgetId, date, tags, note, payed) {
		return $http.post('/api/budgt/'+budgetId+'/expense', {date: date, tags: tags, note: note, payed: payed});
	};

		budgetFactory.share = function(budgetId, userId) {
		return $http.post('/api/budgt/'+budgetId+'/share', {userId: userId});
	};

	budgetFactory.deleteExpense = function(budgetId, eId) {
		return $http.delete('/api/budgt/'+budgetId+'/expense/'+eId);
	};

	return budgetFactory;
});