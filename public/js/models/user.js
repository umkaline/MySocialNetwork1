define([
    'Backbone',
    'moment'
], function(Backbone, moment){
    var UserModel = Backbone.Model.extend({
        //by default idAttribute: 'id'
        idAttribute: '_id',
        defaults: {
            gender: 'male'
        },

        urlRoot: function(){
            return '/myApi/user';
        },

        parse: function(data){
            if(data && data.age){
                data.age = data.age.toFixed(0);
            }

            if(data && data.dateOfBirth){
                data.dateOfBirth = moment(data.dateOfBirth).format('MM/DD/YY');
            }

            return data;
        }
    });

    //collection.fetch({reset: true, success: cb, error: cb})
    
    return UserModel;
});