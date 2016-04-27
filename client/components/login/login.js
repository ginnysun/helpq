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
  // Username is firstname-lastname-track
  // password is "password".

  var firstNameSanitized = $('#first-name').val().toLowerCase().replace(/\W/g, '');
  var lastNameSanitized = $('#last-name').val().toLowerCase().replace(/\W/g, '');
  var trackSanitized = $('#track-selection').dropdown('get value').toLowerCase().replace(/\W/g, '');

  var username = firstNameSanitized + '-' + lastNameSanitized + '-' + trackSanitized;

  var user = {
    username: username,
    password: Meteor.settings.public.password,
    profile: {
      name: $('#first-name').val(),
      track: $('#track-selection').dropdown('get value')
    }
  }

  // Try to create a new user
  Meteor.call("createLoginlessAccount",
    user.username,
    user.password,
    user.profile,
    function(error) {
      if (error) {
        console.log("Does user ", user.username, " already exist: ", Boolean(error));
        console.log(error);
      };

      // Sign the user in.
      Meteor.loginWithPassword(user.username, user.password, function(error) {
        // If sign in fails, create a new user.
        if (error) {
          console.log("Error logging in user ", user.username);
          console.log(error);
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
