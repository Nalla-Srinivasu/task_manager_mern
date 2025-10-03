async function generateToken(payload,screatekey=global.tokenKey) {
    const jwtToken = require('jsonwebtoken');
    const token = await jwtToken.sign(payload,screatekey,{expiresIn: '15m'});
    return token;
}

async function verifyToken(token,screatekey=global.tokenKey){
    const jwtToken  = require('jsonwebtoken')
    try{
        const decode = await jwtToken.verify(token,screatekey)
        return decode;
    }catch(error){
        console.error("Token verification failed:",error);
        return false;
    }
}

module.exports = { generateToken, verifyToken };