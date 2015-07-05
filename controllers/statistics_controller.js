var models = require('../models/models.js');
var Sequelize = require('sequelize');
var statistics = [];

// GET /quizes/statistics
exports.statistics= function(req, res, next) { 

	//console.log("En GET /quizes/statistics: exports.index");
	// El número de preguntas
	models.Quiz.count().then( 
		function(count) {
            statistics[0] = { texto: "Número de preguntas", count: count };

		}).catch(function(error){next(error)});

	// El número de commentarios totales
	models.Comment.count().then( 
		function(count) {
             statistics[1] = { texto: "Número de comentarios", count: count };
             statistics[2] = { texto: "Número medio de comentarios por pregunta", count: ((count / statistics[0].count).toFixed(2) )};
         }).catch(function(error){next(error)});
	
	models.Comment.findAll({
	attributes: ["QuizId" ],
    where: { QuizId: {$ne: null}},
    group : ["QuizId"]}).then(function(numquizcomment) {
		statistics[3] = { texto: "Número de preguntas sin comentarios", count: (statistics[0].count - numquizcomment.length)};
    	statistics[4] = { texto: "Número de preguntas con comentarios", count: numquizcomment.length};
    }).catch(function(error){next(error)
	}).finally(function() { next() });
	
};

exports.show= function(req, res){
		res.render('quizes/statistics', { statistics: statistics, errors: [] });
}