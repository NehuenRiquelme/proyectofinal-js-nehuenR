let seccionProductos = document.getElementById("seccionProductos");

let divOpciones = document.getElementById("divOpciones");

let boton_cerrarSesion = document.getElementById("boton_cerrarSesion");
boton_cerrarSesion.setAttribute("href","javascript:usuario.cerrarSesion()");

let buscador = document.getElementById("buscador");

let divRegistrar = document.getElementById("divRegistrar");

let divIniciarSesion = document.getElementById("divIniciarSesion");

let botonBusacar = document.getElementById("botonBuscar");

let autocomplementado = document.getElementById("autocomplementado");



// let encontrar = document.querySelector('#buscador');
let usuario;
let ruta = "./productos.json";
let usuarioActivo;
let usuarios = [];
let productos = []
let marcas = []

// Recupero datos de la "base de datos" y los vuelco en arrays para trabajarlos

// recupero los productos y las marcas
fetch(ruta)
.then((resp) => resp.json())
 .then((producto) =>{

productos = producto.productos;
marcas = producto.marcas
gestorProd.renderizarProductos(productos);

})


// Botón registrar nuevo usuario
let boton_registrar = document.getElementById("boton_registrar");
boton_registrar.addEventListener("click",pedirDatos)


// Solicitar datos al usuario 


function pedirDatos(){
    
    let nombre_usuario_registrar = document.getElementById("nombre_usuario_regsitrar").value = "";
    let nombre_registrar = document.getElementById("nombre_registrar").value = "";
    let apellido_registrar = document.getElementById("apellido_registrar").value = "";
    let e_mail_registrar = document.getElementById("email_registrar").value = "";
    let contraseña_registrar = document.getElementById("password_registrar").value = "";
   
    divRegistrar.classList.remove("hide");
    divRegistrar.classList.add("visible");


    let formRegistrar = document.getElementById("formRegistrar");
    formRegistrar.addEventListener("submit",validarFormularioRegistro);
  
    
}


// Validar formulario de registro

function validarFormularioRegistro(e){

    e.preventDefault();

    let nombre_usuario_registrar = document.getElementById("nombre_usuario_regsitrar").value;
    let nombre_registrar = document.getElementById("nombre_registrar").value;
    let apellido_registrar = document.getElementById("apellido_registrar").value;
    let e_mail_registrar = document.getElementById("email_registrar").value;
    let contraseña_registrar = document.getElementById("password_registrar").value;

    let user = new Usuario(nombre_usuario_registrar,nombre_registrar,apellido_registrar,e_mail_registrar,contraseña_registrar);

    usuario.registrarUsuario(user);

}




// Botón iniciar Sesión
let boton_iniciarSesion = document.getElementById("boton_iniciarSesion")
boton_iniciarSesion.addEventListener("click",()=>{
   
    if(usuario.sesionIniciada()){

        usuario.mostrarBotonCerrarSesion();

    }else{

   
    divIniciarSesion.classList.remove("hide");
    divIniciarSesion.classList.add("visible");

    let formIniciarSesion = document.getElementById("formIniciarSesion");
    formIniciarSesion.addEventListener("submit",validarFormularioInicioSesion);

    }
    });






    function validarFormularioInicioSesion(e){
        
        e.preventDefault();

        let nombre_usuarioIniciarSesion = document.getElementById("nombre_usuarioIniciarSesion").value;
        let passwordIniciarSesion = document.getElementById("passwordIniciarSesion").value;

        usuario.iniciarSesion(nombre_usuarioIniciarSesion,passwordIniciarSesion);

    };

    








// Variable donde se almacenará la el precio total de la compra

let precioTotal= 0;

// Variable donde se almacenará el precio de cada producto

let precioProducto = 0;




// Esta función crea un nuevo objeto de clase Producto
//  y llama al método que se encarga de pushearlo al carrito del usuario con la sesión activa
 function crearProducto(id){

    if(usuario.sesionIniciada()){

        let producto = document.getElementById("producto_" + id)
        producto = new Producto(id,
                            producto.querySelector('h5').textContent,
                            producto.querySelector('.precio').textContent.substring(1,6),
                            producto.querySelector('img').src);
        let user = usuarios.find(u => u.sesion == 1);
        gestorProd.addCarrito(producto,user);
        
    }else{

        Swal.fire("Debe iniciar sesión para agregar productos al carrito")

    }
    
}


function colorStock(contenedorProd){

    let stock = contenedorProd.querySelectorAll("span") 
    stock.forEach(e =>{

        let msj = document.createElement("p")
        
        
        if(parseInt(e.textContent)> 10){

            e.classList.add("muchos")
            e.classList.remove("pocos")
    
        }else{

            e.classList.add("pocos")
            e.classList.remove("muchos")
        }

    })
    

}

// Esta funcion quita todo el contenido del carrito
function vaciarCarrito(){

    Swal.fire({
        title: '¿Está seguro de retirar todos los productos del carrito?',
        showDenyButton: true,
        confirmButtonText: 'SI',
        denyButtonText: `NO`,
      }).then((resp) => {

        if(resp.isConfirmed){
            usuarioActivo.carrito = []; 
            gestorProd.contador();
            localStorage.setItem(`carrito_${usuarioActivo.nombre_usuario}`,JSON.stringify(usuarioActivo.carrito));
            Swal.fire("Carrito vaciado con éxito");
            gestorProd.renderizarCarrito()

            

            }
      });
    

}

// Esta función compra todo el contenido del carrito
function comprarCarrito(total){

    const Cargando = Swal.mixin({
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
          Swal.showLoading()
        }
      })


    if(usuarioActivo.carrito.length>1){
    Swal.fire({
        title: `¿Está seguro de comprar todos los productos del carrito por un valor total de $ ${total} ?`,
        showDenyButton: true,
        confirmButtonText: 'SI',
        denyButtonText: `NO`,
      }).then((resp) => {

        if(resp.isConfirmed){
            usuarioActivo.carrito = []; 
            localStorage.removeItem(`carrito_${usuarioActivo.nombre_usuario}`);
            Cargando.fire({    
                title: 'Realizando la compra',
                    
              }).then(resp =>{
                Swal.fire({
                    icon:"success",
                    title: `Compra realizada con éxito`,
                    showConfirmButton:false
                    
                    
                  });

                  gestorProd.contador();
                  gestorProd.renderizarCarrito();
                
                });
                  

            }
      });
    }else{

        let producto = usuarioActivo.carrito.find(prod => prod.id);

        Swal.fire({
            title: `¿Está seguro de realizar la compra de ${producto.nombre} por un valor total de: $${total}?`,
            showDenyButton: true,
            confirmButtonText: 'SI',
            denyButtonText: `NO`,
          }).then((resp) => {
    
            if(resp.isConfirmed){       
               
                usuarioActivo.carrito = []; 
                localStorage.removeItem(`carrito_${usuarioActivo.nombre_usuario}`);
                Cargando.fire({    
                    title: 'Realizando la compra',
                        
                  }).then(resp =>{
                    Swal.fire({
                        icon:"success",
                        title: `Compra realizada con éxito`,
                        showConfirmButton:false
                        
                        
                      });
                      
                      gestorProd.contador();
                      gestorProd.renderizarCarrito()
                    
                    });
                  
                
                }
          });

    }

}


// Función que resta un producto del carrito

function restarProducto(id){
    
    gestorProd.restProd(id);

}

// Evento que detecta lo que el usuario teclea para buscar

    buscador.addEventListener("keyup",() => {
        
        
        let encontrar = valorBuscador();


        //Empezamos a buscar solo cuando hay se hayan tipeado mas 2 letras o mas
       
        if( encontrar.length >= 2 ) { 
             
            gestorProd.autocompletar( encontrar );        
    
        } 

        if(buscador.value == 0){

            autocomplementado.innerHTML="";
        }


    })


    // Cuando apretamos enter en el buscador muestra los resultados de la busqueda en pantalla

   function inputBuscador(){
    buscador.addEventListener("keydown",(e) => {


        if(e.code == "Enter"){

           accionBuscar();

        } 
         


    })
}


 // Cuando hacemos click en el botón buscar muestra los resultados de la busqueda en pantalla
    botonBusacar.addEventListener("click",() =>{
        
        accionBuscar();

    })


// esta es la función que llaman los botones del buscador

function accionBuscar(){

    let encontrar = valorBuscador();
    console.log("Este es el valor del buscador: " + encontrar + " y es de tipo:  " + typeof(encontrar));

    if( encontrar.length >= 1 ) {   

        gestorProd.productosMostrados(`Mostrando resultados para "${encontrar}"`)
        gestorProd.buscar( encontrar );        
        
    } else if ( encontrar.length === "" ) {
                
                //Muestro todo sino hay nada el buscador   
                
                gestorProd.renderizarProductos( productos );
            } 

}


function valorBuscador(){
 
    let valor = buscador.value != "" ? buscador.value : "";
    
    return valor;

}

let ulFiltro = document.getElementById("ulFiltro");

   


    
let filtrado = document.getElementById("filtrado")
function filtrarMarca(marca){
    
    
    let filtrados = productos.filter((producto) => producto.marca.toLowerCase() == marca.toLowerCase());
    gestorProd.renderizarProductos(filtrados);
    
    }

function mostrarTodos(productos){

    
    gestorProd.renderizarProductos(productos)

}

    
   
document.addEventListener('DOMContentLoaded', () => {

    usuario = new RegistroUsuario();
    usuarios = JSON.parse(localStorage.getItem("usuarios")) || [] ;
    usuarioActivo = usuarios.find(u => u.sesion == 1) || [];
    usuarioActivo.carrito = JSON.parse(localStorage.getItem(`carrito_${usuarioActivo.nombre_usuario}`)) || [] ;
    usuario.iniciar();
    inputBuscador();
    gestorProd = new GestorProductos();
    gestorProd.renderizarCarrito();
    gestorProd.contador();
    
    
    

});