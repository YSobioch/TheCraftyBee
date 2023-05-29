const User = require('../models/users')
const updateAndDelete = require('../models/updateAndDelete')

exports.getAllUsers = async (req, res, next) => {
    // try {
    //     let [users, _] = await User.findAllUsers();

    //     res.status(200).json(users);
    // } catch (err) {
    //     console.log(err)
    // }
    res.send(`
    <form action='/users/' method='POST' encType='multipart/form-data'>
    <h3>New User Form</h3>
    <label>Username</label>
    <input type='text' name='userName'>
    <label>Password</label>
    <input type='text' name='password'>
    <label>Email</label>
    <input type='text' name='email'>
    <input type='submit' value='Submit'>
    </form>
    `)
}

exports.createNewUser = async (req, res, next) => {
    try {
        let user;
        let {userName, password, email} = req.body

        user = new User(userName, password, email, false)

        let [returnUser, _] = await user.save();
        res.status(200).json(returnUser)
    } catch (err) {
        console.log(err)
    }

} 

//checks to see if the Username and Password are correct and then returns the users data
exports.getUserByEmail = async (req, res, next) => {
    let user;
    try {
        [user, _] = await User.isUser(req.params.email)
        const password = Object.values(user[0])[0];
        
        if(password === req.params.password) {
            let [returnUser, _] = await User.findUserByEmail(req.params.email)
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

exports.changeSubscriptionStatus = async (req, res, next) => {
    try {
        let {change, password, email} = req.body

        let user = await updateAndDelete.updateUserById(
            `subscribed = ${change}`,
            email,
            password
        )

        res.status(200).json({"changedSubscription": true})

    } catch (err) {
        console.log(err)
        res.json({"changedSubscription": false})
    }
}

exports.changePassword = async (req, res, next) => {
    try {
        let {email, password, newPassword} = req.body

        let user = await updateAndDelete.updateUserById(
            `password = aes_encrypt('${newPassword}', '${process.env.DB_KEY}')`,
            email,
            password
        )

        res.status(200).json({"changedPassword": true})
    } catch (err) {
        console.log(err)
        res.json({"changedPassword": false})
    }
}


exports.deleteUser = async (req, res, next) => {
    try {
        let deleted = updateAndDelete.deleteUserById(req.params.name, req.params.password);

        res.status(200).json({"deleted": true})
    } catch (err) {
        console.log(err)

        res.json({"deleted": false})
    }
}

exports.deleteUserForm = async (req, res, next) => {
    try{
        res.send(`
        <form action='/users/deleteUser/${req.params.name}/${req.params.password}?_method=DELETE' method='POST' encType='multipart/form-data'>
        <input type="submit" value="Submit">
        </form>
        `)
    } catch (err) {

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