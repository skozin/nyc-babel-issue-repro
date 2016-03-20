Repro case for an issue with incorrect highlighting in coverage HTML
report when using [nyc] + [Babel] + [AVA]. Code is extracted from the
[cochan] lib.

To reproduce the issue, run `npm install` followed by `npm run cov`,
and then inspect HTML report located in `converage/index.html`. The
report is also uploaded [to this GH pages site][gh-pages].

To see the issue, look at the `_takeFromWaitingPublisher()` function,
which looks like this:

![image](https://cloud.githubusercontent.com/assets/1699593/13906228/6f55a302-eee2-11e5-8069-df3ef42d27c5.png)

Annotations on the left suggest that it has been executed multiple times,
and that's indeed the case as the test code is crafted to ensure this.
However, it is highlighted as not being covered.

The `_take()` function also has similar problem, although its code is
highlighted in yellow, which means "branch not covered". However, the
highlighted code has clearly been executed multuple times.

Also, the highlighting sometimes starts and ends at positions that
make no sense, e.g. between "t" and "h" letters in `this` keyword.

And perhaps the most critical issue: overall coverage numbers for
branches and functions look incorrect, much less than expected.

[nyc]: https://github.com/bcoe/nyc
[AVA]: https://github.com/sindresorhus/ava
[cochan]: https://github.com/skozin/cochan
[Babel]: http://babeljs.io
[gh-pages]: http://skozin.github.io/nyc-babel-issue-repro/index.js.html
