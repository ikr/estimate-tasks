# About

WEAS stands for "Write Estimates And Stuff", and autoimates something I do quite a bit: estimating a
set of user stories, and preparing a printable grid of story cards, to cut out and stick to the
wall, to track the progress (see _Scrum_).

It attempts to do the right thing, when summing up estimations, treating each individual estimate as
a continuous random variable (see _Math_), and applying a formula from Steve McConnel's book
"Software Estimation: Demystifying the Black Art". Doing the math right though requires providing a
range for an individual estimate instead of a single number: you'll be asked for the best case, the
most likely case, and the worst case hours. By the way, the probability of a task taking X hours to
finish is exactly zero (see _Math_ again ;).

# Installation

TBD

# Testing

Test-driven with [Mocha](http://visionmedia.github.com/mocha/)

    ~/weas$ npm test
