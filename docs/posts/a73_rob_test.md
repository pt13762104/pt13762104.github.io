---
date: 2026-09-16
categories:
    - Fun
title: A73 Reordering Capacity?
---
TLDR: it's at least 86. The removal of `nop`s from the "Instruction Control" block (possibly a coalesced retire queue + PRRT?) makes it impossible to measure more, at least up to my knowledge right now.

https://chipsandcheese.com/p/cortex-a73s-not-so-infinite-reordering-capacity

Here we've seen a "practical" limitation handled by the PRRT and store buffer. But... is that *enough*?

After testing a *lot* of things that didn't really go anywhere (because as I've said, A73 discard `nop`s), I've finally settled on modifying the A73 ROB Test described above.

Here's the configuration that reached the highest inflection point of 85: `mov x11, 0` repeated *47* times, and an arbitary FP instruction (eg. `eor v0.8b, v0.8b, v0.8b` or `fadd d0, d0, d0`) repeated *38* times. (Yes, it's that weird.)

The "move to zero" or "rename" queue seems to have a size of 48. Any more integer instructions/branch/etc inserted after these two only worsens the inflection point. I also tried to insert integer instructions in between, still nothing.

So, for all practical purposes, A73 can reorder at most 86 instructions. The ROB capacity is unexplored, still. Maybe another day someone has a solution?