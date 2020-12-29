let fs = require('fs');
module.exports={
    // DB IMP

    users : [],
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
                    this.users.push({username, password, readList : []});
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
                }
}