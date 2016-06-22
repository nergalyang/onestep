'use strict';

angular.module('core').controller('HeaderController', ['OrdersService', '$rootScope', '$scope', '$state', 'Authentication', 'Menus',
  function (OrdersService, $rootScope, $scope, $state, Authentication, Menus) {
    var vm = this;
    vm.carOrder = {};
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
    var userId = $scope.authentication.user._id;

    /*
      if you logged in, then get the cart order
    */
    if ($scope.authentication.user) {
      vm.carOrder = getUserOrder();
      console.log('car order: ', vm.carOrder);
    }


    function getUserOrder(){
      OrdersService.query().$promise.then(function(orders){
        vm.dishNumber = 0;
        orders.forEach(function(order){
          if (order.status === 'preorder') {
            order.dishes.forEach(function(dish){
              vm.dishNumber += dish.quantity;
            });
          }
        });
      });
    }


    $rootScope.$on('getCartDishNumber', function(e, value) {
      // vm.dishNumber += 1;
      vm.carOrder = getUserOrder();
    });

    $rootScope.$on('increaseCartDishNumber', function(e, value) {
      vm.dishNumber += 1;
    });

  }
  ]);
