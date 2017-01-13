'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the appApp
 */
angular.module('appApp')
.controller('MainCtrl', ['$scope', '$location', 'localStorageService', '$window', '$rootScope', 'ngDialog', 'myVilleAPI', 'leafletData', 'AuthentificationService', '$routeParams', '$compile', function ($scope, $location, localStorageService, $window, $rootScope, ngDialog, myVilleAPI, leafletData, AuthentificationService, $routeParams, $compile) {

	$scope.getPopupDescriptionUA = function(uaId) {
		myVilleAPI.UAS.getOne(uaId).then(function(data){
			$scope.center.lat = data.data.location.coordinates[1];
			$scope.center.lng = data.data.location.coordinates[0];
			$scope.center.zoom = 18;
			ngDialog.open({data: data.data, template: 'views/single_ua.html', appendClassName: 'modal-single-ua'});
		});
	};

	$scope.isActive = function (viewLocation) {
		var active = (viewLocation === $location.path());
		return active;
	};

	$scope.disconnect = function(){
		AuthentificationService.logout();
		$window.location.href = '#/';
	};

	$scope.login = function(){
		ngDialog.open({controller: 'LoginCtrl', template: 'views/login.html'});
	};

	$scope.selectFilter = function(index){
		if(index === 0) $scope.filters.mine = false;
		if(index === 1) $scope.filters.popular = false
	};
	$rootScope.$on('$routeChangeStart', function (event, next, current) {
		if (!AuthentificationService.routeGuardian()) {
			event.preventDefault();
			$location.path('/');
		}
	});
	$scope.$watch('filters', function(newv, old){ //on filter change
		if(JSON.stringify(newv) !== JSON.stringify(old)){
			showUas();
		}
		if(newv.mine){
			$window.location.href = '#/profile/mine';
		} else {
			$window.location.href = '#/';
		}
	}, true);

	var markers = L.markerClusterGroup();
	var showUas = function(){
		leafletData.getMap().then(function(map){
		 	markers.clearLayers();
			var mapBounds = [[map.getBounds().getNorthWest().lng, map.getBounds().getNorthWest().lat], [map.getBounds().getSouthEast().lng, map.getBounds().getSouthEast().lat]];
			var filterRequest = $scope.filters.mine ? myVilleAPI.UAS.getMine : $scope.filters.popular ? myVilleAPI.UAS.getPopular : myVilleAPI.UAS.get;
			filterRequest({map: JSON.stringify(mapBounds)}).then(function(geocodes){
				$rootScope.cachedMarkers = geocodes.data;
				var geoJsonLayer = L.geoJson(geocodes.data, {
					onEachFeature: function (feature, layer) {
						var starClass = 'fa fa-star';
						if($rootScope.user && $rootScope.user.favoris.indexOf(feature.properties._doc._id)!=-1){
							starClass = 'fa fa-star-o';
						}
						var testFavoriHtml = $rootScope.user ? '<i id="'+feature.properties._doc._id+'" class="'+starClass+'" ng-click="editFavori(\''+feature.properties._doc._id+'\')" aria-hidden="true"></i>' : ''
						var htmlPopup = '<div class="popup-map">' +
															'<div class="heading-popup">' +
																'<a href="javascript:void(0)" ng-click="getPopupDescriptionUA(\''+ feature.properties._doc._id +'\')">' +
																feature.properties._doc.title +
																'</a>' +
															testFavoriHtml+
															'</div>' +
															'<div class="owner-popup">' +
															'Crée par <a href="#/user/' + feature.properties._doc.owner._id + '">' + feature.properties._doc.owner.username + '</a> ' + moment(new Date(feature.properties._doc.createdAt)).locale('fr').fromNow() +
															'</div>' +
														'</div>';
						var link = $compile(htmlPopup);
						var content = link($scope);
						layer.bindPopup(content[0]);
					}
				});
				markers.addLayer(geoJsonLayer);
				map.addLayer(markers);
			});
		});
	};
	$scope.editFavori = function(ua_id){
		var data = {
			ua: ua_id
		};

		myVilleAPI.UAS.favor(data).then(function(user){
			$rootScope.user.favoris = user.data.favoris;
			localStorageService.set('user', user.data);
			angular.element(document.getElementById(ua_id))[0].className == "fa fa-star" ? angular.element(document.getElementById(ua_id))[0].className = "fa fa-star-o" : angular.element(document.getElementById(ua_id))[0].className = "fa fa-star";
			$rootScope.$broadcast('updateFavorite');
		});
	};


	/*$scope.$on('leafletDirectiveMap.map.load', function(event){
			showUas();
	});*/

	$scope.$on('leafletDirectiveMap.map.dragend', function(event){
			showUas();
	});
	$scope.$on('leafletDirectiveMap.map.zoomend', function(event){
			showUas();
	});

	function onMapClick() {
		leafletData.getMap().then(function(map){
			var geocoder = new L.Control.Geocoder.Nominatim();
			map.on('click', function(e) {
				geocoder.reverse(e.latlng, 1,function(result){
					var location = [result[0].name,[result[0].center.lng, result[0].center.lat]];
					$rootScope.$broadcast('UAlocationClic', location);
				});
			});
		});
	};

	$scope.$on('leafletDirectiveMap.map.click', function(event){
		onMapClick();
	});

	$scope.$on('centerOnMap', function(event, coordinates){
		$scope.center.lat = coordinates[1];
		$scope.center.lng = coordinates[0];
		$scope.center.zoom = 18;
	});


	$scope.$on('$locationChangeStart', function (event, next, current) {
		if(next === 'http://localhost:9000/#/profile/mine' && current != next){
			$scope.filters.mine = true;
		}
	});
	$scope.$on('filtersReset', function(evt, data){
		if(data){
			$scope.filters = {mine: false, popular: true};
		}
	});

	angular.extend($scope, {
			center: {
					lat: 51.505,
					lng: -0.09,
					zoom: 14,
					autoDiscover: true
			},
			bounds: {},
			geojson : {},
			filters: {
				mine: false,
				popular: true
			}
	});

	var expiryTokenTime = localStorageService.get('expiryToken');

	if(expiryTokenTime && Date.now() < expiryTokenTime) {
		var token = localStorageService.get('token');
		if(token) {
			$rootScope.token = token;
			var user = localStorageService.get('user');
			if(user) $rootScope.user = user;
		}
	} else {
		$scope.disconnect();
	}

	if($routeParams.uaId){
		myVilleAPI.UAS.getOne($routeParams.uaId).then(function(data){
			$scope.center.lat = data.data.location.coordinates[1];
			$scope.center.lng = data.data.location.coordinates[0];
			$scope.center.zoom = 18;
			ngDialog.open({data: data.data, template: 'views/single_ua.html', appendClassName: 'modal-single-ua'});
		});
	}
}]);
