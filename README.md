Repro case for an issue with incorrect highlighting in coverage HTML
report when using [nyc] + [babel] + [ava]. Code extracted from the
[cochan] lib.

To reproduce the issue, run `npm install` followed by `npm run cov`,
and then inspect HTML report located in `converage/index.html`. This
file is also intentionally put under the source control to save your
time if you just want to take a quick look at the issue, so you
can just clone the repo and open in the browser it right away.

To see the issue, look at the `_takeFromWaitingPublisher()` function,
which looks like this:

![image](https://cloud.githubusercontent.com/assets/1699593/13906228/6f55a302-eee2-11e5-8069-df3ef42d27c5.png)

Annotations on the left suggest that it has ran multiple times, and
that's indeed the case as the test code is crafted to ensure this.
However, it is highlighted as not being covered.

The `_take()` function also has similar problem, although its code is
highlighted in yellow, which means "branch not covered". However, the
highlighted code has clearly been executed multuple times.

Also, the highlighting sometimes starts and ends at positions that
make no sense, e.g. between "t" and "h" letters in `this` keyword.

[nyc]: /bcoe/nyc
[ava]: /sindresorhus/ava
[cochan]: /skozin/cochan
[babel]: http://babeljs.io
