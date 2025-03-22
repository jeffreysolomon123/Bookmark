import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";
import bcrypt, { hash } from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy} from "passport-local";
import session from "express-session";
import env from "dotenv";



const app = express();
const port = 3000;
const saltRounds = 10;
env.config();


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // set to false so a session is not created until something is stored
    cookie : {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(express.urlencoded({extended:true}));
app.use(cors({ credentials: true, origin: "http://localhost:5173" })); // allow frontend to send cookies
app.use(express.json());


app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
})
db.connect();

app.get("/", cors(), (req,res)=>{
    res.send("backend is working");
});

app.post("/login", passport.authenticate("local") , (req,res)=> {
    res.sendStatus(200);
});


app.post("/logout", (req,res)=>{
    req.logout(function (error) {
        if(error) {
            return next(error);
        }
        req.session.destroy();
        res.clearCookie('connect.sid');
        res.sendStatus(200);
        console.log("logged out successfully!");
    });
});

//passport local strategy for login

passport.use(
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    },async function verify(email,password,cb) {
        try {
            const result = await db.query("SELECT * FROM users WHERE email = $1",[email]);
            //console.log(result.rows[0]);
            if(result.rows.length > 0) {
                const storedHashedPassword = result.rows[0].password;
                const user = result.rows[0];
                bcrypt.compare(password, storedHashedPassword, (error, isMatch) => {
                    if (error) {
                        console.error("Error comparing passwords: ", error);
                        return cb(error);
                    }
                    if (isMatch) {
                        //console.log("Password verified!");
                        return cb(null, user); // Return the full user object
                    } else {
                        console.log("Incorrect password");
                        return cb(null, false, { message: "Incorrect password" });
                    }
                });
            } else {
                console.log("No user found with that email");
                return cb(null, false, { message: "No user found with that email" });
            }
        } catch (error) {
            console.log("Error during authentication: ", error);
            return cb(error);
        }
        
    })
)

app.post("/booksubmit", async (req,res)=> {
    //console.log(req.body);
    //console.log("User details:", req.user);
    const book_name = req.body.selectedBookName;
    const book_id = req.body.selectedBookId;
    const user_id = req.user.id;
    const user_email = req.user.email;
    // if(!req.isAuthenticated()){
    //     console.log("You need to be logged in to submit a book.");
    //     return res.status(401).send("You need to be logged in to submit a book.");
        
    // }


    try {
        await db.query("INSERT INTO marked_books VALUES($1,$2,$3,$4)",[user_id, user_email, book_id, book_name]);
        res.sendStatus(200);
    } catch (error) {
        console.log("Error inserting books!",error);
        res.status(500).send("Error submitting book!");
    }
})




app.get("/getmarkedbooks", async (req,res)=>{
    if(req.isAuthenticated()) {
        const user_id = req.user.id;
        const email_id = req.user.email;
        try {
             const response = await db.query("SELECT book_id , book_name FROM marked_books WHERE user_id = $1 AND email = $2",[user_id,email_id]);
             //console.log(response.rows);
            res.json(response.rows);
            //console.log(user_id,email_id);


        } catch (error) {
            console.log("error fetching books in dashboard!");
        }
    }
    else {
        res.status(401).send("You need to be logged in to view marked books!");
    }
})


app.post("/getremovalbook", async (req,res)=>{
    
    const email = req.body.userInfo.email;
    const id = req.body.userInfo.id;
    const bookid = req.body.bookid;
    //console.log(email,id,bookid);
    try {
        const response = await db.query("DELETE FROM marked_books WHERE user_id = $1 AND email = $2 AND book_id = $3",[id,email,bookid]);
        //console.log("Successfully removed book!");
        res.sendStatus(200);
    } catch (error) {
        console.log("error in removing book");
    }
})

app.get("/auth/check", (req,res)=>{
    if (req.isAuthenticated()) {
        res.json({
            authenticated: true,
            user : {
                id : req.user.id,
                email : req.user.email
            }

        });
    }
    else {
        res.json({authenticated : false})
    }
});


app.post("/signuptest", async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    // console.log(email)
    // console.log(password)

    try {
        const checkResult = await db.query("SELECT * FROM users WHERE email = $1",[email]);
        if (checkResult.rows.length > 0) {
            res.send("User alreadt exists");

        }
        else {
            bcrypt.hash(password,saltRounds, async (error, hash)=>{
                if(error) {
                    console.error("Error hashing password",error)
                }
                else {
                    const newUser = await db.query("INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",[email, hash]);
                    const user = newUser.rows[0];
                    //console.log(user);
                    req.login(user, (error) => {
                        if (error) {
                            console.log("Error logging in after signing up:", error);
                            return res.status(500).send("Error logging in after signing up!");
                        }
                    
                        //console.log("Session after login:", req.session);  // Check if the session is being created
                        res.sendStatus(200);
                    });};
            });
        }
    } catch (error) {
        console.log(error)
    }
})


passport.serializeUser((user, cb) => {
    //console.log(user.id)
    cb(null, user.id); // Use the user's id for session management
    
});

// Deserialize user by id
passport.deserializeUser(async (id, cb) => {
    try {
        const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
        if (result.rows.length > 0) {
            cb(null, result.rows[0]); // Attach the full user object to req.user
        } else {
            cb(new Error("User not found"));
        }
    } catch (error) {
        cb(error);
    }
});


app.listen(port, ()=> {
    console.log(`Listening in ${port}`);
});