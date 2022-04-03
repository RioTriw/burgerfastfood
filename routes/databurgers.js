var express = require('express');
var router = express.Router();
var authentication_mdl = require('../middlewares/authentication');
var session_store;
/* GET databurger page. */

router.get('/',authentication_mdl.is_login, function(req, res, next) {
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM databurger',function(err,rows)
		{
			if(err)
				var errornya  = ("Error Selecting : %s ",err );   
			req.flash('msg_error', errornya);   
			res.render('databurger/list',{title:"Data Burger",data:rows,session_store:req.session});
		});
         //console.log(query.sql);
     });
});

router.delete('/delete/(:id)',authentication_mdl.is_login, function(req, res, next) {
	req.getConnection(function(err,connection){
		var databurger = {
			id: req.params.id,
		}
		
		var delete_sql = 'delete from databurger where ?';
		req.getConnection(function(err,connection){
			var query = connection.query(delete_sql, databurger, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Delete : %s ",err);
					req.flash('msg_error', errors_detail); 
					res.redirect('/databurgers');
				}
				else{
					req.flash('msg_info', 'Delete Data Burger Success'); 
					res.redirect('/databurgers');
				}
			});
		});
	});
});
router.get('/edit/(:id)',authentication_mdl.is_login, function(req,res,next){
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM databurger where id='+req.params.id,function(err,rows)
		{
			if(err)
			{
				var errornya  = ("Error Selecting : %s ",err );  
				req.flash('msg_error', errors_detail); 
				res.redirect('/databurgers'); 
			}else
			{
				if(rows.length <=0)
				{
					req.flash('msg_error', "Data Burger can't be find!"); 
					res.redirect('/databurgers');
				}
				else
				{	
					console.log(rows);
					res.render('databurger/edit',{title:"Edit ",data:rows[0],session_store:req.session});

				}
			}

		});
	});
});
router.put('/edit/(:id)',authentication_mdl.is_login, function(req,res,next){
	req.assert('name', 'Please fill the name').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {
		v_name = req.sanitize( 'name' ).escape().trim(); 
		v_stock = req.sanitize( 'stock' ).escape().trim();
		v_harga = req.sanitize( 'harga' ).escape().trim();

		var databurger = {
			name: v_name,
			stock: v_stock,
			harga: v_harga
		}

		var update_sql = 'update databurger SET ? where id = '+req.params.id;
		req.getConnection(function(err,connection){
			var query = connection.query(update_sql, databurger, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Update : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('databurger/edit', 
					{ 
						name: req.param('name'), 
						stock: req.param('stock'),
						harga: req.param('harga'),
					});
				}else{
					req.flash('msg_info', 'Update data burger success'); 
					res.redirect('/databurgers/edit/'+req.params.id);
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "<p>Sory there are error</p><ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.redirect('/databurgers/edit/'+req.params.id);
	}
});

router.post('/add',authentication_mdl.is_login, function(req, res, next) {
	req.assert('name', 'Please fill the name').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {

		v_name = req.sanitize( 'name' ).escape().trim(); 
		v_stock = req.sanitize( 'stock' ).escape().trim();
		v_harga = req.sanitize( 'harga' ).escape().trim();

		var databurger = {
			name: v_name,
			stock: v_stock,
			harga: v_harga
		}

		var insert_sql = 'INSERT INTO databurger SET ?';
		req.getConnection(function(err,connection){
			var query = connection.query(insert_sql, databurger, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Insert : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('databurger/add-databurger', 
					{ 
						name: req.param('name'), 
						stock: req.param('stock'),
						harga: req.param('harga'),
						session_store:req.session,
					});
				}else{
					req.flash('msg_info', 'Create databurger success'); 
					res.redirect('/databurgers');
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "<p>Sory there are error</p><ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('databurger/add-databurger', 
		{ 
			name: req.param('name'), 
			stock: req.param('stock'),
			session_store:req.session
		});
	}

});

router.get('/add',authentication_mdl.is_login, function(req, res, next) {
	res.render(	'databurger/add-databurger', 
	{ 
		title: 'Add New Data Burger',
		name: '',
		harga: '',
		stock:'',
		session_store:req.session
	});
});

module.exports = router;
