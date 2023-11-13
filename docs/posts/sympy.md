---
date: 2023-11-13
categories:
    - Fun
title: SymPy
---
I have created a SymPy package that runs on ARM64, based on Alpine (note: **requires Termux,proot/chroot OR any rooted computer that is ARM64 (e.g. RPi,etc.)**) just for fun (to see how small it can be).

[Download link](../sympy.cmax.tgz)

- Usage:
     - Extract this file to your home directory (e.g by `tar -xzf ../sympy.cmax.tgz /home/...`).
     - Run `chroot /home/.../alpine /bin/bash -l`
     - You should see a Python shell with SymPy loaded. (Note: exiting the shell will stop the chroot. To stop this (e.g. for customization,etc..) remove the `exit 0` line in the `.../alpine/etc/profile` file.)
