---
date: 2025-04-30
categories:
    - CP
title: Shortest path between 2 special nodes
---

This problem is one of our practice problems, and I have been struggling a bit to solve it. There's a "solution" on GFG: https://www.geeksforgeeks.org/find-the-shortest-distance-between-any-pair-of-two-different-good-nodes/.

The solution is plainly $O(VE)$ and basically have no relations to the actual solution.

I'll explain 2 real solutions:

Solution 1. BFS with multiple sources

Do normal BFS but you push all the sources to the queue. Create a $source_v$ array which will be the optimal source for the $v$-th node. Then, for each edge $(u,v)$, let $Result=min(Result,d[u]+d[v])$ if $source[u] \neq source[v]$.

Complexity: $O(V+E)$.

Solution 2. SPFA with multiple sources

You do normal SPFA relaxation (start from node 1, then add node 2 as a source, etc...) but update the $Result$ variable when there's a node that were NOT a source and is special. The relaxation is only performed if $d[u]+1<Result$.

Complexity: $O(VE)$ (I don't know if it can be hacked, it runs relatively fast (~2x slower than BFS)).
