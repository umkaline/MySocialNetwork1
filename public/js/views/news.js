define([
    'Backbone',
    'Underscore',
    'collections/feed',
    'text!templates/news.html',
], function (Backbone, _, FeedCollection, newsTemplate) {
    var View = Backbone.View.extend({
        el: "#content",
        template: _.template(newsTemplate),

        events: {
            'click button.likeBtn': 'like'
        },

        like: function (e) {
            e.preventDefault();
            var self = this;
            var feeds = this.collection;
            var feed = feeds.get(e.target.id);
            var likes = feed.get('likes');

            feed.urlRoot = 'myApi/feed/like/';
            feed.set('likes', ++likes);

            feed.save({likes: likes}, {
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
            var news = new FeedCollection();
            this.collection = news;

            news.url = 'myApi/feed/news';

            news.fetch({
                success: function (model) {
                    self.render();
                },
                error: function (err, xhr) {
                    alert('Some error');
                }
            });
        },


        render: function () {
            var self = this;
            this.$el.html(this.template({feeds: self.collection.toJSON()}));

            return this;
        }
    });

    return View;
});
