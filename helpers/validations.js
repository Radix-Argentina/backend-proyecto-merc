//Validación de nombre de usuario
const validateUsername = (username) => {
    const regex = /^[A-Za-z0-9\u00C0-\u024F_\-()\[\]']+$/;
    return typeof username === "string" && regex.test(username) && username.length >= 3 && username.length <= 25;
}

//Validación de contraseña
const validatePassword = (password) => {
    return typeof password === "string" && password.length >= 8 && password.length <= 100;
}

//Validación de nombres
const validateName = (name) => {
    const regex = /^[A-Za-z0-9\u00C0-\u024F_\-()\[\] ']+$/;
    return typeof name === "string" && regex.test(name) && name.length >= 3 && name.length <= 25;
}

//Validación de teléfono de proveedor
const validatePhone = (phone) => {
    const regex = /^\+\d{1,3}\d{1,4}\d{1,4}\d{1,4}$/;
    return regex.test(phone) && phone.length >= 7 && phone.length <= 16;
};

//Validación de dirección de proveedor
const validateAddress = (address) => {
    const regex = /^[ A-Za-z\u00C0-\u024F0-9,.\:\(\)\[\]\'\"\`]+$/;
    return regex.test(address) && address.length >= 3 && address.length <= 100;
};

//Validación de contacto de proveedor
const validateContact = (contact) => {
    const regex = /^[ A-Za-z\u00C0-\u024F0-9,.\:\(\)\[\]\'\"\`]+$/;
    return regex.test(contact) && contact.length >= 3 && contact.length <= 100;
};

//Validación de país de proveedor
const validateCountry = (country) => {
    const regex = /^[ A-Za-z\u00C0-\u024F0-9,.\:\(\)\[\]\'\"\`]+$/;
    return regex.test(country) && country.length >= 3 && country.length <= 100;
};

//Validación de correo de proveedor
const validateMail = (mail) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(mail) && mail.length >= 5 && mail.length <= 100;
}

//Validación de titulo de nota
const validateTitle = (title) => {
    const regex = /^[ A-Za-z\u00C0-\u024F0-9,.\:\(\)\[\]\'\"\`]+$/;
    return regex.test(title) && title.length >= 3 && title.length <= 100;
};

//Validación de contenido de nota
const validateText = (text) => {
    const regex = /^[ A-Za-z\u00C0-\u024F0-9,.\:\(\)\[\]\'\"\`]+$/;
    return regex.test(text) && text.length >= 0 && text.length <= 256;
};

//Validación de fecha de oferta
const validateDate = (date) => {
    const testDate = new Date(date);
    return typeof testDate === 'object' && !isNaN(testDate);
}

//Validación de precio de oferta
const validatePrice = (price) => {
    price = Number.parseFloat(price);
    return typeof price === 'number' && price > 0;
}

module.exports = {validatePassword, validateText, validateTitle, validateCountry, validateDate, validatePrice, validateUsername, validateName, validateMail, validateAddress, validatePhone, validateContact};