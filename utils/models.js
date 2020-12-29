let fs = require('fs');
module.exports = {
    // DB IMP

    users : [],
    books : [{page: "dune", title:"Dune"} , {page: "grapes", title: "The Grapes of Wrath"}, 
    {page: "flies", title:"Lord of the Flies"}, {page: "leaves", title: "Leaves of Grass"}, 
    {page: "mockingbird", title: "To Kill a Mockingbird"}, { page: "sun", title: "The Sun and Her Flowers"}],
    update_db : function (){
                    const data = JSON.stringify(this.users);
                    fs.writeFile('db.json',data,'utf-8',() => {/*console.log('done updating db')*/});
                },
    read_db : function(){
                fs.readFile('db.json',(err,data)=>{
                    if(err) throw err;
                    this.users = JSON.parse(data);
                })
            },

    add_to_db  : function (username, password){
                    if(this.username_registerd(username))
                        return false;
<<<<<<< HEAD
                    this.users.push({username, password, readList : []});
=======
                    this.users.push({username, password , readList: []});
>>>>>>> 9ecd72347d882ad0cfd543776038cffe24855f24
                    this.update_db();
                    return true;
                },

    username_registerd : function (username){
                            for(let user of this.users){
                                if(user.username == username)
                                    return true;
                            }
                            return false;
                        },
    valid_user : function (username,password){
                    for (const user of this.users) {
                        if(user.username == username && user.password==password)
                            return true;
                    }
                    return false;
                },
    add_to_readList : function (username, bookname){
        for(let user of this.users){
            if(user.username == username){
                if(!user.readList) user.readList = [];
                if(user.readList.includes(bookname)) return false;
                user.readList.push(bookname);
                this.update_db();
                return true;
            }
        }
    },

    get_readList : function (username){
        for(let user of this.users){
            if(user.username == username){
                return user.readList || [];
            }
        }
        return false;
    }
    
}