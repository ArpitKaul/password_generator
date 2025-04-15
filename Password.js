const passwordForm = document.getElementById('credential-form');
const searchInput = document.getElementById('search');
const credentialsList = document.getElementById('credentials-list');
const generateBtn = document.querySelector('.generate-password');
const passwordInput = document.getElementById('password');
const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-form');
const closeModal = document.querySelector('.close');

const lengthInput = document.getElementById('length');
const uppercaseInput = document.getElementById('uppercase');
const numbersInput = document.getElementById('numbers');
const symbolsInput = document.getElementById('symbols');

let credentials = JSON.parse(localStorage.getItem('credentials')) || [];

function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  const toggleBtn = input.nextElementSibling;
  
  if (input.type === 'password') {
    input.type = 'text';
    toggleBtn.textContent = '🙈';
  } else {
    input.type = 'password';
    toggleBtn.textContent = '👁️';
  }
}

function generatePassword() {
  const length = lengthInput.value;
  const hasUpper = uppercaseInput.checked;
  const hasNumber = numbersInput.checked;
  const hasSymbol = symbolsInput.checked;
  
  let charset = 'abcdefghijklmnopqrstuvwxyz';
  if (hasUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (hasNumber) charset += '0123456789';
  if (hasSymbol) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';
  
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  passwordInput.value = password;
}

function saveCredentials(e) {
  e.preventDefault();
  
  const website = document.getElementById('website').value;
  const username = document.getElementById('username').value;
  const password = passwordInput.value;
  
  const credential = { website, username, password };
  credentials.push(credential);
  localStorage.setItem('credentials', JSON.stringify(credentials));
  
  passwordForm.reset();
  renderCredentials();
}

function renderCredentials(filter = '') {
  credentialsList.innerHTML = '';
  
  const filtered = filter 
    ? credentials.filter(c => c.website.toLowerCase().includes(filter.toLowerCase()))
    : credentials;
    
  filtered.forEach((cred, index) => {
    const div = document.createElement('div');
    div.className = 'credential-item';
    div.innerHTML = `
      <h3>${cred.website}</h3>
      <p>Username: ${cred.username}</p>
      <p>Password: ••••••••</p>
      <button onclick="editCredential(${index})">Edit</button>
      <button onclick="deleteCredential(${index})">Delete</button>
    `;
    credentialsList.appendChild(div);
  });
}

function editCredential(index) {
  const cred = credentials[index];
  document.getElementById('edit-id').value = index;
  document.getElementById('edit-website').value = cred.website;
  document.getElementById('edit-username').value = cred.username;
  document.getElementById('edit-password').value = cred.password;
  editModal.style.display = 'flex';
}

function updateCredential(e) {
  e.preventDefault();
  
  const index = document.getElementById('edit-id').value;
  credentials[index] = {
    website: document.getElementById('edit-website').value,
    username: document.getElementById('edit-username').value,
    password: document.getElementById('edit-password').value
  };
  
  localStorage.setItem('credentials', JSON.stringify(credentials));
  editModal.style.display = 'none';
  renderCredentials();
}

function deleteCredential(index) {
  if (confirm('Are you sure you want to delete this credential?')) {
    credentials.splice(index, 1);
    localStorage.setItem('credentials', JSON.stringify(credentials));
    renderCredentials();
  }
}

generateBtn.addEventListener('click', generatePassword);
passwordForm.addEventListener('submit', saveCredentials);
searchInput.addEventListener('input', (e) => renderCredentials(e.target.value));
editForm.addEventListener('submit', updateCredential);
closeModal.addEventListener('click', () => editModal.style.display = 'none');

document.querySelectorAll('.toggle-password').forEach(btn => {
  btn.addEventListener('click', function() {
    const input = this.previousElementSibling;
    togglePasswordVisibility(input.id);
  });
});

renderCredentials();
