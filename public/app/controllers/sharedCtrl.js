angular.module('sharedCtrl', [])

.controller('sharedController', function($route, $scope, $uibModal, Budget, Auth, $filter) {
    var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
    
    var vm = this;
    vm.loggedin = false
    vm.usermail = '';
    vm.useradmin = false;

    vm.totalItems = 1;
    vm.currentPage = 1;

    repage = function(){
      if(typeof vm.me !== 'undefined'){
        fltrd = $filter("onlyaccepted")(vm.expenses);
        fltrd = $filter("periodfor")(fltrd, vm.period, vm.date);
        fltrd = $filter("onlyshared")(fltrd, vm.me.email, vm.sharedwith);
        vm.totalItems = fltrd.length;
      }
    };

    // $scope.$watch('shared.sharedwith', function(nw, ol) {
    //     repage();
    // });
    // $scope.$watch('shared.periodLabel', function(nw, ol) {
    //     repage();
    // });

    vm.sharedwithlist = [];
    vm.sharedwith = "";

    $scope.toggle = function(userId) {
        vm.sharedwith = userId;
        repage();
    };

    vm.date = new Date();
    vm.period = "m";
    vm.periodLabel = "";

    pad = function(num, size) {
        var s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
    }

    vm.myTags = function(entry){
      var result = [];
      //console.log(entry);
      entry.shares.filter(function(share){
      if(share.user === vm.me.email){
        console.log(share.tags);
        result = share.tags;
      }
      });
      return result;
    }

 vm.perToggle = function () {
    if(vm.period === "y"){
      vm.period = "m";
    } else {
      vm.period = "y";
    }
    redrawPeriod();
  };

vm.perPlus = function () {
    if(vm.period === "y"){
      vm.date.setYear(vm.date.getFullYear() + 1);
    }else{
      vm.date.setMonth(vm.date.getMonth() + 1);     
    }
    redrawPeriod();
};

vm.perMinus = function () {
  if(vm.period === "y"){
      vm.date.setYear(vm.date.getFullYear() - 1);
    }else{
      vm.date.setMonth(vm.date.getMonth() - 1);     
    }
  redrawPeriod();
};

redrawPeriod = function(){
    if(vm.period === "y"){
      vm.periodLabel = vm.date.getFullYear();
    } else {
      vm.periodLabel = monthNames[vm.date.getMonth()]+" "+vm.date.getFullYear();
    }

  input = $filter("onlyaccepted")(vm.expenses);
  input = $filter("periodfor")(input, vm.period, vm.date);
  input = $filter("onlyshared")(input, vm.me.email, vm.sharedwith);
  vm.friendTotal = $filter("calctotalforshared")(input, vm.me.email, vm.sharedwith);

  input = $filter("onlyaccepted")(vm.expenses);
  input = $filter("periodfor")(input, vm.period, vm.date);
  input = $filter("onlyshared")(input, vm.sharedwith, vm.me.email);
  vm.userTotal = $filter("calctotalforshared")(input, vm.sharedwith, vm.me.email);
 
  vm.totalDiffFne = vm.friendTotal - vm.userTotal;
  vm.totalDiffUsr = vm.userTotal - vm.friendTotal;

  vm.totalDiffFne = vm.totalDiffFne.toFixed(2);
  vm.totalDiffUsr = vm.totalDiffUsr.toFixed(2);

  repage();
}

redraw = function () {
    Budget.all().success(function (data) {
        vm.expenses = data;

        sharedlst = new Set();
        vm.expenses.filter(function (expense) {
            if(expense.owner === vm.me.email){
                expense.shares.filter(function (el) {
                    sharedlst.add(el.user);
                });
            } else {
                sharedlst.add(expense.owner);
            }
        });
        sharedlst.delete(vm.me.email);
        if(sharedlst.size > 0){
            vm.sharedwithlist = Array.from(sharedlst);
            vm.sharedwith = vm.sharedwithlist[0];
        }
        redrawPeriod();
    });
}

Auth.getUser().then(function (data) {
    vm.me = data.data;
    vm.loggedin = true;
    vm.usermail = data.data.email;
    vm.useradmin = data.data.admin;
    redraw();
});

vm.payback = function(){
    usr = vm.me.email;
    fnd = vm.sharedwith;
    dat = new Date();
    tgs = [];
    tgs.push({text: 'payback'});
    nte = ""
    shrs = [];
    amnt = vm.totalDiffUsr;
    shrs.push({user: fnd, accepted: false, amount: amnt});
    Budget.addExpense(undefined, dat, tgs, nte, amnt, shrs, true, false).success(function (data) {
        if(data.success){
            redraw();
            vm.infsuccess = "Payback expense added! ::: "+new Date();
        }else{
            vm.infdanger = data.message +" ::: "+new Date();
        }
    });
}

vm.deleteExpense = function (eId) {
  Budget.deleteExpense(eId).success(function (data) {
    redraw();
  });
};

vm.modalExpense = function (existing) {
  var modalInstance = $uibModal.open({
    templateUrl: 'app/views/pages/private/newexpensem.html',
    controller: 'newexController',
    controllerAs: 'main',
    resolve: {
      existing: function () {
        return existing;
      }
    }
  });
  modalInstance.result.then(
    function () {
      $route.reload();
    }, 
    function () {
    }
  )
};

  vm.modalViewExpense = function (existing) {
    var modalInstance = $uibModal.open({
      templateUrl: 'app/views/pages/private/viewexpensem.html',
      controller: 'viewexController',
      controllerAs: 'main',
      resolve: {
        existing: function () {
          return existing;
        }
      }
    });
    modalInstance.result.then(
      function () {
      }, 
      function () {
      }
    )
  };

})

