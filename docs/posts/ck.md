---
date: 2024-08-24
categories:
  - CP
---
# CHUNGKHOAN
Recently I revisited this problem which was intended to solve in $O(n)$: https://oj.vnoi.info/problem/cn1_chungkhoan (the problem asks to find the largest subarray which has $max-min<=T$). But I can only think of a $O(n*log(n))$ solution, so I coded the fastest $O(n*log(n))$ solution yet using vectorized binary search and linear sparse table:

??? info "Code"

    ```c++ linenums="1"
    #include <algorithm>
    #include <functional>
    #include <iostream>
    using namespace std;
    typedef int vec __attribute__((vector_size(32)));
    int lsb(int x)
    {
        return x & -x;
    }
    int smin[4000005], arr[4000005], smax[4000005], mmin[4000005], mmax[4000005];
    int b = 16;
    int n, t;
    int smmin(int r, int size = b)
    {
        int dist_from_r = __lg(mmin[r] & ((1 << size) - 1));
        return r - dist_from_r;
    }
    int smmax(int r, int size = b)
    {
        int dist_from_r = __lg(mmax[r] & ((1 << size) - 1));
        return r - dist_from_r;
    }
    int pmax(int x, int y)
    {
        return arr[x] > arr[y] ? x : y;
    }
    int pmin(int x, int y)
    {
        return arr[x] < arr[y] ? x : y;
    }
    // RMQ constant time insanity that I found online
    void build()
    {
        int curr_mask = 0;
        for (int i = 0; i < n; i++)
        {
            curr_mask = (curr_mask << 1) & ((1LL << b) - 1);
            while (curr_mask > 0 && pmin(i, i - __lg(lsb(curr_mask))) == i)
            {
                curr_mask ^= lsb(curr_mask);
            }
            curr_mask |= 1;
            mmin[i] = curr_mask;
        }
        curr_mask = 0;
        for (int i = 0; i < n; i++)
        {
            curr_mask = (curr_mask << 1) & ((1LL << b) - 1);
            while (curr_mask > 0 && pmax(i, i - __lg(lsb(curr_mask))) == i)
            {
                curr_mask ^= lsb(curr_mask);
            }
            curr_mask |= 1;
            mmax[i] = curr_mask;
        }
        for (int i = 0; i < (n >> 4); i++)
        {
            smin[i] = smmin(b * i + b - 1);
            smax[i] = smmax(b * i + b - 1);
        }
        for (int j = 1; (1 << j) <= (n >> 4); j++)
            for (int i = 0; i + (1 << j) <= (n >> 4); i++)
            {
                smin[(n >> 4) * j + i] = pmin(smin[(n >> 4) * (j - 1) + i], smin[(n >> 4) * (j - 1) + i + (1 << (j - 1))]);
                smax[(n >> 4) * j + i] = pmax(smax[(n >> 4) * (j - 1) + i], smax[(n >> 4) * (j - 1) + i + (1 << (j - 1))]);
            }
    }
    vec query8_0(vec &s, vec &t)
    {
        vec res;
        for (int i = 0; i < 8; i++)
        {
            int l = s[i], r = t[i];
            if (r - l + 1 <= b)
            {
                res[i] = arr[smmax(r, r - l + 1)] - arr[smmin(r, r - l + 1)];
                continue;
            }
            int ansmax = pmax(smmax(l + b - 1), smmax(r)), ansmin = pmin(smmin(l + b - 1), smmin(r));
            int x = (l >> 4) + 1, y = (r >> 4) - 1;
            if (x <= y)
            {
                int j = __lg(y - x + 1);
                ansmax = pmax(ansmax, pmax(smax[(n >> 4) * j + x], smax[(n >> 4) * j + y - (1 << j) + 1]));
                ansmin = pmin(ansmin, pmin(smin[(n >> 4) * j + x], smin[(n >> 4) * j + y - (1 << j) + 1]));
            }
            res[i] = arr[ansmax] - arr[ansmin];
        }
        return res;
    }
    bool cmp_l(vec &a, vec &b)
    {
        vec c = a <= b;
        return c[0] + c[1] + c[2] + c[3] + c[4] + c[5] + c[6] + c[7];
    }
    int maxvec(vec a)
    {
        return max(max(max(a[0], a[1]), max(a[2], a[3])), max(max(a[4], a[5]), max(a[6], a[7])));
    }
    vec nm;
    vec bs_min(vec &l)
    {
        // SIMD binary search
        vec s = l, r = nm;
        while (cmp_l(l, r))
        {
            vec mid = (l + r) >> 1, q4 = query8_0(s, mid);
            l = l - (mid - l + 1) * (q4 <= t);
            r = r - (mid - r - 1) * (q4 > t);
        }
        return r - s + 1;
    }
    const int BUF_SZ = 33550336;
    inline namespace Input
    {
    char buf[BUF_SZ];
    int pos;
    int len;
    char next_char()
    {
        if (pos == len)
        {
            pos = 0;
            len = (int)fread(buf, 1, BUF_SZ, stdin);
            if (!len)
            {
                return EOF;
            }
        }
        return buf[pos++];
    }
    int read_int()
    {
        int x;
        char ch;
        int sgn = 1;
        while (!isdigit(ch = next_char()))
        {
            if (ch == '-')
            {
                sgn *= -1;
            }
        }
        x = ch - '0';
        while (isdigit(ch = next_char()))
        {
            x = x * 10 + (ch - '0');
        }
        return x * sgn;
    }
    }; // namespace Input
    inline namespace Output
    {
    char buf[BUF_SZ];
    int pos;
    void flush_out()
    {
        fwrite(buf, 1, pos, stdout);
        pos = 0;
    }
    void write_char(char c)
    {
        if (pos == BUF_SZ)
        {
            flush_out();
        }
        buf[pos++] = c;
    }
    void write_int(int x)
    {
        static char num_buf[100];
        if (x < 0)
        {
            write_char('-');
            x *= -1;
        }
        int len = 0;
        for (; x >= 10; x /= 10)
        {
            num_buf[len++] = (char)('0' + (x % 10));
        }
        write_char((char)('0' + x));
        while (len)
        {
            write_char(num_buf[--len]);
        }
        write_char('\n');
    } // auto-flush output when program exits
    #include <cassert>
    void init_output()
    {
        assert(atexit(flush_out) == 0);
    }
    }; // namespace Output
    signed main()
    {
        init_output();
        t = read_int();
        n = read_int();
        for (int i = 0; i < n; i++)
            arr[i] = read_int();
        build();
        int res = 0;
        nm = vec{n - 1, n - 1, n - 1, n - 1, n - 1, n - 1, n - 1, n - 1};
        vec shift{0, 1, 2, 3, 4, 5, 6, 7};
        for (int i = 0; i < n / 8; i++)
        {
            vec vi = shift + 8 * i;
            res = max(res, maxvec(bs_min(vi)));
            // Fast cut
            if (n - res < 8 * (i + 1))
                break;
        }
        if (n % 8)
        {
            int n4 = (n >> 3) << 3;
            vec c{n4, n4, n4, n4, n4, n4, n4, n4};
            for (int i = 0; i < n % 8; i++)
                c[i]++;
            res = max(res, maxvec(bs_min(c)));
        }
        write_int(res);
    }
    ```