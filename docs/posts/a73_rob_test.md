---
date: 2026-09-16
categories:
    - Fun
title: A73 Reordering Capacity?
---
TLDR: It's probably 96.

## Part 1 (16/9/2026)
https://chipsandcheese.com/p/cortex-a73s-not-so-infinite-reordering-capacity

Here we've seen a "practical" limitation handled by the PRRT and store buffer. But... is that *enough*?

After testing a *lot* of things that didn't really go anywhere (because as I've said, A73 discard `nop`s), I've finally settled on modifying the A73 ROB Test described above.

Here's the configuration that reached the highest inflection point of 85: `mov x11, 0` repeated *47* times, and an arbitary FP instruction (eg. `eor v0.8b, v0.8b, v0.8b` or `fadd d0, d0, d0`) repeated *38* times. (Yes, it's that weird.)

The "move to zero" or "rename" queue seems to have a size of 48. Any more integer instructions/branch/etc inserted after these two only worsens the inflection point. I also tried to insert integer instructions in between, still nothing.

So, for all practical purposes, A73 can reorder at most 86 instructions. The ROB capacity is unexplored, still. Maybe another day someone has a solution?

## Part 2 (18/9/2026)

I've tried to escape the effects of the PRRT and the FP RF by interleaving blocks of renames and FP (so that the FP instructions can retire in the renaming phase).

Here's the result:

![](/plot.png)

As you can see, the inflection point is at 18. This shows that the maximum reordering capacity is probably $10 + 10 + 1 \text{ (fused branch)} + 3 + 18 \times 4$ = $96$ instructions.

Comment: A73 has a more extreme version of Golden/Lion Cove's disproportionately small speculative register file(s) compared to the ROB. In case of the A73, the maximum reordering capacity will probably never be a bottleneck in any realistic application.

As per C&C:

> ["Golden Cove’s integer register file stands out, and not in a good way. In pure integer loads, GLC may struggle to make good use of its headline grabbing 512 entry ROB because it’ll run out of integer registers before the ROB fills. However, it should not be a major issue with floating point and vector workloads, where a much smaller fraction of instructions generate integer results."](https://chipsandcheese.com/p/popping-the-hood-on-golden-cove)

> ["The (Lion Cove's) integer register file grew by less than a dozen entries and still doesn’t cover ROB capacity well."](https://chipsandcheese.com/p/lion-cove-intels-p-core-roars)
