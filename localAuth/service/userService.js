const fs = require("fs");
const User = require("./../model/user");

let userFilePath = "user.txt";

let UserService = {

    findByUserName: (username) => {

        try { 
            let content = fs.readFileSync(userFilePath);                
            let users = JSON.parse(content);
            let user = users.filter(user => {
                return user.username === username
              })            
            return user;
        } catch (e) {
            console.log("failed to load user data", e);
            return null;
        }
    },
    loadDummyData: () => {
        try { 
            let users = [new User("user1", "1234"), new User("user2", "1234")];    

            fs.writeFile(userFilePath, JSON.stringify(users), function (err) {
                if (err) throw err;
                console.log('Replaced!');
            });
            
            return users;
        } catch (e) {
            console.log("failed to load user data", e);
            return null;
        }
    }
}

module.exports = {UserService}