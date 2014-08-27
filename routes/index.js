var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/desarrollo_tareas');

/* GET home page. */
router.get('/', function(req, res) {
	console.log("ruta/");
  res.render('index', { title: 'Express' });
});

function validateTarea(value){
	return value && value.length;
}

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var Tarea = new Schema({
    tarea: {type:String, validate:[validateTarea,'Una tarea es obligatoria']}
}); 
var Tarea = mongoose.model('Tarea',Tarea);

//ver tareas
router.get('/tareas',function(req,res) {
	Tarea.find({},function(err,docs){
		res.render('tareas/index',{
			title: 'Vista index Lista tareas',
			docs: docs
		});
	});
});

//crear tarea
router.get('/tareas/nueva',function(req,res) {
	res.render('tareas/nueva',{
		title: 'Nueva tarea'
	});
});
router.post('/tareas',function(req,res){
	var tarea = new Tarea(req.body.tarea);
	tarea.save(function(err){
		if(!err){
			res.redirect('/tareas');
		}
		else{
			res.redirect('/tareas/nueva');
		}
	});
});

//editar tarea
router.get('/tareas/:id/editar',function(req,res) {
	Tarea.findById(req.params.id,function(err,doc){
		res.render('tareas/edit',{
			title: 'Vista editar tarea',
			tarea: doc
		});
	});
});
router.post('/tareas/:id',function(req,res){
	Tarea.findById(req.params.id,function(err,doc){
		doc.tarea = req.body.tarea.tarea;
		doc.save(function(err){
			if(!err){
				console.log("redireccionando...");
				res.redirect('/tareas');
			}
			else{
				//manejo de errores
			}
		});
	});
});

//eliminar tarea
router.post('/tareas/delete/:id',function(req,res){
	Tarea.findById(req.params.id,function(err,doc){
		if(!doc)
			return next(new NotFound('Document not found'));
		doc.remove(function(){
			res.redirect('/tareas');
		});
	});
});

module.exports = router;
