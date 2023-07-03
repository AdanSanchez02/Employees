$(document).ready(function () {
  listarRegistros();
  console.log("Entro en la pagina");
});

$("#buscarTabla").on("keyup", function () {
  var value = $(this).val().toLowerCase();
  $("#registrosBD tr").filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
  });
});

function listarRegistros() {
  $.ajax({
    type: "ajax",
    method: "get",
    url: "http://localhost:9000/WorkedWS/listar",
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
          respuesta[i].employees.name +
          "</td>" +
          "<td>" +
          respuesta[i].employees.last_name +
          "</td>" +
          "<td>" +
          respuesta[i].employees.jobs.name +
          "</td>" +
          "<td>" +
          respuesta[i].worked_hours +
          "</td>" +
          "<td>" +
          respuesta[i].worked_date +
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
  var empleado_id = $("#empleado_id").val();
  var horas = $("#horas").val();
  var fecha = $("#fecha").val();

  if (id == "") {
    $("#id").focus();
  } else if (empleado_id == "") {
    $("#empleado_id").focus();
  } else if (horas == "") {
    $("#horas").focus();
  } else if (fecha == "") {
    $("#fecha").focus();
  } else {
    var json = {
      id: id,
      employees: {
        id: empleado_id
      },
      worked_hours: horas,
      worked_date: fecha,
    };
    $.ajax({
      method: "post",
      url: "http://localhost:9000/WorkedWS/guardar",
      data: JSON.stringify(json),
      contentType: "application/json; charset=UTF-8",
      success: function (respuesta) {
        if (respuesta == "empleado") {
          alert("ESE EMPLEADO NO EXISTE");
        } else if (respuesta == "true") {
          $("#modalAgregar").modal("hide");
          $(".alert-success")
            .html("SE GUARDO CORRECTAMENTE EL REGISTRO")
            .fadeIn()
            .delay(5000)
            .fadeOut("snow");
          listarRegistros();
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
    url: "http://localhost:9000/WorkedWS/buscar",
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
    $("#empleado_idU").val(respuesta.employees.id);
    $("#horasU").val(respuesta.worked_hours);
    $("#fechaU").val(respuesta.worked_date);
    $("#modalEditar").modal("show");
  } else if (sel == 0) {
    // eliminar
    $("#idE").val(id);
    $("#empleado_idE").val(respuesta.employees.name);
    $("#horasE").val(respuesta.worked_hours);
    $("#fechaE").val(respuesta.worked_date);
    $("#modalEliminar").modal("show");
  }
}

//Editar
$("#btnEditar").click(function () {
  var id = $("#idU").val();
  var empleado_id = $("#empleado_idU").val();
  var horas = $("#horasU").val();
  var fecha = $("#fechaU").val();

  if (id == "") {
    $("#idU").focus();
  } else if (empleado_id == "") {
    $("#empleado_idU").focus();
  } else if (horas == "") {
    $("#horasU").focus();
  } else if (fecha == "") {
    $("#fechaU").focus();
  } else {
    var json = {
      id: id,
      employees: {
        id: empleado_id
      },
      worked_hours: horas,
      worked_date: fecha,
    };
    $.ajax({
      method: "post",
      url: "http://localhost:9000/WorkedWS/editar",
      data: JSON.stringify(json),
      contentType: "application/json; charset=UTF-8",
      success: function (respuesta) {
        if (respuesta == "empleado") {
          alert("ESE EMPLEADO NO EXISTE");
        } else if (respuesta == "true") {
          $("#modalEditar").modal("hide");
          $(".alert-info")
            .html("SE EDITO CORRECTAMENTE EL REGISTRO")
            .fadeIn()
            .delay(5000)
            .fadeOut("snow");
          listarRegistros();
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

// Eliminar
$('#btnEliminar').click(function () {

  var id = $('#idE').val();
  var json = {
    "id": id
  };

  $.ajax({
    type: 'ajax',
    method: 'post',
    url: "http://localhost:9000/WorkedWS/eliminar",
    data: JSON.stringify(json),
    contentType: 'application/json; charset=UTF-8',
    success: function () {
      $('#modalEliminar').modal('hide');
      $('.alert-danger').html("SE ELIMINO EL REGISTRO ").fadeIn().delay(4000).fadeOut('snow');
      listarRegistros();
    },
    error: function (respuesta) {
      console.log("error al eliminar");
    }

  })

})
