'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the appApp
 */
angular.module('appApp')
.controller('MainCtrl', ['$scope', '$location', 'localStorageService', '$window', '$rootScope', 'ngDialog', 'myVilleAPI', 'leafletData', 'AuthentificationService', function ($scope, $location, localStorageService, $window, $rootScope, ngDialog, myVilleAPI, leafletData, AuthentificationService) {
			$scope.isActive = function (viewLocation) {
				var active = (viewLocation === $location.path());
				return active;
			};

			angular.extend($scope, {
					center: {
							lat: 51.505,
							lng: -0.09,
							zoom: 14,
							autoDiscover: true
					},
					bounds: {},
					geojson : {}
			});

			var showUas = function(){
				leafletData.getMap().then(function(map){
					$rootScope.map = map;

					var mapBounds = [[map.getBounds().getNorthWest().lng, map.getBounds().getNorthWest().lat], [map.getBounds().getSouthEast().lng, map.getBounds().getSouthEast().lat]];
					myVilleAPI.UAS.get({map: JSON.stringify(mapBounds)}).then(function(geocodes){

						var markers = L.markerClusterGroup();
						var geoJsonLayer = L.geoJson(geocodes.data, {
							onEachFeature: function (feature, layer) {
								var htmlPopup = '<div class="popup-map">' +
																	'<div class="heading-popup">' +
																		'<a href="">' +
																		feature.properties._doc.title +
																		'</a>' +
																	'</div>' +
																	'<div class="owner-popup">' +
																	'Crée par <a href="#/user/' + feature.properties._doc.owner._id + '">' + feature.properties._doc.owner.username + '</a> ' + moment(new Date(feature.properties._doc.createdAt)).lang('fr').fromNow() +
																	'</div>' +
																'</div>';

								layer.bindPopup(htmlPopup);
							}
						});
						markers.addLayer(geoJsonLayer);
						leafletData.getMap().then(function(map) {
							map.addLayer(markers);
							});
						});
				});
			};

			$scope.disconnect = function(){
				AuthentificationService.logout();
				$window.location.href = '#/';
			};

			$scope.login = function(){
				ngDialog.open({controller: 'LoginCtrl', template: 'views/login.html'});
			};


			$scope.$on('leafletDirectiveMap.map.load', function(event){
					showUas();
					
			});

			$scope.$on('leafletDirectiveMap.map.dragend', function(event){
					showUas();
					
			});
			$scope.$on('leafletDirectiveMap.map.zoomend', function(event){
					showUas();

			});

			$scope.$on('leafletDirectiveGeoJson.map.click', function(event, leafletPayload){
				console.log(leafletPayload.leafletObject);
				

			});

    		function onMapClick() {
    			leafletData.getMap().then(function(map){
    				map.on('click', function(e) {
                		var location = [e.latlng.lng,e.latlng.lat];
                		$rootScope.$broadcast('UAlocationClic', location);
       				});
                });
    		};

    		$scope.$on('leafletDirectiveMap.map.click', function(event){
    			onMapClick();

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
}]);
