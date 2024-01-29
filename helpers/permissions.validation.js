const validateToken = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        const tokenParts = token.split(" ");
    
        if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
            return res.status(400).json({ message: "Token inválido" });
        }
        const jwtToken = tokenParts[1];
        const { id } = jwt.verify(jwtToken, process.env.JWT);
    
        const user = await User.findById(id);
        req.user = user;
        next();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

const verifyAdmin = async (req, res, next) => {
    try {
        await validateToken(req, res, ()=>{
            if (req.user.isAdmin) {
                next();
            } else {
                throw new Error("Error, el token no corresponde a un usuario váido");
            }
        });
        next();
    }
    catch(error){
        console.log(error);
        res.status(401).json({message: "Acceso denegado"});
    }
}

const verifyEditor = async (req, res, next) => {
    try {
        await validateToken(req, res, ()=>{
            if (req.user.isAdmin || req.user.isEditor) {
                next();
            } else {
                throw new Error("Error, el token no corresponde a un usuario váido");
            }
        });
        next();
    }
    catch(error){
        console.log(error);
        res.status(401).json({message: "Acceso denegado"});
    }
}

const verifyUser = async (req, res, next) => {
    try {
        await validateToken(req, res, ()=>{
            if (req.user._id) {
                next();
            } else {
                throw new Error("Error, el token no corresponde a un usuario váido");
            }
        });
        next();
    }
    catch(error){
        console.log(error);
        res.status(401).json({message: "Acceso denegado"});
    }
}

module.exports = { verifyAdmin, verifyEditor, verifyUser};