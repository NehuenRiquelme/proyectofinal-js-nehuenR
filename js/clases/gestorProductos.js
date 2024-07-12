class GestorProductos {

    // Función que muestra los productos disponibles en la pantalla
    renderizarProductos(productos){

       
        if(productos === 0){

            return false;

        }else {

        let contenedorProd=document.getElementById("contenedorProd");
        contenedorProd.innerHTML = "";
        
        productos.forEach((prod) => {

            let producto = document.createElement("div");
            producto.classList.add("d-flex","col-6","mb-5");
            producto.setAttribute("id","producto_" + prod.id)
            if(prod.stock > 10){
                 producto.innerHTML = `
                                            <img class="img-prod" src="./img/${prod.img}">
                                            <div>
                                                <h5 class="tituloProd">${prod.nombre}</h5>
                                                <p class="descripcion">${prod.descripcion}</p>
                                            </div>
                                            <div>
                                                <p class="precio">$ ${prod.precio}</p>
                                                <a class="btn btn-dark" href="javascript:crearProducto(${prod.id})">Agregar al carrito</a>
                                                <p class="cantidad my-5">En stock: <span id="stock_${prod.id}">${prod.stock}</span></p>
                                            </div>
                                        `;  

                

              }else if(prod.stock > 1){

                producto.innerHTML = `
                <img class="img-prod" src="./img/${prod.img}">
                <div>
                    <h5 class="tituloProd">${prod.nombre}</h5>
                    <p class="descripcion">${prod.descripcion}</p>
                    <p class="cantidad">¡Solo quedan <span class="pocos">${prod.stock}</span> ${prod.nombre} disponibles, apresúrate!</p>
                </div>
                <div>
                    <p class="precio">$ ${prod.precio}</p>
                    <a class="btn btn-dark" href="javascript:crearProducto(${prod.id})">Agregar al carrito</a>
                    <p class="cantidad my-5">En stock: <span id="stock_${prod.id}">${prod.stock}</span></p>
                </div>
            `;  

              }else{


                producto.innerHTML = `
                <img class="img-prod" src="./img/${prod.img}">
                <div>
                    <h5 class="tituloProd">${prod.nombre}</h5>
                    <p class="descripcion">${prod.descripcion}</p>
                    <p class="cantidad">¡Solo queda <span class="pocos">${prod.stock}</span> ${prod.nombre} disponible, apresúrate!</p>
                </div>
                <div>
                    <p class="precio">$ ${prod.precio}</p>
                    <a class="btn btn-dark" href="javascript:crearProducto(${prod.id})">Agregar al carrito</a>
                    <p class="cantidad my-5">En stock: <span id="stock_${prod.id}">${prod.stock}</span></p>
                </div>
            `;  


              }
                                                                               

                

            contenedorProd.appendChild(producto);

        })
        
    }
    
    colorStock(contenedorProd);
    this.botonFiltrar()
    }


    //Función que muestra que productos están siendo mostrados

    productosMostrados(mostrar){

        let prodMostrados = document.getElementById("prodMostrados");
        prodMostrados.innerHTML = `<h2>${mostrar}</h2>`;

    }



// Función que pushea el producto al carrito
    addCarrito(producto,usuario){

        let existe = usuario.carrito.some(prod => prod.id === producto.id);

        if(existe){

          let actualizado = usuario.carrito.find(prod => prod.id == producto.id);

            actualizado.cantidad += 1;
            
            this.guardarCarrito();
            this.renderizarCarrito();
            this.contador();
            Toastify({
                text: "Producto sumado",
                duration: 1000,
                gravity: 'top',
                stopOnFocus: true,
                offset: {
                    x: 10, 
                    y: 50 
                  },
                  style: {
                    background: "linear-gradient(to right, cyan,black)",
                  }

            }).showToast();

        }else {

            usuario.carrito.push(producto);
            Toastify({
                text: "Producto agregado al carrito",
                duration: 1000,
                gravity: 'top',
                stopOnFocus: true,
                offset: {
                    x: "10px", 
                    y: "50px" 
                  },
                style: {
                    background: "linear-gradient(to right, cyan,black)",
                  }

            }).showToast();
            
            this.renderizarCarrito();
            this.guardarCarrito();
            this.contador();

        }
       

    }


    // muestra la cantidad de productos en el carrito
    contador(){

        let total = this.contarProductos();
        let contadorCarrito = document.getElementById("contadorProducto");
        if(usuario.sesionIniciada()){      

            contadorCarrito.innerHTML = total ;

        }else{

            contadorCarrito.innerHTML = 0;

        }
            

        }

    // cuenta la cantidad de productos en el carrito



    contarProductos(){

        let contadorProductos = 0;
        if(usuario.sesionIniciada){
        

        usuarioActivo.carrito.forEach((producto) => {

            contadorProductos += parseInt(producto.cantidad);
        })

        return contadorProductos;
    }else{

        return contadorProductos;

    }
    
    }

    guardarCarrito(){

        // Usuario con la sesión iniciada
         usuarioActivo = usuarios.find(user => user.sesion == 1);
         usuarioActivo.carrito = usuarioActivo.carrito.filter(prod => prod.cantidad != 0);
        localStorage.setItem(`carrito_${usuarioActivo.nombre_usuario}`,JSON.stringify(usuarioActivo.carrito));

    }


// Función que muestra el carrito en pantalla
    renderizarCarrito(){

        // si la sesión está iniciada muestra el contenido del carrito

        if(usuario.sesionIniciada()){  

            usuarioActivo = usuarios.find(user => user.sesion == 1);
            
            //si el usuario no tiene nada cargado en el carrito ,muestra el carrito vacío

            if(usuarioActivo.carrito.length == 0){
            
                this.carritoVacio();
                
            }else{
                seccionCarrito.innerHTML="";
                let total = 0;
                usuarioActivo.carrito.forEach((prod) => {

                        if(prod.cantidad > 0){
                            
                                    total += parseInt(prod.precio * prod.cantidad);
                                    let prodCarrito = document.createElement("div")
                                    prodCarrito.classList.add("d-flex","align-items-center","mb-5");
                                    prodCarrito.innerHTML=`
                                                            <div class="col-3">
                                                                <img class="img-fluid" src="${prod.img}">
                                                            </div>
                                                            <div class="col-4">
                                                                <h5 class="tituloProd">${prod.nombre}</h5>
                                                            </div>
                                                            <div class="col-5">
                                                                <div class="d-flex align-items-center">
                                                                    <p class="cantidad">Cantidad: <span>${prod.cantidad}</span></p>
                                                                    <div class="div-sumar-restar">
                                                                        <a class="btn btn-dark" href="javascript:restarProducto(${prod.id})" ><i class="fa-solid fa-minus"></i></a>
                                                                        <a class="btn btn-dark" href="javascript:crearProducto(${prod.id})" ><i class="fa-sharp fa-solid fa-plus"></i></a>
                                                                    </div>
                                                                </div>
                                                                <p class="precio">$ ${prod.precio * prod.cantidad}</p>
                                                            </div>
                                                
                                                        `    
                                    seccionCarrito.appendChild(prodCarrito);
                                    
                        }else{

                            usuarioActivo.carrito = usuarioActivo.carrito.filter(prod => prod.cantidad > 0);
                            this.guardarCarrito();
                            this.renderizarCarrito();


                        }
                })
                

               
                        let totalPagar = document.createElement("div");
                        totalPagar.classList.add("row");
                        totalPagar.innerHTML=`
                                                <div class="col-4 d-flex align-items-center justify-content-start p-2 border-bottom border-top total">Total a pagar:</div>
                
                                                <div class="col-8 d-flex align-items-center justify-content-end p-2 border-bottom border-top precio">
                                                        <b> $ ${total}</b>
                                                </div>
                                                <div class="col-12 d-flex align-items-center justify-content-evenly p-2"> 
                                                    <a class="btn btn-dark" href="javascript:vaciarCarrito()">Vaciar Carrito</a>
                                                    <a class="btn btn-primary" href="javascript:comprarCarrito(${total})">Comprar</a>
                                                </div>
                
                
                
                        
                                            `;
                        
                        seccionCarrito.appendChild(totalPagar);
                
                
            }


            // si la sesión No está iniciada muestra el carrito vacío

        }else{

            this.carritoVacio();

            }
        

    }


// Función que muestra el carrito cuando esta vacío
    carritoVacio(){

        if(usuario.sesionIniciada()){

            if(usuarioActivo.carrito.length == 0){

                let seccionCarrito = document.getElementById("seccionCarrito");
                seccionCarrito.innerHTML="";
                seccionCarrito.innerHTML = `<div>
                                                <p class="carritoVacio">¡Nada por aquí!</p>
                                                <p class="descripcionCarrito">Agrega los productos que te interesen al carrito para recibirlos en un solo paquete</p>    
                                            ` ;
            }else{

                this.renderizarCarrito();

            }
                
        }else{

            let seccionCarrito = document.getElementById("seccionCarrito");
                seccionCarrito.innerHTML="";
                seccionCarrito.innerHTML = `<div>
                                                <p class="carritoVacio mb-5">¡Nada por aquí!</p>
                                                <p class="descripcionCarrito">Inicia sesión para agregar productos al carrito</p>    
                                            ` ;

                                
        }
    }


    // Función que resta un producto del carrito

    restProd(id){

        let estaCargado = usuarioActivo.carrito.filter(prod => prod.id == id);
        let cantidad = estaCargado.some(prod => prod.cantidad > 0);
        if(cantidad){
            let actualizado = estaCargado.map(prod=> prod.cantidad --) ;
        }
        
        this.guardarCarrito();
        this.renderizarCarrito();
        this.contador();
        
    }


    // Función que autocompleta lo que el usuario está tecleando

    autocompletar(encontrado){
        
        let resultado = productos.filter( producto => producto.nombre.toLowerCase().includes( encontrado.toLowerCase() )); 
        
        if(encontrado != 0){

            autocomplementado.classList.remove("hide");
            autocomplementado.innerHTML="";
            
            resultado.forEach((e)=>{
            
                let li = document.createElement("li")
                li.classList.add("list-group-item","list-group-item-action")
                li.innerHTML= e.nombre;

                li.addEventListener("click",() =>{
                
                    autocomplementado.innerHTML = "";
                    buscador.value = li.textContent;

                })

                autocomplementado.appendChild(li);

            })
        
            
    }else{

        autocomplementado.innerHTML="";

    }

    }

    buscar(encontrado){

        let resultado = productos.filter( producto => producto.nombre.toLowerCase().includes( encontrado.toLowerCase() ) || producto.descripcion.toLowerCase().includes( encontrado.toLowerCase() )); 

        if(resultado != ""){

            this.renderizarProductos(resultado);
            buscador.value ="";
            autocomplementado.classList.add("hide");
            this.botonFiltrar();


        }
        else {

            this.productosMostrados(`No hay concidencias para tu búsqueda "<b>${encontrado}</b>"`)
            this.renderizarProductos(resultado);
            buscador.value ="";
            autocomplementado.classList.add("hide");

        }  
        

    }
    buscar(encontrado){

        let resultado = productos.filter( producto => producto.nombre.toLowerCase().includes( encontrado.toLowerCase() ) || producto.descripcion.toLowerCase().includes( encontrado.toLowerCase() )); 

        if(resultado != ""){

            this.renderizarProductos(resultado);
            buscador.value ="";
            autocomplementado.classList.add("hide");
            this.botonFiltrar();


        }
        else {

            this.productosMostrados(`No hay concidencias para tu búsqueda "<b>${encontrado}</b>"`)
            this.renderizarProductos(resultado);
            buscador.value ="";
            autocomplementado.classList.add("hide");

        }  
        

    }


    botonFiltrar(){
        
        ulFiltro.innerHTML="";
        let todos = document.createElement("h4")
        todos.innerHTML = `<a class="btn btn-dark" href="javascript:mostrarTodos(productos)">Todos los productos</a>`
        
        
        marcas.forEach((mar)=>{
            let cantProd = productos.filter(prod => prod.marca == mar.marca);
            let liMarca = document.createElement("li");
            liMarca.classList.add("my-5")
            
            liMarca.innerHTML = `
                                <a class="btn btn-dark" href="javascript:filtrarMarca('${mar.marca}')">${mar.marca}<span>(${cantProd.length})</span></a>
                                `;

            
            ulFiltro.appendChild(liMarca);                           

        })
        
        
        ulFiltro.prepend(todos)
        
}

}
