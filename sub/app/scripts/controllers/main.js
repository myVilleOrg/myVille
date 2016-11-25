'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the appApp
 */
angular.module('appApp')
.controller('MainCtrl', ['$scope', '$location', 'localStorageService', '$window', '$rootScope', 'ngDialog', 'myVilleAPI', 'leafletData', 'AuthentificationService', '$routeParams', function ($scope, $location, localStorageService, $window, $rootScope, ngDialog, myVilleAPI, leafletData, AuthentificationService, $routeParams) {
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

			var showUas = function(){
				leafletData.getMap().then(function(map){
					$rootScope.map = map;
					if($rootScope.markerLayer) map.removeLayer($rootScope.markerLayer);

					var mapBounds = [[map.getBounds().getNorthWest().lng, map.getBounds().getNorthWest().lat], [map.getBounds().getSouthEast().lng, map.getBounds().getSouthEast().lat]];
					var filterRequest = $scope.filters.mine ? myVilleAPI.UAS.getMine : $scope.filters.popular ? myVilleAPI.UAS.getPopular : myVilleAPI.UAS.get;
					filterRequest({map: JSON.stringify(mapBounds)}).then(function(geocodes){
						$rootScope.cachedMarkers = geocodes.data;
						var markers = L.markerClusterGroup();
						var geoJsonLayer = L.geoJson(geocodes.data, {
							onEachFeature: function (feature, layer) {
								var htmlPopup = '<div class="popup-map">' +
																	'<div class="heading-popup">' +
																		'<a href="#/ua/'+ feature.properties._doc._id +'">' +
																		feature.properties._doc.title +
																		'</a>' +
																	'</div>' +
																	'<div class="owner-popup">' +
																	'Crée par <a href="#/user/' + feature.properties._doc.owner._id + '">' + feature.properties._doc.owner.username + '</a> ' + moment(new Date(feature.properties._doc.createdAt)).locale('fr').fromNow() +
																	'</div>' +
																'</div>';

								layer.bindPopup(htmlPopup);
							}
						});
						markers.addLayer(geoJsonLayer);
						$rootScope.markerLayer = markers;
						map.addLayer(markers);
					});
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

			$scope.$on('leafletDirectiveGeoJson.map.click', function(event, leafletPayload){
				console.log(leafletPayload.leafletObject);
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
					$scope.filters = {mine: false, popular: false};
					console.log($scope.filters)
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
						popular: false
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
					ngDialog.open({data: data.data, template: 'views/single_ua.html'});
  			});
			}
}]);
