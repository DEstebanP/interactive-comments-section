const commentMainContainer = document.querySelector('.comments-container');
const addCommentBtn = document.querySelector('.add-comment__btn');
const addCommentFooter = document.querySelector('.add-comment');
const commentInput = document.querySelector('#comment-input');
const sendBtn = document.getElementById('send-btn');


commentInput.addEventListener('input', inputValue)
sendBtn.addEventListener('click', addNewComment);
addCommentBtn.addEventListener('click', () => {
    addCommentFooter.classList.remove('inactive');
    addCommentBtn.classList.add('inactive');
});

let currentUser;
let comments = [];
let inputContent;
let commentReply;
let username;
let liked;

function renderCommentProt() {
    let repliesContainer;
    return function(userIcon, nickname, createdAtTime, content, score, isReply, id) {
    let commentContainer;
    if (!isReply) {
        commentContainer = document.createElement('section')
        commentContainer.classList.add('comment-container');
    }

    const commentSection = document.createElement('div');
    if (isReply) {
        commentSection.classList.add('comment-reply');
        commentSection.id = id;
    } else {
        commentSection.classList.add('comment');
        commentSection.id = id;
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
    plusBtn.classList.add('plus');
    const plusImg = document.createElement('img');
    plusImg.src = './images/icon-plus.svg';
    plusBtn.appendChild(plusImg);
    plusBtn.addEventListener('click', upDownVote);
    //
    const commentScore = document.createElement('span');
    commentScore.innerText = score;
    //
    const minusBtn = document.createElement('button');
    minusBtn.classList.add('minus');
    const minusImg = document.createElement('img');
    minusImg.src = './images/icon-minus.svg';
    minusBtn.appendChild(minusImg);
    minusBtn.addEventListener('click', upDownVote);

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
        replyContainer.addEventListener('click', (event) => renderTemporalReply(event, replyContainer));
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
}

/* function allocateId() {

} */
function inputValue(event) {
    inputContent = event.target.value;
}

function reloadPage() {
    while (commentMainContainer.firstChild) {
        commentMainContainer.removeChild(commentMainContainer.firstChild);
    }
    
    localStorage.setItem("commentsArr", JSON.stringify(comments));
    renderComments();
}

function addNewComment() {
    const newComment = new Comment({
        id: comments.length + 1,
        content: inputContent,

        user: username
    })

    comments.push(newComment);  
    addCommentFooter.classList.add('inactive');
    addCommentBtn.classList.remove('inactive');
    commentInput.value = "";

    reloadPage();
}

function addNewReply() {
    const newReply = new Reply({
        id: 0,
        content: inputContent,
        user: username
    }, commentReply.user.username
    );

    if (commentReply.replies) {
        commentReply.replies.push(newReply);
    } else {
        const commentIndex = Number((String(commentReply.id)[0])) - 1;
        comments[commentIndex].replies.push(newReply);
    }

    reloadPage();
}

function renderTemporalReply(event, replyContainer) {
    //Quitar o poner el reply
    replyContainer.classList.add('inactive');

    //Obtener el elemento que se clickeo
    let commentNode = event.target.parentNode;
    if (!commentNode.classList.contains('comment') || !commentNode.classList.contains('comment-reply')) {
        commentNode = commentNode.parentNode;
    }

    //Obtener el objeto
    for (const comment of comments) {
        if (comment.id == commentNode.id) {
            commentReply = comment;
        }
        for (const reply of comment.replies) {
            if (reply.id == commentNode.id) {
                commentReply = reply;
            }
        }
    }
    console.log({commentReply,commentNode});
    const replyPrompt = document.createElement('div');
    replyPrompt.classList.add('temporal-reply-prompt');
    if (commentNode.classList.contains('comment-reply')) {
        replyPrompt.classList.add('comment-reply')    
    }

    const inputComment = document.createElement('input');
    inputComment.type = 'text';
    inputComment.placeholder = 'Add a comment...';
    inputComment.value = `@${commentReply.user.username} `;
    inputComment.addEventListener('input', inputValue);

    const imgUser = document.createElement('img');
    imgUser.src = currentUser.image.webp;

    const replyBtn = document.createElement('button');
    replyBtn.innerText = 'REPLY';

    replyPrompt.append(inputComment, imgUser, replyBtn);

    commentNode.insertAdjacentElement('afterend', replyPrompt);

    //Eliminar el contendor cuando se de click en el boton 'REPLY'
    replyBtn.addEventListener('click', addNewReply);
    /* replyBtn.addEventListener('click', () => {
        replyPrompt.remove();
        replyContainer.classList.remove('inactive');
    }); */
}

function renderComments() {
    for (const comment of comments) {
        const showComments = renderCommentProt();
        showComments(comment.user.image.webp, comment.user.username, comment.createdAt, comment.content, comment.score, false, comment.id);
        if (comment.replies.length) {
            for (const reply of comment.replies) {
                showComments(reply.user.image.webp, reply.user.username, reply.createdAt, reply.content, reply.score, true, reply.id);
            }
        }
    }

    //Class for likes
    if (liked == 'plus') {
        debugger;
        isPlusVote.classList.add('voted-plus');
        isPlusVote.classList.remove('voted-minus');
    } else if (liked == 'minus') {
        isPlusVote.classList.add('voted-minus');
        isPlusVote.classList.remove('voted-plus');
    }
}

function upDownVote(event) {
    let commentNode = event.target.closest('.comment, .comment-reply');
    const isPlusVote = event.target.closest('.plus, .minus');
    let commentLike;
    for (const comment of comments) {
        if (comment.id == commentNode.id) {
            commentLike = comment;
        }
        for (const reply of comment.replies) {
            if (reply.id == commentNode.id) {
                commentLike= reply;
            }
        }
    }

    if (isPlusVote.classList.contains('plus')) {
        
        if (commentLike.like == 'minus') {
            commentLike.score += 2;
            commentLike.like = 'plus'
        } else if (commentLike.like == 'plus') {
            commentLike.score -= 1;
            commentLike.like = undefined;
        } else {
            commentLike.score += 1;
            commentLike.like = 'plus'
        }
    } else if (isPlusVote.classList.contains('minus')) {
        if (commentLike.like == 'plus') {
            commentLike.score -= 2;
            commentLike.like = 'minus'; 
        } else if (commentLike.like == 'minus') {
            commentLike.score += 1;
            commentLike.like = undefined;
        } else {
            commentLike.score -= 1;
            commentLike.like = 'minus';  
        }
    }

    reloadPage();
}


class User {
    constructor({
        image = {
            png,
            webp: undefined
        },
        username
    }){
        this.image = image;
        this.username = username;
    }
}


class Comment {
    constructor({
        id,
        content,
        createdAt = 'Now',
        score = 0,
        user,
        replies = []
    }) {
        this.id = id;
        this.content = content;
        this.createdAt = createdAt;
        this.score = score;
        this.user = user;
        this.replies = replies;
    }
}

class Reply extends Comment {
    constructor(props, replyingTo){
        super(props);
        this.replyingTo = replyingTo;
        delete Reply.prototype.replies;
    }
}

async function fetchData() {
    try {
        const response = await fetch('./data.json');
        const data = await response.json();

        currentUser = data.currentUser;
    // Acceder a los datos del archivo JSON

        if (!localStorage.getItem("commentsArr")) {
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

            localStorage.setItem("commentsArr", JSON.stringify(comments));
            console.log(comments);
        } else {
            const commentsArr = JSON.parse(localStorage.getItem("commentsArr"));
            comments = commentsArr;
        }

      // Llamar a otras funciones o ejecutar código que dependa de comments y currentUser
        username = new User({
        image:{
            png: currentUser.image.png,
            webp: currentUser.image.webp
        },
        username: currentUser.username
    })
    
        renderComments();
    } catch (error) {
        console.error('Error al cargar el archivo JSON:', error);
    }
}

fetchData();