define(['Backbone', 'moment'],
    function(Backbone, moment){
    var FeedModel = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot: function(){
            return '/myApi/feed';
        }
    });

    return FeedModel;
});