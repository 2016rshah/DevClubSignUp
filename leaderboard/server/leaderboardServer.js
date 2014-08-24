// On server startup, create some players if the database is empty.\

  Meteor.startup(function () {
    if (Players.find().count() === 0) {
      var names = ["Ada Lovelace",
                   "Grace Hopper",
                   "Marie Curie",
                   "Carl Friedrich Gauss",
                   "Nikola Tesla",
                   "Claude Shannon"];
      for (var i = 0; i < names.length; i++)
        Players.insert({name: names[i], score: Math.floor(Random.fraction()*10)*5});
    }
  });
  
Meteor.methods({
    addName : function(name){
        if(Meteor.userId()){
            console.log('Adding Name');
            var newName = Players.insert({
                  name : name,
                  score : 5,
                  owner : Meteor.user().username
            });
            return newName;
        }
        else{
            throw new Meteor.Error(403, 'unauthorized access');  
        }
    },
  
    remName : function(catVal){
        var n = Players.findOne({name:catVal})
        if(typeof n !== "undefined")
        {
            if(n.owner === Meteor.user().username || Meteor.user().username === "admin")
            {
                Players.remove(n._id);
            }
            else{
                throw new Meteor.Error(403, 'unauthorized access');    
            }
        }
        else{
            console.log("Doesn't exist");
        }
    }, 
    
    incScore : function(id, s){
        var n = Players.findOne({_id:id})
        if(Meteor.user().username === n.owner || Meteor.user().username === "admin"){
            Players.update(id, {$inc: {score: s}});
        }
        else{
            throw new Meteor.Error(403, 'unauthorized access');    
        }
    }
});
