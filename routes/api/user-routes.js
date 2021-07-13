const router = require("express").Router();
const { verify } = require("crypto");
const { User, Post, Vote } = require("../../models");

// GET ALL USERS
router.get("/", (req, res) => {
    User.findAll({
        // attributes: { exclude: ["password"] }
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// GET SINGLE USER BY ID
router.get("/:id", (req, res) => {
    User.findOne({
        // attributes: { exclude: ["password"] },
        where: {
            id: req.params.id
        },
        include: [
            {
              model: Post,
              attributes: ['id', 'title', 'post_url', 'created_at']
            },
            {
              model: Post,
              attributes: ['title'],
              through: Vote,
              as: 'voted_posts'
            }
          ]
    })
    .then(dbUserData=> {
        if (!dbUserData) {
            res.status(404).json({ message: "No user found with this id" });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// CREATE NEW USER
router.post("/", (req, res) => {
    User.create({
        username:req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// LOGIN VERIFICATION
router.post("/login", (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: "An account with the provided email was not found."});
            return;
        }
        const verifyPassword = dbUserData.checkPassword(req.body.password);
        if (!verifyPassword){
            res.status(400).json({ message: "Incorrect password!" });
            return;
        }
        res.json({ user: dbUserData, message: "You are now logged in!"})
    })
})

// UPDATE USER INFORMATION
router.put("/:id", (req, res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id:req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: "No user found with this id" });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.delete("/:id", (req, res) => {
    User.destroy({
        where: {
            id:req.params.id
        }
    })
    .then(dbUserData => { 
        if (!dbUserData) {
            res.status(404).json({ message: "No user found with this id" });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;