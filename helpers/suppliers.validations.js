const validateName = (name) => {
    const regex = /^[A-Za-z0-9\u00C0-\u024F_\-()\[\]']+$/; //Permite todo menos caracteres especiales y espacios, si permite guiones y parentesis
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

const validateMail = (mail) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(mail) && mail.length >= 5 && mail.length <= 100;
}

module.exports = { validateName, validatePhone, validateAddress, validateMail};