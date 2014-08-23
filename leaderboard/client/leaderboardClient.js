function focusText(i, val){
      i.focus();
      i.value = val?val:"";
      i.select();
  }


if (Meteor.isClient) {
    
    
    Session.set("adding_name", false);
    Session.set("removing_name", false);
    Template.textboxes.removing_name = function(){
    return Session.equals('removing_name', true);
  };
  Template.textboxes.adding_name = function(){
      return Session.equals('adding_name', true);
  };
  Template.leaderboard.players = function () {
    return Players.find({}, {sort: {score: -1, name: 1}});
  };

  Template.leaderboard.selected_name = function () {
    var player = Players.findOne(Session.get("selected_player"));
    return player && player.name;
  };

  Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };

  Template.leaderboard.events({
    'click #inc': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 5}});
    }
  });
  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
    }
  });
  Template.buttons.events({
      'click #add': function(e, t){
          Session.set("adding_name", true);
          Meteor.flush();
          focusText($("#add-name"));
      },
      'click #remove': function(e, t){
          Session.set("removing_name", true);
          Meteor.flush();
          focusText($("#rem-name"));
      }
  });
  Template.textboxes.events({
    'keyup #add-name':function(e, t){
        if(e.which === 13){
            Players.insert({name:String(e.target.value || "JOHN DOE"), score: Math.floor(Random.fraction()*10)*5});
            Session.set('adding_name', false);
        }
    },
    'keyup #rem-name': function(e, t){
        if(e.which === 13)
        {
          var catVal = String(e.target.value || "");
          if(catVal){
            if(typeof Players.find({name:catVal}).fetch()[0] !== "undefined")
            {
              var id = Players.find({name:catVal}).fetch()[0]._id;
              Players.remove(id);
            }
            else{
              console.log("Doesn't exist");
            }
            Session.set('removing_name', false);
          }
        }
      }
  });
}