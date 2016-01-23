define(['Backbone', 'moment'],
    function(Backbone, moment){
    var UserModel = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot: function(){
            return '/myApi/user';
        },

        parse: function(data) {
            if (data && data.dateOfBirth) {
                var date = data.dateOfBirth;
                date = new Date(date);
                date  = moment(date).format("YYYY-MM-DD");
                data.dateOfBirth = date;
            }
            return data;
        }
    });

    return UserModel;
});