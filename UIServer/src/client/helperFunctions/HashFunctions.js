var bcrypt = require('bcryptjs');
const salt = "$2a$10$CwTycUXWue0Thq9StjUM0u";

export function hashFunction(pass){
    const hashedPassword = bcrypt.hashSync(pass, salt);
    return hashedPassword;
}