/**
 * Class for creating item
 */
class Item {
  constructor(name, price) {
    this.name = name;
    this.amount = price;
  }
}

/**
 * Class UI for manipulating DOM content
 * Include methods for:
 * 1. Adding item to list
 * 2. Clear inputs after adding
 * 3. Show alert if you forgot input some data
 * or when book successfull added
 */
class UI {
  addItem(item) {
    const list = document.getElementById('list');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${item.name}</td>
        <td>$ ${item.amount}</td>
        `;
    list.appendChild(row);
  }

  clearInputs() {
    document.getElementById('name').value = '';
    document.getElementById('amount').value = '';
  }

  showAlert(message, className) {
    const container = document.querySelector('.card');
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${className}`;
    alertDiv.appendChild(document.createTextNode(message));
    container.insertBefore(alertDiv, container.children[1]);
    setTimeout(function() {
      document.querySelector('.alert').remove();
    }, 2000);
  }

  sortRows() {}
}

/**
 * Class Store for interaction with Local Storage
 * Include methods for:
 * 1. Getting items from LS
 * 2. Add item to LS @param {*object} item
 * 3. Display items when you refresh page
 */
class Store {
  static getItems() {
    let items;
    if (localStorage.getItem('items') === null) {
      items = [];
    } else {
      items = JSON.parse(localStorage.getItem('items'));
    }
    return items;
  }

  static addItem(item) {
    const items = Store.getItems();
    items.push(item);
    localStorage.setItem('items', JSON.stringify(items));
  }

  static displayItems() {
    const items = Store.getItems();
    items.forEach(element => {
      const ui = new UI();
      ui.addItem(element);
    });
  }
}

document.addEventListener('DOMContentLoaded', Store.displayItems());

/**
 * Create accordion
 */
document.querySelector('.title-bar').addEventListener('click', e => {
  e.target.classList.toggle('active');
  let infoTable = e.target.nextElementSibling;
  if (infoTable.style.maxHeight) {
    infoTable.style.maxHeight = null;
  } else {
    infoTable.style.maxHeight = infoTable.scrollHeight + 'px';
  }
});

/**
 * Read data from inputs and called appropriate methods
 */
document.getElementById('addItem').addEventListener('click', e => {
  const name = document.getElementById('name').value,
    amount = parseFloat(document.getElementById('amount').value);

  const item = new Item(name, amount);
  const ui = new UI();
  if (name === '' || amount === '') {
    ui.showAlert('Please fill in all inputs', 'error');
  } else {
    ui.showAlert('Item successfull added', 'success');
    ui.addItem(item);
    Store.addItem(item);
  }
});
