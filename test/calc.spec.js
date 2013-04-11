(function () {
    "use strict";

    var _ = require("underscore"),
        assert = require("assert"),
        should = require("should"),
        sinon = require("sinon"),
        calc = require("../lib/calc"),
        Estimate = calc.Estimate;

    describe("Estimate object", function () {
        it("has a constructor function", function () {
            Estimate.should.be.a("function");
        });

        it("accepts a vector of values in constructor", function () {
            assert.strictEqual(
                (new Estimate(1, 2, 3.5, 80)).variance(),
                (new Estimate([1, 2, 3.5, 80])).variance()
            );
        });
    });

    describe("confidenceDivisor()", function () {
        it("is 0.25 for 9%", function () {
            should.not.exist(calc.confidenceDivisor(9));
        });

        it("is 0.25 for 10%", function () {
            calc.confidenceDivisor(10).should.be.within(0.25 - 0.001, 0.25 + 0.001);
        });

        it("is 0.51 for 20%", function () {
            calc.confidenceDivisor(20).should.be.within(0.51 - 0.001, 0.51 + 0.001);
        });

        it("is 0.77 for 30%", function () {
            calc.confidenceDivisor(30).should.be.within(0.77 - 0.001, 0.77 + 0.001);
        });

        it("is 1.0 for 40%", function () {
            calc.confidenceDivisor(40).should.be.within(1.0 - 0.001, 1.0 + 0.001);
        });

        it("is 1.4 for 50%", function () {
            calc.confidenceDivisor(50).should.be.within(1.4 - 0.001, 1.4 + 0.001);
        });

        it("is 1.7 for 60%", function () {
            calc.confidenceDivisor(60).should.be.within(1.7 - 0.001, 1.7 + 0.001);
        });

        it("is 2.1 for 70%", function () {
            calc.confidenceDivisor(70).should.be.within(2.1 - 0.001, 2.1 + 0.001);
        });

        it("is 2.6 for 80%", function () {
            calc.confidenceDivisor(80).should.be.within(2.6 - 0.001, 2.6 + 0.001);
        });

        it("is 3.3 for 90%", function () {
            calc.confidenceDivisor(90).should.be.within(3.3 - 0.001, 3.3 + 0.001);
        });

        it("is 6.0 for 99.7%", function () {
            calc.confidenceDivisor(99.7).should.be.within(6.0 - 0.001, 6.0 + 0.001);
        });

        it("is 6.0 for 99.9%", function () {
            calc.confidenceDivisor(99.9).should.be.within(6.0 - 0.001, 6.0 + 0.001);
        });
    });

    describe("Estimate.prototype.expectedCaseHours()", function () {
        it("is 16 for [12, 16, 20, 99.9]", function () {
            var e = new Estimate(12, 16, 20, 99.9);
            e.expectedCaseHours().should.be.within(16 - 0.001, 16 + 0.001);
        });

        it("is 24.33 for [20, 24, 30, 99.9]", function () {
            var e = new Estimate(20, 24, 30, 99.9);
            e.expectedCaseHours().should.be.within(24.33 - 0.01, 24.33 + 0.01);
        });
    });

    describe("Estimate.prototype.variance()", function () {
        it("relies on calc.confidenceDivisor()", function () {
            var e = new Estimate(12, 16, 20, 100),
                spy = sinon.spy(calc, "confidenceDivisor");

            e.variance();

            assert(calc.confidenceDivisor.calledWith(100));

            calc.confidenceDivisor.restore();
        });

        it("is 1.78 for [12, 16, 20, 99.9]", function () {
            var e = new Estimate(12, 16, 20, 99.9);
            e.variance().should.be.within(1.78 - 0.005, 1.78 + 0.005);
        });
    });

    describe("total75PercentLikelyHours()", function () {
        it("is 16 for (1 2 3) (4 5 6) (7 8 10)", function () {
            calc.total75PercentLikelyHours([
                new Estimate(1, 2, 3, 99.9),
                new Estimate(4, 5, 6, 99.9),
                new Estimate(7, 8, 10, 99.9)
            ]).should.be.within(16 - 0.5, 16 + 0.5);
        });

        it("is 10 for (1 2 3) (1 2 2.5) (3 5 7) (0.5 1 1.5)", function () {
            calc.total75PercentLikelyHours([
                new Estimate(1, 2, 3, 99.9),
                new Estimate(1, 2, 2.5, 99.9),
                new Estimate(3, 5, 7, 99.9),
                new Estimate(0.5, 1, 1.5, 99.9)
            ]).should.be.within(10 - 0.5, 10 + 0.5);
        });

        it("accepts the plain maps instead of Estimate objects as the input", function () {
            calc.total75PercentLikelyHours([{
                bestCaseHours: 1,
                mostLikelyCaseHours: 2,
                worstCaseHours: 3,
                confidencePercent: 99.9
            }, {
                bestCaseHours: 4,
                mostLikelyCaseHours: 5,
                worstCaseHours: 6,
                confidencePercent: 99.9
            }, {
                bestCaseHours: 7,
                mostLikelyCaseHours: 8,
                worstCaseHours: 10,
                confidencePercent: 99.9
            }]).should.be.within(16 - 0.5, 16 + 0.5);
        });
    });
}());
