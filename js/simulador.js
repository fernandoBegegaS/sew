class Simulacion{


    obtnerEquipo(nombre){
        $(document).ready(function() {
            $('#obtener_equipos').on('click', function() {
                var id_usuario = $('#id_usuario').val(); // Obtenemos el ID del usuario desde el input

                // Verificamos si se ha introducido un ID válido
                if (id_usuario) {
                    $.ajax({
                        url: 'obtenerEquipos.php',  // Ruta del archivo PHP
                        type: 'GET',
                        data: { id_usuario: id_usuario },  // Enviamos el ID del usuario
                        dataType: 'json',  // Esperamos una respuesta en formato JSON
                        success: function(response) {
                            
                        },
                        error: function() {
                            $('#equipos').html('<p>Error al obtener los datos</p>');
                        }
                    });
                } else {
                    alert("Por favor, ingrese un ID de usuario.");
                }
            });
        });
    }

    añadirFuncionalidadAlBoton() {
        $(document).ready(function () {
            // Puedes añadir funcionalidades adicionales a otros botones aquí
            $('#otro_boton').on('click', function () {
                alert("¡Este es otro botón!");
                // Aquí puedes agregar más lógica si lo necesitas
            });
        });
    }

}