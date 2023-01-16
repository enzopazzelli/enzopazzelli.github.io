

const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const cards= document.getElementById("cards");
const items = document.getElementById("items");
const footer= document.getElementById("footer");
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content; 
const fragment = document.createDocumentFragment();
let carrito= {};


//FUNCIONAMIENTO DE BOTON DE MENU EN HEADER//
navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("nav-menu_visible");

  if (navMenu.classList.contains("nav-menu_visible")) {
    navToggle.setAttribute("aria-label", "Cerrar menú");
  } else {
    navToggle.setAttribute("aria-label", "Abrir menú");
  }
});


document.addEventListener("DOMContentLoaded", () => {
   fetchData()
   if(localStorage.getItem("carrito")){
    carrito = JSON.parse(localStorage.getItem("carrito"))
    hacerCarrito();
   }
})
cards.addEventListener("click", e =>{
  addCarrito(e)
})
items.addEventListener("click", e => {
  botonAccion(e)
})

// VINCULAR JSON
const fetchData = async () => {
  try {
    const res= await fetch("libros.json")
    const data = await res.json()
    cargarProductos(data)
  } catch (error) {
    console.error();
    
  }
}
// RENDERIZAR OBJETOS 
const cargarProductos = data => {
  console.log(data)
  data.forEach(libro => {
  const nuevoLibro = document.createElement("article");
  nuevoLibro.setAttribute("class", "articulo");
  const contenedorImagen = document.createElement("div");
  contenedorImagen.setAttribute("class", "contenedorImagen");
  const contenedorTitulo= document.createElement("div");
  contenedorTitulo.setAttribute("class", "contenedorTitulo");
  contenedorImagen.innerHTML = `<img id="img5" class="imagen" src=${libro.img} alt=${libro.alt}/>`;
  contenedorTitulo.innerHTML=
    `<h3 class="titulo">${libro.nombre}</h3>`
  const contenedorSinTitulo=document.createElement("div");
  contenedorSinTitulo.setAttribute("class", "contenedorSinTitulo");
  contenedorSinTitulo.innerHTML=
     ` <p class="autor">
        ${libro.autor}
      </p>
      <h3 class="precio">$${libro.precio}</h3>
      <button class="agregar" data-id=${libro.id} href="#">Agregar al carrito<i class="fa-solid fa-cart-plus"></i></button>`;
  const contenedorInfos= document.createElement("div");
  contenedorInfos.setAttribute("class", "contenedorInfos")
  contenedorInfos.appendChild(contenedorTitulo);
  contenedorInfos.appendChild(contenedorSinTitulo);
  nuevoLibro.appendChild(contenedorImagen);
  nuevoLibro.appendChild(contenedorInfos);

  document.getElementById("cards").appendChild(nuevoLibro);
  
})
}



const addCarrito = e => {
  if(e.target.classList.contains("agregar")){
    setCarrito(e.target.parentElement.parentElement.parentElement)
  }
  e.stopPropagation();
}

const setCarrito= objeto => {
  const producto = {
    id: objeto.querySelector(".agregar").dataset.id,
    nombre: objeto.querySelector(".titulo").innerHTML,
    precio: objeto.querySelector(".precio").textContent.slice(1),
    cantidad: 1,
    imagen: objeto.querySelector(".imagen").src

  }
  if(carrito.hasOwnProperty(producto.id)){
    producto.cantidad = carrito[producto.id].cantidad + 1;
  }

  carrito[producto.id] = {...producto}
  hacerCarrito()
}

const hacerCarrito = () => {
  items.innerHTML= "";
  Object.values(carrito).forEach(producto => {
    templateCarrito.querySelector("th").textContent = producto.id;
    templateCarrito.querySelectorAll("td")[0].textContent=producto.nombre;
    templateCarrito.querySelectorAll("td")[1].textContent=producto.cantidad;
    templateCarrito.querySelector(".btn-info").dataset.id= producto.id;
    templateCarrito.querySelector(".btn-danger").dataset.id= producto.id;
    templateCarrito.querySelector("span").textContent= producto.cantidad * producto.precio;

    const clone= templateCarrito.cloneNode(true);
    fragment.appendChild(clone)
  })
  items.appendChild(fragment);

  hacerFooter()
  
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

const hacerFooter = () => {
  footer.innerHTML= "";
  if(Object.keys(carrito).length === 0){
    footer.innerHTML= 
    `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`;
    return;
  }
  const nCantidad= Object.values(carrito).reduce((acc, {cantidad}) => acc+cantidad,0)
  const nPrecio= Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio, 0)

  templateFooter.querySelectorAll("td")[0].textContent= nCantidad;
  templateFooter.querySelector("span").textContent= nPrecio;
  const clone = templateFooter.cloneNode(true);
  fragment.appendChild(clone);
  footer.appendChild(fragment);

  const botonVaciar= document.getElementById("vaciar-carrito");
  botonVaciar.addEventListener("click", () => {
    carrito = {};
    hacerCarrito()
  })

  const botonContinuar = document.getElementById("continuar-compra");
  botonContinuar.addEventListener('click', ()=>{
    
     alert('Acabas de comprar '+nCantidad+' libros' );  
   
    carrito = {};    
    hacerCarrito()
  })


}

const botonAccion = e => {
  if(e.target.classList.contains("btn-info")){
    const producto= carrito[e.target.dataset.id];
    producto.cantidad++;
    carrito[e.target.dataset.id] = {...producto};
    hacerCarrito();
  }
  else if(e.target.classList.contains("btn-danger")){
    const producto= carrito[e.target.dataset.id];
    producto.cantidad--;
    if(producto.cantidad === 0){
      delete carrito[e.target.dataset.id];
    }
    hacerCarrito();
  }
}