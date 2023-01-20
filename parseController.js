function connect() {
    Parse.initialize("02VtfIZsimZQoxjFPzm9i5cC2jcdELpHjZ8vIu2E", "vDYQ8TCvJ6akQbyJvbBApJJgRESJsqsrG7ibCF0X");
    Parse.serverURL = "https://parseapi.back4app.com/";
}
function signUp(data, success, fail) {
    let user = new Parse.User();
    user.set("username", data.username);
    user.set("email", data.username);
    user.set("password", data.password);
    user.set("name", data.name);
    user.signUp().then(() => {
        success();
    }).catch((e) => {
        fail(e);
    })
}
function logIn(data, success, fail) {
    Parse.User.logIn(data.username, data.password).then((u) => {
        success(u);
    }).catch((e) => {
        fail(e)
    });
}
function logOut(success, fail) {
    Parse.User.logOut().then(() => {
        success();
    }).catch((e)=> {
        fail(e);
    });
}
function isLoggedIn() {
    return Parse.User.current() !== null;
}
function getCurrentUser() {
    return Parse.User.current();
}
connect();