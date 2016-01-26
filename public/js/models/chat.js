define(['Backbone', 'moment'],
    function(Backbone, moment){
    var ChatModel = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot: function(){
            return '/myApi/chat';
        },

        parse: function(data) {
            if (data && data.date) {
                var date = data.date;
                date = new Date(date);
                date  = moment(date).format("HH:mm:ss DD-MMM-YYYY");
                data.date = date;
            }
            return data;
        }
    });

    return ChatModel;
});