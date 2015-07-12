var models = require('../models/models.js');

// GET /quizes
exports.index = function(req, res) {
	models.Quiz.findAll().then(function (quizes) {
		res.render('quizes/index.ejs', {quizes: quizes});
	});
};

// GET /quizes/{uuid}
exports.show = function(req, res) {
	models.Quiz.find(req.params.quizId).then(function (quiz) {
		res.render('quizes/show', {quiz: quiz});
	});
};

// GET /quizes/{uuid}/answer
exports.answer = function(req, res) {
	models.Quiz.find(req.params.quizId).then(function (quiz) {
		if (req.query.respuesta.trim() === quiz.respuesta) {
			res.render('quizes/answer', {quiz: quiz, respuesta: 'Correcto'});
		} else {
			res.render('quizes/answer', {quiz: quiz, respuesta: 'Incorrecto'});
		}
	});
};