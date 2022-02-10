// importing named exports we use brackets
import { createPostTile, uploadImage } from './helpers.js';

// when importing 'default' exports, use below syntax
import API from './api.js';

const api  = new API();
const main = document.querySelector('main[role="main"]');

//username contain a textbox of name
const username = document.createElement('div');
username.setAttribute('class',"login_form");
username.textContent = "Name:   ";

const name = document.createElement('input');
name.setAttribute('type',"text");
name.setAttribute('id',"fname");
username.appendChild(name);

//userpwd contain a textbox for pwd
const userpwd = document.createElement('div');
userpwd.setAttribute('class',"login_form");
userpwd.textContent = "Password: ";

const pwd = document.createElement('input');
pwd.setAttribute('type',"text");
pwd.setAttribute('id',"password");
userpwd.appendChild(pwd);

//button to trigger submit
const btn1 = document.createElement('button');
btn1.setAttribute('id',"enter");
btn1.textContent = "Submit";

//button to trigger sign up
const btn2 = document.createElement('button');
btn2.setAttribute('id',"sign-up");
btn2.style.visibility = "hidden";
btn2.textContent = "Sign Up!";

//append the form under main
main.appendChild(username);
main.appendChild(userpwd);
main.appendChild(btn1);
main.appendChild(btn2);

var nav = document.getElementsByClassName('nav-item');
var array = [];
var user_post = []; //record post id with array

//const login_btn = document.createElement('button');
nav[1].setAttribute("id", 'Login');
nav[1].textContent = "Login";
nav[2].setAttribute("id", 'Sign-Up');
nav[2].textContent = "Sign Up";

nav[1].onclick = function(){
    login_sign();
    btn2.style.visibility = "hidden";
}

function login_sign(){
    var paras = document.getElementsByClassName('post');
    while(paras[0]){
        paras[0].parentNode.removeChild(paras[0]);
    }
    document.getElementById('enter').style.visibility = "visible";
    document.getElementsByClassName('login_form')[0].style.visibility = "visible";
    document.getElementsByClassName('login_form')[1].style.visibility = "visible";

}

nav[2].onclick = function(){
    login_sign();
    btn2.style.visibility = "visible";
    btn1.style.visibility = "hidden"; //hide btn one is not hidden
}

btn1.onclick = function(){
    var Name = document.getElementById("fname").value;
    var Pwd = document.getElementById("password").value;
    console.log(Name);
    console.log(Pwd);

    const login = api.getCredentials();
    var logged = 0;
    login
    .then(json =>{
        console.log(json);
        for(var i =0; i < json.length; i++){

            console.log("hello");
            if(Name.localeCompare(json[i].name) == 0){
                if(Pwd.localeCompare(json[i].username) == 0){
                    console.log("Logging credentials confirmed");
                    display();
                    logged = 1;
                }
            }
        }
        if(array.length > 0){
            for(var i =0; i < array.length; i++){
                console.log(array[i]);
                if(Name.localeCompare(array[i].name) == 0){
                    if(Pwd.localeCompare(array[i].username) == 0){
                        console.log("Logging credentials confirmed");
                        log_user.push
                        display();
                        logged = 1;
                    }
                }
            }
        }

        if(logged == 0){
            alert("Wrong credentials!");
        }
    })
}

btn2.onclick = function(){
    console.log("bjescsli");

    var Name = document.getElementById("fname").value;
    var Pwd = document.getElementById("password").value;

    const login = api.getCredentials();
    var logged = 0;
    login
    .then(json =>{
        console.log(json);
        for(var i =0; i < json.length; i++){
            //checking if alrdy exist
            if(Name.localeCompare(json[i].name) == 0){
                if(Pwd.localeCompare(json[i].username) == 0){
                    console.log("Logging credentials confirmed");
                    logged = 1;
                }
            }
        }
        if(logged != 1){
            var user = {
                "username": document.getElementById("password").value,
                "name": document.getElementById("fname").value,
                "id"  : (json.length+1),
                "posts": []
            };
            array.push(user);
            for(var i =0; i < array.length; i++){
                console.log("hahahah");
                console.log(array[i]);
            }
        }
    })
}

 // we can use this single api request multiple times
function display(){
    document.getElementById('enter').style.visibility = "hidden";
    document.getElementsByClassName('login_form')[0].style.visibility = 'hidden';
    document.getElementsByClassName('login_form')[1].style.visibility = 'hidden';

    const feed = api.getFeed();
    feed
    .then(posts => {
        posts.reduce((parent, post) => {
            parent.appendChild(createPostTile(post));
            return parent;

        }, document.getElementById('large-feed'))
    });

    // Potential example to upload an image
    const input = document.querySelector('input[type="file"]');

    input.addEventListener('change', uploadImage);

}
