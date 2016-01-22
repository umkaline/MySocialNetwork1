define([
    'Backbone',
    'models/user'
], function(Backbone, User){
    var Users = Backbone.Collection.extend({
        model: User,
        url: '/myApi/user/',
        comparator: 'age',

        initialize: function(options){
            this.fetch({
                data: options,
                reset: true,
                success: function(){

                },
                error: function(){

                }
            });
        }
    });

    return Users;
});