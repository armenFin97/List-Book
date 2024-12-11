const records = [
    {
        id: 'XJBRSC',
        firstName: 'Armen',
        lastName: 'Poghosyan',
        email: 'atest@example.com',
        phoneNumber: '+37441803999',
        role: 'Admin',
        age: '24',
        city: 'Yerevan',
        status: true,
    },
    {
        id: 'BGTYJN',
        firstName: 'Alexandr',
        lastName: 'Magomedov',
        email: 'magomedov@example.com',
        phoneNumber: '+37441332234',
        role: 'User',
        age: '52',
        city: 'Moscow',
        status: true,
    },
    {
        id: 'QWEYTTR',
        firstName: 'Roy',
        lastName: 'Jhonson',
        email: 'sherif@example.com',
        phoneNumber: '+37441332234',
        role: 'Staffer',
        age: '34',
        city: 'San-Diego',
        status: true,
    }
];

if (!JSON.parse(localStorage.getItem('userArr'))) {
    localStorage.setItem('userArr', JSON.stringify(records, null, " "));
}
printUsers();



function showUser() {
    console.log(123);

}

function createUser() {
    const form = document.querySelector('form[id="createUser"]');
    const firstName = document.querySelector('form[id="createUser"] input[name="first-name"]');
    const lastName = document.querySelector('form[id="createUser"] input[name="last-name"]');
    const email = document.querySelector('form[id="createUser"] input[name="email"]');
    const phoneNumber = document.querySelector('form[id="createUser"] input[name="phone-number"]');
    const role = document.querySelector('form[id="createUser"] select[name="role"]');
    const age = document.querySelector('form[id="createUser"] input[name="age"]');
    const city = document.querySelector('form[id="createUser"] input[name="city"]');
    const status = document.querySelector('form[id="createUser"] input[name="status"]');
    const fileInput = document.querySelector('form[id="createUser"] input[name="file-upload"]');
    const imagePreview = document.querySelector('form[id="createUser"] .form__wrapper-img');

    let usersArray = JSON.parse(localStorage.getItem('userArr')) || [];
    const existingIds = usersArray.map(obj => obj.id);
    const newId = generateUniqueId(existingIds);

    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            createUserObject(e.target.result); 
        };
        reader.readAsDataURL(file); 
    } else {
        createUserObject(null);
    }

    function createUserObject(image) {
        let user = {
            id: newId,
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            phoneNumber: phoneNumber.value,
            role: role.value,
            age: Number(age.value),
            city: city.value,
            status: status.checked,
            image: image
        }

        usersArray.push(user);
        localStorage.setItem('userArr', JSON.stringify(usersArray, null, " "));
        printUsers();
        imagePreview.src = './img/user-logo.jpg';
        form.reset();
    }
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

function setAvatar() {
    const fileInput = document.querySelector('form[id="createUser"] input[name="file-upload"]');
    const imagePreview = document.querySelector('form[id="createUser"] .form__wrapper-img');
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
    document.querySelector('form[id="createUser"]').classList.remove('none');
}
