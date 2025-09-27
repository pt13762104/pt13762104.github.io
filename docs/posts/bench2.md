---
date: 2025-09-27
categories:
    - Fun
title: Qwen3 0.6B benchmarks
---
Here are a few benchmarks of Qwen3 0.6B (Q4_0) on a Dimensity 9000+:

Specs: 64 bit LPDDR5X-7500 (60.0 GB/s), 1xX2 (3350MHz), 3xA710 (3200 MHz), 4xA510 (1800MHz)

All benchmarks are done using llama.cpp `build: 6602 (72b24d96) with clang version 20.1.8 (Fedora 20.1.8-4.fc42) for aarch64-redhat-linux-gnu` with ubatch = 64. Tests on A510 are done with mmap enabled.

Compilation options: `-DCMAKE_C_COMPILER=clang -DCMAKE_CXX_COMPILER=clang++ -DGGML_OPENMP=off`

## 1st run: One A510 core vs. one A710 core vs. one X2 core
### One A510 core

| model                          |       size |     params | backend    | threads | n_ubatch |            test |                  t/s |
| ------------------------------ | ---------: | ---------: | ---------- | ------: | -------: | --------------: | -------------------: |
| qwen3 0.6B Q4_0                | 358.78 MiB |   596.05 M | CPU        |       1 |       64 |           pp512 |         14.83 ± 0.00 |
| qwen3 0.6B Q4_0                | 358.78 MiB |   596.05 M | CPU        |       1 |       64 |           tg128 |          4.34 ± 0.00 |


### One A710 core

| model                          |       size |     params | backend    | threads | n_ubatch | mmap |            test |                  t/s |
| ------------------------------ | ---------: | ---------: | ---------- | ------: | -------: | ---: | --------------: | -------------------: |
| qwen3 0.6B Q4_0                | 358.78 MiB |   596.05 M | CPU        |       1 |       64 |    0 |           pp512 |         96.77 ± 0.00 |
| qwen3 0.6B Q4_0                | 358.78 MiB |   596.05 M | CPU        |       1 |       64 |    0 |           tg128 |         27.20 ± 0.00 |


### One X2 core

| model                          |       size |     params | backend    | threads | n_ubatch | mmap |            test |                  t/s |
| ------------------------------ | ---------: | ---------: | ---------- | ------: | -------: | ---: | --------------: | -------------------: |
| qwen3 0.6B Q4_0                | 358.78 MiB |   596.05 M | CPU        |       1 |       64 |    0 |           pp512 |        143.94 ± 0.00 |
| qwen3 0.6B Q4_0                | 358.78 MiB |   596.05 M | CPU        |       1 |       64 |    0 |           tg128 |         39.32 ± 0.00 |


## 2nd run: Two A510 cores vs. two A710 cores vs. A710+X2
### Two A510 cores

| model                          |       size |     params | backend    | threads | n_ubatch |            test |                  t/s |
| ------------------------------ | ---------: | ---------: | ---------- | ------: | -------: | --------------: | -------------------: |
| qwen3 0.6B Q4_0                | 358.78 MiB |   596.05 M | CPU        |       2 |       64 |           pp512 |         25.97 ± 0.00 |
| qwen3 0.6B Q4_0                | 358.78 MiB |   596.05 M | CPU        |       2 |       64 |           tg128 |          6.92 ± 0.00 |

### Two A710 cores

| model                          |       size |     params | backend    | threads | n_ubatch | mmap |            test |                  t/s |
| ------------------------------ | ---------: | ---------: | ---------- | ------: | -------: | ---: | --------------: | -------------------: |
| qwen3 0.6B Q4_0                | 358.78 MiB |   596.05 M | CPU        |       2 |       64 |    0 |           pp512 |        184.00 ± 0.00 |
| qwen3 0.6B Q4_0                | 358.78 MiB |   596.05 M | CPU        |       2 |       64 |    0 |           tg128 |         48.63 ± 0.00 |

### A710+X2

| model                          |       size |     params | backend    | threads | n_ubatch | mmap |            test |                  t/s |
| ------------------------------ | ---------: | ---------: | ---------- | ------: | -------: | ---: | --------------: | -------------------: |
| qwen3 0.6B Q4_0                | 358.78 MiB |   596.05 M | CPU        |       2 |       64 |    0 |           pp512 |        196.54 ± 0.00 |
| qwen3 0.6B Q4_0                | 358.78 MiB |   596.05 M | CPU        |       2 |       64 |    0 |           tg128 |         52.45 ± 0.00 |


## 3rd run: 3 A510 cores vs. 3 A710 cores vs. 2xA710+X2
### 3 A510 cores

| model                          |       size |     params | backend    | threads | n_ubatch |            test |                  t/s |
| ------------------------------ | ---------: | ---------: | ---------- | ------: | -------: | --------------: | -------------------: |
| qwen3 0.6B Q4_0                | 358.78 MiB |   596.05 M | CPU        |       3 |       64 |           pp512 |         39.05 ± 0.00 |
| qwen3 0.6B Q4_0                | 358.78 MiB |   596.05 M | CPU        |       3 |       64 |           tg128 |         10.40 ± 0.00 |


### 3 A710 cores

| model                          |       size |     params | backend    | threads | n_ubatch | mmap |            test |                  t/s |
| ------------------------------ | ---------: | ---------: | ---------- | ------: | -------: | ---: | --------------: | -------------------: |
| qwen3 0.6B Q4_0                | 358.78 MiB |   596.05 M | CPU        |       3 |       64 |    0 |           pp512 |        267.38 ± 0.00 |
| qwen3 0.6B Q4_0                | 358.78 MiB |   596.05 M | CPU        |       3 |       64 |    0 |           tg128 |         64.33 ± 0.00 |


### 2xA710+X2

| model                          |       size |     params | backend    | threads | n_ubatch | mmap |            test |                  t/s |
| ------------------------------ | ---------: | ---------: | ---------- | ------: | -------: | ---: | --------------: | -------------------: |
| qwen3 0.6B Q4_0                | 358.78 MiB |   596.05 M | CPU        |       3 |       64 |    0 |           pp512 |        284.89 ± 0.00 |
| qwen3 0.6B Q4_0                | 358.78 MiB |   596.05 M | CPU        |       3 |       64 |    0 |           tg128 |         65.91 ± 0.00 |

## 4th run: 4 A510 cores vs. 3xA710+X2

### 4 A510 cores

| model                          |       size |     params | backend    | threads | n_ubatch |            test |                  t/s |
| ------------------------------ | ---------: | ---------: | ---------- | ------: | -------: | --------------: | -------------------: |
| qwen3 0.6B Q4_0                | 358.78 MiB |   596.05 M | CPU        |       4 |       64 |           pp512 |         43.76 ± 0.00 |
| qwen3 0.6B Q4_0                | 358.78 MiB |   596.05 M | CPU        |       4 |       64 |           tg128 |         10.51 ± 0.00 |

### 3xA710+X2

| model                          |       size |     params | backend    | threads | n_ubatch | mmap |            test |                  t/s |
| ------------------------------ | ---------: | ---------: | ---------- | ------: | -------: | ---: | --------------: | -------------------: |
| qwen3 0.6B Q4_0                | 358.78 MiB |   596.05 M | CPU        |       4 |       64 |    0 |           pp512 |        359.16 ± 0.00 |
| qwen3 0.6B Q4_0                | 358.78 MiB |   596.05 M | CPU        |       4 |       64 |    0 |           tg128 |         74.01 ± 0.00 |

## 5th run: All cores

| model                          |       size |     params | backend    | threads | n_ubatch | mmap |            test |                  t/s |
| ------------------------------ | ---------: | ---------: | ---------- | ------: | -------: | ---: | --------------: | -------------------: |
| qwen3 0.6B Q4_0                | 358.78 MiB |   596.05 M | CPU        |       8 |       64 |    0 |           pp512 |         86.80 ± 0.00 |
| qwen3 0.6B Q4_0                | 358.78 MiB |   596.05 M | CPU        |       8 |       64 |    0 |           tg128 |         22.08 ± 0.00 |

