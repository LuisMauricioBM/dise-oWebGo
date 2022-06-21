const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}


document.addEventListener('DOMContentLoaded', () => {
  fetchData()
})
cards.addEventListener('click', e =>{
  addCarrito(e)
})
items.addEventListener('click', e =>{
  btnQuitar(e)
})
const fetchData = async()=>{
  try {
    const res = await fetch('./js/api.json')
    const data = await res.json()
    pintarCards(data)
  } catch (error) {
    console.log(error)
  }
}


const pintarCards = data =>{
    data.forEach(producto =>{
      templateCard.querySelector('h5').textContent = producto.nombre 
      templateCard.querySelector('span').textContent = producto.precio 
      templateCard.querySelector('button').dataset.id = producto.id
      templateCard.querySelector('img').setAttribute("src",producto.imagen)
      const clone = templateCard.cloneNode(true)
      fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

const addCarrito = e =>{
  if (e.target.classList.contains('btn')) {
    setCarrito(e.target.parentElement.parentElement.parentElement)
  }
  e.stopPropagation()
}

const setCarrito = objeto =>{
    const producto = {
      id: objeto.querySelector('button').dataset.id,
      nombre: objeto.querySelector('h5').textContent,
      precio: objeto.querySelector('span').textContent,
      cantidad: 1
    }
  if (carrito.hasOwnProperty(producto.id)) {
    producto.cantidad = carrito[producto.id].cantidad + 1;
  }
  carrito[producto.id] = {...producto}
  pintarCarrito()
}

const pintarCarrito = () => {
  items.innerHTML = ''
  Object.values(carrito).forEach(producto => {
    templateCarrito.querySelectorAll('td')[0].textContent = producto.nombre
    templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
    templateCarrito.querySelector('.btn-light').dataset.id = producto.id
    templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

    const clone = templateCarrito.cloneNode(true)
    fragment.appendChild(clone)
})
  items.appendChild(fragment)
  pintarFooter()
}

const pintarFooter = () =>{
  footer.innerHTML = ''
    
  if (Object.keys(carrito).length === 0) {
      footer.innerHTML = `
      <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
      `
      return
  }
  
  const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
  const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)

  templateFooter.querySelector('td').textContent = nCantidad
  templateFooter.querySelector('span').textContent = nPrecio

  const clone = templateFooter.cloneNode(true)
  fragment.appendChild(clone)

  footer.appendChild(fragment)
}

const btnQuitar = e => {
  console.log(e.target.classList.contains('btn-light'))
  if (e.target.classList.contains('btn-light')) {
    const producto = carrito[e.target.dataset.id]
      delete carrito[e.target.dataset.id]
    pintarCarrito()
  }
  e.stopPropagation()
}