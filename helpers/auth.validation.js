const validateUsername = (username) => {
    const regex = /^[A-Za-z0-9\u00C0-\u024F_\-()\[\]']+$/; //Permite todo menos caracteres especiales y espacios, si permite guiones y parentesis
    return typeof username === "string" && regex.test(username) && username.length >= 3 && username.length <= 25;
}

const validatePassword = (password) => {
    return typeof password === "string" && password.length >= 8 && password.length <= 100;
}

module.exports = {validatePassword, validateUsername};