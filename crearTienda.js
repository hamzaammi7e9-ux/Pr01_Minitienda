// variable global para el json de productos parseados
let inventario = [];
let totalCuenta = 0; // Variable para sumar el precio total de los productos añadidos al carrito

function init() {
    console.log("Iniciando tienda");
    // parseamos el JSON de productos, de string a objetos
    inventario = JSON.parse(productosJSON);

    //llamo la funcion principal para mostrar los productos
    mostrarProductos(inventario);
}

// La función principal que muestra todos los productos en la pagina, le pasamos la lista de productos a mostrar
function mostrarProductos(lista) {
    let contenedor = document.getElementById("contenedor-productos");


    for (let i = 0; i < lista.length; i++) {
        let producto = lista[i];
        
        // Creamos el article del producto
        let articulo = crearArticulo(producto);
        
        // Lo añadimos al HTML
        contenedor.appendChild(articulo);
    }
}

// Esta es la funcion que gestiona la creación de cada artículo, recibe un producto con toda su info y devuelve el article ya montado
// con su estructura y estilos.
// el selector de tallas y colores estan en otras funciones.
function crearArticulo(infoProducto) {
    //creamos un articulo
    let articulo = document.createElement("article");
    // le damos la clase card al articulo vacio creado
    articulo.classList.add("card");


    //Aqui creo la etiqueta del producto.
    //Si el producto tiene tags, lo muestro como primer contenido del articulo
    if (infoProducto.tags && infoProducto.tags.length > 0) {
        //creamos un span que sera el tag del producto
        let tag = document.createElement("span");

        // su clase sera "etiqueta"
        tag.classList.add("etiqueta");
        // y el contenido del span es el nombre de la etiqueta que tenia el producto
        tag.textContent = infoProducto.tags[0];
        // añadimos la etiqueta al articulo
        articulo.appendChild(tag);
    }

    // Aqui creo la imagen del producto.
    // Cogemos la primera imagen disponible 

    let rutasImagenes = Object.values(infoProducto.imagenes); 

    let img = document.createElement("img");
    img.src = rutasImagenes[0]; // Ponemos la primera por defecto
    img.alt = infoProducto.nombre;
    articulo.appendChild(img);

    // Creamos el titulo del producto, que contiene el nombre del producto
    let titulo = document.createElement("h3");
    titulo.classList.add("titulo");
    titulo.textContent = infoProducto.nombre;
    articulo.appendChild(titulo);

    // Luego creamos otro parrafo con la descripcion del producto
    let desc = document.createElement("p");
    desc.style.fontSize = "15px";
    desc.textContent = infoProducto.descripcion;
    articulo.appendChild(desc);

    // Tambien creamos un div con el precio del producto, que se muestra debajo de la descripcion, y le añadimos el signo de euro.
    let precio = document.createElement("div");
    precio.classList.add("precio");
    precio.textContent = infoProducto.precioBase + "€";
    articulo.appendChild(precio);

    // Aqui llamo al creador de selector de tallas y colores, pero seran funciones separadas

    let divTallas = crearSelectorTallas(infoProducto.tallas);
    articulo.appendChild(divTallas);

    let divColores = crearSelectorColores(infoProducto.colores);
    articulo.appendChild(divColores);

    // Creo el boton para comprar, y le añado la clase "btn-comprar".
    let boton = document.createElement("button");
    boton.classList.add("btn-comprar");
    boton.textContent = "AÑADIR AL CARRITO";
    
    // Creo el evento click del boton, que al hacer click muestra un alert para añadir el producto al carrito.
    boton.addEventListener("click", function() {
        alert("Has añadido " + infoProducto.nombre + " al carrito.");
        actualizarTicket(infoProducto);
    });
    
    articulo.appendChild(boton);

    return articulo;
}

// Función separada para crear el selector de tallas.
function crearSelectorTallas(tallas) {
    let contenedor = document.createElement("div");
    contenedor.classList.add("selector-container"); // le damos la clase especifica para que se aplique el estilo del CSS
    
    //creamos el texto que indica que es el selector de tallas
    let texto = document.createElement("p");
    texto.textContent = "Talla:";
    texto.style.fontWeight = "bold";
    texto.style.marginBottom = "5px";
    contenedor.appendChild(texto);
     
    //creamos un div que contendra los botones de las tallas
    let divBotones = document.createElement("div");
    divBotones.classList.add("botones-talla");
    
    //dependiendo de la cantidad de tallas que tenga el producto, se crean mas o menos botones, y se les asigna el texto de la talla correspondiente
    for (let i = 0; i < tallas.length; i++) {
        let btn = document.createElement("button");
        btn.classList.add("btn-talla");
        btn.textContent = tallas[i];
        divBotones.appendChild(btn);
    }
    
    //añadimos el div de los botones al contenedor del selector de tallas, y devolvemos todo.
    contenedor.appendChild(divBotones);
    return contenedor;
}

// Función separada para crear el selector de colores, es un poco igual que el selector de talla, solo que en vez de botones con tallas son circulos con colores.
function crearSelectorColores(colores) {
    let contenedor = document.createElement("div");
    contenedor.classList.add("selector-container");
    
    //creamos el texto que indica que es el selector de colores
    let texto = document.createElement("p");
    texto.textContent = "Color:";
    texto.style.fontWeight = "bold";
    texto.style.marginBottom = "5px";
    contenedor.appendChild(texto);

    //creamos un div que contendra los circulos de los colores
    let divColores = document.createElement("div");
    divColores.classList.add("colores-container");

    //como en la funcion de tallas, se crea la cantidad necesaria de colores escogibles del producto y se añade al contenedor de colores.
    for (let i = 0; i < colores.length; i++) {
        let color = colores[i];
        let circulo = document.createElement("div");
        circulo.classList.add("circulo-color");
        
        // Aqui dependiendo de que color tenia el producto en el json, se le aplica su color de fondo correcto al circulo.
        if (color === "blanco") circulo.style.backgroundColor = "white";
        else if (color === "negro") circulo.style.backgroundColor = "black";
        else if (color === "mostaza") circulo.style.backgroundColor = "#ffdb58";
        else if (color === "gris") circulo.style.backgroundColor = "grey";
        else if (color === "azul") circulo.style.backgroundColor = "navy";
        
        //añadimos el circulo al div de colores.
        divColores.appendChild(circulo);
    }
    
    //añadimos el div de los circulos al contenedor del selector de colores, y devolvemos todo.
    contenedor.appendChild(divColores);
    return contenedor;
}


// Función para añadir productos al ticket de compra.
function actualizarTicket(producto) {
    let lista = document.getElementById("lista-compra");
    
    //Creamos el producto comprado como un nuevo elemento de la lista de la compra
    let productoComprado = document.createElement("li");
    
    // Le ponemos como contenido el nombre del producto y su precio.
    productoComprado.textContent = producto.nombre + " ... " + producto.precioBase + "€";
    
    // Lo añadimos a la lista de la compra
    lista.appendChild(productoComprado);

    // Actualizamos el total de la cuenta sumando el precio del producto comprado al total anterior.
    totalCuenta = totalCuenta + producto.precioBase;
    
    // Creamos el elemento del total de la cuenta
    let importeTotal = document.getElementById("total-carrito");
    importeTotal.textContent = "Total: " + totalCuenta + "€";
}