angular
    .module('myApp', ['ngRoute','ui.bootstrap'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'item-list.html',
                controller: 'itemListController',
                controllerAs: 'vm'
            })
            .when('/new-item', {
                templateUrl: 'item-form.html',
                controller: 'itemFormController',
                controllerAs: 'vm'
            })
            .when('/items/:itemId', {
                templateUrl: 'item-detail.html',
                controller: 'itemDetailController',
                controllerAs: 'vm'
            })
            .otherwise({redirectTo: '/'});
    })
    .controller('itemListController', function (ItemServices) {
        var vm = this;
        vm.getItems = ItemServices.getItems()
            .success(function(items){
                vm.items = items;
            })
            .error(function(error){
                console.log(error);
            });
    })
    .controller('itemDetailController', function ($routeParams, $uibModal, ItemServices, $location) {
        var vm = this;
        vm.back = function(){
            $location.path('/#/');
        };
        vm.itemId = $routeParams.itemId;
        vm.getItemById = ItemServices.getItemById(vm.itemId)
            .success(function(item){
                vm.item = item;
            })
            .error(function(error){
                console.log(error);
            });

        vm.popupBidForm = function() {
            var modalInstance = $uibModal.open({
                templateUrl: '/bid-model.html',
                controller: 'bidModalController as vm',
                resolve: {
                    itemData: function() {
                        return {
                            id: vm.itemId,
                            name: vm.item.name,
                            description: vm.item.description,
                            startingPrice: vm.item.startingPrice,
                            bids: vm.item.bids
                        };
                    }
                }
            });
            modalInstance.result.then(function(data){
                vm.item.bids.push(data);
            });
        };

    })
    .controller('bidModalController', function ($uibModalInstance, ItemServices, itemData, $route) {
        var vm = this;
        vm.itemData = itemData;

        var bids = angular.copy(itemData.bids);
        vm.maxPrice = Math.max.apply(Math,bids.map(function(o){return o.price;}));
        vm.startingPrice = itemData.startingPrice;

        vm.onSubmit = function(){
            vm.formError = "";
            if(!vm.formData.username || !vm.formData.price) {
                vm.formError = "No data entered!";
                return false;
            } else if(vm.formData.price <= vm.startingPrice || vm.formData.price <= vm.maxPrice) {
                vm.formError = "Bid is too low!";
                return false;
            } else {
                vm.doAddBid(vm.itemData.id, vm.formData);
            }
        };
        vm.doAddBid = function(itemId, formData){
            ItemServices.addBidById(itemId, {
                username: formData.username,
                price: formData.price
            })
                .success(function(data){
                    vm.modal.close(data);
                    $route.reload();
                })
                .error(function(data){
                    vm.formError = "Your bid has not been saved, please try again"
                });
            return false;
        };
        vm.modal = {
            close: function(result){
                $uibModalInstance.close(result);
            },
            cancel: function(){
                $uibModalInstance.dismiss('cancel');
            }
        };

    })
    .controller('itemFormController', function ($location, ItemServices) {
        var vm = this;
        vm.back = function(){
            $location.path('/#/');
        };
        vm.saveItem = function(item) {
            vm.item.bids = [];
            ItemServices.addItem(vm.item)
                .success(function(data){
                    $location.path('/#/');
                })
                .error(function(error){
                    console.log(error);
                })
        }
    })
    .service('ItemServices', function ($http) {
        this.getItems = function() {
            return $http.get('/api/items');
        };
        this.getItemById = function(itemId) {
            return $http.get('/api/items/' + itemId);
        };
        this.addItem = function(item){
            return $http.post('/api/items', item);
        };
        this.addBidById = function (itemId, data) {
            return $http.post('/api/items/' + itemId + '/bids', data);
        };
    });