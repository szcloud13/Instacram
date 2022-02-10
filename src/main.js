// importing named exports we use brackets
import { createPostTile, uploadImage } from './helpers.js';

// when importing 'default' exports, use below syntax
import API from './api.js';

const api  = new API();
const main = document.querySelector('main[role="main"]');

//---------------------------------------------------------------------------------
//username is a div under class "login form" and contains a textbox
const username = document.createElement('div');
username.setAttribute('class',"login_form");
username.textContent = "Username:   ";

const name = document.createElement('input');
name.setAttribute('type',"text");
name.setAttribute('id',"fname");
username.appendChild(name);
//---------------------------------------------------------------------------------

//---------------------------------------------------------------------------------
//userpwd is a div under class "login form" and contains a textbox
const userpwd = document.createElement('div');
userpwd.setAttribute('class',"login_form");
userpwd.textContent = "Password: ";

const pwd = document.createElement('input');
pwd.setAttribute('type',"text");
pwd.setAttribute('id',"password");
userpwd.appendChild(pwd);
//---------------------------------------------------------------------------------

//button to submit login form
const btn1 = document.createElement('button');
btn1.setAttribute('id',"enter");
btn1.textContent = "Submit";

//button to submit sign up form
const btn2 = document.createElement('button');
btn2.setAttribute('id',"sign-up");
btn2.style.visibility = "hidden";
btn2.textContent = "Sign Up!";

//button to go to profile
const profile = document.createElement('button');
profile.setAttribute('id',"profile");
profile.textContent = "My Profile";

//button to get desire feed
const feed = document.createElement('button');
feed.setAttribute('id',"feed");
feed.textContent = "Next Posts!";

//---------------------------------------------------------------------------------

//Sign up forms classes containing text boxes for email and Name input
const useremail = document.createElement('div');
useremail.setAttribute('class',"signup_form");
useremail.textContent = "Email: ";
useremail.style.visibility = "hidden";

const email = document.createElement('input');
email.setAttribute('type',"text");
email.setAttribute('id',"email");
useremail.appendChild(email);
//---------------------------------------------------------------------------------

//---------------------------------------------------------------------------------
//extra text box for name
const Name = document.createElement('div');
Name.setAttribute('class',"signup_form");
Name.textContent = "Name: ";
Name.style.visibility = "hidden";

const real_name = document.createElement('input');
real_name.setAttribute('type',"text");
real_name.setAttribute('id',"name");
Name.appendChild(real_name);
//---------------------------------------------------------------------------------

//append the form under main body
main.appendChild(username);
main.appendChild(userpwd);
main.appendChild(useremail);
main.appendChild(Name);
main.appendChild(btn1);
main.appendChild(btn2);
document.getElementsByClassName('banner')[0].appendChild(profile);
document.getElementsByClassName('banner')[0].appendChild(feed);

var nav = document.getElementsByClassName('nav-item');
var token_log = "";
var values = [];

//use the nav item to get the forms
nav[1].setAttribute("id", 'Login');
nav[1].textContent = "Login";
nav[2].setAttribute("id", 'Sign-Up');
nav[2].textContent = "Sign Up";

//input file button given by specs
const input = document.querySelector('input[type="file"]');
input.addEventListener('change', (event) => uploadImage(event, token_log));

//Login nav event handler that display the right form
nav[1].onclick = function(){
    remove_feed();
    btn2.style.visibility = "hidden";
    btn1.style.visibility = "visible";

    username.style.visibility = "visible";
    userpwd.style.visibility = "visible";

    Name.style.visibility = "hidden";
    useremail.style.visibility = "hidden";

}

//profile button is clicked
profile.onclick = function(){
    remove_feed(); //first remove all current feed if there are any
    fetch(`http://127.0.0.1:5000/user/`, { //get user info
          method: 'GET',
          headers:{
            'Content-Type': 'application/json',
            'Authorization': 'token: ' + token_log
          }
    })
    .then(response => {
        return response.json();
    })
    .then(x => {
        //create a simple div that has the user basic info and append to doc body
        const info = document.createElement('div');
        info.setAttribute('id',"info");
        info.textContent = ("UserName: " + x.username) + ("\r\n,Name: " + x.name) + ("\r\n,Email: " + x.email) + ("\r\n,Number of Posts: " + x.posts.length);
        main.appendChild(info);

        //create an array of url strings where each url correspond to a post under this logged in user
        var my_posts_id = []; //this gives an array
        for(var i =0; i < x.posts.length; i++){
            var str = 'http://127.0.0.1:5000/post?' + "id=" + x.posts[i];
            my_posts_id.push(str);
        }

        all_posts_obj(my_posts_id);
    })
}
//get all post obj and puts it in an array, where the array belongs to a bigger object
function all_posts_obj(url){
    //given id arr need to GET and append all posts obj for display
    //write all the requested header file for all url links
    let requestsArray= url.map((url) => {
        let request = new Request(url, {
            headers: new Headers({
                'Content-Type': 'text/json',
                'Authorization': 'token: ' + token_log
            }),
            method: 'GET'
        });
        return request;
    });

    //promise all eturn an array of post info objects
    Promise.all(requestsArray.map((request) => {
        return fetch(request).then((response) => {
            return response.json();
        }).then((data) => {
            return data;
        });
    })).then((values) => {
        //should return all post objects
        console.log(values);
        //need to pass this list of post objects into display
        var obj = {
            "posts": values
        };
        var likes = 0;
        for(var i =0; i < values.length; i++){
            likes += values[i].meta.likes.length;
        }
        var comm = 0;
        for(var i =0; i < values.length; i++){
            comm += values[i].comments.length;
        }
        //record the statistics
        info = document.getElementById("info");
        info.textContent += ("\r\n,Total likes received: " + likes);
        info.textContent += ("\r\n,Total comments: " + comm);
        //display my posts
        display(obj, token_log);
    }).catch(console.error.bind(console));
}

//refreshes the feed
feed.onclick = function(){
    var token = {
        "token": token_log
    };
    //prompt user for arguments
    var n = prompt("Choose max posts you want: ");
    if (n == null || n== "") {
        alert("Invalid number!");
        return;
    }else{
        var p = prompt("Starts with post no. ?: ");
        if (p == null || p== "") {
            alert("Invalid number!");
            return;
        }else{
            get_feed(token, p, n);
        }
    }
}

//***************************TEST FUNCTION FOR LEVEL 2!!!!! makes logged user follow "name"
function follow(name, token){
    fetch(`http://127.0.0.1:5000/user/follow`, {
          method: 'PUT', // or 'PUT'
          body: name, // data can be `string` or {object}!
          headers:{
            'Content-Type': 'application/json',
            'Authorization': 'token: ' + token
          }
    })
    .then(response => {
        return response.json();
    })
    .then(x => {
        if('token' in x){
            console.log("success follow");
            return x;
        }else{
            console.log("faileddddd");
            return null;
        }

    })
}

//remove all posts feed
function remove_feed(){
    var paras = document.getElementsByClassName('post');
    while(paras[0]){
        paras[0].parentNode.removeChild(paras[0]);
    }
}

//Sign Up nav event handler that display the right form
nav[2].onclick = function(){
    remove_feed();
    btn2.style.visibility = "visible";
    btn1.style.visibility = "hidden"; //hide btn one is not hidden
    document.getElementsByClassName('signup_form')[0].style.visibility = "visible";
    document.getElementsByClassName('signup_form')[1].style.visibility = "visible";
    document.getElementsByClassName('login_form')[0].style.visibility = "visible";
    document.getElementsByClassName('login_form')[1].style.visibility = "visible";

}

//login form input is received
btn1.onclick = function(){
    setTimeout(function(){
        var user = {
            "username": document.getElementById("fname").value,
            "password": document.getElementById("password").value
        };
        signup('http://127.0.0.1:5000/auth/login', user, get_feed);

    }, 1000);
}

//sign up form input is received
btn2.onclick = function(){
    setTimeout(function(){
        var user = {
            "username": document.getElementById("fname").value,
            "password": document.getElementById("password").value,
            "email": document.getElementById("email").value,
            "name": document.getElementById("name").value,
        };
        signup('http://127.0.0.1:5000/auth/signup', user, get_feed);

    }, 1000);

}

//carries out login event for user and receive token
function signup(url, user, callback){

    fetch(`${url}`, {
          method: 'POST', // or 'PUT'
          body: JSON.stringify(user), // data can be `string` or {object}!
          headers:{
            'Content-Type': 'application/json'
          }
    })
    .then(response => {

        return response.json();
    })
    .then(x => {
        if('token' in x){
            token_log = x.token;
            callback(x, 0, 10);

            return x;

        }else{

            alert(x.message);
            return null;
        }

    })



}
//*****************************************TEST FUNCTION FOR LEVEL 2: adds comments to a following user posts (SOPHIA)
function test_comment(){
    var payload = {
        "author": "Liyee",
        "published": "1539476785.0",
        "comment": "I am a comment! :))"
    };

    var url = 'http://127.0.0.1:5000/post/comment?' + "id=" + 74;
    fetch(`${url}`, {
        method: 'PUT', // or 'PUT'
        body: JSON.stringify(payload),
        headers:{
          'Content-Type': 'application/json',
          'Authorization': 'token: ' + token_log
        }
    })
    .then(response => {
        return response.json();
    })
    .then(x => {
        console.log(x);
    })
}

//fetch the feed from backend
export function get_feed(token, p, n){
    var str = token.token;
    var url = 'http://127.0.0.1:5000/user/feed?' + 'p=' + p + "&" + 'n=' + n
    fetch(`${url}`, {
          method: 'GET', // or 'PUT'
          headers:{
            'Authorization': 'token: ' + str,
            'Content-Type': 'application/json',
          }
    })
    .then(response => {
        return response.json();
    })
    .then(x => {
        display(x, token); //gets an array of posts
        follow("Sophia", str);
        test_comment();
        return x;
    })
}

//***********************************TEST FUNCTION: detects when a "like" button is clicked
function like_click(event, id){ //need event, token, and post id

    var url = 'http://127.0.0.1:5000/post/like?' + "id=" + id;

    fetch(`${url}`, {
        method: 'PUT',
        headers:{
          'Content-Type': 'application/json',
          'Authorization': 'token: ' + token_log
        }
    })
    .then(response => {
        return response.json();
    })
    .then(x => {
        var token = {
            "token": token_log
        };
        get_feed(token, 0, 10);
        return x;
    })

}

//display posts pictures given an array of post objects
function display(my_posts, token){
    remove_feed(); //first clear everything and hide all forms
    btn1.style.visibility = "hidden";
    btn2.style.visibility = "hidden";
    document.getElementsByClassName('login_form')[0].style.visibility = 'hidden';
    document.getElementsByClassName('login_form')[1].style.visibility = 'hidden';
    document.getElementsByClassName('signup_form')[0].style.visibility = 'hidden';
    document.getElementsByClassName('signup_form')[1].style.visibility = 'hidden';

    //loop through each posts
    if(my_posts.posts.length > 0){
        for(var i =0; i < my_posts.posts.length; i++){

            create_post(my_posts.posts[i], get_liked);
        }
    }
}

//create a element for html body called post
function create_post(post_obj, callback){
//--------------append HTML elements-------------------------------------------------------------------

    //create the image element
    const image = document.createElement('img');
    image.style.Position = "position:absolute";
    var str = "data:image/jpeg;base64," + post_obj.src;
    image.setAttribute('src', str);

    //make a div with class post to handle all posts
    const text = document.createElement('div');
    text.setAttribute("class", "post");

    //the caption of the photo
    var str = post_obj.meta.author + ": " + post_obj.meta.description_text + "\n";
    text.textContent=str;

    //for like button
    const like_btn = document.createElement('button');
    like_btn.textContent = "<3";
    like_btn.setAttribute("id", post_obj.id);
    like_btn.addEventListener("click", function(e){
        like_click(e, this.id);
    });

    //for COMMENTS
    var lines = [];
    const comments = document.createElement('div');
    comments.setAttribute("class", "comments");

    for(var j =0 ; j < post_obj.comments.length; j++){
        const com = document.createElement('li');
        com.textContent = post_obj.comments[j];
        comments.appendChild(com);
    }

    //class post has an image and a like button
    text.appendChild(comments);

    //class post has an image and a like button
    text.appendChild(image);
    text.appendChild(like_btn);
    document.getElementById('large-feed').appendChild(text);
//------------------------------------------------------------------------------------------------------------
    //get liked is passed in as callback
    callback(post_obj, text);

}

//get username that liked the post, and also comments available
function get_liked(post_cls, parent){
    //get user
    var likes = [];
    for(var i =0; i < post_cls.meta.likes.length; i++){
        var url = 'http://127.0.0.1:5000/user?' + "id=" + post_cls.meta.likes[i];
        likes.push(url);
    }

    //need to add comments and append to parent HTML element
    var str = "Comments: ";
    for(var i =0; i < post_cls.comments.length; i++){
        str += post_cls.comments[i].comment;
        str += ", ";
    }
    const comm = document.createElement('div');
    comm.setAttribute("class", "comments");
    comm.textContent = str;
    parent.appendChild(comm);

    //get username for these likes of this particular post
    get_username(likes, parent);

    const users = document.createElement('div');
    for(var i =0 ; i < likes.length; i++){
        const user = document.createElement('li');
        users.appendChild(user);
    }

    // parent.appendChild(text);
}

//get username for these likes of this particular post
function get_username(url, parent){

    let requestsArray= url.map((url) => {
        let request = new Request(url, {
            headers: new Headers({
                'Content-Type': 'text/json',
                'Authorization': 'token: ' + token_log
            }),
            method: 'GET'
        });
        return request;
    });

    //array of url request of user ids
    Promise.all(requestsArray.map((request) => {
        return fetch(request).then((response) => {
            return response.json();
        }).then((data) => {
            return data;
        });
    })).then((values) => {
        var str = "";
        for(var i =0; i < values.length; i++){
            str += values[i].username;
            str += " ";
        }
        if(values.length > 0){
            str += "likes this!\n";
        }
        const like = document.createElement('div');
        like.setAttribute("class", "likes");
        like.textContent = str;
        parent.appendChild(like);
    }).catch(console.error.bind(console));

}
