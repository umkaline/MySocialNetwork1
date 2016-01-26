define([
    'Backbone',
    'models/chat'
], function(Backbone, Chat){
    var Chats = Backbone.Collection.extend({
        model: Chat,
        url: '/myApi/chat/',
        comparator: function(feed) {
            var val = feed.get('date');
            val = new Date(val);
            val = -val.getTime();
            return val;
        }
    });
    return Chats;
});