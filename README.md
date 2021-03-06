[![Build Status](https://travis-ci.org/ikr/estimate-tasks.svg?branch=master)](https://travis-ci.org/ikr/estimate-tasks)

# About

Given the individual tasks' estimations (in hours), calculates the total estimation for the whole
project.  It attempts to do the right thing, when summing up estimations, treating each individual
estimate as a continuous random variable (see _Math_), and applying a formula from Steve McConnel's
book "Software Estimation: Demystifying the Black Art".

Doing the math right though requires providing _a range_ for an individual estimate instead of a
single number: you'll be asked for the best case, the most likely case, and the worst case hours.

By the way, the probability of a task taking exactly X hours to finish is exactly zero (see _Math_
again ;).

Also, a subjective _confidence factor_ is provided for each task's estimation, in percent, within
the range (0, 100) -- excluding 0 and 100. Normally, you should be pretty confident in the _most_ of
your tasks' estimations, specifying confidence factors above 90% for them. Only a smaller part of
tasks should have 90% and below. Anyway, that's a just fine tuning mechanism; you may well ignore
it, and simply assign, say, 95% confidence to all the tasks.

The number _E_ you get from `total75PercentLikelyHours()` means that there's a 75% probability that
your project will take not more than _E_ hours.

# Installation

Node.js:

    $ npm install estimate-tasks

Web browser:

    $ bower install estimate-tasks

# API

Node version:

    var et = require("estimate-tasks"),

        total = et.total75PercentLikelyHours([{
            bestCaseHours: 1,
            mostLikelyCaseHours: 1.5,
            worstCaseHours: 4,
            confidencePercent: 99.9
        }, {
            bestCaseHours: 8,
            mostLikelyCaseHours: 10,
            worstCaseHours: 12,
            confidencePercent: 66
        }, {
            bestCaseHours: 2,
            mostLikelyCaseHours: 3,
            worstCaseHours: 4,
            confidencePercent: 95
        }]);

In the browser you have to include the
[lib/calc.js](https://github.com/ikr/estimate-tasks/blob/master/lib/calc.js) script. Then:

    var et = window["estimate-tasks"];

# Testing

Test-driven with [Mocha](http://mochajs.org/). Under Node, say:

    ~/estimate-tasks(master)$ npm test
