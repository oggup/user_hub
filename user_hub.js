const BASE_URL = 'https://jsonplace-univclone.herokuapp.com';


function fetchData(url) {
    return fetch(url)
    .then(function(response){
        return response.json();
    })   
    .catch(function(error){
        console.error("you goofed!");
    });
};

function fetchUsers() {
    return fetchData(`${BASE_URL}/users`);
};
function fetchUserAlbumList(userId) {
    return fetchData(`${ BASE_URL }/users/${userId}/albums?_expand=user&_embed=photos`);
};
function fetchUserPosts(userId) {
  return fetchData(`${ BASE_URL }/users/${ userId }/posts?_expand=user`);
};

function fetchPostComments(postId) {
  return fetchData(`${ BASE_URL }/posts/${ postId }/comments`);
};

function renderUser(user){
      return $(`<div class="user-card">
      <header>
        <h2>${user.name}</h2>
      </header>
      <section class="company-info">
        <p><b>Contact:</b> ${user.email}</p>
        <p><b>Works for:</b> ${user.company.name}</p>
        <p><b>Company creed:</b> "${user.company.catchPhrase}"</p>
      </section>
      <footer>
        <button class="load-posts">POSTS BY ${user.username}</button>
        <button class="load-albums">ALBUMS BY ${user.username}</button>
      </footer>
    </div>`).data('user',user);
};

function renderUserList(userList){
      userList.forEach(function (user){
          $('#user-list').append(renderUser(user));
    });
};

function renderAlbum(album) {
    let albumElement=$(`<div class="album-card">
    <header>
      <h3>${album.title}, by ${album.user.name} </h3>
    </header>
    <section class="photo-list">
     
    </section>
  </div>`).data('album',album);
    let photoListElement = albumElement.find('.photo-List');
    album.photos.forEach(function (photo){
      photoListElement.append(renderPhoto(photo))
    });
  return albumElement;
};

function renderPhoto(photo) {
    return $(`<div class="photo-card">
    <a href="${photo.url}>" target="_blank">
      <img src="${photo.thumbnailUrl}">
      <figure class="title">${photo.title}</figure>
    </a>
  </div>`).data('photo',photo);
};

function renderAlbumList(albumList) {
  $('#app section.active').removeClass('active');    
  $('#album-list').empty();
  $('#album-list').addClass('active');
  albumList.forEach(function (album){
        $('#album-list').append(renderAlbum(album));
    });
};

function renderPost(post) {
  let postElement = $(`<div class="post-card">
  <header>
    <h3>${post.title}</h3>
    <h3>--- ${post.user.name}</h3>
  </header>
  <p>${post.body}</p>
  <footer>
    <div class="comment-list"></div>
    <a href="#" class="toggle-comments">(<span class="verb">show</span> comments)</a>
  </footer>
</div>`).data('post',post);
return postElement
};

function renderPostList(postList) {
  $('#app section.active').removeClass('active');    
  $('#post-list').empty();
  $('#post-list').addClass('active');
  postList.forEach(function (post){
      $('#post-list').append(renderPost(post));
  });
};

function toggleComments(postCardElement) {
  const footerElement = postCardElement.find('footer');

  if (footerElement.hasClass('comments-open')) {
    footerElement.removeClass('comments-open');
    footerElement.find('.verb').text('show');
  } else {
    footerElement.addClass('comments-open');
    footerElement.find('.verb').text('hide');
  }
}

function setCommentsOnPost(post) {
  fetchPostComments(post.id);
  if(post.comments){
    return Promise.reject(null)

  } else{
    return fetchPostComments(post.id).then(function (comments){
      post.comments = comments;
      return post;
    });
  };
};


$('#user-list').on('click', '.user-card .load-posts', function () {
  console.log($(this).closest('.user-card').data('user'));
  fetchUserPosts($(this).closest('.user-card').data('user').id).then(renderPostList);
});

$('#user-list').on('click', '.user-card .load-albums', function () {
  console.log($(this).closest('.user-card').data('user'));
  fetchUserAlbumList($(this).closest('.user-card').data('user').id).then(renderAlbumList);
});

$('#post-list').on('click', '.post-card .toggle-comments', function () {
  const postCardElement = $(this).closest('.post-card');
  const post = postCardElement.data('post');
  let commentListElement = postCardElement.find('.comment-list');
  
  setCommentsOnPost(post)
    .then(function (post) {
      commentListElement.empty();
      post.comments.forEach(function (comment){
        commentListElement.prepend($(`<h3>${comment.body}</h3><p>
            ${comment.email}`));
         })
    toggleComments(postCardElement);
    })
    .catch(function () {
      console.log('comments previously existed, only toggling...', post);
      toggleComments(postCardElement)
      commentListElement.empty();
    });
});
function bootstrap(){
  fetchUsers()
  .then(function(data){
      console.log(data);   
      renderUserList(data); 
  })
};

bootstrap();

