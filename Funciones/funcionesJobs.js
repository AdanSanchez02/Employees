$(document).ready(function () {
  listarJobs();
  console.log("Entro en la pagina");
});

$("#buscarTabla").on("keyup", function () {
  var value = $(this).val().toLowerCase();
  $("#registrosBD tr").filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
  });
});

function listarJobs() {
  $.ajax({
    type: "ajax",
    method: "get",
    url: "http://localhost:9000/JobsWS/listar",
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
          respuesta[i].salary +
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
  var nombre = $("#nombre").val();
  var salario = $("#salario").val();

  if (id == "") {
    $("#id").focus();
  } else if (nombre == "") {
    $("#nombre").focus();
  } else if (salario == "") {
    $("#salario").focus();
  } else {
    var json = {
      id: id,
      name: nombre,
      salary: salario,
    };
    $.ajax({
      method: "post",
      url: "http://localhost:9000/JobsWS/guardar",
      data: JSON.stringify(json),
      contentType: "application/json; charset=UTF-8",
      success: function (respuesta) {
        if (respuesta == "id") {
          alert("ID YA DADO DE ALTA");
        } else if (respuesta == "name") {
          alert("PUESTO YA DADO DE ALTA");
        }  else if (respuesta == "true") {
          $("#modalAgregar").modal("hide");
          $(".alert-success")
            .html("SE GUARDO CORRECTAMENTE EL PUESTO")
            .fadeIn()
            .delay(5000)
            .fadeOut("snow");
            listarJobs();
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
    url: "http://localhost:9000/JobsWS/buscar",
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
    $("#nombreU").val(respuesta.name);
    $("#salarioU").val(respuesta.salary);
    $("#modalEditar").modal("show");
  } else if (sel == 0) {
    // eliminar
    $("#idE").val(id);
    $("#nombreE").val(respuesta.name);
    $("#salarioE").val(respuesta.salary);
    $("#modalEliminar").modal("show");
  }
}

//Editar
$("#btnEditar").click(function () {
  var id = $("#idU").val();
  var nombre = $("#nombreU").val();
  var salario = $("#salarioU").val();

  if (id == "") {
    $("#idU").focus();
  } else if (nombre == "") {
    $("#nombreU").focus();
  } else if (salario == "") {
    $("#salarioU").focus();
  } else {
    var json = {
      id: id,
      name: nombre,
      salary: salario,
    };
    $.ajax({
      method: "post",
      url: "http://localhost:9000/JobsWS/editar",
      data: JSON.stringify(json),
      contentType: "application/json; charset=UTF-8",
      success: function (respuesta) {
         if (respuesta == "name") {
          alert("PUESTO YA DADO DE ALTA");
        }  else if (respuesta == "true") {
          $("#modalEditar").modal("hide");
          $(".alert-info")
            .html("SE EDITO CORRECTAMENTE EL PUESTO")
            .fadeIn()
            .delay(5000)
            .fadeOut("snow");
            listarJobs();
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
$('#btnEliminar').click(function () {

  var id = $('#idE').val();
  var mostrar = $('#nombreE').val();
  var json = {
    "id": id
  };

  $.ajax({
    type: 'ajax',
    method: 'post',
    url: "http://localhost:9000/JobsWS/eliminar",
    data: JSON.stringify(json),
    contentType: 'application/json; charset=UTF-8',
    success: function () {
      $('#modalEliminar').modal('hide');
      $('.alert-danger').html("SE ELIMINO EL PUESTO: " + mostrar).fadeIn().delay(4000).fadeOut('snow');
      listarJobs();
    },
    error: function (respuesta) {
      console.log("error al eliminar");
    }

  })

})
