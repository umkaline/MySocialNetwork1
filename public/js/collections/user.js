define([
    'Backbone',
    'models/user'
], function(Backbone, User){
    var Users = Backbone.Collection.extend({
        model: User,
        url: '/myApi/friends/',
    });

    return Users;
});