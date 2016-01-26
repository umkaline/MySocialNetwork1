define([
    'Backbone',
    'Underscore',
    'collections/feed',
    'text!templates/admin/posts.html',
], function (Backbone, _, FeedCollection, newsTemplate) {
    var View = Backbone.View.extend({
        el: "#content",
        template: _.template(newsTemplate),

        events: {
            'click button.removeBtn': 'remove'
        },

        remove: function (e) {
            e.preventDefault();

            var id = e.target.id;
            var self = this;
            var feed = self.collection.get(id);

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
            var posts = new FeedCollection();
            this.collection = posts;

            posts.url = 'myApi/admin/posts';

            posts.fetch({
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
            var posts = self.collection.toJSON();
            var data = {
                posts: posts
            };
            this.$el.html(this.template(data));

            return this;
        }
    });

    return View;
});
