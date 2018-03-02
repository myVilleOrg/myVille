var  express 		= require('express'),
	mongoose 		= require('mongoose'),
	CriteriaModel		= mongoose.model('Criteria');

var Criteria = {

	create_criteria: function(critere){
		CriteriaModel.create({critere}).catch(function(err){
			reject(err);
			});
		},




		delete_criteria: function(criteria){
			CriteriaModel.findOneAndRemove(criteria).catch(function(err){
				reject(err);
			});
		},

		update_criteria: function(oldCriteria,newCriteria){
			CriteriaModel.findOneAndUpdate(cri).catch(function(err){
				reject(err);
			});
		},


		get_criteria: function(req,res,next){  //fonction utilisée par le front pour récupérer les critere et les id
			CriteriaModel.find({},function(err,criteres){

				res.send(criteres);

			});

		},

};


//creation de critère

// var Criteria1 =  new CriteriaModel	({ name : 'Qualité' });
//
// Criteria1.save(function (err) {
//   if (err) { throw err; }
//   console.log('Critère ajouté avec succès !');
// });



// Initialisation de la table criteria

CriteriaModel.count({}, function( err, count){
    console.log( "Number of criteria:", count );
		if(count==0){
			var Criteria1 =  new CriteriaModel	({ name : 'Qualité' });

			Criteria1.save(function (err) {
			  if (err) { throw err; }
			});


			var Criteria2 =  new CriteriaModel	({ name : 'Esthétique' });

			Criteria2.save(function (err) {
				if (err) { throw err; }
			});

			var Criteria3 =  new CriteriaModel	({ name : 'Utilité' });

			Criteria3.save(function (err) {
			  if (err) { throw err; }
			});


		}
})


//suppression de critere

// CriteriaModel.remove({ name : 'esthetique' }, function (err) {
//   if (err) { throw err; }
//   console.log('esthetique supprimés !');
// });
//

//Criteria.get_criteria();

//Criteria.create_criteria;


module.exports = function (app) {
	app.get('/criteria/get',	Criteria.get_criteria);
};
