---
date: 2024-06-17
categories:
  - My site
---
# Hàng cây
## 1. Subtask 1
Ta lặp qua từng phần tử trong mảng, chọn ra những phần tử thỏa mãn rồi tính giá trị. Đpt: $O(nq)$.

## 2. Subtask 2
Ta sẽ xử lý trước các truy vấn $[l,r]$ với l,r thuộc mảng.
Ta đặt các mảng next, prev, p để xử lý thao tác xóa phần tử (tăng $l$ lên -> xóa dần phần tử đi).
Ta lặp r, sau đó chèn các phần tử nằm trong khoảng $[0,r]$ vào mảng p. Mảng next sẽ lưu $i+1$ với phần tử thứ $i$, và mảng prev sẽ lưu phần tử thứ $i-1$.
Khi chúng ta muốn xóa phần tử thứ $i$ trong mảng p thì ta sẽ cập nhật next và prev để bỏ qua phần tử đấy và cập nhật chênh lệch.
Khi chúng ta xử lý được hết $[l,r]$ trong mảng thì chỉ cần cnp để tìm đáp án.

<details>
<summary>Code:</summary>
```c++ linenums="1"
void update(int *p, int *prev, int *next, int i, long long &sum, int size)
{
    if (next[i] != size && prev[i] != -1)
    {
        sum += abs(p[next[i]] - p[prev[i]]);
    }
    if (next[i] != size)
    {
        sum -= abs(p[next[i]] - p[i]);
        prev[next[i]] = prev[i];
    }
    if (prev[i] != -1)
    {
        sum -= abs(p[prev[i]] - p[i]);
        next[prev[i]] = next[i];
    }
}
void sub2(vector<int> &p, vector<query *> &queries)
{
    int distinct = 0;
    bool cnt[401];
    fill(cnt, cnt + 401, 0);
    for (int i = 0; i < n; i++)
    {
        if (!cnt[p[i]])
        {
            cnt[p[i]] = 1;
            distinct++;
        }
    }
    long long mp[401][401];
    vector<int> p2 = p;
    sort(p.begin(), p.end());
    unique(p.begin(), p.end());
    while (p.size() != distinct)
        p.pop_back();
    int p3[n], prev[n], next[n];
    for (int i = 0; i < p.size(); i++)
    {
        vector<int> idx[401];
        int counter = 0;
        long long sum = 0;
        for (int j = 0; j < n; j++)
        {
            if (p2[j] <= p[i])
            {
                p3[counter] = p2[j];
                prev[counter] = counter - 1;
                next[counter] = counter + 1;
                idx[p2[j]].push_back(counter);
                if (counter >= 1)
                    sum += abs(p3[counter - 1] - p2[j]);
                counter++;
            }
        }
        mp[p[0]][p[i]] = sum;
        for (int j = 1; j <= i; j++)
        {
            for (auto &k : idx[p[j - 1]])
            {
                update(p3, prev, next, k, sum, counter);
            }
            mp[p[j]][p[i]] = sum;
        }
    }
    for (int i = 0; i < q; i++)
    {
        int l = queries[i]->l, r = queries[i]->r;
        int ll = lower_bound(p.begin(), p.end(), l) - p.begin();
        int rr = upper_bound(p.begin(), p.end(), r) - p.begin() - 1;
        if (ll > rr)
        {
            cout << 0 << '\n';
            continue;
        }
        cout << mp[p[ll]][p[rr]] << '\n';
    }
}
```
</details>
Đpt: $O((n+h)*h+q\log(h))$.

## 3. Subtask 3
Với subtask 3, ta chỉ cần phải chèn và xóa các phần tử 1 cách trâu. Do giới hạn của subtask này khiến cho chỉ có $O(n)$ phần tử bị chèn thêm / xóa đi.
Ta vẫn sử dụng chặt nhị phân để tìm kết quả (chuyển $[l,r]$ thành $[l',r']$ gần nhất mà $l',r'$ thuộc mảng).

<details>
<summary>Code:</summary>
```c++ linenums="1"
void add(map<int, int> &s, int i, int x, long long &sum)
{
    auto it = s.lower_bound(i), it2 = it;
    if (it != s.begin())
        it2--;
    if (it != s.end() && it != s.begin())
    {
        sum -= abs((*it).second - (*it2).second);
    }
    if (it != s.end())
    {
        sum += abs((*it).second - x);
    }
    if (it != s.begin())
    {
        sum += abs((*it2).second - x);
    }
    s[i] = x;
}
void rmv(map<int, int> &s, int i, long long &sum)
{
    auto it = s.lower_bound(i), it2 = it, it3 = it;
    if (it != s.begin())
        it3--;
    it2++;
    if (it2 != s.end() && it != s.begin())
    {
        sum += abs((*it2).second - (*it3).second);
    }
    if (it2 != s.end())
    {
        sum -= abs((*it2).second - (*it).second);
    }
    if (it != s.begin())
    {
        sum -= abs((*it3).second - (*it).second);
    }
    s.erase(it);
}
void sub3(vector<int> &p, vector<query *> &queries)
{
    map<int, vector<int>> idx;
    for (auto &i : p)
        idx[i].push_back(&i - &p.front());
    long long sum = 0;
    map<int, int> s;
    sort(p.begin(), p.end());
    unique(p.begin(), p.end());
    while (p.size() != idx.size())
        p.pop_back();
    int oldl = queries.front()->l, oldr = queries.front()->r, oldll, oldrr;
    oldll = lower_bound(p.begin(), p.end(), oldl) - p.begin();
    oldrr = upper_bound(p.begin(), p.end(), oldr) - p.begin() - 1;
    for (int i = oldll; i <= oldrr; i++)
    {
        for (auto &k : idx[p[i]])
        {
            add(s, k, p[i], sum);
        }
    }
    cout << sum << '\n';
    for (int i = 1; i < q; i++)
    {
        int l = queries[i]->l, r = queries[i]->r;
        int ll = lower_bound(p.begin(), p.end(), l) - p.begin();
        int rr = upper_bound(p.begin(), p.end(), r) - p.begin() - 1;
        while (ll > oldll)
        {
            for (auto &k : idx[p[oldll]])
            {
                rmv(s, k, sum);
            }
            oldll++;
        }
        while (rr > oldrr)
        {
            oldrr++;
            for (auto &k : idx[p[oldrr]])
            {
                add(s, k, p[oldrr], sum);
            }
        }
        if (ll > rr)
        {
            cout << 0 << '\n';
            continue;
        }
        cout << sum << '\n';
    }
}
```
</details>
Đpt: $O((n+q)\log(n))$.
## 4. Subtask 4
Ta cắt mảng ra thành các phần, mỗi phần có kích thước $BLOCK$.
Sử dụng thuật toán gần giống với sub2 trên mỗi phần tuy nhiên ta sẽ lưu vị trí của $l',r'$ thay vì lưu $l',r'$, ta sẽ lấy được kết quả cho mỗi phần.
Ta sử dụng RMQ để tìm phần tử gần nhất với 2 đầu mút nằm trong khoảng $[l,r]$.
(Vì việc gộp các phần lại cần phải có 2 phần tử đầu mút để tìm chênh lệch đúng).
Ta sẽ sắp xếp lại các truy vấn theo $l$ rồi theo $r$ để tính vị trí của $l',r'$ nhanh hơn (mất $O(q*n/BLOCK)$ thay vì $O(q*n/BLOCK*\log(BLOCK))$).
Việc xử lý như subtask 2 sẽ mất $O(BLOCK*n)$.
<details>
<summary>Code:</summary>
```c++ linenums="1"
struct result
{
    long long query;
    int first, last;
};
struct block
{
    // blk^2
    long long mp[BLOCK][BLOCK];
    // blk*log(blk)
    int rmq[lgblk][BLOCK], rmq2[lgblk][BLOCK];
    // blk
    vector<int> p, p2;
    result query(int l, int r, int ll, int rr)
    {
        if (ll > rr)
            return {0, -1, -1};
        int lg = _lg[rr - ll + 1];
        return {mp[ll][rr], p2[min(rmq[lg][ll], rmq[lg][rr - (1 << lg) + 1])],
                p2[max(rmq2[lg][ll], rmq2[lg][rr - (1 << lg) + 1])]};
    }
};
void process(vector<int> p, block &blk)
{
    map<int, vector<int>> idx;
    for (int i = 0; i < BLOCK; i++)
    {
        idx[p[i]].push_back(i);
    }
    blk.p2 = p;
    sort(p.begin(), p.end());
    unique(p.begin(), p.end());
    vector<int> orders(BLOCK);
    while (p.size() != idx.size())
        p.pop_back();
    for (int i = 0; i < BLOCK; i++)
        orders[i] = lower_bound(p.begin(), p.end(), blk.p2[i]) - p.begin();
    blk.p = p;
    for (int i = 0; i < p.size(); i++)
    {
        blk.rmq[0][i] = idx[p[i]].front();
        blk.rmq2[0][i] = idx[p[i]].back();
    }
    for (int i = 1; i <= lgblk; i++)
    {
        for (int j = 0; j + (1 << i) <= p.size(); j++)
        {
            blk.rmq[i][j] =
                min(blk.rmq[i - 1][j], blk.rmq[i - 1][j + (1 << (i - 1))]);
            blk.rmq2[i][j] =
                max(blk.rmq2[i - 1][j], blk.rmq2[i - 1][j + (1 << (i - 1))]);
        }
    }
    int p3[n], prev[n], next[n];
    for (int j = 0; j < p.size(); j++)
    {

        vector<int> idx[BLOCK];
        int counter = 0;
        long long sum = 0;
        for (int i = 0; i < BLOCK; i++)
        {
            if (orders[i] <= j)
            {
                p3[counter] = blk.p2[i];
                prev[counter] = counter - 1;
                next[counter] = counter + 1;
                idx[orders[i]].push_back(counter);
                if (counter >= 1)
                    sum += abs(p3[counter - 1] - blk.p2[i]);
                counter++;
            }
        }
        blk.mp[0][j] = sum;
        for (int i = 1; i <= j; i++)
        {
            for (auto k : idx[i - 1])
            {
                update(p3, prev, next, k, sum, counter);
            }
            blk.mp[i][j] = sum;
        }
    }
}
void sub4(vector<int> &p, vector<query *> &queries)
{
    block blks[n / BLOCK];
    for (int i = 0; i < n / BLOCK; i++)
    {
        process(vector<int>(p.begin() + i * BLOCK, p.begin() + (i + 1) * BLOCK),
                blks[i]);
    }
    vector<int> ll(n / BLOCK), rr(n / BLOCK);
    sort(queries.begin(), queries.end(),
         [](query *a, query *b)
         { return a->l < b->l; });
    for (auto &i : queries)
    {
        for (int j = 0; j < n / BLOCK; j++)
        {
            int psz = blks[j].p.size();
            while (ll[j] < psz && blks[j].p[ll[j]] < i->l)
                ll[j]++;
        }
        i->ll = ll;
    }
    sort(queries.begin(), queries.end(),
         [](query *a, query *b)
         { return a->r < b->r; });
    vector<long long> qres(q);
    for (auto &i : queries)
    {
        long long res = 0;
        vector<int> acc;
        for (int j = 0; j < n / BLOCK; j++)
        {
            int psz = blks[j].p.size();
            while (rr[j] < psz && blks[j].p[rr[j]] <= i->r)
                rr[j]++;
            result x = blks[j].query(i->l, i->r, i->ll[j], rr[j] - 1);
            res += x.query;
            if (x.first != -1)
            {
                acc.push_back(x.first);
                acc.push_back(x.last);
            }
        }
        for (int i = 1; i + 1 < acc.size(); i += 2)
            res += abs(acc[i] - acc[i + 1]);
        qres[i->id] = res;
    }
    for (auto &i : qres)
        cout << i << '\n';
}
```
</details>
Chọn $BLOCK=\sqrt{n}$ ta có đpt $O((n+q)\sqrt{n})$.