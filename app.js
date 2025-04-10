(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', FoundItemsDirective);

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var ctrl = this;
        ctrl.searchTerm = "";
        ctrl.found = [];

        ctrl.narrowDown = function () {
            if (ctrl.searchTerm) {
                MenuSearchService.getMatchedMenuItems(ctrl.searchTerm).then(function (result) {
                    ctrl.found = result;
                });
            } else {
                ctrl.found = [];
            }
        };

        ctrl.removeItem = function (index) {
            ctrl.found.splice(index, 1);
        };
    }

    MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http) {
        var service = this;

        service.getMatchedMenuItems = function (searchTerm) {
            return $http({
                method: "GET",
                url: "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json"
            }).then(function (response) {
                var foundItems = [];
                var menuItems = response.data;

                // Filter items based on the search term
                for (var i = 0; i < menuItems.length; i++) {
                    var item = menuItems[i];
                    if (item.description.toLowerCase().includes(searchTerm.toLowerCase())) {
                        foundItems.push(item);
                    }
                }
                return foundItems;
            });
        };
    }

    function FoundItemsDirective() {
        var ddo = {
            restrict: 'E',
            templateUrl: 'foundItems.html',
            scope: {
                found: '<',
                onRemove: '&'
            }
        };
        return ddo;
    }
})();
