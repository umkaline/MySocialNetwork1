define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/user/editItem.html',
    'models/user',
    'moment'
], function (Backbone, _, $, templateHtml, Model, moment) {
    var View = Backbone.View.extend({
        el      : '#content-holder',
        template: _.template(templateHtml),

        events: {
            'click #saveBtn'  : 'saveItem',
            'click #cancelBtn': 'cancel'
        },

        initialize: function () {
            this.render();
        },

        saveItem: function (e) {
            e.preventDefault();
            var self = this;

            var firstName = this.$firstName.val();
            var lastName = this.$lastName.val();
            var dateOfBirth = this.$dateOfBirth.val();
            this.model.set({
                name       : {
                    first: firstName,
                    last : lastName
                },
                dateOfBirth: dateOfBirth
            });

            //user.url = '';

            this.model.save(this.model.changed, {
                patch: true,
                success: function (model, xhr, options) {
                    self.undelegateEvents();

                    Backbone.history.fragment = '';
                    Backbone.history.navigate('myApp/user', {trigger: true});
                },
                error  : function (model, xhr, options) {
                    self.$el.append('<span>Error</span>');
                }
            });
        },

        cancel: function () {
            Backbone.history.navigate('myApp/user', {trigger: true});
        },

        render: function () {
            var $thisEl = this.$el;
            var model = this.model.toJSON();

            model.dateOfBirth = moment(model.dateOfBirth).format('YYYY-MM-DD');

            $thisEl.html(this.template(model));

            this.$firstName = $thisEl.find('#firstName');
            this.$lastName = $thisEl.find('#lastName');
            this.$dateOfBirth = $thisEl.find('#dateOfBirth');

            return this;
        }
    });
    return View;
});
