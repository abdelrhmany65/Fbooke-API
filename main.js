
// const bass = 'https://tarmeezacademy.com/api/v1';
const baseUrl = sessionStorage.getItem("base");

ui()

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

// onpost 

const baseUrlprams = new URLSearchParams(window.location.search)
const dd = baseUrlprams.get("postId");

const userUrl = new URLSearchParams(window.location.search)
const infoUser = userUrl.get("postId");
ui()


// show post ui 

function onepost(){

    axios.get(`${baseUrl}/posts/${dd}`)
    .then(function (response) {
      
      const post = response.data.data;
      const comments = post.comments;
      const author = post.author;

    //   document.getElementById("one-post").innerHTML = author.name
    let titlePost = "";
      if(post.title == null){
        post.title = titlePost
      }

      let commentcontent = "";
      for(let comment of comments){
        commentcontent +=`
            <div class="coment my-2 p-2 rounded bg-light">
                <div class="img-coment">
                <img src="${comment.author.profile_image}" alt="imag" class="me-1 rounded-circle">
                <b>@${comment.author.name}</b>
                </div>
                <p>
                ${comment.body}.
                </p>
            </div>
        `
      }

      let content = 
      `
      <div class="card my-3" id="one-post">
            <div class="card-header">
                <img src="${author.profile_image}" class="rounded-circle border-2">
                <b>@${author.name}</b>
            </div>
            <div class="card-body">
                <img src="${post.image}" alt="" class="w-100">
                <h6>${post.comments_count}</h6>
            
                <h5 class="card-title">${post.title}</h5>
                <p class="card-text">${post.body}.</p>
                <hr>
                <i class="bi bi-chat"></i>
                <span>
                    ${post.comments_count}
                </span>
            </div>
        </div>

        <div class="coments m-0" id="showcoment">
            ${commentcontent}
        </div>

        <div class="input-group my-3">
            <input type="text" class="form-control" placeholder="Recipient's username" 
            aria-label="Recipient's username" aria-describedby="button-addon2" 
            id="input-cmmet">

            <button class="btn btn-outline-primary" type="button" id="button-addon2" onclick="craetcommet()">send</button>
        </div>
      `
      document.getElementById('one-post').innerHTML = content;
      

    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}
onepost()


// craetcommet
function craetcommet(){
    let inputcommet = document.getElementById("input-cmmet").value;
    let parms = {
        "body":inputcommet
    }
    
    let token = localStorage.getItem("token");
    let url = `${baseUrl}/posts/${dd}/comments`;

    axios.post(url, parms,{
        headers: {
            "authorization": `Bearer  ${token}`
        }
    })
    .then((response) => {
        onepost()
    })
    .catch(function (error) {

        const errormessage = error.response.data.message;
        alert(errormessage)
    });
}
// craetcommet()



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

let imagepost = document.getElementById("image-post").files[0];
let bodypost = document.getElementById("body-post").value;
let titlepost = document.getElementById("title-post").value


const formdata = new FormData();
formdata.append('image',imagepost);
formdata.append('body',bodypost);
formdata.append('title',titlepost);
const token = localStorage.getItem("token")

const headers = {
    "Content-Type":"multipart/form-data",
    "authorization": `Bearer  ${token}`
}


axios.post(`${baseUrl}/posts`,formdata, {
    headers : headers
})
.then(function (response) {

    const mode = document.getElementById("btn-post-creat");
    const modepost = bootstrap.Modal.getInstance(mode)
    modepost.hide()
    
    showposts()
})
.catch(function (error) {
    console.log(error);
});

}

// logeout 
function logeout(){
localStorage.removeItem("token");
localStorage.removeItem("user");
ui();
}
// logeout 

// curnt user 
function getcurntuser(){

let user = null;
const storge = localStorage.getItem("user");

if(storge != null){

    user = JSON.parse(storge)
}

return user;
}

// getuserposts 

profilepost()
function profilepost() {
    const id = infoUser
    axios.get(`${baseUrl}/users/${id}`)
    .then((response) =>{
        let user = response.data.data

        document.getElementById("info-email").innerHTML = user.email
        document.getElementById("info-name").innerHTML = user.name
        document.getElementById("info-username").innerHTML = user.username
        document.getElementById("posts-count").innerHTML = user.posts_count
        document.getElementById("comment-count").innerHTML = user.comments_count
        document.getElementById("image-header").src = user.profile_image
        document.getElementById("info-name").src = user.username


    })
}

// show posts ui 
showposts()

function showposts(){

    const id = infoUser
  axios.get(`${baseUrl}/users/${id}/posts`)
  .then(function (response) {
    
    // console.log(response);
    document.getElementById("info-user-post").innerHTML = "";
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
          <img src="${post.author.profile_image}" alt="img" class="rounded-circle border-2">
          <b>@${post.author.name}</b>
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

      document.getElementById("info-user-post").innerHTML += content 
    }
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });
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
// console.log("kljk");
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

