Template.login.onCreated(function(){
  this.error = new ReactiveVar();
});

Template.login.events({
  'click #login-github': function(){
    Meteor.loginWithGithub({
      loginStyle: 'redirect'
    });
  },
  'click #login-facebook': function(){
    Meteor.loginWithFacebook({
      loginStyle: 'redirect'
    });
  },
  'click #login-submit': function(e, t){
    // loginPassword(t);
    loginWithoutPassword(t);
  }
});

Template.login.helpers({
  enabled: function(){
    var services = {};
    ServiceConfiguration.configurations
        .find({})
        .fetch()
        .forEach(function(service){
          services[service.service] = true;
        });
    return services;
  },
  error: function(){
    return Template.instance().error.get();
  }
});

Template.login.rendered = function(){
  $(this.findAll('.container')).addClass('animated fadeIn');
  $(this.findAll('.ui.dropdown')).dropdown();
};

function loginPassword(t){
  Meteor.loginWithPassword(
      $(t.findAll('#username')).val(),
      $(t.findAll('#password')).val(),
      function(error){
        if (error){
          $(t.findAll('#password')).val("");
          t.error.set(error.reason);
        }
      }
  )
}
