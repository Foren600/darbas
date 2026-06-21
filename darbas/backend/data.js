import bcrypt from 'bcryptjs';

const data = {
    users: [
        {
            name: "Dovydas",
            email: "admin@example.com",
            password: bcrypt.hashSync("123456", 10),
            isAdmin: true,
        },
        {
            name: "jonh",
            email: "user@example.com",
            password: bcrypt.hashSync("123456", 10),
            isAdmin: false,
        }
    ],
    products: [
       
    ],
};

export default data;
