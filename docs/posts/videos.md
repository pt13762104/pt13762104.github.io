---
date: 2026-09-06
categories:
    - Fun
title: 4K HDR videos, but within a small margin
---

I've been taking a look at sample 4K HDR videos, and [this one](https://mega.nz/file/2ew0DApT#UOEt2mrKYOHDak2TlgZSk6nQmJPckHntZvWHdfjVARY) caught my attention.

It's that I wanted to test out encoders' efficiency, and whether I can fit the video into file sizes limit of social media platforms (e.g. Discord.)

## Part 1. Encoders' efficiency

TLDR:

![](/enc_eff.png)

Here's an example showcasing SVT-AV1's advantage on small bitrates (about 2.4 Mbps):

<video controls>
<source src="/out_crf42_preset3_noaudio.mp4" type="video/mp4">
</video>

NVENC, on the other hand:

<video controls>
<source src="/out_cq36.mp4" type="video/mp4">
</video>

Also, here's NVENC at maximum quantization:

<video controls>
<source src="/out_cq51.mp4" type="video/mp4">
</video>


## Part 2. Fitting video files

After a long fight with the encoders, I've chosen the below configuration for the file size limits:

* 20 MiB (Discord): SVT-AV1, crf=43, preset=3, audio being AAC at 128 kb/s (*42 slightly exceeds the limit.*)

* 100 MiB (GitHub): SVT-AV1-HDR, crf=32, preset=3, tune=0 (VQ), audio being AAC at 256 kb/s (*31 slightly exceeds the limit.*)

20 MiB limit:

<video controls>
<source src="/out_crf43_preset3.mp4" type="video/mp4">
</video>

100 MiB limit:
<video controls>
<source src="/out_crf32_preset3.mp4" type="video/mp4">
</video>

Also this is what happens if you send the video through mobile Discord:

<video controls>
<source src="/discord_video.mp4" type="video/mp4">
</video>

(*Note: Discord retains the color space information, while the video's thumbnail will not reflect the correct color, the player has a 50% chance of being able to do it.*)



