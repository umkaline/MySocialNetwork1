define(['Backbone', 'moment'],
    function(Backbone, moment){
    var FeedModel = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot: function(){
            return '/myApi/feed';
        },

        parse: function(data) {
            if (data && data.dateOfPost) {
                var date = data.dateOfPost;
                date = new Date(date);
                date  = moment(date).format("YYYY-MM-DD HH:mm:ss");
                data.dateOfPost = date;
            }
            return data;
        }
    });

    return FeedModel;
});