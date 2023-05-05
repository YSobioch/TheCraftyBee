const User = require('../models/users')

exports.getAllUsers = async (req, res, next) => {
    try {
        let [users, _] = await User.findAllUsers();

        res.status(200).json(users);
    } catch (err) {
        console.log(err)
    }
    // res.send(`
    // <form action='./users/' method='POST' encType='multipart/form-data'>
    // <h3>New User Form</h3>
    // <label>Username</label>
    // <input type='text' name='userName'>
    // <label>Password</label>
    // <input type='text' name='password'>
    // <label>Email</label>
    // <input type='text' name='email'>
    // <input type='submit' value='Submit'>
    // </form>
    // `)
}

exports.createNewUser = async (req, res, next) => {
    let user;
    let {userName, password, email} = req.body
    try {
        user = new User(userName, password, email, false)

        user.save();
        res.status(200).send("new user succesfully created")
    } catch (err) {
        console.log(err)
    }

} 

//checks to see if the Username and Password are correct and then returns the users data
exports.getUserByName = async (req, res, next) => {
    let user;
    try {
        [user, _] = await User.isUser(req.params.name)
        const password = Object.values(user[0])[0];
        
        if(password === req.params.password) {
            let [returnUser, _] = await User.findUserByUsername(req.params.name)
            returnUser = returnUser[0];
            returnUser.password = password
            res.json({"isUser": true, "isPassword": true, "User": returnUser})
        } else {
            res.json({"isUser": true, "isPassword": false, "User": null})
        }
    } catch (err) {
        console.log(err)
        res.json({"isUser": false, "isPassword": false, "User": null})
    }
}

exports.updateUser = async (req, res, next) => {
    let user;
    let {id, userName, password, email, subscribed} = req.body
    try {
        [user, _] = await User.isUser(req.params.name)
        const userPassword = Object.values(user[0])[0];
        
        if(userPassword === req.params.password) {
            console.log('success')
            User.update(id, userName, password, email, subscribed)
            res.status(200).json({"updated": true})
        } else {
            console.log('failed')
            res.json({"updated": false})
        }
    } catch (err) {
        console.log(err)
        res.json({"updated": false})
    }
}

exports.deleteUser = async (req, res, next) => {
    let user;
    try {
        [user, _] = await User.isUser(req.params.name)
        const userPassword = Object.values(user[0])[0];
        
        if(userPassword === req.params.password) {
            console.log('success')
            let [returnUser, _] = await User.findUserByUsername(req.params.name);
            returnUser = returnUser[0];
            User.deleteUser(returnUser.id)
            res.status(200).json({"deleted": true})
        } else {
            console.log('failed')
            res.json({"deleted": false})
        }
    } catch (err) {
        console.log(err)
        res.json({"deleted": false})
    }
}

exports.updateUserForm = async (req, res, next) => {
    try {
        res.send(`
        <form action='/users/updateUser/${req.params.name}/${req.params.password}?_method=PUT' method='POST' encType='multipart/form-data'>
        <h3>Update User Form</h3>
        <input type="hidden" name="id" value="1">
        <label>Username</label>
        <input type='text' name='userName'>
        <label>Password</label>
        <input type='text' name='password'>
        <label>Email</label>
        <input type='text' name='email'>
        <input type = "hidden" name="subscribed" value="0">
        <input type='submit' value='Submit'>
        </form>
        `)
    } catch (err) {
        console.log(err)
    }
}