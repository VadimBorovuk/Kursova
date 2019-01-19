var
	content = document.getElementById('content'),
	allPosts = document.createElement('div'),
	arrPosts = [],
	LS = localStorage.getItem('posts');

allPosts.setAttribute('id', 'allPosts');
content.appendChild(allPosts);

// Generate ID's
function generatorId() {
	return Math.random().toString(36).substr(2, 9);
}

// Add event listener for rendering posts
// Remove post
function addButtonListener() {
	var
		removePostBtn = document.querySelectorAll('.removeBtn'),
		addLikeBtn = document.querySelectorAll('.addLike'),
		addCommentBtn = document.querySelectorAll('.addComment');

	removePostBtn.forEach(function(elem) {
		elem.addEventListener("click", function() {
			var postId = this.parentNode.getElementsByTagName('input')[0].value;
			newPost.remove(postId);
		});
	});

	addLikeBtn.forEach(function(elem) {
		elem.addEventListener("click", function() {
			var postId = this.parentNode.parentNode.getElementsByTagName('input')[0].value;
			newPost.addLike(postId);
		});
	});

	addCommentBtn.forEach(function(elem) {
		elem.addEventListener("click", function() {
			var postId = this.parentNode.parentNode.parentNode.getElementsByTagName('input')[0].value,
				avtor = this.parentNode.getElementsByClassName('commentAvtor')[0].value,
				message = this.parentNode.getElementsByClassName('commentMessage')[0].value;
			var dataforCom = new Date();
			var dataNowCom = `${dataforCom.getDate()}/${dataforCom.getMonth()}1/${dataforCom.getFullYear()}    ${dataforCom.getHours()}:${dataforCom.getMinutes()}`
			newPost.addComment(postId, avtor, message, dataNowCom);
		});
	});
}

document.addEventListener('DOMContentLoaded', () => {
	// Get Form data's
	var
		author = document.getElementById('inputAuthor'),
		text = document.getElementById('inputText'),
		img = document.getElementById('inputUrl'),
		createPostBtn = document.getElementById('createPost'),
		clearStorageBtn = document.getElementById('clearStorage');

	var dataVal = new Date();
	var dataNow = `${dataVal.getDate()}/${dataVal.getMonth()}1/${dataVal.getFullYear()}    ${dataVal.getHours()}:${dataVal.getMinutes()}`
	// Buttons events
	// Add to LS
	createPostBtn.addEventListener('click', () => {

		newPost.add(generatorId(), dataNow, author.value, text.value, img.value, 0, []);
		newPost.render();
	});

	// Clear LS
	clearStorageBtn.addEventListener('click', () => {
		newPost.clearAll();
	});
});

class Post {
	constructor() {}

	// Add new post
	add(id, date, name, text, adress, like, comment) {
		arrPosts.push({
			'id': id,
			'date': date,
			'name': name,
			'text': text,
			'adress': adress,
			'like': like,
			'comment': comment
		})
		localStorage.setItem('posts', JSON.stringify(arrPosts));
		console.log('=== В LS добавлен новый пост ===');
		console.log(arrPosts);
	}

	// Remove post by id
	remove(id) {
		arrPosts = JSON.parse(localStorage.getItem("posts"));

		for (var i = 0; i < arrPosts.length; i++) {
			if (arrPosts[i].id == id) {
				arrPosts.splice(i, 1);
				break;
			}
		}

		localStorage.setItem('posts', JSON.stringify(arrPosts));
		this.render();
		console.log('=== Пост удальон ===');
	}

	// Add like for post
	addLike(id) {
		arrPosts = JSON.parse(localStorage.getItem("posts"));

		for (var i = 0; i < arrPosts.length; i++) {
			if (arrPosts[i].id == id) {
				arrPosts[i]['like'] = arrPosts[i]['like'] + 1;
				break;
			}
		}

		localStorage.setItem('posts', JSON.stringify(arrPosts));
		this.render();
		console.log('=== Лайк добавлен ===');
	}

	// Add Comment
	addComment(id, avtor, message, date) {
		arrPosts = JSON.parse(localStorage.getItem("posts"));

		for (var i = 0; i < arrPosts.length; i++) {
			if (arrPosts[i].id == id) {
				arrPosts[i]['comment'].push({
					'avtor': avtor,
					'message': message,
					'date': date
				});
				break;
			}

		}

		localStorage.setItem('posts', JSON.stringify(arrPosts));
		this.render();
		console.log('=== Коментарий добавлен ===');
	}

	// Remove all posts
	clearAll() {
		allPosts.innerHTML = "";
		arrPosts = [];
		localStorage.clear();
		localStorage.setItem('posts', []);
		console.log('=== LS очищен ===');
	}

	// Render all post in page
	render() {
		allPosts.innerHTML = "";
		var items = JSON.parse(localStorage.getItem("posts"));

		items.forEach(function(item) {
			// Post main container
			var post = document.createElement('div');
			post.setAttribute('class', 'post');

			// Post date

			var author = document.createElement('p');
			author.innerText = item.name;
			author.style.cssText = 'font-size: 20px; color: blue; margin-top:15px;'
			post.appendChild(author);

			var date = document.createElement('p');
			date.innerText = item.date;
			date.style.cssText = 'float:right; color:#000; font-weight:bold;'
			post.appendChild(date);

			// Post remove button


			var postRemoveBtn = document.createElement('button');
			postRemoveBtn.setAttribute('class', 'removeBtn');
			postRemoveBtn.innerText = 'X';
			post.appendChild(postRemoveBtn);

			// Post ID value
			var postIdValue = document.createElement('input');
			postIdValue.value = item.id;
			postIdValue.type = 'hidden';
			post.appendChild(postIdValue);

			// Post image
			var adress = document.createElement('img');
			adress.setAttribute('id', 'image')
			adress.src = item.adress;
			post.appendChild(adress);

			// Post author name


			// Post text
			var text = document.createElement('p');
			text.innerText = item.text;
			post.appendChild(text);

			var infoBtn = document.createElement('div');
			infoBtn.setAttribute('id', 'infoBtn');
			post.appendChild(infoBtn);

			var like = document.createElement('button');
			like.innerText = 'Likes: ' + item.like;
			like.setAttribute('class', 'addLike');
			infoBtn.appendChild(like);

			var countComments = document.createElement('p');
			countComments.setAttribute('id', 'lenghCom')
			countComments.innerText = 'Coments(' + item.comment.length + ')';
			infoBtn.appendChild(countComments);



			var btnForComm = document.createElement('button');
			btnForComm.innerText = 'Write message';
			btnForComm.setAttribute('class', 'addNewComment');
			infoBtn.appendChild(btnForComm);



			var commentsContent = document.createElement('div');
			commentsContent.setAttribute('class', 'commentsContent');
			post.appendChild(commentsContent);

			btnForComm.addEventListener('click', function() {
				commentsForm.style.cssText = "display: flex;"
			})



			// Comment content
			var commentsContainer = document.createElement('div');
			commentsContainer.setAttribute('class', 'commentContainer');
			post.appendChild(commentsContainer);



			var commentsForm = document.createElement('div');
			commentsForm.setAttribute('class', 'commentsForm');
			commentsContainer.appendChild(commentsForm);

			item.comment.forEach(function(element) {
				var divComentAuthor = document.createElement('div');
				divComentAuthor.setAttribute('id', 'divComentAuthor');

				var divComentCom = document.createElement('div');
				divComentCom.setAttribute('id', 'divComentAuthors');

				divComentAuthor.style.cssText = 'display:flex;justify-content: space-between;font-weight:bold;font-size:17px; background:#fff;padding:10px 10px 0px 10px;';

				var commentContentAuthor = document.createElement('p');
				var commentContentDate = document.createElement('p');
				commentContentAuthor.innerText = element.avtor;
				commentContentDate.innerText = element.date;

				var commentContentMessega = document.createElement('p');
				commentContentMessega.innerText = element.message;
				divComentCom.appendChild(commentContentMessega);
				divComentCom.style.cssText = 'background:#fff; padding:10px;';

				commentMessage
				// commentContent.innerText = element.avtor + '/' + element.message + '/' + element.date;

				divComentAuthor.appendChild(commentContentAuthor);
				divComentAuthor.appendChild(commentContentDate);

				commentsContent.appendChild(divComentAuthor);
				commentsContent.appendChild(divComentCom);
			});

			// form
			var commentAvtor = document.createElement('input');
			commentAvtor.setAttribute('placeholder', 'Avtor');
			commentAvtor.setAttribute('class', 'commentAvtor');
			commentsForm.appendChild(commentAvtor);

			var commentMessage = document.createElement('textarea');
			commentMessage.setAttribute('placeholder', 'Message');
			commentMessage.setAttribute('class', 'commentMessage');
			commentsForm.appendChild(commentMessage);

			var commentBtn = document.createElement('button');
			commentBtn.innerText = 'Send comment';
			commentBtn.setAttribute('class', 'addComment');
			commentsForm.appendChild(commentBtn);

			allPosts.appendChild(post);
		});

		addButtonListener();
	}
}

var newPost = new Post();

if ((LS !== null) && (LS.length !== 0)) {
	arrPosts = JSON.parse(LS);
	newPost.render();
};