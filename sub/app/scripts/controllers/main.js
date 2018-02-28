'use strict';

/**
 * @name MainCtrl
 * @description
 * # myVille
 * Controller of map and home
 */
angular.module('appApp')
.controller('MainCtrl', ['$scope', '$location', 'localStorageService', '$timeout', '$window', '$rootScope', 'ngDialog', 'myVilleAPI', 'leafletData', 'AuthentificationService', '$routeParams', '$compile', '$sessionStorage', function ($scope, $location, localStorageService, $timeout, $window, $rootScope, ngDialog, myVilleAPI, leafletData, AuthentificationService, $routeParams, $compile, $sessionStorage) {
	$scope.resetPwd = {};
	$scope.showChosens =[];
	$rootScope.ajoutDeGroup = false;
	localStorageService.set('ajoutDeGroup',false);
	$rootScope.chooseMode = false;
	localStorageService.set('chooseMode',false);
	$scope.getPopupDescriptionUA = function(uaId) { // when we click on title on ua display a modal box
		myVilleAPI.UAS.getOne(uaId).then(function(data){
			ngDialog.open({data: data.data, controller: 'VoteCtrl', template: 'views/single_ua.html', appendClassName: 'modal-single-ua'});
		});
	};

	$scope.forgotClick = function(){ // reset password function
		if($scope.resetPwd.pwd1 !== $scope.resetPwd.pwd2) {
			$scope.message = 'Mot de passe différent.';
			return;
		}

		var data = {
			tokenReset: $scope.ngDialogData.token,
			password: $scope.resetPwd.pwd1
		};

		myVilleAPI.User.reset(data).then(function(){
			$scope.closeThisDialog();
			return;
		}).catch(function(err){
			$scope.message = err.data.message;
			return;
		});
	};

	$scope.isActive = function (viewLocation) { // Page is active ?
		var active = (viewLocation === $location.path());
		return active;
	};

	if (localStorageService.get('token')){
		$scope.showChosens = [ // In the dropdown menu, the option chosen
			{name: 'Tout', functionChosen: 0},
			{name: 'Les plus populaires', functionChosen: 1},
			{name: 'Mes propositions', functionChosen: 2},
			{name: 'Mes favoris', functionChosen: 3}
		];
	};
	$scope.disconnect = function(){ // disconnect function
		AuthentificationService.logout();
		$window.location.href = '#/';
		$scope.showChosens = [ // In the dropdown menu, the option chosen
			{name: 'Tout', functionChosen: 0},
			{name: 'Les plus populaires', functionChosen: 1}
		];
	};

	$scope.login = function(){
		ngDialog.open({controller: 'LoginCtrl', template: 'views/login.html', appendClassName: 'popup-auto-height'});
		$scope.showChosens = [ // In the dropdown menu, the option chosen
			{name: 'Tout', functionChosen: 0},
			{name: 'Les plus populaires', functionChosen: 1},
			{name: 'Mes propositions', functionChosen: 2},
			{name: 'Mes favoris', functionChosen: 3}
		];
	};
	$scope.optionChosen = $scope.showChosens[0];

	$scope.submitUA = function(){ // when we finish to draw we send an event to all controllers
		$scope.$broadcast('submitUA');
	};
	$scope.submitGroup = function(){//@LIUYan
		$scope.$broadcast('submitGroup');
	};
	$scope.getGroup = function(){//@LIUYan
		$scope.$broadcast('getGroup');
	};

	$scope.selectFilter = function(index){ // filter for the map display
		if(index === 0){
			$scope.filters = {all: true, popular: false, mine: false, favorite: false, search: false};
			$scope.optionChosen = $scope.showChosens[0];
		}
		if(index === 1){
			$scope.filters = {all: false, popular: true, mine: false, favorite: false, search: false};
			$scope.optionChosen = $scope.showChosens[1];
		}
		if(index === 2 && localStorageService.get('token') ){
			$scope.filters = {all: false, popular: false, mine: true, favorite: false, search: false};
			$scope.optionChosen = $scope.showChosens[2];
		}
		if(index === 3 && localStorageService.get('token') ) {
			$scope.filters = {all: false, popular: false, mine: false, favorite: true, search: false};
			$scope.optionChosen = $scope.showChosens[3];
		}
		if(index === 4) {
			$scope.filters = {all: false, popular: false, mine: false, favorite: false, search: true};
			$scope.optionChosen = $scope.showChosens[4];
		}
	};

	$scope.$watch('filters', function(newv, old){ //on filter change
		if(JSON.stringify(newv) !== JSON.stringify(old)){
			showUas();
		}
		if(newv.popular){
			$window.location.href = '#/';
		}
		if(newv.all){
			$window.location.href = '#/';
		}
		if(newv.mine){
			$window.location.href = '#/profile/mine';
		}
		if(newv.favorite){
			$window.location.href = '#/profile/favorite';
		}
		if(newv.search){
			$window.location.href = '#/search';
		}
	}, true);

	$scope.$on('filterForce', function(e, idx){ // In a specific case we force filter
		$scope.selectFilter(idx);
	});


	// The function which permits to display items on map
	var geoJsonLayer;
	var showUas = function(){
		leafletData.getMap().then(function(map){
			//get gps of map bounds
			var mapBounds = [[map.getBounds().getNorthWest().lng, map.getBounds().getNorthWest().lat], [map.getBounds().getSouthEast().lng, map.getBounds().getSouthEast().lat]];
			if (!$scope.filters.search){
				// filter we gonna use based on filters we select
				var filterRequest = $scope.filters.mine ? myVilleAPI.UAS.getMine : $scope.filters.popular ? myVilleAPI.UAS.getPopular : $scope.filters.all ? myVilleAPI.UAS.getAll : myVilleAPI.UAS.getFavorites;
				filterRequest({map: JSON.stringify(mapBounds)}).then(function(geocodes){
					$scope.geoJL(geocodes.data);
				});
			} else {
				$scope.search($scope.res);
			};

			$scope.searchKey = $sessionStorage.searchKey;

			$scope.search = function (searchK) {
				if(typeof searchK !== 'undefined'){
					var searchKey = searchK;
					$sessionStorage.searchKey = searchK;
				}else {
					var searchKey = $scope.searchKey;
				}
				var searchOption = $scope.searchOption;

				myVilleAPI.UAS.search({search : searchKey, searchOption : searchOption, map: JSON.stringify(mapBounds)}).then(function(geocodes){
						$rootScope.searchUAS = geocodes.data;
						$scope.geoJL(geocodes.data,"search");
						$scope.selectFilter(4);
						$rootScope.$broadcast('updateSearch');
				});
			};

			$scope.searchOptions = ["Nom Projet","Créateur(s)"];
			if (typeof $sessionStorage.searchOption !== 'undefined'){
				$scope.searchOption = $sessionStorage.searchOption;
			}else{
				$scope.searchOption = $scope.searchOptions[0];
			}
			$scope.filterSearchChosen =function(searchOption){

				$sessionStorage.searchOption = searchOption;
			};
			$scope.geoJL = function (geoC,filter){

				// we remove data on map if there are some
				$rootScope.cachedMarkers = geoC;
				try {
					map.removeLayer(geoJsonLayer);
				}
				catch (e){
				}

				var filter = filter;

				geoJsonLayer = L.geoJson(geoC, {
					onEachFeature: function (feature, layer) {
						var geoLFeature;
						if (filter === "search"){
								geoLFeature = feature.properties;
						}else {
								geoLFeature = feature.properties._doc;
						}
						//for each items we attach a popup
						var starClass = 'fa fa-star-o';
						if($rootScope.user && $rootScope.user.favoris.indexOf(geoLFeature._id) !== -1){
							starClass = 'fa fa-star';
						}
						var testFavoriHtml = $rootScope.user ? '<i id="'+ geoLFeature._id +'" class="'+ starClass +'" ng-click="editFavori(\''+ geoLFeature._id +'\')" aria-hidden="true"></i>' : ''
						var htmlPopup = '<div class="popup-map">' +
															'<div class="heading-popup">' +
																'<a href="javascript:void(0)" ng-click="getPopupDescriptionUA(\''+ geoLFeature._id +'\')">' +
																geoLFeature.title +
																'</a>' +
															testFavoriHtml +
															'</div>' +
															'<div class="owner-popup">' +
															'Crée par <a href="#/user/' + geoLFeature.owner._id + '">' + geoLFeature.owner.username + '</a> ' + moment(new Date(geoLFeature.createdAt)).locale('fr').fromNow() +
															'</div>' +
														'</div>';
						var link = $compile(htmlPopup); // display html stored in descriptiond
						var content = link($scope);
						layer.bindPopup(content[0]);
					}
				});
				geoJsonLayer.addTo(map); // we need our layer in the map
			};
		});
	};


	$scope.editFavori = function(ua_id){
		myVilleAPI.UAS.favor({ua: ua_id}).then(function(user){
			$rootScope.user.favoris = user.data.favoris;
			localStorageService.set('user', user.data);
			angular.element(document.getElementById(ua_id))[0].className === 'fa fa-star-o' ? angular.element(document.getElementById(ua_id))[0].className = 'fa fa-star' : angular.element(document.getElementById(ua_id))[0].className = 'fa fa-star-o';
			$rootScope.$broadcast('updateFavorite');
		});
	};

	$scope.$on('leafletDirectiveMap.map.dragend', showUas); // on drag we update map

	$scope.$on('leafletDirectiveMap.map.zoomend', showUas);// on drag we update map

	$scope.$on('centerOnMap', function(event, coordinates){ // event to center
		var point = coordinates[0];
		var coordinate, zoom;
		if(point.type === 'Polygon'){
			coordinate = coordinates[0].coordinates[0][0];
			zoom = 14;
		} else if(point.type === 'Point'){
			coordinate = coordinates[0].coordinates;
			zoom = 18;
		} else if(point.type === 'LineString'){
			coordinate = coordinates[0].coordinates[0];
			zoom = 14;
		}
		$scope.center.lat = coordinate[1];
		$scope.center.lng = coordinate[0];
		$scope.center.zoom = zoom;
	});

	$scope.$on('$locationChangeStart', function (event, next, current) { // force filter on url
		if(next === 'http://localhost:9000/#/profile/mine' && current !== next){
			$scope.selectFilter(2);
		}
		if(next === 'http://localhost:9000/#/profile/favorite' && current !== next){
			$scope.selectFilter(3);
		}
		$scope.$emit('normalMode')
	});
	$scope.$on('filtersReset', function(evt, data){
		if(data){
			$scope.filters = {all: true, popular: false, mine: false, favorite: false, search: false};
		}
	});

	angular.extend($scope, {
			center: {
					lat: 51.505,
					lng: -0.09,
					zoom: 14,
					autoDiscover: false
			},
			bounds: {},
			geojson : {},
			filters: {
				all: true,
				popular: false,
				mine: false,
				favorite: false,
				search: false
			}
	});
  navigator.geolocation.getCurrentPosition(function(position){
  	$scope.center.lat = position.coords.latitude;
  	$scope.center.lng = position.coords.longitude;
  	showUas();
  });

	/*Draw on MAP and save what is drawing*/
	var drawnItems = new L.FeatureGroup();
	var options = {
		edit: {
			featureGroup: drawnItems
		},
		draw: {
			circle: false
		},
		showRadius: true
	};

	var drawControl = new L.Control.Draw(options);
	var editMapMode = false;
	$scope.$on('normalMode', function(){
		if(editMapMode){
			leafletData.getMap().then(function(map){
				map.removeLayer(drawnItems);
				map.removeControl(drawControl);
				editMapMode = false;
			});
		}
	});
	$scope.$on('editMode', function(){
		leafletData.getMap().then(function(map) {
			if(!editMapMode){
				drawnItems = new L.FeatureGroup();
				options = {
					edit: {
						featureGroup: drawnItems
					},
					draw: {
						circle: false
					},
					showRadius: true
				};
				drawControl = new L.Control.Draw(options);
				map.addControl(drawControl);
				map.on('draw:created', function (e) {
					var type = e.layerType,
					layer = e.layer;
					drawnItems.addLayer(layer);
					map.addLayer(drawnItems)
					$scope.$broadcast('drawingData', drawnItems.toGeoJSON()); // we send the drawing data to other controllers
				});
				editMapMode = true;
			}
		});
	});

	// we update token if expiring
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

	// if we are on detailled url for an ua
	if($routeParams.uaId){
		myVilleAPI.UAS.getOne($routeParams.uaId).then(function(data){
			$scope.center.lat = data.data.location.coordinates[1];
			$scope.center.lng = data.data.location.coordinates[0];
			$scope.center.zoom = 18;
			ngDialog.open({data: data.data, template: 'views/single_ua.html', appendClassName: 'modal-single-ua'});
		});
	}

	// if we are on token reset page
	if($routeParams.tokenReset){
		$scope.resetPwd = {};
		ngDialog.open({data: {token: $routeParams.tokenReset}, controller: 'MainCtrl', template: 'views/reset_password.html', appendClassName: 'modal-single-ua'});
	}

	/* Tutorial Mode */
	var tutorialDone = localStorageService.get('tutorialMode');
	if(!tutorialDone){
		$scope.IntroOptions = {
				steps:[
				{
					element: document.querySelector('.container'),
					intro: 'Bienvenue sur myVille ! \n myVille est un site colloboratif où vous pouvez partager vos aménagements urbains à la communauté :)'
				},
				{
					element: document.querySelector('.sidebar'),
					intro: 'Ça c\'est la barre de menu !',
					position: 'right'
				},
				{
					element: document.querySelector('#map'),
					intro: 'Là tu peux naviguer sur la carte et voir les aménagements d\'autres personnes, les aimer, les partager ...',
				}
				],
				showStepNumbers: false,
				exitOnOverlayClick: true,
				exitOnEsc: true,
				nextLabel: 'Suivant',
				prevLabel: 'Précédent',
				skipLabel: 'Quitter',
				doneLabel: 'Quitter'
		};
		$timeout(function(){
			$scope.startIntro();
			localStorageService.set('tutorialMode', 'mode1');
		}, 500);
	}
	$scope.$on('firstLoginTutorial', function(){
		var tutorialDone = localStorageService.get('tutorialMode');
		if(AuthentificationService.routeGuardian() && tutorialDone && tutorialDone === 'mode1'){

			$timeout(function(){
				angular.extend($scope, {
					IntroOptions: {
							steps:[
							{
								intro: 'Bienvenue sur myVille ! Nous allons vous présentez les fonctionnalités du site.'
							},
							{
								element: '#link-create',
								intro: 'Ici, vous pouvez créer votre aménagement.',
								position: 'right'
							},
							{
								element: '#link-mine',
								intro: 'Par là, vous pouvez voir vos créations.',
								position: 'right'
							},
							{
								element: '#link-favorite',
								intro: 'Envie de lister vos favoris , il suffit de cliquer ici.',
								position: 'right'
							},
							{
								element: '#link-group',
								intro: 'Par là, vous pouvez voir les groupes vous participés et rechercher des groupes.',
								position: 'right'
							},
							{
								intro: 'Il suffit de cliquer sur un marqueur ou une forme pour voir les détails de cet aménagement.',
								position: 'right'
							}
							],
							showStepNumbers: false,
							exitOnOverlayClick: true,
							exitOnEsc:true,
							nextLabel: 'Suivant',
							prevLabel: 'Précédent',
							skipLabel: 'Quitter',
							doneLabel: 'Quitter'
					}
				});
				$timeout(function(){
					$scope.startIntro();
					localStorageService.set('tutorialMode', 'finished');
				}, 200);
			}, 1000);
		}
	});

}]);
