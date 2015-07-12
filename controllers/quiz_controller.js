var models = require('../models/models.js');

// Autoload - Se ejecuta si la url contiene ":quizId"
exports.load = function(req, res, next, quizId) {
	console.log('AUtoload...');
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
	models.Quiz.findAll().then(function (quizes) {
		res.render('quizes/index.ejs', {quizes: quizes});
	});
};

// GET /quizes/{uuid}
exports.show = function(req, res) {
	res.render('quizes/show', {quiz: req.quiz});
};

// GET /quizes/{uuid}/answer
exports.answer = function(req, res) {
	var respuesta = 'Incorrecto';
	if (req.query.respuesta.trim() === req.quiz.respuesta) {
		respuesta = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: respuesta});
};