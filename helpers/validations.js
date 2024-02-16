const validateUsername = (username) => {
    const regex = /^[A-Za-z0-9\u00C0-\u024F_\-()\[\]']+$/; //Permite todo menos caracteres especiales y espacios, si permite guiones y parentesis
    return typeof username === "string" && regex.test(username) && username.length >= 3 && username.length <= 25;
}

const validatePassword = (password) => {
    return typeof password === "string" && password.length >= 8 && password.length <= 100;
}

const validateName = (name) => {
    const regex = /^[A-Za-z0-9\u00C0-\u024F_\-()\[\] ']+$/;    //Permite todo menos caracteres especiales y espacios, si permite guiones y parentesis
    return typeof name === "string" && regex.test(name) && name.length >= 3 && name.length <= 25;
}

const validatePhone = (phone) => {
    const regex = /^\+\d{1,3}\d{1,4}\d{1,4}\d{1,4}$/; //Tenes que poner el + primero
    return regex.test(phone) && phone.length >= 7 && phone.length <= 16;
};

const validateAddress = (address) => {
    const regex = /^[ A-Za-z\u00C0-\u024F0-9,.\:\(\)\[\]\'\"\`]+$/;
    return regex.test(address) && address.length >= 3 && address.length <= 100;
};

const validateContact = (contact) => {
    const regex = /^[ A-Za-z\u00C0-\u024F0-9,.\:\(\)\[\]\'\"\`]+$/;
    return regex.test(contact) && contact.length >= 3 && contact.length <= 100;
};

const validateCountry = (country) => {
    const regex = /^[ A-Za-z\u00C0-\u024F0-9,.\:\(\)\[\]\'\"\`]+$/;
    return regex.test(country) && country.length >= 3 && country.length <= 100;
};

const validateMail = (mail) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(mail) && mail.length >= 5 && mail.length <= 100;
}

const validateDate = (date) => { //Comprobar si funciona perfecto
    const testDate = new Date(date);
    return typeof testDate === 'object' && !isNaN(testDate);
}

const validatePrice = (price) => {
    price = Number.parseFloat(price);
    return typeof price === 'number' && price > 0;
}

module.exports = {validatePassword, validateCountry, validateDate, validatePrice, validateUsername, validateName, validateMail, validateAddress, validatePhone, validateContact};