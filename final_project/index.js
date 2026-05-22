const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if a JWT token exists in the session
    const token = req.session?.token;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No active session" });
    }

    // Verify the JWT token
    jwt.verify(token, "access", (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Forbidden: Invalid or expired token" });
        }

        // Attach decoded user payload to request for downstream use
        req.user = decoded;
        next();
    });
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
