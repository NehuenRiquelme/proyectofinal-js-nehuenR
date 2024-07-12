class RegistroUsuario{

   iniciar(){

    this.mostrarBotonIniciarSesion();


   }

    registrarUsuario(usuario){

        // Comprobar si el nombre de usuario ya fue registrado
        const existe = usuarios.some(user => user.nombre_usuario === usuario.nombre_usuario);
        
        if(existe){

            Swal.fire("Nombre de usuario no disponible,por favor eliga otro");
            let nombre_usuario_registrar = document.getElementById("nombre_usuario_regsitrar").value="";

        }else if(usuarios.some(user => user.e_mail === usuario.e_mail)){

            Swal.fire("Ese correo electrónico ya tiene un usuario registrado");
            let e_mail_registrar = document.getElementById("email_registrar").value="";

        }else if(usuario.nombre_usuario === "" || usuario.contraseña === "" || usuario.e_mail === "" || usuario.nombre === "" || usuario.apellido === ""){

            Swal.fire("Complete todos los datos");

        } else if(usuarios.some(user => user.sesion == 1)) {


            Swal.fire({
                title: 'Debe cerrar sesión antes de registrar un nuevo usuario',
                text: '¿Desea cerrar la sesión actual e iniciar una nueva?',
                showDenyButton: true,
                confirmButtonText: 'SI',
                denyButtonText: `NO`,
              }).then((resp) => {
        
                if(resp.isConfirmed){
                    
                    this.cerrarSesion();
                    
                    }
              });
            let nombre_usuario_registrar = document.getElementById("nombre_usuario_regsitrar").value="";
            let nombre_registrar = document.getElementById("nombre_registrar").value="";
            let apellido_registrar = document.getElementById("apellido_registrar").value="";
            let e_mail_registrar = document.getElementById("email_registrar").value="";
            let contraseña_registrar = document.getElementById("password_registrar").value="";
            divRegistrar.classList.remove("visible");
            divRegistrar.classList.add("hide");
            


        }else{

        //Si no está registrado, agregarlo al registro de usuarios  
        
            usuarios.push(usuario);
            usuario.sesion = 1;
            localStorage.setItem("usuarios",JSON.stringify(usuarios));
            this.iniciarSesion(usuario.nombre_usuario,usuario.contraseña);   
            divRegistrar.classList.remove("visible");
            divRegistrar.classList.add("hide");
            
            
        }
        }

    


    //   Botón que inicia la sesión del usuario

    iniciarSesion(user_name,password){

        let nombre_usuarioIniciarSesion = document.getElementById("nombre_usuarioIniciarSesion").value="";
        let passwordIniciarSesion = document.getElementById("passwordIniciarSesion").value="";

        if(!this.sesionIniciada()){

            if(usuarios.length != 0){

                if(usuarios.some(u => user_name ===  u.nombre_usuario && password === u.contraseña)){

                usuarios.forEach(user => {

                    

                    if(user_name === user.nombre_usuario && password === user.contraseña){
                        

                        usuarios.forEach(u => u.sesion = 0);
                        user.sesion = 1
                        localStorage.setItem("usuarios",JSON.stringify(usuarios));
                        Swal.fire("Bienvenido " + user_name);
                        divIniciarSesion.classList.remove("visible");
                        divIniciarSesion.classList.add("hide");
                        gestorProd.renderizarCarrito();
                        this.mostrarBotonIniciarSesion();
                        gestorProd.contador();


                    }
                    
        
                })
            }
            else{

                Swal.fire({
                    title: `Usuario no registrado`,
                    text:`¿Desea registrar un nuevo usuario?`,
                    showDenyButton: true,
                    confirmButtonText: 'SI',
                    denyButtonText: `NO`,
                  }).then((resp) => {
            
                    if(resp.isConfirmed){
                        
                        boton_registrar.click();
                        
                    }})


                nombre_usuarioIniciarSesion = document.getElementById("nombre_usuarioIniciarSesion").value="";
                passwordIniciarSesion = document.getElementById("passwordIniciarSesion").value="";

            }
        }
            
        }else{

            Swal.fire("Bienvenido " + user_name);
            let nombre_usuario_registrar = document.getElementById("nombre_usuario_regsitrar").value="";
            let nombre_registrar = document.getElementById("nombre_registrar").value="";
            let apellido_registrar = document.getElementById("apellido_registrar").value="";
            let e_mail_registrar = document.getElementById("email_registrar").value="";
            let contraseña_registrar = document.getElementById("password_registrar").value="";
            this.mostrarBotonIniciarSesion();
        }
        
    
    }


//   Función que verifica si la sesión está iniciada
   
    sesionIniciada(){


        let sesionIni = usuarios.some(user => user.sesion === 1);

        return sesionIni;

    }


    // Función que muestra el botón de iniciar sesión

    mostrarBotonIniciarSesion(){

            boton_iniciarSesion.textContent = "";

            if(this.sesionIniciada()){
                
                let user = usuarios.find(u => u.sesion == 1);
                boton_iniciarSesion.textContent = user.nombre_usuario;
                boton_iniciarSesion.removeAttribute("data-bs-target");
                boton_iniciarSesion.removeAttribute("data-bs-toggle");

            }else{

                boton_iniciarSesion.classList.add("visible");
                boton_iniciarSesion.textContent = "Iniciar Sesión";


            }

    }

//   Función que muestra el botón de cerrar sesión en caso de que la sesión esté iniciada
    mostrarBotonCerrarSesion(){

        if(this.sesionIniciada()){
           
            
            divOpciones.classList.add("visible")
            divOpciones.classList.remove("hide")

            boton_cerrarSesion.classList.add("visible");
            boton_cerrarSesion.textContent = `Cerrar Sesión `; 
            document.addEventListener("click",(e)=>{

                 if( e.target != boton_iniciarSesion){ 

                        console.log("Es distinto")
                        divOpciones.classList.add("hide")
                        divOpciones.classList.remove("visible")
                        boton_cerrarSesion.classList.add("hide");
                        boton_cerrarSesion.classList.remove("visible");
        }
    })

           

        }else{
            
            divOpciones.classList.add("hide")
            divOpciones.classList.remove("visible")
            boton_cerrarSesion.classList.add("hide");
            boton_cerrarSesion.classList.remove("visible");

        }

        

    }


//   Botón que cierra la sesión del usuario
    cerrarSesion(){
        
        
                Swal.fire({
                    title: 'Cerrar Sesión?',
                    showDenyButton: true,
                    confirmButtonText: 'SI',
                    denyButtonText: `NO`,
                  }).then((resp) => {
    
                    if(resp.isConfirmed){
                        debugger
                            usuarios.forEach((user)=>{user.sesion = 0;});
                            localStorage.setItem("usuarios",JSON.stringify(usuarios));
                            this.mostrarBotonCerrarSesion();
                            gestorProd.carritoVacio();
                            gestorProd.contador();
                            
                            
                            boton_iniciarSesion.textContent = "Iniciar Sesión";
                            boton_iniciarSesion.setAttribute("data-bs-toggle","modal")
                            boton_iniciarSesion.setAttribute("data-bs-target","#modalInicioSesion")

                            let nombre_usuario_registrar = document.getElementById("nombre_usuario_regsitrar").value;
                            let nombre_registrar = document.getElementById("nombre_registrar").value;
                            let apellido_registrar = document.getElementById("apellido_registrar").value;
                            let e_mail_registrar = document.getElementById("email_registrar").value;
                            let contraseña_registrar = document.getElementById("password_registrar").value;

                            if(nombre_usuario_registrar != "" &&nombre_registrar != "" &&apellido_registrar != "" &&e_mail_registrar != "" &&contraseña_registrar != "" ){

                                let user = new Usuario(nombre_usuario_registrar,nombre_registrar,apellido_registrar,e_mail_registrar,contraseña_registrar);

                                this.registrarUsuario(user);
                            }
                        
                            
                        }
    
                  });
                
            

        }


}