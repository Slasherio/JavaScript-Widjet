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
 * or when item successfull added
 */
class UI {
  addItem(item) {
    const list = document.getElementById('list');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${item.name}</td>
        <td>
        $ ${item.amount}
        <i class="ion-close-circled delete"></i>
        </td>
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

  static compare(str1, str2) {
    const numCmpr = str1 - str2;
    return isNaN(numCmpr) ? str1.localeCompare(str2) : numCmpr;
  }

  static sortRows() {
    const tbody = document.getElementsByTagName('tbody')[0];
    let rows = [];

    for (let i = 0; i < tbody.children.length; i++) {
      rows.push(tbody.children[i]);
    }

    rows.sort((a, b) => {
      return this.compare(a.innerHTML, b.innerHTML);
    });

    for (let i = 0; i < rows.length; i++) {
      tbody.appendChild(rows[i]);
    }
  }

  updateTotal(price) {
    const total = document.querySelector('.totalAmount');
    total.textContent = (parseFloat(total.textContent) + price).toFixed(2);
  }

  deleteItem(target) {
    if (target.classList.contains('delete')) {
      target.parentElement.parentElement.remove();
    }
  }
}

/**
 * Class Store for interaction with Local Storage
 * Include methods for:
 * 1. Getting items from LS
 * 2. Add item to LS @param {*object} item
 * 3. Display items when you refresh page
 * 4. Add total @param {*number} price
 * 5. Get total
 * 5. Dispay total sum
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

  static addTotal(price) {
    let total = Store.getTotal();
    total += price;
    localStorage.setItem('totalSum', total);
  }

  static getTotal() {
    let total;
    if (localStorage.getItem('totalSum') === null) {
      total = 0;
    } else {
      total = parseFloat(localStorage.getItem('totalSum'));
    }
    return total;
  }

  static displayTotal() {
    const totalSum = Store.getTotal();
    const ui = new UI();
    ui.updateTotal(totalSum);
  }

  static removeItem(name) {
    const items = Store.getItems();
    items.forEach((element, index) => {
      if (element.name === name) {
        items.splice(index, 1);
      }
    });
    localStorage.setItem('items', JSON.stringify(items));
  }
}

document.addEventListener('DOMContentLoaded', Store.displayItems());
document.addEventListener('DOMContentLoaded', Store.displayTotal());

/***********************************Add event listeners************************************ */

/**
 * Create accordion
 */
document.querySelector('.title-bar').addEventListener('click', e => {
  e.target.classList.toggle('active');
  let infoTable = e.target.nextElementSibling;
  if (infoTable.style.maxHeight) {
    infoTable.style.maxHeight = null;
  } else {
    infoTable.style.maxHeight = 100 + '%';
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

  if (!name || !amount) {
    ui.showAlert('Please fill in all inputs', 'error');
  } else {
    ui.showAlert('Item successfull added', 'success');
    ui.addItem(item);
    Store.addItem(item);
    Store.addTotal(amount);
    ui.updateTotal(amount);
    ui.clearInputs();
  }

  e.preventDefault();
});

document.getElementById('expensesData').addEventListener('click', e => {
  const target = e.target;
  if (target.tagName === 'I') {
    target.classList.toggle('sort-icon');
    UI.sortRows();
  } else {
    return;
  }
});
