$(document).ready(function(){
	listarEmpleados();
	//buscarEmpleado();
});

function listarEmpleados(){
	// Ajax - Es una metodologia de trabajo, trabaja de manera azincrona --> Nos permite hacer la comunicacion del cliente con el servidos 
	// --> a traves de los metodos GET, POS, PUT...
	$.ajax({
		method: 'get',
		url: 'http://localhost:9000/EmpleadosWS/listar',
		contentType: 'application/json; charset=UTF-8',
		dataType: 'json',
		success:function(respuesta){ // recibir la respuesta del servidor
			//console.log(respuesta);
			var registros;
			for(var i=0; i<respuesta.length; i++){
				registros += '<tr>' +
									'<td>' +respuesta[i].id +'</td>'+
									'<td>' +respuesta[i].nombre +'</td>'+
									'<td>' +respuesta[i].app +'</td>'+
									'<td>' +respuesta[i].apm +'</td>'+
									'<td>' +respuesta[i].nss +'</td>'+
									'<td>' +respuesta[i].num_cel +'</td>'+
									'<td>' +respuesta[i].sueldo +'</td>'+
									'<td>' +respuesta[i].correo +'</td>'+
									'<td> <a class="btn btn-warning" data="'+respuesta[i].id +'"><i class="fa fa-fw fa-sync"></i></a></td>'+
									'<td> <a class="btn btn-danger" data="'+respuesta[i].id +'"><i class="fa fa-fw fa-trash"></i></a></td>'+
								'</tr>'
			}
			$('#registrosBD').html(registros);
			//Aqui podria ir el buscar
			buscarEmpleado();
		},
		error:function(respues){
			console.log("Error al listar");
		}
	})

}

function buscarEmpleado(){
	$("#buscarTabla").on("keyup", function() {
		var value = $(this).val().toLowerCase();
		$("#registrosBD tr").filter(function() {
			$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
		});
	});
}

$('#btnAbrirModal').click(function(){
	$('#modalAgregar').modal('show');
});

$('#btnGuardar').click(function(){
	var id = $('#id').val();
	var nombre = $('#nombre').val();
	var app = $('#app').val();
	var apm = $('#apm').val();
	var nss = $('#nss').val();
	var num_cel = $('#num_cel').val();
	var sueldo = $('#sueldo').val();
	var correo = $('#correo').val();

	if(id == ''){
		$('#id').focus();//alert("Ingrensar id");
	} else if(nombre == ''){
		$('#nombre').focus();
	} else if(app == ''){
			$('#app').focus();
		}else if(apm == ''){
			$('#apm').focus();
		}else if(nss == ''){
			$('#nss').focus();
		}else if(num_cel == ''){
			$('#num_cel').focus();
		} else if(sueldo == ''){
			$('#sueldo').focus();
		}else  if(correo == ''){
		$('#correo').focus();
		}else {
			var json = {
				    "id": id,
				    "nombre": nombre,
				    "app": app,
				    "apm": apm,
				    "nss": nss,
				    "num_cel": num_cel,
				    "sueldo": sueldo,
				    "correo": correo
			};
			//console.log(json);
			$.ajax({
				method: 'post',
				url: 'http://localhost:9000/EmpleadosWS/guardar',
				data: JSON.stringify(json),
				contentType: 'application/json; charset=UTF-8',
				success:function(respuesta){
					//alert('Se guardo el empleado');
					$('#modalAgregar').modal('hide');
					$('.alert-dark').html("Se guardo el empleado").fadeIn().delay(5000).fadeOut('snow');
					listarEmpleados();
				}
			});
		}
});

// Para editar hay que buscar
$("#registrosBD").on('click', '.btn-warning', function(){
	var id=$(this).attr('data');
	//console.log(id);

	var json = { "id": id};
	$.ajax({
		type: 'ajax',
		method: 'post',
		url: 'http://localhost:9000/EmpleadosWS/buscar',
		data: JSON.stringify(json),
		contentType: 'application/json; charset=UTF-8',
		success: function(respuesta){
			//console.log(respuesta);
			$('#idU').val(id);
			$('#nombreU').val(respuesta.nombre);
			$('#appU').val(respuesta.app);
			$('#apmU').val(respuesta.apm);
			$('#nssU').val(respuesta.nss);
			$('#num_celU').val(respuesta.num_cel);
			$('#sueldoU').val(respuesta.sueldo);
			$('#correoU').val(respuesta.correo);
			$('#modalEditar').modal('show');
		}, 
		error: function(repuesta){
			console.log("error al buscar");
		}
	})
});

//Editar
$('#btnEditar').click(function(){
	var id = $('#idU').val();
	var nombre = $('#nombreU').val();
	var app = $('#appU').val();
	var apm = $('#apmU').val();
	var nss = $('#nssU').val();
	var num_cel = $('#num_celU').val();
	var sueldo = $('#sueldoU').val();
	var correo = $('#correoU').val();

	if(id == ''){
		$('#idU').focus();//alert("Ingrensar id");
	} else if(nombre == ''){
		$('#nombreU').focus();
	} else if(app == ''){
			$('#appU').focus();
		}else if(apm == ''){
			$('#apmU').focus();
		}else if(nss == ''){
			$('#nssU').focus();
		}else if(num_cel == ''){
			$('#num_celU').focus();
		} else if(sueldo == ''){
			$('#sueldoU').focus();
		}else  if(correo == ''){
		$('#correoU').focus();
		}else {
			var json = {
				    "id": id,
				    "nombre": nombre,
				    "app": app,
				    "apm": apm,
				    "nss": nss,
				    "num_cel": num_cel,
				    "sueldo": sueldo,
				    "correo": correo
			};

			$.ajax({
				type: 'ajax',
				method: 'post',
				url: 'http://localhost:9000/EmpleadosWS/editar',
				data: JSON.stringify(json),
				contentType: 'application/json; charset=UTF-8',
				success: function(repuesta){
					$('#modalEditar').modal('hide');
					$('.alert-info').html("Se edito el empleado").fadeIn().delay(5000).fadeOut('snow');
					listarEmpleados();
				},
				error: function(respuesta) {
					console.log("error al editar");
					}
			})
		}
})


// Para eliminar hay que buscar
$("#registrosBD").on('click', '.btn-danger', function(){
	var id=$(this).attr('data');

	var json = { "id": id};
	$.ajax({
		type: 'ajax',
		method: 'post',
		url: 'http://localhost:9000/EmpleadosWS/buscar',
		data: JSON.stringify(json),
		contentType: 'application/json; charset=UTF-8',
		success: function(respuesta){
			//console.log(respuesta);
			$('#idD').val(id);
			$('#nombreD').val(respuesta.nombre);
			$('#appD').val(respuesta.app);
			$('#apmD').val(respuesta.apm);
			$('#nssD').val(respuesta.nss);
			$('#num_celD').val(respuesta.num_cel);
			$('#sueldoD').val(respuesta.sueldo);
			$('#correoD').val(respuesta.correo);
			$('#modalEliminar').modal('show');
		}, 
		error: function(repuesta){
			console.log("error al buscar");
		}
	})
});


// Eliminar
$('#btnEliminar').click(function(){

	var id = $('#idD').val();
	var json= {"id":id};

	$.ajax({
		type: 'ajax',
		method: 'post',
		url: 'http://localhost:9000/EmpleadosWS/eliminar',
		data: JSON.stringify(json),
		contentType: 'application/json; charset=UTF-8',
		success: function(){
			$('#modalEliminar').modal('hide');
			$('.alert-danger').html("Se elimino el empleado").fadeIn().delay(5000).fadeOut('snow');
			listarEmpleados();
		}, 
		error: function(respuesta){
			console.log("error al eliminar");
		}

	})

})



