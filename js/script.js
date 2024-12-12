if (!JSON.parse(localStorage.getItem('userArr'))) {
    document.querySelector('#usersTable').classList.add('none');
    document.querySelector('#tableMessage').classList.remove('none');
    localStorage.setItem('userArr', JSON.stringify(records, null, " "));
}
loadUsersWithSpinner();

function getUsersArray() {
    return JSON.parse(localStorage.getItem('userArr')) || [];
}

function updateLocalStorage(usersArray) {
    localStorage.setItem('userArr', JSON.stringify(usersArray, null, " "));
}

function getFormFields(formId) {
    const form = document.querySelector(`form[id="${formId}"]`);
    return {
        form,
        firstName: form.querySelector('input[name="first-name"]'),
        lastName: form.querySelector('input[name="last-name"]'),
        email: form.querySelector('input[name="email"]'),
        phoneNumber: form.querySelector('input[name="phone-number"]'),
        role: form.querySelector('select[name="role"]'),
        age: form.querySelector('input[name="age"]'),
        city: form.querySelector('input[name="city"]'),
        status: form.querySelector('input[name="status"]'),
        fileInput: form.querySelector('input[name="file-upload"]'),
        imagePreview: form.querySelector('.form__wrapper-img')
    };
}

function loadImage(file, callback) {
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            callback(e.target.result);
        };
        reader.readAsDataURL(file);
    } else {
        callback(null);
    }
}

function showUser(userID) {
    closeModal('createUser');
    const fields = getFormFields('editUser');
    let usersArray = getUsersArray();
    let user = usersArray.find(obj => obj.id === userID);

    if (user) {
        fields.form.classList.remove('none');
        fields.firstName.value = user.firstName;
        fields.lastName.value = user.lastName;
        fields.email.value = user.email;
        fields.phoneNumber.value = user.phoneNumber;
        fields.role.value = user.role;
        fields.age.value = user.age;
        fields.city.value = user.city;
        fields.status.checked = user.status;
        fields.imagePreview.src = user.image || './img/user-logo.jpg';
    }

    document.querySelector('#editBtn').addEventListener('click', () => updateUser(userID));
    document.querySelector('#deleteBtn').addEventListener('click', () => deleteUser(userID));

}

function updateUser(userID) {
    const fields = getFormFields('editUser');
    let usersArray = getUsersArray();
    let userIndex = usersArray.findIndex(user => user.id === userID);

    if (userIndex !== -1) {
        usersArray[userIndex] = {
            ...usersArray[userIndex], 
            firstName: fields.firstName.value,
            lastName: fields.lastName.value,
            email: fields.email.value,
            phoneNumber: fields.phoneNumber.value,
            role: fields.role.value,
            age: Number(fields.age.value) || 0,
            city: fields.city.value,
            status: fields.status.checked,
        };

        const file = fields.fileInput.files[0];
        if (file) {
            loadImage(file, (imageData) => {
                usersArray[userIndex].image = imageData; 
                updateLocalStorage(usersArray); 
                closeModal('editUser'); 
                loadUsersWithSpinner(); 
            });
        } else {
            updateLocalStorage(usersArray); 
            closeModal('editUser'); 
            loadUsersWithSpinner(); 
        }
    }
}


function deleteUser(userID) {
    let usersArray = getUsersArray();
    usersArray = usersArray.filter(user => user.id !== userID);
    updateLocalStorage(usersArray);
    closeModal('editUser');
    loadUsersWithSpinner();
}

function createUser() {
    const fields = getFormFields('createUser');
    let usersArray = getUsersArray();
    const existingIds = usersArray.map(obj => obj.id);
    const newId = generateUniqueId(existingIds);
    const file = fields.fileInput.files[0];

    loadImage(file, (image) => {
        let user = {
            id: newId,
            firstName: fields.firstName.value,
            lastName: fields.lastName.value,
            email: fields.email.value,
            phoneNumber: fields.phoneNumber.value,
            role: fields.role.value,
            age: Number(fields.age.value),
            city: fields.city.value,
            status: fields.status.checked,
            image: image
        };

        usersArray.push(user);
        updateLocalStorage(usersArray);
        loadUsersWithSpinner();
        fields.imagePreview.src = './img/user-logo.jpg';
        fields.form.reset();
        closeModal('createUser')
    });
}

 function printUsers() {
    let usersArray = JSON.parse(localStorage.getItem('userArr'));
    let tableBody = document.querySelector('#usersTable tbody');
    if (usersArray) {
        let counter = 0;
        tableBody.innerHTML = '';
        for (const user of usersArray) {
            counter++;
            tableBody.innerHTML +=
                `<tr class="${counter % 2 === 1 ? "oddRow" : "evenRow"}">
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${user.phoneNumber}</td>
                <td>${user.age}</td>
                <td>${user.city}</td>
                <td>${user.status ? "Active" : "Inactive"}</td>
                <td onclick="showUser('${user.id}')" class="editIcon"><img src="./img/edit.png" alt="eye"></td>
            </tr>`;
        }
    }

    if (usersArray.length === 0) {
        document.querySelector('#usersTable').classList.add('none');
        document.querySelector('#tableMessage').classList.remove('none');
    } else {
        document.querySelector('#usersTable').classList.remove('none');
        document.querySelector('#tableMessage').classList.add('none');
    }
}

function generateUniqueId(existingIds, length = 6) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    function generateRandomId() {
        let id = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            id += characters[randomIndex];
        }
        return id;
    }
    let newId;
    do {
        newId = generateRandomId();
    } while (existingIds.includes(newId));
    return newId;
}

function setAvatar(form) {
    const fileInput = document.querySelector(`form[id=${form}] input[name="file-upload"]`);
    const imagePreview = document.querySelector(`form[id=${form}] .form__wrapper-img`);
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function showCreateForm() {
    closeModal('editUser');
    document.querySelector('form[id="createUser"]').classList.remove('none');
}

function closeModal(form) {
    let currentForm = document.querySelector(`#${form}`);
    currentForm.classList.add('none');
    const imagePreview = document.querySelector(`form[id="${form}"] .form__wrapper-img`);
    imagePreview.src = './img/user-logo.jpg';
    currentForm.reset();

    const buttons = currentForm.querySelectorAll('button');
    buttons.forEach(button => {
        const newButton = button.cloneNode(true); 
        button.replaceWith(newButton);
    });
}

function showSpinner() {
    const spinner = document.querySelector('#spinner');
    const section = document.querySelector('#users');
    spinner.classList.remove('none');
    section.classList.add('none');
}

function hideSpinner() {
    const spinner = document.querySelector('#spinner');
    const table = document.querySelector('#users');
    table.classList.remove('none');
    spinner.classList.add('none');
}

function loadUsersWithSpinner() {
    showSpinner();
    setTimeout(() => {
        printUsers();
        hideSpinner();
    }, 150);  
}