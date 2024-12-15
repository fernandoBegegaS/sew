class Usuario {
    constructor() {
        this.authForm = $("section:first-of-type form");
        this.authMessage = $("section:first-of-type p");
        this.createPostSection = $("section:nth-of-type(2)");
        this.postFormCrear = $("section:nth-of-type(2) form");
        this.postMessage = $("section:nth-of-type(2) div");
        this.postFormFiltrar = $("section:nth-of-type(3) form:first-of-type");
        this.postList = $("section:nth-of-type(3) section");

        this.init();
    }

    init() {
        this.authForm.on("submit", (e) => this.handleLoginSubmit(e));
        this.postFormCrear.on("submit", (e) => this.handlePostSubmit(e));
        this.postFormFiltrar.on("submit", (e) => this.handleFilterSubmit(e));
        $(document).on("click", "button[data-id]:contains('Dar Like')", (e) => this.handleLike(e));
        $(document).on("click", "button[data-id]:contains('Ver Comentarios')", (e) => this.handleViewComments(e));
        $(document).on("submit", "form:has(input[name='comment'])", (e) => this.handleCommentSubmit(e));
    }

    handleLoginSubmit(event) {
        event.preventDefault();
        const formData = this.authForm.serializeArray();
        const action = event.originalEvent.submitter.value;
        formData.push({ name: "action", value: action });

        $.ajax({
            url: "foro.php",
            type: "POST",
            data: formData,
            dataType: "json",
            success: (result) => {
                this.authMessage.text(result.message);
                if (result.status === "success") {
                    if(result.type === "login"){
                        this.createPostSection.show();
                        this.authForm.hide();

                        this.authForm.parent().append("<a href='logout.php' class='logout-link'>Cerrar Sesión</a>");
                    }else{
                        console.log(this.authForm)
                        this.authForm.get(0).reset();
                    }
                }
            },
            error: (xhr, status, error) => {
                console.error("Error al iniciar sesión:", error);
            },
        });
    }

    handlePostSubmit(event) {
        event.preventDefault();
        const formData = this.postFormCrear.serializeArray();
        formData.push({ name: "action", value: "create_post" });

        $.ajax({
            url: "foro.php",
            type: "POST",
            data: formData,
            dataType: "json",
            success: (result) => {
                this.postMessage.text(result.message);
                if (result.status === "success") {
                    this.postFormCrear[0].reset();
                    this.loadPosts();
                }
            },
            error: (xhr, status, error) => {
                console.error("Error al crear publicación:", error);
            },
        });
    }

    handleFilterSubmit(event) {
        event.preventDefault();
        const formData = this.postFormFiltrar.serializeArray();
        formData.push({ name: "action", value: "fetch_posts" });

        $.ajax({
            url: "foro.php",
            type: "POST",
            data: formData,
            dataType: "json",
            success: (result) => {
                this.postList.empty();
                if (result.status === "success") {
                    result.posts.forEach((post) => this.renderPost(post));
                }
            },
            error: (xhr, status, error) => {
                console.error("Error al filtrar publicaciones:", error);
            },
        });
    }

    handleLike(event) {
        const postId = $(event.target).data("id");
        $.ajax({
            url: "foro.php",
            type: "POST",
            data: { action: "like_post", post_id: postId },
            dataType: "json",
            success: (response) => alert(response.message),
            error: (xhr, status, error) => {
                console.error("Error al dar like:", error);
            },
        });
    }

    handleViewComments(event) {
        const postElement = $(event.target).closest("article");
        const commentsContainer = postElement.find("article");

        const postId = $(event.target).data("id");
        if (!postId) {
            console.error("No se encontró el ID de la publicación.");
            return;
        }

        if (commentsContainer.is(":visible")) {
            commentsContainer.hide();
            return;
        }

        $.ajax({
            url: "foro.php",
            type: "POST",
            data: { action: "fetch_comments", post_id: postId },
            dataType: "json",
            success: (result) => {
                commentsContainer.find("p").remove();
                if (result.status === "success" && result.comments.length > 0) {
                    
                    result.comments.forEach((comment) => {
                        commentsContainer.append(`<p  >${comment.username}: ${comment.content}</p>`);
                    });
                } else {
                    commentsContainer.append("<p>No hay comentarios disponibles.</p>");
                }
                commentsContainer.show();
            },
            error: (xhr, status, error) => {
                console.error("Error al cargar comentarios:", error);
            },
        });
    }

    handleCommentSubmit(event) {
        event.preventDefault();

        const form = $(event.target);
        const postElement = form.closest("article");
        const commentsContainer = postElement.find("article");
        const postId = postElement.find("button:contains('Ver Comentarios')").data("id");
        const commentText = form.find("input[name='comment']").val().trim();

        if (!commentText) {
            alert("El comentario no puede estar vacío.");
            return;
        }

        $.ajax({
            url: "foro.php",
            type: "POST",
            data: {
                action: "add_comment",
                post_id: postId,
                comment: commentText,
            },
            dataType: "json",
            success: (response) => {
                if (response.status === "success") {
                    alert("Comentario publicado.");
                    commentsContainer.append(`<p  >${response.comment.username}: ${response.comment.content}</p>`);
                    form[0].reset();
                } else {
                    alert(response.message);
                }
            },
            error: (xhr, status, error) => {
                console.error("Error al publicar comentario:", error);
            },
        });
    }

    loadPosts() {
        console.log("Cargando publicaciones");
        $.ajax({
            url: "foro.php",
            type: "POST",
            data: { action: "fetch_posts" },
            dataType: "json",
            success: (result) => {
                this.postList.empty();
                this.postList.append($("<h3>Publicaciones</h3>"));
                result.posts.forEach((post) => this.renderPost(post));
            },
            error: (xhr, status, error) => {
                console.error("Error al cargar publicaciones:", error);
            },
        });
    }

    renderPost(post) {
        const postArticle = $(`
            <article class='post'>
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <footer>
                    <small>Autor: ${post.username}</small>
                    <button data-id="${post.id}">Dar Like</button>
                    <button data-id="${post.id}">Ver Comentarios</button>
                </footer>
                <form>
                    <input type="text" name="comment" placeholder="Escribe un comentario..." required>
                    <button type="submit">Comentar</button>
                </form>
                <article class = "oculto"><h4>Comentarios:</h4> </article>
            </article>
        `);

        this.postList.append(postArticle);
    }
}

const usuario = new Usuario();
usuario.loadPosts();
