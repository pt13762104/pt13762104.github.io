---
date: 2025-07-14
categories:
    - Fun
title: Gemma 3N E2B benchmarks
---
Here are a few benchmarks of Gemma 3N E2B (Q4_0) on a Snapdragon 730G:

Specs: 32 bit LPDDR4X-3733 (14.9 GB/s), 2xA76 (2208MHz, downclocks to 2169MHz), 6xA55 (1804MHz)

All benchmarks are done using llama.cpp `build: 5891 (0d922676)` with mmap disabled.

Compilation options: `-DGGML_NATIVE=off -DGGML_OPENMP=off -DGGML_CPU_ARM_ARCH=armv8.2-a+fp16+dotprod`

## 1st run: One A55 core vs. one A76 core
| model                          |       size |     params | backend    | threads | mmap |            test |                  t/s |
| ------------------------------ | ---------: | ---------: | ---------- | ------: | ---: | --------------: | -------------------: |
| gemma3n E2B Q4_0               |   3.34 GiB |     4.46 B | CPU        |       1 |    0 |           pp512 |          3.21 ± 0.00 |
| gemma3n E2B Q4_0               |   3.34 GiB |     4.46 B | CPU        |       1 |    0 |           tg128 |          1.05 ± 0.00 |
