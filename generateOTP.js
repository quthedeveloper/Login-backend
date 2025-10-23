const speakeasy = require('speakeasy');


const generateOTP = () => {

let secret = speakeasy.generateSecret({ length: 20});

const token = speakeasy.totp({
    secret: secret.base32,
    encoding: 'base32',
    time: 5,
    step: 60
})



return { token, secret: secret.base32};

}

module.exports = {generateOTP};
