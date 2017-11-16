(function () {
    'use strict'

    function isFunction (x) {
        return (typeof x === 'function')
    }

    function scope () {
        return hasModule ? module.exports : {}
    }

    var hasModule = (typeof module !== 'undefined' && module.exports)
    var exports = scope()

    /**
     * bestCaseHours <= mostLikelyCaseHours <= worstCaseHours
     * Minimum possible confidencePercent is 10
     */
    var Estimate = function (bestCaseHours, mostLikelyCaseHours, worstCaseHours, confidencePercent) {
        var isVector = (typeof bestCaseHours === 'object')

        this.bestCaseHours = isVector ? bestCaseHours[0] : bestCaseHours
        this.mostLikelyCaseHours = isVector ? bestCaseHours[1] : mostLikelyCaseHours
        this.worstCaseHours = isVector ? bestCaseHours[2] : worstCaseHours
        this.confidencePercent = isVector ? bestCaseHours[3] : confidencePercent
    }

    Estimate.prototype.expectedCaseHours = function () {
        return (this.bestCaseHours + 4.0 * this.mostLikelyCaseHours + this.worstCaseHours) / 6.0
    }

    Estimate.prototype.variance = function () {
        var confidenceDivisor = exports.confidenceDivisor(this.confidencePercent)
        var standardDeviation = (this.worstCaseHours - this.bestCaseHours) / confidenceDivisor

        return standardDeviation * standardDeviation
    }

    exports.Estimate = Estimate

    exports.confidenceDivisor = function (confidencePercent) {
        var foundPair = [
            [99.7, 6], [90, 3.3], [80, 2.6], [70, 2.1], [60, 1.7],
            [50, 1.4], [40, 1], [30, 0.77], [20, 0.51], [10, 0.25]
        ].find(
            function (pair) {
                return confidencePercent >= pair[0]
            }
        )

        return (foundPair ? foundPair[1] : undefined)
    }

    exports.total75PercentLikelyHours = function (estimates) {
        var add = function (memo, num) { return memo + num }

        var ensureEstimateObjects = function () {
            return estimates.map(function (e) {
                return (
                    isFunction(e.expectedCaseHours) && isFunction(e.variance)
                        ? e

                        : new Estimate(
                            e.bestCaseHours,
                            e.mostLikelyCaseHours,
                            e.worstCaseHours,
                            e.confidencePercent
                        )
                )
            })
        }

        var expectedCasesSum = ensureEstimateObjects().map(
            function (e) { return e.expectedCaseHours() }
        ).reduce(
            add,
            0.0
        )

        var variancesSum = ensureEstimateObjects().map(
            function (e) { return e.variance() }
        ).reduce(
            add,
            0.0
        )

        return expectedCasesSum + 0.67 * Math.sqrt(variancesSum)
    }

    if (!hasModule) {
        window['estimate-tasks'] = exports
    }
}())
