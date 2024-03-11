
sessionStorage.setItem("base", "https://tarmeezacademy.com/api/v1");
const baseUrl = sessionStorage.getItem("base");


// const baseUrl = 'https://tarmeezacademy.com/api/v1';

ui();

let  curntpage = 1;
let lastpage = 1;

// Infinity Scrilling

window.addEventListener("scroll", function(){


  const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
    if (endOfPage && curntpage < lastpage) {
      
      curntpage = curntpage + 1

      showposts(false ,curntpage);
    
    };

});

// show posts ui 
showposts()

function showposts(relod = true, page = 1){

  axios.get(`${baseUrl}/posts?limit=6&page=${page}`)
  .then(function (response) {
    
    // console.log(response);
    lastpage = response.data.meta.last_page;

    if(relod){

      document.getElementById("pistes").innerHTML = "";

    }

    let posts = response.data.data
    

    for(let post of posts){
      let titlePost = "";
      // show or hid button  edit
      let user = getcurntuser();
      let ismyPost = user != null && post.author.id == user.id;
      let editbuttoncontent = ``
      if(ismyPost){

        editbuttoncontent = 
        `
          <button class="btn btn-outline-primary float-end m-2" type="button" id="addon2" onclick="editpostclick('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>
          <button class="btn btn-outline-danger float-end m-2" type="button" id="addon2" onclick="deletpostclick('${encodeURIComponent(JSON.stringify(post))}')">Delet</button>

          
        `

      }
      if(post.title == null){
        post.title = titlePost
      }
      let content = 
      `
      <div class="card my-5">
        <div class="card-header">

          <span style="cursor:pointer" onclick="userClick(${post.author.id})">
            <img src="${post.author.profile_image}" alt="img" class="rounded-circle border-2">
            <b>@${post.author.name}</b>
          </span>

          ${editbuttoncontent}

        </div>
        <div class="card-body" onclick="clickedonepost(${post.id})">
          <img src="${post.image}" alt="" class="w-100">
          <h6>2min ago</h6>
        
          <h5 class="card-title">${post.title}</h5>
          <p class="card-text">${post.body}</p>
          <hr>
          <i class="bi bi-chat"></i>
          <span>posts
            ${post.comments_count}
          </span>
        </div>
      </div>
      `

      document.getElementById("pistes").innerHTML += content 
    }
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });
}


// rigester 

function Btnrigster(){

  let imagerigster = document.getElementById("image-rigster").files[0];
  let passwordrigster = document.getElementById("password-rigster").value;
  let usernamerigster = document.getElementById("username-rigster").value
  let namerigster = document.getElementById("name-rigster").value

  let formdata = new FormData();

  formdata.append('image',imagerigster)
  formdata.append('password',passwordrigster)
  formdata.append('username',usernamerigster)
  formdata.append('name',namerigster)


  const header = {
    "Content-Type":"multipart/form-data"
  }

  axios.post(`${baseUrl}/register`, formdata,{
    headers : header
  })
  .then(function (response) {
    
    // console.log(response);
    const mol = document.getElementById("modelrigster");
    const molr = bootstrap.Modal.getInstance(mol);
    molr.hide()
    ui()

  })
  .catch(function (error) {
    console.log(error);
  });

}


// login 
function loginbtnclicked(){

  let loginemail = document.getElementById("login-Email").value
  let loginpassword = document.getElementById("login-Password").value  

  let pram = {
    "username":loginemail,
    "password":loginpassword
    
  }

  axios.post(`${baseUrl}/login`, pram)
  .then(function (response) {

    localStorage.setItem("token", response.data.token)
    localStorage.setItem("user", JSON.stringify(response.data.user))

    const model = document.getElementById("exampleModal");
    const modelinst = bootstrap.Modal.getInstance(model)
    modelinst.hide()
    ui()

  })
  .catch(function (error) {
    console.log(error);
  });
}


// creat post 

function btncreatpost(){

  

  let postid = document.getElementById("is-title-edite").value;
  let iscreat = postid == null || postid == "";
  
  // console.log(postid);
 


  let imagepost = document.getElementById("image-post").files[0];
  let bodypost = document.getElementById("body-post").value;
  let titlepost = document.getElementById("title-post").value


  let formdata = new FormData();
  formdata.append('image',imagepost);
  formdata.append('body',bodypost);
  formdata.append('title',titlepost);

  const token = localStorage.getItem("token")

  const headers = {
    "Content-Type":"multipart/form-data",
    "authorization": `Bearer  ${token}`
  }
  
  let url = ``;
  if (iscreat) {

    url = `${baseUrl}/posts`

  } else {

    formdata.append("_method","put")
    url = `${baseUrl}/posts/${postid}`
      
  }

  axios.post(url,formdata, {
    headers : headers
  })
  .then(function (response) {

    const mode = document.getElementById("btn-post-creat");
    const modepost = bootstrap.Modal.getInstance(mode)
    modepost.hide()
    showposts()
  })
  .catch(function (error) {
    let message = error.response.data.message
    console.log(message);
  });

}

// logeout 
function logeout(){
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  ui();
}

// ui
function ui(){

  const token = localStorage.getItem("token");
  const btnlog = document.getElementById("btn-log");
  const btnreg = document.getElementById("btn-reg");
  // const btnout = document.getElementById("btnout");
  const creatpost = document.getElementById("creatpost"); 
  const NameNave = document.getElementById("name-nave"); 
  const ImageNave = document.getElementById("image-nave"); 
  const logoutDiv = document.getElementById("logout-div"); 
  
  if(token == null){
  
      if (creatpost != null) {
      
      creatpost.style.setProperty("display", "none", "important");
      }
  
      btnlog.style.setProperty("display", "flex", "important")
      btnreg.style.setProperty("display", "flex", "important")
      creatpost.style.setProperty("display", "none", "important");
      logoutDiv.style.setProperty("display", "none", "important");
      logoutDiv.style.setProperty("display", "none", "important")
  
  
  }else{
  
      if (creatpost != null) {
          
          creatpost.style.setProperty("display", "flex", "important")
          
      }
  
      btnlog.style.setProperty("display", "none", "important")
      btnreg.style.setProperty("display", "none", "important")
      logoutDiv.style.setProperty("display", "flex", "important");
      logoutDiv.style.setProperty("display", "flex", "important");
  
  
  
      let CurentUsers = getcurntuser();
      NameNave.innerHTML = CurentUsers.username;
      ImageNave.src = CurentUsers.profile_image;
  
  }
  }

// curnt user 
function getcurntuser(){

  let user = null;
  const storge = localStorage.getItem("user");

  if(storge != null){

    user = JSON.parse(storge)
  }

  return user;
}

// clickedonepost 
function clickedonepost(postId) {
  // alert(postId)
  window.location = `post.html?postId=${postId}`
  
}

function userClick(userId) {

  window.location = `profile.html?postId=${userId}`
}
// editpostclick 
function editpostclick(postID){

  let edpost = JSON.parse(decodeURIComponent(postID))
  // console.log(edpost)
  // return;
  document.getElementById("post-modal-btn").innerHTML = "update"
  document.getElementById("is-title-edite").value = edpost.id;
  document.getElementById("title-edite").innerHTML = 'edit post';
  document.getElementById("title-post").value = edpost.title;
  document.getElementById("body-post").value = edpost.body;

  var myModal = new bootstrap.Modal(document.getElementById('btn-post-creat'), {
   
  })
  myModal.toggle()
}

// deletpostclick 
function deletpostclick(postID) {
  
  let delet = JSON.parse(decodeURIComponent(postID))
  
  document.getElementById("delet-post").value = delet.id;
  var myModal = new bootstrap.Modal(document.getElementById('delet-post-model'), {
   
  })
  myModal.toggle()
}

function confirmdelet() {

   const token = localStorage.getItem("token")
   let postdelet =  document.getElementById("delet-post").value;
    // alert(postdelet)
    // return
    const headers = {
      "Content-Type":"multipart/form-data",
      "authorization": `Bearer  ${token}`
    }
    
    axios.delete(`${baseUrl}/posts/${postdelet}`,{
      headers : headers
    })
    .then(function (response) {

      const deletmodel = document.getElementById("delet-post-model");
      const modelinst = bootstrap.Modal.getInstance(deletmodel)
      modelinst.hide()
      showposts()
  
    })
    .catch(function (error) {
      console.log(error);
    });
  
}

// addBtnClick ()
function addBtnClick(){

  document.getElementById("post-modal-btn").innerHTML = "Creat"
  document.getElementById("is-title-edite").value = "";
  document.getElementById("title-edite").innerHTML = 'Creat A post';
  document.getElementById("title-post").value = "";
  document.getElementById("body-post").value = "";

  var myModal = new bootstrap.Modal(document.getElementById('btn-post-creat'), {
   
  })
  myModal.toggle()
}

function pofileClick() {
  const user = getcurntuser()
  const userId = user.id
  window.location = `profile.html?postId=${userId}`
} 
