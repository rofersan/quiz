var models = require('../models/models.js');

// Autoload - Se ejecuta si la url contiene ":quizId"
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(function (quiz) {
		if (quiz) {
			req.quiz = quiz;
			next();
		} else {
			next(new Error('No existe quizId: ' + quizId));
		}
	}).catch(function(error) {
		next(error);
	});
};

// GET /quizes
exports.index = function(req, res) {
	var query, percent = '%';
	if (!!req.query.search && req.query.search.trim() !== '') {
		query = {
			where: ['pregunta like ?', percent + req.query.search.trim().replace(/\s/g, percent) + percent],
			order: [['pregunta', 'ASC']]
		};
	}
	models.Quiz.findAll(query).then(function (quizes) {
		res.render('quizes/index.ejs', {
			quizes: quizes,
			errors: []
		});
	});
};

// GET /quizes/{uuid}
exports.show = function(req, res) {
	res.render('quizes/show', {
		quiz: req.quiz,
		errors: []
	});
};

// GET /quizes/{uuid}/answer
exports.answer = function(req, res) {
	var respuesta = 'Incorrecto';
	if (req.query.respuesta.trim() === req.quiz.respuesta) {
		respuesta = 'Correcto';
	}
	res.render('quizes/answer', {
		quiz: req.quiz, 
		respuesta: respuesta,
		errors: []
	});
};

// GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build(
		{
			pregunta: 'Pregunta',
			respuesta: 'Respuesta'
		});
	res.render('quizes/new', {
		quiz: quiz,
		errors: []
	});
};

// GET /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);
	quiz.validate().then(function(err){
		if(err) {
			res.render('quizes/new', {
				quiz: quiz,
				errors: err.errors
			});
		} else {
			quiz.save(
				{
					fields: ["pregunta", "respuesta"]	
				}).then(function() {
					res.redirect('/quizes');
				});
		}
	});


	
};