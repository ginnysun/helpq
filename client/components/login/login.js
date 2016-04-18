Template.login.onCreated(function() {
  this.error = new ReactiveVar();
});

Template.login.events({
  'click #login-github': function() {
    Meteor.loginWithGithub({
      loginStyle: 'redirect'
    });
  },
  'click #login-facebook': function() {
    Meteor.loginWithFacebook({
      loginStyle: 'redirect'
    });
  },
  'click #login-submit': function(e, t) {
    // Do not allow for defaults to be used for the login.
    e.preventDefault();
    loginWithoutPassword(t);
  }
});

Template.login.helpers({
  enabled: function() {
    var services = {};
    ServiceConfiguration.configurations
      .find({})
      .fetch()
      .forEach(function(service) {
        services[service.service] = true;
      });
    return services;
  },
  error: function() {
    return Template.instance().error.get();
  }
});

Template.login.rendered = function() {
  $(this.findAll('.container')).addClass('animated fadeIn');
  $(this.findAll('.ui.dropdown')).dropdown();
};

// When a user hits submit, log them in with their name as the username
function loginWithoutPassword(t) {
  // Auto create username and password
  var username = $('#first-name').val().toLowerCase() + '-' + $('#last-name').val().toLowerCase() + '-' + $('#track-selection').dropdown('get value');
  var user = {
    username: username,
    password: username,
    profile: {
      name: $('#first-name').val().toLowerCase()
    }
  }

  // Try to create a new user
  Meteor.call("createAccount",
    user.username,
    user.password,
    user.profile,
    function(error) {
      if (error) {
        console.log("Does user ", user.username, " already exist: ", Boolean(error) );
        console.log(error.reason);
      };

      // Sign the user in.
      Meteor.loginWithPassword(user.username, user.password, function(error) {
        // If sign in fails, create a new user.
        if (error) {
          console.log("Error logging in user ", user.username );
          t.error.set(error.reason);
        }
      });

    });
};

function loginPassword(t) {
  Meteor.loginWithPassword(
    $(t.findAll('#username')).val(),
    $(t.findAll('#password')).val(),
    function(error) {
      if (error) {
        $(t.findAll('#password')).val("");
        t.error.set(error.reason);
      }
    }
  )
}
