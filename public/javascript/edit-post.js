async function editFormHandler(event) {
    event.preventDefault();
    const post_id = window.location.toString().split("/")[
        window.location.toString().split("/").length - 1
    ];
    const title = document.querySelector("#post-title").value.trim();
    // console.log(title)
    await fetch(`/api/posts/${post_id}`, {
        method: "POST",
        body: JSON.stringify({
            title
        }),
        headers: {
            "Content-Type":"application/json"
        }
    });
}
document.querySelector(".edit-post-form").addEventListener("submit", editFormHandler);