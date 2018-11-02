const fs = require("fs");
const User = require("./../model/user");

var UserService = {

    findByUserName: () => {

        try { 
            var content = fs.readFileSync("user.txt");                
            var jsonContent = JSON.parse(content);
            console.log("Output Content : \n"+ jsonContent);
            return new User("steve", "test");
        } catch (e) {
            console.log("failed to load user data", e);
            return null;
        }
    },
    loadDummyData: () => {
        try { 
            let users = [new User("user1", "1234"), new User("user2", "1234")];    

            fs.writeFile('user.txt', JSON.stringify(users), function (err) {
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