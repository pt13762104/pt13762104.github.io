---
date: 2025-05-14
categories:
  - LLM
title: Qwen3 FAQ
---

There are other Qwen3 FAQs, with [this one](https://theepic.dev/kb/ollama-qwen3-faq/) made me do my FAQ. I just put random commonly asked questions here for fun.
## 1. HOW TO DISABLE THINKING 🔥🔥🔥🔥
Use `/no_think` in your prompts. Or just add it to system prompt.
## 2. What are the system requirements?
*In progress*
## 3. What can I run?
###  **FOR MOE MODELS, REMEMBER TO USE TENSOR OVERRIDES!!!**
### *Any units of information here refers to VRAM size if not explicitly stated.*
This list is from best to worst.

If you have a GPU server with $\geq 150$ GB of free VRAM: go for the 235B model! You won't be disappointed.

Else, if you have CPU platforms with fast RAM ($\geq 200$ GB/s and $\geq 96$ GB), you can try running the 235B model. NOTE: You should add GPUs ($24$ GB will work fine) then offload to them as much as possible (this will boost your speed by a huge margin).

Else, If you have a GPU gaming rig or server with $\leq 32$ GB of VRAM, or is RAM-limited ($\leq 96$ GB), the 32B model is best for you. It performs well, maybe a slight bit less than the 235B.

If you want fast inference on big GPU rigs, you can also try the 32B model.

For platforms with $12-16$ GB of VRAM, running 14B or 30BA3B is advised. You can get very high performance with 30BA3B using an ordinary computer with 16GB VRAM.

30BA3B have relatively high performance even on DDR4 RAM and VRAM-limited machines. It can reach 20t/s on an ordinary machine with a 8GB GPU and DDR5 RAM. Think of it as like a "flash" model.

30BA3B doesn't require expensive GPUs, anything $\geq 8$ GB and relatively recent is already an usable experience.

8b is also a viable option for 8GB platforms. You can choose between 30BA3B (slower) or 8b (faster, but somewhat less intelligent).

4B is a viable option for 4-6 GB platforms and ordinary DDR4/5 CPU inference. You can use this model on 6GB GPUs while keeping a bit of memory for the system.

1.7B is suitable for fast, ordinary CPU inference. You can even do it on high end phones!!!

0.6B is suitable for anything except single-channel RAM DDR $\leq 4$ devices.
## 4. What are tensor overrides?
Think of it as a way to force some tensors, not layers onto the GPU. You would to like to load everything (except the FFN*) on to the GPU. Then, load the FFN accordingly if you have enough VRAM.

*: The FFN tensors are really big, but they can be processed efficiently with MoE models. Other parts (such as shared experts, etc...) needs to be put on the GPU because they are activated every time.
