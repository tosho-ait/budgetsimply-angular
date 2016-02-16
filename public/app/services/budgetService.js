angular.module('budgetService', [])

.factory('Budget', function($http) {

	var budgetFactory = {};

	budgetFactory.all = function() {
		return $http.get('/api/expense/shares');
	};

	budgetFactory.addExpense = function(date, tags, note, payed, shares) {
		postData = {date: date, tags: tags, note: note, amount: payed, shares: shares}
		return $http.post('/api/expense/', postData);
	};

	budgetFactory.deleteExpense = function(budgetId, eId) {
		return $http.delete('/api/budgt/'+budgetId+'/expense/'+eId);
	};

	return budgetFactory;
});