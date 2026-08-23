---
date: 2026-08-23
categories:
    - Fun
title: Overclocking a meaningless chip
---
## Part 1. Overclocking a locked chip

It might sound a bit illogical at first, "locked" and "overclocking" doesn't usually come together. But... have you heard of "partial overclocking"?

??? spoiler "Spoiler"
    Does this reminds you of Tiger Lake H?

You may or may not have prepared for the chip I'm working with. It's not TGL-H, but something way worse...

It's the RK3326. The chip that blew up in popularity due to the R36 series of devices. 

All experiments are done on a RG351M (which is another RK3326 device), with a "I don't care" personality.

Back in 2023, I was discovering "CPU overclocking" options on many distros, which usually pushed the clocks from 1.3 to 1.5 GHz.

At that time, I couldn't verify that claim, because I didn't really know how to do it.

One day, I decided to say "1.5 GHz is NOT enough", and decided to push the clocks to the max.

I was on Rocknix at that time, and with the `mhz` tool, I quickly added extra operating points and push the clocks higher and higher.

But that's when I realized... the chip is locked.

The chip is locked at 1.6 GHz (67x multiplier at 24 MHz base clock). Rockchip probably was not planning anyone to push the clocks that high.

An operating point, or an "OPP" is described by voltage and frequency points.

Here's the stable voltages for my RK3326:

| Frequency | Voltage |
|----------------|---------|
| 1.3 GHz      | 1.35V   |
| 1.4 GHz      | 1.35V (max rated)   |
| 1.5 GHz      | 1.40V (crashes while overheating)    |
| 1.6 GHz      | 1.50V (max, crashes while overheating)   |

There's no point in doing more than 1.50V because the VRM doesn't support it; and the CPU is locked.

There's a need of a "safe operating point" e.g. 1.3 GHz, or using "turbo mode" to restrict the frequency being boost ones to avoid overheating.

But... Rocknix's mainline kernel wasn't up to my expectations. It had all of the good things I wanted, but except for one thing...


## Part 2. Overclocking on the stock kernel

At first, I tried the classical "OPP" method of adding operating points. The short explanation is: the frequency is still oscilating randomly. Basically, the CPU lies to you about what frequency it actually ran.


??? info "Longer explanation"
    The CPU actually has bins, being L0, L1, L2 and L3 (L0 being the lowest and L3 highest). The "rockchip-avs" option controls the voltage and frequencies for the CPU based on the bins and temperatures.

    From https://cateee.net/lkddb/web-lkddb/POWER_AVS.html: "AVS is a power management technique which finely controls the operating voltage of a device in order to optimize (i.e. reduce) its power consumption. At a given operating point the voltage is adapted depending on static factors (chip manufacturing process) and dynamic factors (temperature depending performance)."

    For example, here are the voltages based on the bins at 1.5 GHz:
        ```dts
                opp-1512000000 {
                        opp-hz = <0x00 0x5a1f4a00>;
                        opp-microvolt = <0x149970 0x149970 0x149970>;
                        opp-microvolt-L0 = <0x149970 0x149970 0x149970>;
                        opp-microvolt-L1 = <0x149970 0x149970 0x149970>;
                        opp-microvolt-L2 = <0x13d620 0x13d620 0x149970>;
                        opp-microvolt-L3 = <0x1312d0 0x1312d0 0x149970>;
                        clock-latency-ns = <0x9c40>;
                };
        ```
        And, here are Rockchip-specific frequency options:
        ```dts
                rockchip,temp-hysteresis = <0x1388>;
                rockchip,low-temp = <0x00>;
                rockchip,low-temp-min-volt = <0xf4240>;
                rockchip,low-temp-adjust-volt = <0x00 0x5e8 0xc350>;
                clocks = <0x02 0x01>;
                rockchip,avs-scale = <0x04>;
                rockchip,max-volt = <0x149970>;
                rockchip,evb-irdrop = <0x61a8>;
                nvmem-cells = <0x07 0x08>;
                nvmem-cell-names = "cpu_leakage", "performance";
                rockchip,bin-scaling-sel = <0x00 0x0d 0x01 0x0f 0x02 0x12 0x03 0x19>;
                rockchip,pvtm-voltage-sel = <0x00 0xc350 0x00 0xc351 0xd2f0 0x01 0xd2f1 0xea60 0x02 0xea61 0x1869f 0x03>;
                rockchip,pvtm-freq = <0x639c0>;
                rockchip,pvtm-volt = <0xf4240>;
                rockchip,pvtm-ch = <0x00 0x00>;
                rockchip,pvtm-sample-time = <0x3e8>;
                rockchip,pvtm-number = <0x0a>;
                rockchip,pvtm-error = <0x3e8>;
                rockchip,pvtm-ref-temp = <0x28>;
                rockchip,pvtm-temp-prop = <0xffffffc8 0xffffffc8>;
                rockchip,thermal-zone = "soc-thermal";
                rockchip,avs = <0x01>;
        ```    

One day, I saw an "overclocking kernel" for the R36S, being https://github.com/teacupx/linux-r36s. After inspection, I didn't see any "special" patching or behavior other than setting the OPPs, so I quickly tried to delete these `rockchip` options and see if it now recognizes my set frequency points correctly.

It finally did. I was happy to see the RK3326 finally performing at its best, even if it meant burning itself (1.50V basically does that); or its "peak" is worse than a Skylake core sleeping.

This took me months to realize these `rockchip` options are interfering with my frequency points, thus causing it to not following what I set.

## Part 3. The Memory Controller

As I've said, why did I choose the stock kernel over the (definitely more usable) mainline kernel? The answer is explained below...

The mainline kernel doesn't include DMC support. That is, it doesn't support setting memory frequencies and do frequency scaling. The memory is stuck at the RK3326 default of 333MHz (DDR3L-666), which contributes to poor performance.

The memory is 1 GB of DDR3L-1600, which can be overclocked to DDR3L-2160/2112 based on my observations. (2160 is partially unstable)

Here's the memory latency and bandwidth table for the RK3326 based on the RAM frequency:


| Frequency | Latency at 32MB test size (approximate) | Bandwidth (4C Memory bandwidth test) |
|----------------|---------|-|
| 333 MHz      | 260ns   |2 GB/s|
| 786 MHz (stock)      | 140ns   |5 GB/s|
| 924 MHz      | 130ns  |6 GB/s|
| 1056 MHz      | 120ns   |7.2 GB/s|

All tests are done with 1.15V IMC voltage (max) and validated for stability through Stockfish and memtester.

Behavior of the memory (controller) on extreme frequencies: 

| Frequency | Voltage |
|----------------|---------|
|  1080 MHz       | Unstable   |
|  1104 MHz       | Very unstable, has a 20% chance of booting up   |
|  1128 MHz       | Incapable of getting to EmulationStation, kernel panic  |
|  1152+ MHz       | Does not boot  |


## Part 4. Does it make sense to run Stockfish on a game console?

The answer is "It's like FurMark. While it may not find all problems, it'll find the obvious, the not-so-obvious and burn your device to near-death".

Stockfish multi-threaded was the heaviest test I can apply to the RK3326. If sysbench was "100% synthetic", Stockfish is 100% synthetic mixed with a death note to the NEON units. 

Temperatures were up to 20 degrees higher than that of sysbench, and can go near 100 degrees C before the chip crashes.

It also helps to find unstable overclocks that'll crash in a few hours, because that's reduced to only a few seconds of launching Stockfish and see if it crashes or not.

While a quad core A510 cluster on 4nm barely heats up, a quad core Cortex-A35 on 28nm can radiate heat so much it's like launching my Cortex-X2 at full load.

## Part 5. Conclusion

While the RK3326 might be a locked chip, I actually had fun inspecting its corners and pushing it to its absolute limit. It's almost as if the chip was actually unlocked anyways. 

The only thing I found lacking about the chip is the inability to push the IMC voltage further, and if you care about performance, **ITSELF**.

Sadly, even in 2026, I don't have another unlocked chip to test out overclocking. It probably wouldn't be that much anyways.
