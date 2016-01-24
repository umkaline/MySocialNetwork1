define([
    'Backbone',
    'models/feed'
], function(Backbone, Feed){
    var Feeds = Backbone.Collection.extend({
        model: Feed,
        url: '/myApi/feed/',
        comparator: function(feed) {
            var val = feed.get('dateOfPost');
            val = new Date(val);
            val = -val.getTime();
            return val;
        }
    });
    return Feeds;
});