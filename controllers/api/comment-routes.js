const router = require("express").Router();
const { Comment, User, Post } = require("../../models");
const { restore } = require("../../models/User");

router.get("/", (req, res) => {
    
    Comment.findAll({
        attributes: [
            "id",
            "comment_text",
            "created_at"
        ],
        include: [
            {
                model: User,
                attributes: ["username","id"]
            },
            {
                model: Post,
                attributes: ["title", "id"]
            }
        ]
    })
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post("/", (req, res) => {
    if(req.session){
        Comment.create({
            comment_text: req.body.comment_text,
            post_id: req.body.post_id,
            user_id: req.session.user_id
        })
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    }
});

router.delete("/:id", (req, res) => {
    Comment.destroy(
        {
            where: req.params.id
        }
    )
    .then(dbCommentData => {
        if (!dbCommentData) {
            res.status(404).json({ message: "Unable to find a comment with the provided Comment ID"});
            return;
        }
        res.json(dbCommentData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;