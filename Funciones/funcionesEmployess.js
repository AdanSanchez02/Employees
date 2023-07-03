$(document).ready(function () {
  listarEmployees();
  console.log("Entro en la pagina");
});

$("#buscarTabla").on("keyup", function () {
  var value = $(this).val().toLowerCase();
  $("#registrosBD tr").filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
  });
});

function listarEmployees() {
  $.ajax({
    type: "ajax",
    method: "get",
    url: "http://localhost:9000/EmployeesWS/listar",
    contentType: "application/json; charset=UTF-8",
    dataType: "json",
    success: function (respuesta) {
      var registros;
      for (var i = 0; i < respuesta.length; i++) {
        registros +=
          "<tr>" +
          "<td>" +
          respuesta[i].id +
          "</td>" +
          "<td>" +
          respuesta[i].name +
          "</td>" +
          "<td>" +
          respuesta[i].last_name +
          "</td>" +
          "<td>" +
          respuesta[i].birthdate +
          "</td>" +
          "<td>" +
          respuesta[i].jobs.name +
          "</td>" +
          "<td>" +
          respuesta[i].jobs.salary +
          "</td>" +
          "<td>" +
          respuesta[i].genders.name +
          "</td>" +
          '<td> <a class="btn btn-warning" data="' +
          respuesta[i].id +
          '"><i class="fa fa-fw fa-filter"></i></a></td>' +
          '<td> <a class="btn btn-danger" data="' +
          respuesta[i].id +
          '"><i class="fa fa-fw fa-trash"></i></a></td>' +
          "</tr>";
      }
      $("#registrosBD").html(registros);
    },
    error: function (respueta) {
      console.log("Erro al listar");
    },
  });
}

$("#btnAbrirModal").click(function () {
  $("#modalAgregar").modal("show");
});

$("#btnGuardar").click(function () {
  var id = $("#id").val();
  var genero_id = $("#genero_id").val();
  var puesto_id = $("#puesto_id").val();
  var nombre = $("#nombre").val();
  var apellido = $("#apellido").val();
  var nacimiento = $("#nacimiento").val();

  if (id == "") {
    $("#id").focus();
  } else if (genero_id == "") {
    $("#genero_id").focus();
  } else if (puesto_id == "") {
    $("#puesto_id").focus();
  } else if (nombre == "") {
    $("#nombre").focus();
  } else if (apellido == "") {
    $("#apellido").focus();
  } else if (nacimiento == "") {
    $("#nacimiento").focus();
  } else {
    var json = {
      id: id,
      genders: {
        id: genero_id
      },
      jobs: {
        id: puesto_id
      },
      name: nombre,
      last_name: apellido,
      birthdate: nacimiento,
    };
    $.ajax({
      method: "post",
      url: "http://localhost:9000/EmployeesWS/guardar",
      data: JSON.stringify(json),
      contentType: "application/json; charset=UTF-8",
      success: function (respuesta) {
        if (respuesta == "id") {
          alert("ID YA DADO DE ALTA");
        } else if (respuesta == "nombre") {
          alert("TRABAJADOR YA DADO DE ALTA");
        } else if (respuesta == "puesto") {
          alert("ID DEL PUESTO NO EXISTE");
        } else if (respuesta == "menor") {
          alert("EMPLEADO MENOR DE EDAD");
        } else if (respuesta == "true") {
          $("#modalAgregar").modal("hide");
          $(".alert-success")
            .html("SE GUARDO CORRECTAMENTE EL EMPLEADO")
            .fadeIn()
            .delay(5000)
            .fadeOut("snow");
          listarEmployees();
        } else {
          alert("ERROR AL GUARDAR");
        }

      },
      error: function (respuesta) {
        console.log("error" + respuesta);
      },
    });
  }

});

//Boton Editar
$("#registrosBD").on("click", ".btn-warning", function () {
  var id = $(this).attr("data");
  buscar(id, 1);
});

//Boton Eliminar
$("#registrosBD").on("click", ".btn-danger", function () {
  var id = $(this).attr("data");
  buscar(id, 0);
});

// Funcion de buscar
function buscar(idx, fc) {
  var json = {
    id: idx
  };
  console.log("entro al buscar" + json);
  $.ajax({
    type: "ajax",
    method: "post",
    url: "http://localhost:9000/EmployeesWS/buscar",
    data: JSON.stringify(json),
    contentType: "application/json; charset=UTF-8",
    success: function (respuesta) {
      console.log("Entramos a editar y selecion " + respuesta);
      selectModal(respuesta, fc, idx);
    },
    error: function (repuesta) {
      console.log("error al buscar");
    },
  });
}

//Seleccion de Modal
function selectModal(respuesta, sel, id) {
  if (sel == 1) {
    // editar
    $("#idU").val(id);
    $("#genero_idU").val(respuesta.genders.id);
    $("#puesto_idU").val(respuesta.jobs.id);
    $("#nombreU").val(respuesta.name);
    $("#apellidoU").val(respuesta.last_name);
    $("#nacimientoU").val(respuesta.birthdate);
    $("#modalEditar").modal("show");
  } else if (sel == 0) {
    // eliminar
    $("#idE").val(id);
    $("#genero_idE").val(respuesta.genders.id);
    $("#puesto_idE").val(respuesta.jobs.id);
    $("#sueldoE").val(respuesta.jobs.salary);
    $("#nombreE").val(respuesta.name);
    $("#apellidoE").val(respuesta.last_name);
    $("#nacimientoE").val(respuesta.birthdate);
    $("#modalEliminar").modal("show");
  }
}

//Editar
$("#btnEditar").click(function () {
  var id = $("#idU").val();
  var genero_id = $("#genero_idU").val();
  var puesto_id = $("#puesto_idU").val();
  var nombre = $("#nombreU").val();
  var apellido = $("#apellidoU").val();
  var nacimiento = $("#nacimientoU").val();

  if (id == "") {
    $("#idU").focus();
  } else if (genero_id == "") {
    $("#genero_idU").focus();
  } else if (puesto_id == "") {
    $("#puesto_idU").focus();
  } else if (nombre == "") {
    $("#nombreU").focus();
  } else if (apellido == "") {
    $("#apellidoU").focus();
  } else if (nacimiento == "") {
    $("#nacimientoU").focus();
  } else {
    var json = {
      id: id,
      genders: {
        id: genero_id
      },
      jobs: {
        id: puesto_id
      },
      name: nombre,
      last_name: apellido,
      birthdate: nacimiento,
    };
    $.ajax({
      method: "post",
      url: "http://localhost:9000/EmployeesWS/editar",
      data: JSON.stringify(json),
      contentType: "application/json; charset=UTF-8",
      success: function (respuesta) {
        if (respuesta == "puesto") {
          alert("ID DEL PUESTO NO EXISTE");
        } else if (respuesta == "menor") {
          alert("EMPLEADO MENOR DE EDAD");
        } else if (respuesta == "true") {
          $("#modalEditar").modal("hide");
          $(".alert-info")
            .html("SE EDITO CORRECTAMENTE EL EMPLEADO")
            .fadeIn()
            .delay(4000)
            .fadeOut("snow");
          listarEmployees();
        } else {
          alert("ERROR AL EDITAR");
        }

      },
      error: function (respuesta) {
        console.log("error" + respuesta);
      },
    });
  }

});

// Eliminar
$('#btnEliminar').click(function(){

	var id = $('#idE').val();
  var mostrar = $('#nombreE').val();
	var json= {"id":id};

	$.ajax({
		type: 'ajax',
		method: 'post',
		url: 'http://localhost:9000/EmployeesWS/eliminar',
		data: JSON.stringify(json),
		contentType: 'application/json; charset=UTF-8',
		success: function(){
			$('#modalEliminar').modal('hide');
			$('.alert-danger').html("SE ELIMINO EL EMPLEADO: " + mostrar).fadeIn().delay(4000).fadeOut('snow');  
      listarEmployees();
		}, 
		error: function(respuesta){
			console.log("error al eliminar");
		}

	})

})