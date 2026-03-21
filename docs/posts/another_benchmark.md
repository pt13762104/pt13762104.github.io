---
date: 2026-02-08
categories:
    - Fun
title: Does the Dimensity 9000 and 10750H hold well in the benchmarks? (again)
---

I've taken a look at https://www.phoronix.com/review/16-armlinux-sep2018/, and decided to test the Dimensity 9000 on these benchmarks.

The result: https://openbenchmarking.org/result/2602284-YOSH-260227012. Most of the benchmarks the Dimensity wins by a landslide excluding pgbench (it got a lead but the Socionext Developerbox is brute forcing it), or Perl Interpreter (I blame proot for this).

The X2-core was completely destroying anything else in 2018 (obviously), and the total run-time is so fast nothing even comes close (thanks to the X2-core again.). On [the desktop leaderboard](https://www.phoronix.com/review/22-systems-linux418), the 9000 Plus pales in comparison. I have not tested that out but it should rank at the bottom.

I've also tested a few benchmarks out of my 10750H and it got about 4960X-5960X performance: https://openbenchmarking.org/result/2602287-YOSH-YOSHI9552.

A summary: https://docs.google.com/spreadsheets/d/1MC92otAyJLy6xrpeCMe5lM960kpfgVo6Gvjeg3wx6aE/edit?usp=sharing. 

