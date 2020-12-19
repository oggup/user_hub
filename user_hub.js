const BASE_URL = 'https://jsonplace-univclone.herokuapp.com';

function fetchUsers() {
    return fetch(`${BASE_URL}/users`)
    .then(function(response){
        return response.json();
    })   
    .catch(function(error){
        console.error("you goofed!")
    });
  };

 

  function renderUser(user){
    return $(`<div class="user-card">
    <header>
      <h2>${user.name}</h2>
    </header>
    <section class="company-info">
      <p><b>Contact:</b> ${user.email}</p>
      <p><b>Works for:</b> ${user.company}</p>
      <p><b>Company creed:</b> "${user.company.catchPhrase}"</p>
    </section>
    <footer>
      <button class="load-posts">POSTS BY ${user.username}</button>
      <button class="load-albums">ALBUMS BY ${user.username}</button>
    </footer>
  </div>`)
  };

  function renderUserList(userList){
      userList.forEach(function (user){
          $('#user-list').append(renderUser(user));
    });
  };

  function bootstrap(){
    fetchUsers()
    .then(function(data){
        console.log(data);   
        renderUserList(data);  //code using data as parameter where well call our other functions that uses the fetched data
    })
  };

bootstrap();