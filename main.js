const commentMainContainer = document.querySelector('.comments-container');
let currentUser;
const comments = [];

function renderCommentProt() {
    let repliesContainer;
    return function(userIcon, nickname, createdAtTime, content, score, isReply) {
        let commentContainer;
    if (!isReply) {
        commentContainer = document.createElement('section')
        commentContainer.classList.add('comment-container');
    }

    const commentSection = document.createElement('div');
    if (isReply) {
        commentSection.classList.add('comment-reply');
    } else {
        commentSection.classList.add('comment');
    }

    const userInfoDiv = document.createElement('div')
    userInfoDiv.classList.add('comment-user-info');
    const userImg = document.createElement('img');
    userImg.classList.add('user-img');
    userImg.src = userIcon;
    //
    const nicknameUser = document.createElement('span')
    nicknameUser.classList.add('nickname');
    nicknameUser.innerText = nickname;
    const time = document.createElement('span');
    time.classList.add('time');
    time.innerText = createdAtTime; 

    userInfoDiv.append(userImg, nicknameUser, time);

    const commentContent = document.createElement('p');
    commentContent.classList.add('comment-content');
    commentContent.innerText = content;

    const voteBtn = document.createElement('div')
    voteBtn.classList.add('vote-btn');
    const plusBtn = document.createElement('button');
    const plusImg = document.createElement('img');
    plusImg.src = './images/icon-plus.svg';
    plusBtn.appendChild(plusImg);
    //
    const commentScore = document.createElement('span');
    commentScore.innerText = score;
    //
    const minusBtn = document.createElement('button');
    const minusImg = document.createElement('img');
    minusImg.src = './images/icon-minus.svg';
    minusBtn.appendChild(minusImg);

    voteBtn.append(plusBtn,commentScore,minusBtn);

    commentSection.append(userInfoDiv,commentContent,voteBtn);

    let deleteDiv;
    let editDiv;
    let replyContainer;
    
    if (currentUser.username == nickname) {
        deleteDiv = document.createElement('div')
        deleteDiv.classList.add('delete-container');
        const deleteImg = document.createElement('img');
        deleteImg.src = './images/icon-delete.svg';
        const spanDelete = document.createElement('span');
        spanDelete.innerText = 'Delete';

        deleteDiv.append(deleteImg, spanDelete);

        editDiv = document.createElement('div')
        editDiv.classList.add('edit-container');
        const editImg = document.createElement('img');
        editImg.src = './images/icon-edit.svg';
        const spanEdit = document.createElement('span');
        spanEdit.innerText = 'Edit';

        editDiv.append(editImg, spanEdit);

        commentSection.append(deleteDiv, editDiv);
    } else {
        replyContainer = document.createElement('div')
        replyContainer.classList.add('reply-container');
        const replyImg = document.createElement('img');
        replyImg.src = './images/icon-reply.svg';
        const spanReply = document.createElement('span');
        spanReply.innerText = 'Reply';

        replyContainer.append(replyImg, spanReply);
        commentSection.append(replyContainer);
        
        //
        replyContainer.addEventListener('click', renderTemporalReply)
    }


    if (!isReply) {
        repliesContainer = document.createElement('section')
        repliesContainer.classList.add('replies-container');
        const line = document.createElement('div')
        line.classList.add('line');
        repliesContainer.appendChild(line);

        commentContainer.append(commentSection, repliesContainer);
        commentMainContainer.appendChild(commentContainer);
    } else {
        repliesContainer.append(commentSection);
    }
    }

    // poner replies container fuera de la funcion y crear un closure
}

/*  <div class="temporal-reply-prompt comment-reply">
        <input type="text" name="" placeholder="Add a comment...">
        <img src="./images/avatars/image-juliusomo.webp" alt="">
        <button>REPLY</button>
    </div> */

function renderTemporalReply(event) {
    let commentNode = event.target.parentNode;
    if (!commentNode.classList.contains('comment')) {
        commentNode = commentNode.parentNode;
    }
    const replyPrompt = document.createElement('div');
    replyPrompt.classList.add('temporal-reply-prompt');
    if (commentNode.classList.contains('comment-reply')) {
        replyPrompt.classList.add('comment-reply')    
    }

    const inputComment = document.createElement('input');
    inputComment.type = 'text';
    inputComment.placeholder = 'Add a comment...';

    const imgUser = document.createElement('img');
    imgUser.src = currentUser.image.webp;

    const replyBtn = document.createElement('button');
    replyBtn.innerText = 'REPLY';

    replyPrompt.append(inputComment, imgUser, replyBtn);

    commentNode.insertAdjacentElement('afterend', replyPrompt);

    //Eliminar el contendor cuando se de click en el boton 'REPLY'
    replyBtn.addEventListener('click', () => replyPrompt.remove());
}

function renderComments() {
    for (const comment of comments) {
        const showComments = renderCommentProt();
        showComments(comment.user.image.webp, comment.user.username, comment.createdAt, comment.content, comment.score, false);
        if (comment.replies.length) {
            for (const reply of comment.replies) {
                showComments(reply.user.image.webp, reply.user.username, reply.createdAt, reply.content, reply.score, true);
            }
        }
    }
}

async function fetchData() {
    try {
        const response = await fetch('./data.json');
        const data = await response.json();

        currentUser = data.currentUser;
    // Acceder a los datos del archivo JSON
        data.comments.forEach(comment => {
            const id = comment.id;
            const content = comment.content;
            const createdAt = comment.createdAt;
            const score = comment.score;
            const user = comment.user;
            const replies = comment.replies;

            const commentObj = {
                id: id,
                content: content,
                createdAt: createdAt,
                score: score,
                user: user,
                replies: replies
            }

            comments.push(commentObj);
        });
        console.log(comments);

      // Llamar a otras funciones o ejecutar código que dependa de comments y currentUser
        renderComments();
    } catch (error) {
        console.error('Error al cargar el archivo JSON:', error);
    }
}

fetchData();