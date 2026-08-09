---
date: 2026-08-09
categories:
    - SPEC
title: SPEC CPU adventures
---

## Part 1. Trying SPEC for the first time

For a long time, SPEC has been a well-known (in some circles) benchmark. I keep hearing it from time to time, but I don't know what it does or how to use it yet. Until one day.....

> *SPEC drops from the sky, including both 2006 and 2017 versions. If you know, you know.*

Now that I've gotten SPEC, the adventure begins...

First installation, I immediately got an error related to Perl tests. With some patching and manifest editing, that seems to "fix" it. But then, I'll regret it later...

> *"The correct way to handle SPEC is to NOT test it..."*

It was a tiring experience to do the config files, compiler flags, etc. 

But then, after *many* failed tries due to not having enough time, errors, etc, I got my first few results:

* Cortex-X2: 7.15
* Cortex-A710: 5.58
* Cortex-A510: 1.15

But this is just the start...

## Part 2. Do I really need different compilers?

After trying out GCC and abusing it, I take a look at Clang. It was not great, to be honest.

In both SPEC CPU 2006 and 2017, Clang performed consistently worse. (In most benchmarks, that is.) 

There was hope in seeing Clang improves 525 on x86, but that hope was short-lived. It survived from the moment I tested 525 to the first full run.

On the topic of 462, the one benchmark that either tests:

* For legitimate compilers, your memory bandwidth. Very simple: About 110 for every 25GB/s of memory bandwidth.
* For vendored compilers, the ability to abuse the vector units and pushing the score sky-high (it's so bad to the point it doesn't even makes sense)

ICC literally demonstrates perfect scaling and >9X the performance of GCC/Clang on 462. It regressed significantly over GCC in some other benchmarks, but the 20+X performance gain of ICC in 462 literally renders the result useless.

This is probably one of the reasons why 462 was never to be seen again.

> *Conclusion: For SPEC (06/17), prefer GCC over Clang. ICC could be another reasonable option if you prefer breaking the rules.*

## Part 3. Does `malloc()` matter?

The answer: Yes, *somewhat*.

I heard that mimalloc and jemalloc were commonly used in SPEC results, and there's a reason for why:

*523.xalancbmk.* (this is the most prominent example)

Using either of the `malloc` implementations literally gives you double the score. I'm not joking.

There's about a 10% boost in using these, which is significant (at least, it makes I feel better about my scores, while *I'll still be slower than an iPad.*)


## Part 4. Compiler flags

In my SPEC adventure, I tested multiple flags collections.

Some observations:

* O3 is much preferred over O2 (+ autovec). Ofast doesn't seem to have much implications; can fail perlbench's signed zero test on ARM (matters only if you do reportable runs.)

* flto boosts your scores by a significant amount; `-march=native` is smaller.

* `-mcpu` doesn't really matter, a 1-2% of difference at most (still noticeable, just not that much.)

* `-funroll-loops` has unnoticeable effect.

Generally the optimal flags are `-O3 (or Ofast) -flto -march=native -mcpu=[CPU name] (ARM only) -ljemalloc`.

For an equal comparison, `-march=native` might be keep at the minimum subset; or omitted entirely. On SPEC26, this flag has an even stronger effect (706/772); 525 really benefits from vectorization.

## Part 5. The good, the bad and the ugly about installing and using SPEC

The good:

*It (the tests) works on X86! I think I should stop here now!*

Just kidding, no. It will only get much worse later on...

The bad:

First, the failed Perl tests. I tried the same patching method on a different ARM device, couldn't get it to work. As with everything that I don't like, the choice is just to disable the tests and move on.

Now, for the compatibility flags.

For SPEC06/17 on x86, you only really need `-Wno-error=template-body` for GCC 15+, which is fine.

But the situation isn't as smooth-sailing on ARM.

The ugly:

Building SPEC (yes, SPEC itself) on ARM takes a lot of time (SPEC06 only, why would I spend so much time on an obsolete benchmark? I don't know.).

Even worse, most of the time is spent on configuring and testing, which means more time wasted on doing things repeatedly. Forgotting to enable GNU extensions was a mistake that costed me many rebuilds, and even then the Perl tests would still fail. 

It's not the only part that fails, by the way. That part was commented out.

Running SPEC06 on ARM wasn't an exactly satisfying experience either. Five compliation errors means FIVE different compatibility flags, *just for an obsolete benchmark.*

Figuring out how to run SPEC on Clang was another painful experience. There's a flag, `-fdelayed-template-parsing`, that fixes 523's error. I can't find any documentation about this flag.

## Part 6. SPEC could literally ran on anything!

*Except for a single benchmark that kept crashing, probably due to ISA differences.*

As the name "adventure" suggests, I had spent a lot of my time running SPEC on any device that I have on hand. https://pt13762104.github.io/benchview/ is my collection of (best) SPEC results.

(Thanks to Titanic (Chips And Cheese) for the 5950X result.)

I've wasted a measurable amount of time dealing with 429 on the A35, but to no avail, it was still crashing.

As reflected in the results, 520 and 541, and (502, 505 to a lesser extent) were having significant memory-related bottlenecks. 520 is the worst offender of them all being mainly memory latency bottlenecked.

On my phone, SPEC results were quite inconsistent. I don't know why, but it seems like the phone is actually doing it at 2.55GHz at times (possibly throttling?) instead of 3.35GHz. 

At least I got a 7.68 (the result reflected above is a best-of-2, which is 7.71) and two 7.62s with it, which isn't bad, but the poor 520 result agains shows how high-latency LPDDR can hurt performance.

There's a 17% SMT gain on Skylake, which can be seen here: https://www.youtube.com/watch?v=zx6ZFyRa-Hs. 

Also, I've tried to run some MT benchmarks, but the results were significantly worse than ICC (~20% based on comparable SPEC results), with 505 on ICC literally doubling the rate.

## Part 7. Was there anything more to explore?

Given that SPEC26 is out, and I'm eager to try it out, it's almost as if I've fully beaten the dead horse that is SPEC17.

But there're still a few interesting things left:

* Figuring how to get a 10 on my 7840U. (This wasn't interesting, it was rather tiring and repetitive, and may even be counted as gambling.)

* Running rate-N benchmarks (N=2..MAX) to see SMT performance gains and thread scaling.

* Doing more runs with stats, which I only knew how to do it recently (thanks https://jia.je).


## Conclusion

SPEC CPU is an interesting benchmark, to say the least. Workloads demonstrates diversity and exercises different parts of the system, including memory-heavy workloads. 

Compared to Geekbench, SPEC (06/17) demonstrates less ISA gains and underrates small cores (like A76, which Skylake has a 30% PPC advantage, while on Geekbench 7 that gap reduces to only 15%.)

To end the article, here's a logged SPEC17 result, the first one with the `perf` metrics:

![](https://pt13762104.github.io/spec.jpg)

> *To be continued...*
