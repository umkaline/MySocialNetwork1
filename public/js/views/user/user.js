define([
    'Backbone',
    'views/user/userItem',
    'views/user/createItem',
    'text!templates/user/user.html'
], function (Backbone, UserItemView, createItem, UserTemplate) {
    var View = Backbone.View.extend({
        el      : '#content-holder',
        template: _.template(UserTemplate),

        events: {
            'click #createBtn': 'createItem'
        },

        initialize: function (options) {
            this.chanel = options.chanel;
            this.startTime = options.startTime;
            this.render();
        },

        createItem: function (e) {
            if(this.creatItemView){
                this.creatItemView.undelegateEvents();
            }
            this.creatItemView = new createItem();
        },

        render: function () {
            var self = this;
            var $bodyHolder;

            this.$el.html(this.template({
                tableName: 'UserTable'
            }));

            $bodyHolder = this.$el.find('#bodyHolder');

            this.collection.each(function (model) {
                var item = new UserItemView({model: model, attributes: {'data-id': model.id}});

                $bodyHolder.append(item.el);
            });

            this.$el.append('<span>' + (new Date() - this.startTime) + '</span>');

            this.chanel.trigger('customEvent');
            return this;
        }
    });

    return View;
});
