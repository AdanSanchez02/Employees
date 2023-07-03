$(document).ready(function () {
  listarZapateria();
  console.log("Entro en la pagina");
});

$("#buscarTabla").on("keyup", function () {
  var value = $(this).val().toLowerCase();
  $("#registrosBD tr").filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
  });
});

function listarZapateria() {
  $.ajax({
    type: "ajax",
    method: "get",
    url: "http://localhost:9000/ZapateriaWS/listar",
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
          respuesta[i].marca +
          "</td>" +
          "<td>" +
          respuesta[i].modelo +
          "</td>" +
          "<td>" +
          respuesta[i].color +
          "</td>" +
          "<td>" +
          respuesta[i].tamano +
          "</td>" +
          "<td>" +
          respuesta[i].precio +
          "</td>" +
          "<td>" +
          respuesta[i].cantidad +
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
  var marca = $("#marca").val();
  var modelo = $("#modelo").val();
  var color = $("#color").val();
  var tamano = $("#tamano").val();
  var precio = $("#precio").val();
  var cantidad = $("#cantidad").val();

  if (id == "") {
    $("#id").focus();
  } else if (marca == "") {
    $("#marca").focus();
  } else if (modelo == "") {
    $("#modelo").focus();
  } else if (color == "") {
    $("#color").focus();
  } else if (tamano == "") {
    $("#tamano").focus();
  } else if (precio == "") {
    $("#precio").focus();
  } else if (cantidad == "") {
    $("#cantidad").focus();
  } else {
    var json = {
      id: id,
      marca: marca,
      modelo: modelo,
      color: color,
      tamano: tamano,
      precio: precio,
      cantidad: cantidad,
    };

    $.ajax({
      method: "post",
      url: "http://localhost:9000/ZapateriaWS/guardar",
      data: JSON.stringify(json),
      contentType: "application/json; charset=UTF-8",
      success: function (respuesta) {
        $("#modalAgregar").modal("hide");
        $(".alert-secondary")
          .html("Se guardo el empleado")
          .fadeIn()
          .delay(5000)
          .fadeOut("snow");
        listarZapateria();
      },
    });
  }
});

$("#registrosBD").on("click", ".btn-warning", function () {
  var id = $(this).attr("data");
  buscar(id, 1);
});

$("#registrosBD").on("click", ".btn-danger", function () {
  var id = $(this).attr("data");
  buscar(id, 0);
});

// Funcion de buscar

function buscar(idx, fc) {
  var json = { id: idx };
  console.log("entro al buscar" + json);
  $.ajax({
    type: "ajax",
    method: "post",
    url: "http://localhost:9000/ZapateriaWS/buscar",
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
    $("#marcaU").val(respuesta.marca);
    $("#modeloU").val(respuesta.modelo);
    $("#colorU").val(respuesta.color);
    $("#tamanoU").val(respuesta.tamano);
    $("#precioU").val(respuesta.precio);
    $("#cantidadU").val(respuesta.cantidad);
    $("#modalEditar").modal("show");
  } else if (sel == 0) {
    // eliminar
    $("#idD").val(id);
    $("#marcaD").val(respuesta.marca);
    $("#modeloD").val(respuesta.modelo);
    $("#colorD").val(respuesta.color);
    $("#tamanoD").val(respuesta.tamano);
    $("#precioD").val(respuesta.precio);
    $("#cantidadD").val(respuesta.cantidad);
    $("#modalEliminar").modal("show");
  }
}
 //Boton Editar
$("#btnEditar").click(function () {
  var id = $("#idU").val();
  var marca = $("#marcaU").val();
  var modelo = $("#modeloU").val();
  var color = $("#colorU").val();
  var tamano = $("#tamanoU").val();
  var precio = $("#precioU").val();
  var cantidad = $("#cantidadU").val();

  if (id == "") {
    $("#idU").focus();
  } else if (marca == "") {
    $("#marcaU").focus();
  } else if (modelo == "") {
    $("#modeloU").focus();
  } else if (color == "") {
    $("#colorU").focus();
  } else if (tamano == "") {
    $("#tamanoU").focus();
  } else if (precio == "") {
    $("#precioU").focus();
  } else if (cantidad == "") {
    $("#cantidadU").focus();
  } else {
    var json = {
      id: id,
      marca: marca,
      modelo: modelo,
      color: color,
      tamano: tamano,
      precio: precio,
      cantidad: cantidad,
    };

    $.ajax({
      method: "post",
      url: "http://localhost:9000/ZapateriaWS/editar",
      data: JSON.stringify(json),
      contentType: "application/json; charset=UTF-8",
      success: function (respuesta) {
        $("#modalEditar").modal("hide");
        $(".alert-info")
          .html("Se edito el producto")
          .fadeIn()
          .delay(5000)
          .fadeOut("snow");
        listarZapateria();
      },
    });
  }
});

//Boton Eliminar
// Eliminar
$('#btnEliminar').click(function(){

	var id = $('#idD').val();
	var json= {"id":id};

	$.ajax({
		type: 'ajax',
		method: 'post',
		url: 'http://localhost:9000/ZapateriaWS/eliminar',
		data: JSON.stringify(json),
		contentType: 'application/json; charset=UTF-8',
		success: function(){
			$('#modalEliminar').modal('hide');
			$('.alert-danger').html("Se elimino el producto").fadeIn().delay(5000).fadeOut('snow');  
            
			listarZapateria();
		}, 
		error: function(respuesta){
			console.log("error al eliminar");
		}

	})

})