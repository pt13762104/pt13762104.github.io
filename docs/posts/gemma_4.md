---
date: 2026-06-06
categories:
    - Fun
title: Taking a look at Gemma 4 E2B (QAT)
---

A continuation of the 3N E2B benchmarks, now with faster hardware and models.

LiteRT-LM model: https://huggingface.co/litert-community/gemma-4-E2B-it-litert-lm/blob/main/gemma-4-E2B-it.litertlm

llama.cpp Q4_0 model: https://huggingface.co/google/gemma-4-E2B-it-qat-q4_0-gguf/resolve/main/gemma-4-E2B_q4_0-it.gguf

We'll denote the hardware as follows:
| ID      | Info                                                  |
|---------|-------------------------------------------------------|
| CPU 1   | Dimensity 9000+ (A710 = 1.8 GHz, X2 = 2.55 GHz)       |
| CPU 1.1 | Dimensity 9000+ (max freq)                            |
| CPU 2   | i7-10750H (2.6 GHz)                                   |
| CPU 2.1 | i7-10750H (max freq, ~3.4 GHz)                                  |
| GPU 1   | Mali-G710 MP10 (max freq)                             |
| GPU 2   | GTX 1660 Ti (max freq)                                |
| GPU 2.1 | GTX 1660 Ti (1.455 GHz)                               |

TPS is taken as an average of 5 runs.

Configuration:

LiteRT-LM: `enable-speculative-decoding = false`

llama.cpp: `ub = 1024, threads=n_cores/2`

For CPU 1, llama.cpp is configured as follows: `-DGGML_NATIVE=off -DGGML_CPU_ARM_ARCH=native+dotprod+i8mm+nosve`

For GPU 2, llama.cpp is https://github.com/pt13762104/llama.cpp/commit/c5914bbd918022518bb5c0645bcdb24e3bc404f2 with `GGML_CUDA_NO_TURING_MMA` enabled.

Benchmarks:

## LiteRT-LM


| Benchmark | CPU 1   | CPU 1.1 |CPU 2|CPU 2.1|
|-----------|---------|---------|-|-|
| pp1024    | 151.98  | 184.57 |153.96|211.37|
| tg256 @ d1024     | 15.13  | 16.07   |17.23|20.45|

Comment: Power efficiency of the CPU is poor and scaling is sub-linear. TG is inherently memory bottlenecked.

| Benchmark | GPU 1  | GPU 2   | GPU 2.1 |
|-----------|--------|---------|---------|
| pp1024    | 874.90 | 4877.41 | 4411.52 |
| tg256 @ d1024    | 19.16  | 98.96   | 79.00   |

Comment: Clearly the GTX 1660 Ti is ALU bottlenecked in the decode phase.


## llama.cpp Q4_0


| Benchmark      |CPU 1|CPU 1.1| CPU 2   | CPU 2.1 |
|--------------|-|-|---------|---------|
| pp1024        |81.03|99.55 | 71.26 | 84.24 |
| tg256         |14.99|17.20 | 17.82  | 20.48  |
| pp1024 @ d4096|42.93|53.23 | 54.26 | 64.25 |
| tg256 @ d4096 |12.43|14.06 | 14.88 | 17.29   |

Comment: Slightly better scaling than LiteRT-LM, but objectively worse performance.

| Benchmark      | GPU 2   | GPU 2.1 |
|----------------|---------|---------|
| pp1024         | 2165.55 | 1860.03 |
| tg256          | 118.57  | 102.95  |
| pp1024 @ d4096 | 1496.00 | 1311.85 |
| tg256 @ d4096  | 112.58  | 99.38   |

Comment: Better decode scaling, but falls short of LiteRT-LM in prompt processing.

Conclusion: LiteRT-LM is the first viable option for phone inference. If you want to burn your hand while enjoying (much) slower inference, llama.cpp (on the phone) is probably for you. 

It should be noted that the LiteRT-LM model is optimized for **phone inference***, and should not be considered a replacement to the llama.cpp Q4_0 model.

*Note that this is a 2-bit and not a 4-bit model. Accuracy might be evaluated on another time, e.g. on a RTX 3080 when I have time to do so.