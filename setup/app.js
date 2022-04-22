// ****** SELECT ITEMS **********
const form = document.querySelector('.grocery-form')
const alert = document.querySelector('.alert')
const grocery = document.getElementById('grocery') //input
const submitBtn = document.querySelector('.submit-btn')
const container = document.querySelector('.grocery-container')
const list = document.querySelector('.grocery-list')
const clearBtn = document.querySelector('.clear-btn')

// edit option
let editElement
let editFlag = false // default
let editID = ''

// ****** EVENT LISTENERS **********
// submit form
form.addEventListener('submit', addItem)
// clear items
clearBtn.addEventListener('click', clearItems)
// load items
window.addEventListener('DOMContentLoaded', setupItems)
// ****** FUNCTIONS **********
function addItem(e) {
  e.preventDefault()
  const value = grocery.value
  const id = new Date().getTime().toString
  if (value && !editFlag) {
    createListItem(id, value)
    // display alert
    displayAlert('Urun sepetinize eklendi.', 'success')
    // show container
    container.classList.add('show-container') // css deki show-container class i ekledik
    // add to local storage
    addToLocalStorage(id, value)
    // set back to default
    setBackToDefalut()
  } else if (value && editFlag) {
    editElement.innerHTML = value
    displayAlert('urun  degistirildi', 'success')
    // edit local storage
    editLocalStorage(editID, value)
    setBackToDefalut()
  } else {
    displayAlert('Lutfen bir urun giriniz !', 'danger')
  }
}
// uyari mesajinin ayarlanmasi
function displayAlert(text, action) {
  alert.textContent = text
  alert.classList.add(`alert-${action}`)
  // ekranda gorunen uyarini mesajini silinmesi
  setTimeout(() => {
    alert.textContent = ''
    alert.classList.remove(`alert-${action}`)
  }, 2000)
}
// clear items
function clearItems() {
  const items = document.querySelectorAll('.grocery-item')

  if (items.length > 0) {
    items.forEach((item) => {
      list.removeChild(item)
    })
  }
  container.classList.remove('show-container')
  displayAlert('Sepetiniz Bos !', 'danger')
  setBackToDefalut()
  localStorage.removeItem('list')
}
//delete function
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement
  const id = element.dataset.id
  list.removeChild(element)
  if (list.children.length === 0) {
    container.classList.remove('show-container')
  }
  displayAlert('urun silindi', 'danger')
  setBackToDefalut()
  // remove from local storage
  removeFromLocalStorage(id)
}
//edit function
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement
  // set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling
  // set form value
  grocery.value = editElement.innerHTML
  editFlag = true
  editID = element.dataset.id
  submitBtn.textContent = 'edit'
}
//set back to default
function setBackToDefalut() {
  grocery.value = ''
  editFlag = false
  editID = ''
  submitBtn.textContent = 'kaydet'
}
// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value) {
  const grocery = { id, value }
  let items = getLocalStorage()

  items.push(grocery)
  localStorage.setItem('list', JSON.stringify(items))

  // console.log('added to local storage')
}
function removeFromLocalStorage(id) {
  let items = getLocalStorage()

  items = items.filter((item) => {
    if (item.id !== id) {
      return item
    }
  })
  localStorage.setItem('list', JSON.stringify(items))
}
function editLocalStorage(id, value) {
  let items = getLocalStorage()
  items = items.map((item) => {
    if (item.id === id) {
      item.value = value
    }
    return item
  })
  localStorage.setItem('list', JSON.stringify(items))
}
function getLocalStorage() {
  return localStorage.getItem('list')
    ? JSON.parse(localStorage.getItem('list'))
    : []
}
//localStorage API
// setItem
// getItem
// removeItem
// save as strings
// ****** SETUP ITEMS **********
function setupItems() {
  let items = getLocalStorage()
  if (items.length > 0) {
    items.forEach((item) => {
      createListItem(item.id, item.value)
    })
    container.classList.add('show-container')
  }
}
function createListItem(id, value) {
  const element = document.createElement('article') // index.html de ki article class i dinamik olarak ekliyoruz
  // add class
  element.classList.add('grocery-item')
  // add id
  const attr = document.createAttribute('data-id')
  attr.value = id
  element.setAttributeNode(attr)
  element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>`
  // delete ve edit butonlarini aktif etmek icin buraya yazdik
  const deleteBtn = element.querySelector('.delete-btn')
  const editBtn = element.querySelector('.edit-btn')
  deleteBtn.addEventListener('click', deleteItem)
  editBtn.addEventListener('click', editItem)
  //append child - list
  list.appendChild(element)
}
