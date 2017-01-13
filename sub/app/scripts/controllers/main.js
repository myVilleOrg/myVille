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
	$scope.resetPwd = {};

	$scope.getPopupDescriptionUA = function(uaId) {
		myVilleAPI.UAS.getOne(uaId).then(function(data){
			ngDialog.open({data: data.data, template: 'views/single_ua.html', appendClassName: 'modal-single-ua'});
		});
	};
	$scope.forgotClick = function(){
		if($scope.resetPwd.pwd1 !== $scope.resetPwd.pwd2) return $scope.message = 'Mot de passe différent.';

		var data = {
			tokenReset: $scope.ngDialogData.token,
			password: $scope.resetPwd.pwd1
		};

		myVilleAPI.User.reset(data).then(function(){
			$scope.closeThisDialog();
		}).catch(function(err){
			$scope.message = err.data.message;
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

	$scope.submitUA = function(){
		$scope.$broadcast('submitUA');
	}

	$scope.selectFilter = function(index){
		if(index === 0) $scope.filters.mine = false;
		if(index === 1) $scope.filters.popular = false
	};
	/*$rootScope.$on('$routeChangeStart', function (event, next, current) {
		if (!AuthentificationService.routeGuardian()) {
			event.preventDefault();
			$location.path('/');
		}
	});*/
	$scope.$watch('filters', function(newv, old){ //on filter change
		if(JSON.stringify(newv) !== JSON.stringify(old)){
			showUas();
		}
		if(newv.mine){
			$window.location.href = '#/profile/mine';
		}
	}, true);

	var geoJsonLayer;
	var showUas = function(){
		leafletData.getMap().then(function(map){
			try {
				map.removeLayer(geoJsonLayer);
			}
			catch (e){

			}
			var mapBounds = [[map.getBounds().getNorthWest().lng, map.getBounds().getNorthWest().lat], [map.getBounds().getSouthEast().lng, map.getBounds().getSouthEast().lat]];
			var filterRequest = $scope.filters.mine ? myVilleAPI.UAS.getMine : $scope.filters.popular ? myVilleAPI.UAS.getPopular : myVilleAPI.UAS.get;
			filterRequest({map: JSON.stringify(mapBounds)}).then(function(geocodes){
				$rootScope.cachedMarkers = geocodes.data;
				geoJsonLayer = L.geoJson(geocodes.data, {
					onEachFeature: function (feature, layer) {

						var starClass = 'fa fa-star-o';
						if($rootScope.user && $rootScope.user.favoris.indexOf(feature.properties._doc._id)!=-1){
							starClass = 'fa fa-star';
						}
						var testFavoriHtml = $rootScope.user ? '<i id="'+ feature.properties._doc._id +'" class="'+ starClass +'" ng-click="editFavori(\''+ feature.properties._doc._id +'\')" aria-hidden="true"></i>' : ''
						var htmlPopup = '<div class="popup-map">' +
															'<div class="heading-popup">' +
																'<a href="javascript:void(0)" ng-click="getPopupDescriptionUA(\''+ feature.properties._doc._id +'\')">' +
																feature.properties._doc.title +
																'</a>' +
															testFavoriHtml +
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
				geoJsonLayer.addTo(map);
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
			angular.element(document.getElementById(ua_id))[0].className == "fa fa-star-o" ? angular.element(document.getElementById(ua_id))[0].className = "fa fa-star" : angular.element(document.getElementById(ua_id))[0].className = "fa fa-star-o";
			$rootScope.$broadcast('updateFavorite');
		});
	};

	$scope.$on('leafletDirectiveMap.map.dragend', showUas);

	$scope.$on('leafletDirectiveMap.map.zoomend', showUas);

	$scope.$on('centerOnMap', function(event, coordinates){
		var point = coordinates[0];
		var coordinate, zoom;
		if(point.type == 'Polygon'){
			coordinate = coordinates[0].coordinates[0][0];
			zoom = 14;
		} else if(point.type == 'Point'){
			coordinate = coordinates[0].coordinates;
			zoom = 18;
		}
		$scope.center.lat = coordinate[1];
		$scope.center.lng = coordinate[0];
		$scope.center.zoom = zoom;
	});

	$scope.$on('$locationChangeStart', function (event, next, current) {
		if(next === 'http://localhost:9000/#/profile/mine' && current != next){
			$scope.filters.mine = true;
		}
		$scope.$emit('normalMode')

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

	/*Draw MAP*/
	var drawnItems = new L.FeatureGroup();
	var options = {
		edit: {
			featureGroup: drawnItems
		},
		draw: {

		},
		showRadius: true
	};

	var drawControl = new L.Control.Draw(options);
	drawControl.setDrawingOptions({
		circle: false,
		polyline: false,
		polygon: false
	});
	var editMapMode = false;
	$scope.$on('normalMode', function(){
		if(editMapMode){
			leafletData.getMap().then(function(map){
				map.removeLayer(drawnItems);
				map.removeControl(drawControl);
			});
		}
	});
	$scope.$on('editMode', function(){
		leafletData.getMap().then(function(map) {
				map.addControl(drawControl);
				editMapMode = true;
				map.on('draw:created', function (e) {
					var type = e.layerType,
					layer = e.layer;
					drawnItems.addLayer(layer);
					map.addLayer(drawnItems)
					$scope.$broadcast('drawingData', drawnItems.toGeoJSON());
				});
		});
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
	if($routeParams.tokenReset){
		$scope.resetPwd = {};
		ngDialog.open({data: {token: $routeParams.tokenReset}, controller: 'MainCtrl', template: 'views/reset_password.html', appendClassName: 'modal-single-ua'});
	}
}]);
