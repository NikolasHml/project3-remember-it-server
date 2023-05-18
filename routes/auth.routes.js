const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const router = express.Router();
const { isAuthenticated } = require("./../middleware/jwt.middleware")
const saltRounds = 10;


// POST /auth/signup - Creating a new user in the database
router.post("/signup", (req, res, next) => {
    const { email, password, name } = req.body;

    // Checking if the email/pw/name is provided as an empty string
    if (email === "" || password === "" || name === "") {
        res.status(400).json({ message: "Please provide all the stuff, my friend. Email, password and name!" }); /* tested and works */
        return;
    }

    //Using regex to validate the email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ message: "Please give me a valid email address!" }); /* tested and works */
        return;
    }

    // Using regex to validate the pasword format
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
        res.status(400).json({ message: "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter!"}); /* tested and works */
        return;
    }

    // Checking the users collection if a user with the same email already exists
    User.findOne({ email })
        .then((foundUser) => {
            // If the user with the same email or name already exists, send an error response
            if (foundUser) {
                res.status(400).json({ message: "Wait a second...I know your face! You better go straight to login, my friend!" }); /* tested and works */
                return
            }

            // If the email is unique, proceed to hash the password
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);

            // Creating a new user in the database and
            // we return a pending promise, which allows us to chain another "then"
            return User.create({ email, password: hashedPassword, name });
        })
        .then((createdUser) => {
            // First deconstruct the newly created user object to omit the password (to
            // not show the pw publicly)
            const { email, name, _id } = createdUser;

            // Creating a new object with above information
            const user = { email, name, _id };

            // Sending a json response containing the user 
            res.status(201).json({ user: user});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Internal Server Error"})
        });
});

// POST  /auth/login - Verifies email and password and returns a JWT
router.post("/login", (req, res, next) => {
    const { email, password } = req.body;

    // Checking if email or pw are provided as emtpy string
    if (email === "" || password === "") {
        res.status(400).json({ message: "Please provide all the stuff, my friend. Email, password and name!" });
        return;
}
    // Checking the users collection if a user with the same email exists
    User.findOne({ email })
        .then((foundUser) => {
            if (!foundUser) {
                // If the user is not found, send err 
                res.status(401).json({ message: "You sure, you've been here before, my friend? Better signup first!" })
                return;
            }

            // Compare the provided pw with the saved one in db
            const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

            if (passwordCorrect) {
                // Deconstruct the user object to omit pw
                const { _id, email, name } = foundUser;

                // Creating an object with the above info that will be set as the token 
                // payload
                const payload = { _id, email, name };

                // Create and sign the token
                const authToken = jwt.sign(
                    payload,
                    process.env.TOKEN_SECRET,
                    { algorithm: "HS256", expiresIn: "6h" }
                );

                // Send the token as the response
                res.status(200).json({ authToken: authToken });
            }
            else {
                res.status(401).json({ message: "Unable to authenticate the user"});
            }
        })
        .catch(err => res.status(500).json({ message: "Internal Server Error"}));
    })

// GET /auth/verify - Used to verify JWT stored on the client
router.get("/verify", isAuthenticated, (req, res, next) => {

    // If JWT is valid the payload gets decoded by the is Authenticated middleware
    // and made available on "req.payload"
    console.log("req.payload", req.payload);

    // Send back the object with user data prevously set as the token payload
    res.status(200).json(req.payload);
});

// POST /auth/profile - Users profile side
// router.post("/profile", (req, res, next) => {
//     const { ideaTitle, about } = req.body
    
//     Custom.create({ ideaTitle, about })
// })


module.exports = router;