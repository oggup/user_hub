const BASE_URL = 'https://jsonplace-univclone.herokuapp.com';


function fetchData(url) {
    return fetch(url)
    .then(function(response){
        return response.json();
    })   
    .catch(function(error){
        console.error("you goofed!")
    });
  };

function fetchUsers() {
    return fetchData(`${BASE_URL}/users`);
  };
function fetchUserAlbumList(userId) {
    return fetchData(`${ BASE_URL }/users/${userId}/albums?_expand=user&_embed=photos`);
}

 

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


//need to figure out how to get a photo to render on the album posts
/* render a single album */
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
/*album.photos.forEach(function(photo){
    albumElement.find('.photo-list').append(renderPhoto(photo));
    return albumElement; ???   
/* render a single photo */
function renderPhoto(photo) {
    return $(`<div class="photo-card">
    <a href="${photo.url}>" target="_blank">
      <img src="${photo.thumbnailUrl}">
      <figure class="title">${photo.title}</figure>
    </a>
  </div>`).data('photo',photo);
};

/* render an array of albums */
function renderAlbumList(albumList) {
    $('#app section.active').removeClass('active');    
    $('#album-list').empty();
    $('#album-list').addClass('active');
    albumList.forEach(function (album){
        $('#album-list').append(renderAlbum(album));
    })
};







function bootstrap(){
    fetchUsers()  // <==we could have included this code in fetchUsers, but we plan on reusing the fetch with different url locations
    .then(function(data){
        console.log(data);   
        renderUserList(data);  //code using data as parameter where well call our other functions that uses the fetched data
    })
  };

bootstrap();


$('#user-list').on('click', '.user-card .load-posts', function () {
  // load posts for this user
  // render posts for this user
  console.log($(this).closest('.user-card').data('user'));
});

$('#user-list').on('click', '.user-card .load-albums', function () {

  // load albums for this user
  // render albums for this user
  console.log($(this).closest('.user-card').data('user'));
  fetchUserAlbumList($(this).closest('.user-card').data('user').id).then(renderAlbumList);


});


