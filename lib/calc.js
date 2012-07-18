(function (exports) {
    "use strict";

    var _ = require("underscore"),

        /**
         * bestCaseHours <= mostLikelyCaseHours <= worstCaseHours
         * Minimum possible confidencePercent is 10
         */
        Estimate = function (bestCaseHours, mostLikelyCaseHours, worstCaseHours, confidencePercent) {
            this.bestCaseHours = bestCaseHours;
            this.mostLikelyCaseHours = mostLikelyCaseHours;
            this.worstCaseHours = worstCaseHours;
            this.confidencePercent = confidencePercent;
        };

    Estimate.prototype.expectedCaseHours = function () {
        return (this.bestCaseHours + 4.0 * this.mostLikelyCaseHours + this.worstCaseHours) / 6.0;
    };

    Estimate.prototype.variance = function () {
        var confidenceDivisor = exports.confidenceDivisor(this.confidencePercent),
            standardDeviation = (this.worstCaseHours - this.bestCaseHours) / confidenceDivisor;

        return standardDeviation * standardDeviation;
    };

    exports.Estimate = Estimate;

    exports.confidenceDivisor = function (confidencePercent) {
        var foundPair = _.find(
                [[99.7, 6], [90, 3.3], [80, 2.6], [70, 2.1], [60, 1.7],
                [50, 1.4], [40, 1], [30, 0.77], [20, 0.51], [10, 0.25]],

                function (pair) {
                    return confidencePercent >= pair[0];
                }
            );

        return (foundPair ? foundPair[1] : undefined);
    };

    exports.total75PercentLikelyHours = function (estimates) {
        var add = function (memo, num) { return memo + num; },

            expectedCasesSum = _.reduce(
                _.map(
                    estimates,
                    function (e) { return e.expectedCaseHours(); }
                ),

                add,
                0.0
            ),

            variancesSum = _.reduce(
                _.map(
                    estimates,
                    function (e) { return e.variance(); }
                ),

                add,
                0.0
            );

        return expectedCasesSum + 0.67 * Math.sqrt(variancesSum);
    };
}(exports));