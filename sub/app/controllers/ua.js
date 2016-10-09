var express 		= require('express'),
	mongoose 		= require('mongoose'),
	UaModel 		= mongoose.model('Ua'),
	UserModel 		= mongoose.model('User'),
	GeoJSON 		= require('mongodb-geojson-normalize');

var Ua = {
	create: function(req, res, next){
		req.body.geojson = JSON.parse(req.body.geojson);
		var fields = ['description', 'geojson'];
		for(var i = 0; i < fields.length; i++) {
			if(!req.body[fields[i]]) return res.error({message: fields[i], error: 'Missing'});
		}
		UaModel.create({description: req.body.description, deleted: false, owner: req.user._id, private: true, location: req.body.geojson}).then(function(ua){
			UserModel.findOne({_id: req.user._id}).then(function(user){
				user.uas.push(ua._id);
				user.save();
				return res.ok(ua);
			});
		}).catch(function(err){
			return res.error({message: err});
		});
	},

	get: function(req, res, next){
		UaModel.findOne({_id: req.params.id, deleted: false}).then(function(ua){
			if(!ua ||(ua.private && ua.owner != req.user._id)) return res.error({message: 'Ua does not exist', error: 'Not found'});
			return res.ok(ua);
		}).catch(function(err){
			return res.error({message: 'Ua not found', error: 'Not found'});
		});
	},
	getGeo: function(req, res, next){
		var mapBorder = JSON.parse(req.query.map);
		for(var i = 0; i < mapBorder.length; i++){
			if(mapBorder[i][0] > 180) mapBorder[i][0] = 179;
			if(mapBorder[i][0] < -180) mapBorder[i][0] = -179;
			if(mapBorder[i][1] > 90) mapBorder[i][1] = 90;
			if(mapBorder[i][1] > -90) mapBorder[i][1] = -90;
		}
		UaModel.find({
			location: {
				$geoWithin: {
					/*$box: [
						[mapBorder[0][0], mapBorder[0][1]],
						[mapBorder[1][0], mapBorder[1][1]]
					]*/
					$geometry: {
						type: 'Polygon',
						coordinates: [
							[
								[mapBorder[0][0], mapBorder[0][1]],
								[mapBorder[1][0], mapBorder[1][1]],
								[-mapBorder[0][0], mapBorder[1][1]],
								[mapBorder[0][0], -mapBorder[1][1]],
								[mapBorder[0][0], mapBorder[0][1]],
							]
						],
						crs: {
							type: "name",
							properties: { name: "urn:x-mongodb:crs:strictwinding:EPSG:4326" }
						}
					}
				}
			}
		, deleted: false}).populate({
			path: 'owner',
			select: '_id avatar deleted username facebook_id'
		}).then(function(uas){
			console.log(uas);
			var uaGeoJSON = GeoJSON.parse(uas, {path: 'location'});
			return res.ok(uaGeoJSON);
		}).catch(function(err){
			return res.error({message: err});
		});
	},
	mine: function(req, res, next){
		UaModel.find({owner: req.user._id, deleted: false}).then(function(uas){
			return res.ok(uas);
		});
	},

	publish: function(req, res, next){
		UaModel.findOne({_id: req.params.id}).then(function(ua){
			if(!ua || ua.owner != req.user._id) return res.error({message: 'Ua does not exist / Ua is not yours', error: 'Not found / Not yours'});
			if(ua.private){
				UaModel.update({_id: ua.id}, {private: false}).then(function(data){
					return res.ok({message: 'OK'});
				}).catch(function(err){
					return res.error({message: err.message, error: err});
				});
			} else{
				UaModel.update({_id: ua.id}, {private: true}).then(function(data){
					return res.ok({message: 'OK'});
				}).catch(function(err){
					return res.error({message: err.message, error: err});
				});
			}
		});
	},

	delete: function(req, res, next){
		UaModel.findOne({_id: req.params.id}).then(function(ua){
			if(!ua || ua.owner != req.user._id) return res.error({message: 'Ua does not exist / Ua is not yours', error: 'Not found / Not yours'});
			if(ua.deleted) return res.error({message: 'Already done'});
			UaModel.update({_id: ua.id}, {deleted: true}).then(function(data){
				return res.ok({message: 'OK'});
			}).catch(function(err){
				return res.error({message: err.message, error: err});
			});
		});
	}
};

module.exports = function (app) {
	app.post('/ua/create', 		Ua.create);
	app.get('/ua/get/geo', 	Ua.getGeo);
	app.get('/ua/get/mine',	    Ua.mine);
	app.put('/ua/publish/:id',	Ua.publish);
	app.get('/ua/:id',	    	Ua.get);
	app.delete('/ua/:id',		Ua.delete);
};
