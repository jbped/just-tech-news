const router = require("express").Router();
const { Post, User, Vote, Comment } = require("../../models");
const sequelize = require("../../config/connection");

// GET ALL POSTS
router.get("/", (req, res) => {
    console.log("========================");
    Post.findAll({
        attributes: ["id", 
            "post_url",
            "title",
            "created_at",
            [sequelize.literal("(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"), "vote_count"]
        ],
        order: [["created_at", "DESC"]],
        include: [
            {
                model: User,
                attributes: ["username"]
            },
            {
                model: Comment,
                attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
                include: {
                    model: User,
                    attributes: ["username"]
                }
            }
        ]
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET SINGLE POST BY POST ID
router.get("/:id", (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
          ],
        include: [
            {
                model: User, 
                attributes: ["username"]
            },
            {
                model: Comment,
                attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
                include: {
                    model: User,
                    attributes: ["username"]
                }
            }
        ]
    })
    .then(dbPostData => {
        if(!dbPostData) {
            res.status(404).json({ message: "No posts were found for the provided user ID"});
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// CREATE POST
router.post("/", (req, res) => {
    Post.create({
        title:req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// UPDATE POST TITLE
router.post("/:id", (req,res) => {
    Post.update(
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: "No post was found with the provided id" });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.delete("/:id", (req, res) => {
    Post.destroy(
        {
            where:{
                id: req.params.id
            }
        }
    )
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: "No post was found with the provided id"});
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.put("/upvote", (req, res) => {
    Post.upvote(req.body, { Vote })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    });
});



module.exports = router;