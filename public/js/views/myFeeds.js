define([
    'Backbone',
    'Underscore',
    'models/feed',
    'collections/feed',
    'text!templates/myFeeds.html'
], function (Backbone, _, FeedModel, FeedCollection, myFeedsTemplate) {
    var View = Backbone.View.extend({
        el      : "#myFeeds",
        template: _.template(myFeedsTemplate),

        events: {
          'click #postBtn': 'post',
          'click button.deleteBtn': 'delete'
        },

        post: function(e) {
            e.preventDefault();
            var self = this;
            var feed = new FeedModel();

            var topic = this.$el.find('#feedTopic').val();
            var text = this.$el.find('#feedText').val();
            var data = {
                topic: topic,
                text: text
            };

            feed.save(data, {
                success: function (response, xhr) {
                    self.initialize();
                },
                error: function (err, xhr) {
                    alert('Some error');
                }
            });
        },

        delete: function(e) {
            e.preventDefault();
            e.stopPropagation();
            var self = this;
            var feed = self.collection.get(e.target.id)

            feed.destroy({
                success: function (response, xhr) {
                    self.render();
                },
                error: function (err, xhr) {
                    alert('Some error');
                }
            });
        },

        initialize: function (options) {
            var self = this;
            var feeds = new FeedCollection();

            feeds.fetch({
                success: function () {
                    self.collection = feeds;
                    self.render();
                },
                error: function (err, xhr) {
                    alert('Some error');
                }
            });
        },


        render: function () {
            var self = this;
            var params = {feeds: self.collection.toJSON()};
            this.$el.html(self.template(params));

            return this;
        }
    });

    return View;
});
