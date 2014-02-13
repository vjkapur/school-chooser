define(
    ['lodash',
     'backbone',
     'models/school'
    ], function (_, Backbone, School) {
    'use strict';

    var Schools = Backbone.Collection.extend({

        model: School,
        url: '/data/schools.json',

        initialize: function () {
            this.fetch();
        },

        sorted: function (grade, nc, rankings) {
            this.fetch();
            var selected = _.transform(rankings, function (result, value, key)
                    {
                        if (value > 0) { result[key] = value; return result; }
                    }),
                n = _.keys(selected).length,
                weights = _(selected).transform(function (result, value, key)
                    {
                        result[key] = (n + 1 - value) / n;
                        return result;
                    })
                    .pairs()
                    .value(),
                results = _(this.models).filter(function (school)
                    {
                        return _.include(school.attributes.grades, grade);
                    })
                    .each(function (school)
                    {
                        school.attributes.studentsFromMyNeighborhood = school.attributes.studentsFromMyNeighborhood[nc];
                    })
                    .sortBy(function (school) {
                        var score = 0;
                        _.forEach(weights, function (weight) {
                            var value = school.attributes[weight[0]];
                            if (value && value.sd) { score += value.sd * weight[1]; }
                        });
                        return -score;
                    })
                    .value();
            return results;
        }

    });
    return Schools;
});