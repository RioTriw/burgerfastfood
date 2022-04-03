var express = require('express');
var router = express.Router();
var authentication_mdl = require('../middlewares/authentication');
var session_store;
/* GET datapesanan page. */

router.get('/',authentication_mdl.is_login, function(req, res, next) {
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM datapesanan',function(err,rows)
		{
			if(err)
				var errornya  = ("Error Selecting : %s ",err );   
			req.flash('msg_error', errornya);   
			res.render('datapesanan/list',{title:"Data Pesanan",data:rows,session_store:req.session});
		});
         //console.log(query.sql);
     });
});

router.delete('/delete/(:id)',authentication_mdl.is_login, function(req, res, next) {
	req.getConnection(function(err,connection){
		var datapesanan = {
			id: req.params.id,
		}
		
		var delete_sql = 'delete from datapesanan where ?';
		req.getConnection(function(err,connection){
			var query = connection.query(delete_sql, datapesanan, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Delete : %s ",err);
					req.flash('msg_error', errors_detail); 
					res.redirect('/datapesanans');
				}
				else{
					req.flash('msg_info', 'Pesanan Selesai !!'); 
					res.redirect('/datapesanans');
				}
			});
		});
	});
});
router.get('/edit/(:id)',authentication_mdl.is_login, function(req,res,next){
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM datapesanan where id='+req.params.id,function(err,rows)
		{
			if(err)
			{
				var errornya  = ("Error Selecting : %s ",err );  
				req.flash('msg_error', errors_detail); 
				res.redirect('/datapesanans'); 
			}else
			{
				if(rows.length <=0)
				{
					req.flash('msg_error', "Data Burger can't be find!"); 
					res.redirect('/datapesanans');
				}
				else
				{	
					console.log(rows);
					res.render('datapesanan/edit',{title:"Edit ",data:rows[0],session_store:req.session});

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
		v_phone = req.sanitize( 'phone' ).escape().trim();

		var datapesanan = {
			name: v_name,
			stock: v_stock,
			harga: v_harga,
			phone: v_phone
		}

		var update_sql = 'update datapesanan SET ? where id = '+req.params.id;
		req.getConnection(function(err,connection){
			var query = connection.query(update_sql, datapesanan, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Update : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('datapesanan/edit', 
					{ 
						name: req.param('name'), 
						stock: req.param('stock'),
						harga: req.param('harga'),
						phone: req.param('phone'),
					});
				}else{
					req.flash('msg_info', 'Update data pesanan success'); 
					res.redirect('/datapesanans/edit/'+req.params.id);
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
		res.redirect('/datapesanans/edit/'+req.params.id);
	}
});

router.post('/add',authentication_mdl.is_login, function(req, res, next) {
	req.assert('name', 'Please fill the name').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {

		v_name = req.sanitize( 'name' ).escape().trim(); 
		v_stock = req.sanitize( 'stock' ).escape().trim();
		v_harga = req.sanitize( 'harga' ).escape().trim();
		v_phone = req.sanitize( 'phone' ).escape().trim();

		var datapesanan = {
			name: v_name,
			stock: v_stock,
			harga: v_harga,
			phone: v_phone
		}

		var insert_sql = 'INSERT INTO datapesanan SET ?';
		req.getConnection(function(err,connection){
			var query = connection.query(insert_sql, datapesanan, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Insert : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('datapesanan/add-datapesanan', 
					{ 
						name: req.param('name'), 
						stock: req.param('stock'),
						harga: req.param('harga'),
						phone: req.param('phone'),
						session_store:req.session,
					});
				}else{
					req.flash('msg_info', 'Tambah data pesanan success'); 
					res.redirect('/datapesanans');
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
		res.render('datapesanan/add-datapesanan', 
		{ 
			name: req.param('name'), 
			stock: req.param('stock'),
			session_store:req.session
		});
	}

});

router.get('/add',authentication_mdl.is_login, function(req, res, next) {
	res.render(	'datapesanan/add-datapesanan', 
	{ 
		title: 'Add New Data Pesanan',
		name: '',
		harga: '',
		stock:'',
		phone:'',
		session_store:req.session
	});
});

module.exports = router;