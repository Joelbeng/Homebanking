//DOM Selection
const extractBtn = document.getElementById("extractBtn");
const depositBtn = document.getElementById("depositBtn");
const payServiceBtn = document.getElementById("payServiceBtn");
const transferBtn = document.getElementById("transferBtn");
const limitBtn = document.getElementById("limitBtn");
const modal = document.getElementById("modal");
const servicesLi = document.getElementsByClassName("service");
const closeBtn = document.getElementById("closeBtn");

//Declaración de variables
let balance = 7000;
let extractionLimit = 3000;
let waterBill = 350;
let telephoneBill = 425;
let electricBill = 210;
let internetBill = 570;
let validUser = false;

const users = [
  {
      name: "Mario",
      code: 1111
  },
  {
      name: "Beatriz",
      code: 8888
  }
];

const friendAccounts = [
  {
    name: "Silvana",
    accountNumber: 12341234
  },
  {
    name: "Mariano",
    accountNumber: 44443331
  }
] 

//Ejecución de las funciones que actualizan los valores de las variables en el HTML.
window.onload = function() {
  logIn();
  updateBalance();
  updateLimit();
  updateBills();
}

/**
 * Suma al saldo el monto que se le pase por parámetro, y retorna el resultado
 * @param {number} inputMoney
 * @returns {number}
 */
function addMoney(inputMoney) {
  balance += inputMoney;
  return balance;
}

/**
 * Resta al saldo el monto que se le pase por parámetro, y retorna el resultado
 * @param {number} extracted
 * @returns {number} 
 */
function subMoney(extracted){
  balance -= extracted;
  return balance;
}

// Cambia el límite de extracción
function changeExtractionLimit() {
  const dataInput = prompt("Ingrese nuevo límite de extracción");
  let validData = getInputValidation(dataInput);
  if (!validData) return;

  extractionLimit = parseInt(dataInput);                 
  alert(`Actualmente el límite de extracción es de: $ ${extractionLimit}`);
  updateLimit();
}


/**
 * @param {number} amount 
 * @returns {boolean}
 * Chequea si el monto es mayor a 1 y si el tipo de dato es número
 */
function getInputValidation(amount) {
  if (amount < 1 || isNaN(amount)) {
    alert("Ingrese un monto mayor a 0");
    return false;
  } else {
      return true;
  }
} 

//Extrae del saldo el monto que ingresa el usuario
function extractMoney() {
  const message = "No hay saldo disponible en tu cuenta para retirar esa cantidad de dinero";
  const dataInput = prompt("Ingrese la cantidad que desea retirar");
  let validData = getInputValidation(dataInput);
  if (!validData) return; 

  const extractedMoney = parseInt(dataInput);

  if (extractedMoney > extractionLimit) {
    alert("La cantidad de dinero que desea retirar es mayor a tu límite de extracción");
    return;
  }

  let overBalance = checkOverBalance(extractedMoney, message);
  if (overBalance) return;

  if (extractedMoney % 100 == 0) { 
    let oldBalance = balance;              
    balance = subMoney(extractedMoney);                      

    alert(`Has retirado: $${extractedMoney}\n\nSaldo anterior: $${oldBalance}\n\nSaldo actual: $${balance}`);
    updateBalance();
  } else {
      alert("Sólo puedes extraer billetes de $ 100")
  }
} 

/**
 * @param {number} amount 
 * @param {string} message 
 * @returns {boolean}
 * Chequea si el monto ingresado como parámetro es mayor al saldo, y muestra un mensaje si es así
 */
function checkOverBalance(amount, message) {
  if (amount > balance) {
    alert (message);
    return true;
  } else {
      return false;    
  }
}

//Suma al saldo el monto que ingresa el usuario
function depositMoney() { 
  const dataInput = prompt("Ingrese la cantidad que desea depositar");
  const validData = getInputValidation(dataInput);
  if (!validData) return; 

  let addedAmount = parseInt(dataInput);
  let oldBalance = balance;
  balance = addMoney(addedAmount);

  alert(`Has depositado: $${addedAmount}\n\nSaldo anterior: $${oldBalance}\n\nSaldo actual: $${balance}`);
  updateBalance();
}

function showServices() {
  modal.classList.remove("disabled");
  modal.classList.add("active");
}

//Se convierte el HTMLCollection en un array y se almacena en una variable
servicesArray = Array.from(servicesLi);

servicesArray.forEach(service => {
  //al hacer click en un item de la lista, se obtiene su id (nombre del servicio)
  service.addEventListener('click', ev => {
    let service = ev.target.id;
    payService(service);
  });
});

/**
 * Realiza el pago del servicio si hay saldo disponible
 * @param {string} service 
 */
function payService(service) {
  const message = "No hay saldo disponible en tu cuenta para pagar este servicio";
  let overBalance;
  let originalBalance = balance; //almaceno el valor del saldo antes de realizar algún pago

  switch (service) {
    
    case "waterBill": //considero id del <span>
    case "water":
      overBalance = checkOverBalance(waterBill, message); //almaceno el retorno de esta función

      if (!overBalance) { //si la tarifa del servicio no supera el saldo realizo el pago
        balance = subMoney(waterBill);
        waterBill = 0;
      }
      break;
    
    case "electricityBill":
    case "electricity":
      overBalance = checkOverBalance(electricBill, message);

      if (!overBalance) {
        balance = subMoney(electricBill);
        electricBill = 0;
      }
      break;

    case "internetBill":  
    case "internet":
      overBalance = checkOverBalance(internetBill, message);

      if (!overBalance) {
        balance = subMoney(internetBill);
        internetBill = 0;
      }
      break;

    case "telephoneBill":  
    case "telephone":
      overBalance = checkOverBalance(telephoneBill, message);

      if (!overBalance) {
        balance = subMoney(telephoneBill);
        telephoneBill = 0;
      }
      break;
  
    default:
      break;
  }
  //Si se realizó algún pago, actualizo el valor del saldo y del servicio que pagué
  if (originalBalance != balance) {
    updateBills();
    updateBalance();
  }
}  


//Cierra la ventana del pago de servicios al hacer click en X
function closeModal() {
  modal.classList.remove("active");
  modal.classList.add("disabled");
}

//Cierra la ventana del pago de servicios al hacer click por fuera de la misma
modal.addEventListener('click', function (ev) {
  if (ev.target.id == "modal") {
    this.classList.remove("active");
    modal.classList.add("disabled");
  }
});

function transferMoney() { 
  const message = "El monto que desea transferir supera su saldo actual";
  let dataInput = prompt("Ingrese el monto que desea transferir");
  let validData = getInputValidation(dataInput);
  if (!validData) return;

  let transferAmount = parseInt(dataInput);
  let overBalance = checkOverBalance(transferAmount, message);
  if (overBalance) return;

  let accountInput = parseInt(prompt("Ingrese el número de cuenta del destinatario"));
  let validAccount = false; //flag
  let accountOwner; 

  for (let i = 0; i < friendAccounts.length; i++) {
    const accountNumber = friendAccounts[i].accountNumber;

    if (accountInput === accountNumber) {
      validAccount = true;
      accountOwner = friendAccounts[i].name; //almaceno el nombre del apoderado de la cuenta
    }

    if (validAccount) break;
  }

  if (!validAccount) {
    alert("La cuenta ingresada no pertenece a ningún destinatario asociado");
    return;
  }
  
  balance = subMoney(transferAmount);
  alert(`Has depositado $${transferAmount} en la cuenta de ${accountOwner}`);
  updateBalance();
}

//detecta si el usuario es válido o no
function logIn() {
  let userName;
  let inputCode = parseInt(prompt("Ingrese el código de su cuenta"));
  
  for (let i = 0; i < users.length; i++) {
    const userCode = users[i].code;

    if (userCode === inputCode) {
      validUser = true;
      userName = users[i].name;
      break;
    }
  }
  
  if (!validUser) {
    alert ("El código ingresado es incorrecto. El dinero ha sido retenido por seguridad");
    return;
  }

  showName(userName);
}


//Actualiza en el DOM el saludo al usuario
function showName(name) {
  const nameSpan = document.getElementById("nombre")
  let welcome;

  //Varío el saludo según el usuario
  name === "Mario" ? welcome = "Bienvenido " : welcome = "Bienvenida "; 

  nameSpan.innerHTML = welcome + name;
}

//Actualiza en el DOM el saldo
function updateBalance() {
  if (!validUser) balance = 0;
  document.getElementById("saldo-cuenta").innerHTML = "$" + balance;
}

//Actualiza en el DOM límite de extracción 
function updateLimit() {
  if (!validUser) extractionLimit = 0;
  document.getElementById("limite-extraccion").innerHTML = "Tu límite de extracción es: $" + extractionLimit;
}

//Actualiza en el DOM el precio a pagar de cada servicio
function updateBills() {
  const waterSpan = document.getElementById("waterBill");
  const electricitySpan = document.getElementById("electricityBill");
  const internetSpan = document.getElementById("internetBill");
  const telephoneSpan = document.getElementById("telephoneBill");

  waterSpan.textContent = "$ " + waterBill;
  electricitySpan.textContent = "$ " + electricBill;
  internetSpan.textContent = "$ " + internetBill;
  telephoneSpan.textContent = "$ " + telephoneBill;
}

//Event listeners que ejecutan las funciones, si el usuario es válido
extractBtn.addEventListener('click', ()=> {
  if (validUser) {
    extractMoney();
  } else {
      alert("Usuario no reconocido. Recargue la página e inicie sesión, por favor")
  }
});

depositBtn.addEventListener('click', ()=> {
  if (validUser) {
    depositMoney();
  } else {
      alert("Usuario no reconocido. Recargue la página e inicie sesión, por favor")
  }
});

payServiceBtn.addEventListener('click', ()=> {
  if (validUser) {
    showServices();
  } else{
      alert("Usuario no reconocido. Recargue la página e inicie sesión, por favor")
  }
});

transferBtn.addEventListener('click', ()=> {
  if (validUser) {
    transferMoney();
  } else{
      alert("Usuario no reconocido. Recargue la página e inicie sesión, por favor")
  }
});

limitBtn.addEventListener('click', ()=> {
  if (validUser) {
    changeExtractionLimit();
  } else{
      alert("Usuario no reconocido. Recargue la página e inicie sesión, por favor")
  }
});