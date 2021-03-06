define(
    ['jquery',
     'lodash',
     'backbone',
     'i18n!nls/content'
    ], function ($, _, Backbone, content) {
    'use strict';

    var BasicInfoView = Backbone.View.extend({

        tagName: 'div',
        id: 'basic-info-view',
        className: 'app-view',

        order: 1,

        template: _.template($('#app-view-template').html()),
        formViewTemplate: _.template($('#basic-info-form-view-template').html()),

        events: {
            'blur #basic-info-address': 'addressUpdate',
            'change #basic-info-grade': 'gradeUpdate'
        },

        initialize: function () {
            var model = this.model;
            this.$el.html(this.template({
                view: 'basicInfo',
                content: content
            }));
            this.$formView = $('<div id="basic-info-form-view"></div>')
                .appendTo(this.$el);

            this.listenTo(this.model, 'addressGIS:valid', function () {
                $('#basic-info-address').addClass('valid');
            });

            this.listenTo(this.model, 'addressGIS:invalid', function () {
                $('#basic-info-address').addClass('invalid');
            });

            this.listenTo(this.model, 'change:address', function () {
                $('#basic-info-address').val(model.get('address'));
            });
        },

        render: function () {
            var address = this.model.get('address'),
                addressGISValid = this.model.get('addressGISValid'),
                grade = this.model.get('grade'),
                grades = ['PS', 'PK', 'K', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

            this.$formView.html(this.formViewTemplate({
                address: address,
                addressGISValid: addressGISValid,
                selectedGrade: grade,
                grades: grades,
                content: content
            }));
        },

        addressUpdate: function (e) {
            var newAddress = e.target.value,
                oldAddress = this.model.get('address');
            if (newAddress !== oldAddress) {
                this.model.set({'address': newAddress, 'zonedSchools': []});
                $(e.target).removeClass();
            }
        },

        gradeUpdate: function (e) {
            var newGrade = $(e.target).children(':selected').attr('value'),
                oldGrade = this.model.get('grade');
            if (newGrade !== oldGrade) {
                this.model.set({'grade': newGrade, 'zonedSchools': []});
            }
        },

        close: function () {
            this.remove();
            this.unbind();
        }

    });
    return BasicInfoView;
});