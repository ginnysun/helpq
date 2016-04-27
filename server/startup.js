// Startup Functions
Meteor.startup(function(){
  // Grab the config
  // This should be autograbbed by meteor based on value of --settings
  var config = Meteor.settings;

  // Create admins
  createAdmin(config.admin.username, config.public.password, config.admin.profile);

  // Pre-populate mentor users

  // Clear Service integrations
  ServiceConfiguration.configurations.remove({});

  // Add Service Integrations
  addServiceIntegration('github', config.github);
  addFacebookIntegration(config.facebook);
  addServiceIntegration('google', config.google);

  // Add Base Settings
  setBasicSettings(config);

  Accounts.onCreateUser(function(options, user){
    if (options.profile){
      user.profile = options.profile;

      if (config.defaultMentor){
        user.profile.mentor = true;
      }
    }

    return user;
  });

});

function createAdmin(username, password, profile){
  var newUser = {
    username: username,
    password: password,
    profile: profile
  };

  newUser.profile.admin = true;

  // Overwrite already existing users to force creation of admin.
  Meteor.users.remove(
    {username: username},
    function(err, results) {
      console.log("Creating admin user", newUser);
      Accounts.createUser(newUser);
    }
  );
}

function addServiceIntegration(service, config){
  if (config.enable){
    ServiceConfiguration.configurations.upsert({
      service: service
    },{
      $set: {
        clientId: config.clientId,
        secret: config.secret
      }
    });
  }
}

function addFacebookIntegration(fb){
  if (fb.enable){
    ServiceConfiguration.configurations.upsert({
      service: 'facebook'
    },{
      $set: {
        appId: fb.appId,
        secret: fb.secret
      }
    });
  }
}

function setBasicSettings(config){
  // Check if the settings document already exists
  var settings = Settings.find({}).fetch();
  if (settings.length == 0 || settings.length > 1){
    // Remove all documents and then create the singular settings document.
    Settings.remove({});
    Settings.insert(config.settings);
  }
}
