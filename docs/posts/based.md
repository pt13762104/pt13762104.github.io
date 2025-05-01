---
date: 2025-05-01
categories:
  - Fun
title: Run Codeforces 1952J codes 20000x faster
---
I have created a [Codeforces 1952J language](https://github.com/toxicpie/based-language) to C++ transpiler, the resulting compiled code is 20000x* faster compared to the reference implementation.

??? info "Code"

    ```c++ linenums="1"
    #include <bits/stdc++.h>
    using namespace std;
    #define int long long
    #ifndef yoshi_likes_e4
    #define endl '\n'
    #endif
    #define problem ""
    #define multitest 0
    #define debug(x) cerr << #x << " = " << x << endl;
    void init()
    {
    }
    map<string, bool> var_type;
    void Add_variable(string k)
    {
        bool ok = 0;
        try
        {
            std::stoi(k);
            ok = true;
        }
        catch (const std::invalid_argument &e)
        {
        }
        catch (const std::out_of_range &e)
        {
        }
        if (!ok)
        {
            int pos = k.find('[');
            if (pos == string::npos)
                var_type[k] = 0;
            else
                var_type[string(k.begin(), k.begin() + pos)] = 1;
        }
    }
    void Yoshi()
    {
        vector<vector<string>> code;
        string s;
        while (getline(cin, s))
        {
            stringstream t(s);
            code.push_back({});
            string x;
            while (t >> x)
                code.back().push_back(x);
        }
        map<int, int> label_id;
        int lid = 0;
        for (auto &lines : code)
        {
            if (lines[0] == "simp")
            {
                int v = stoi(lines[2]) - 1;
                if (label_id.find(v) == label_id.end())
                    label_id[v] = lid++;
            }
            if (lines[0] == "vibe")
                Add_variable(lines[2]), Add_variable(lines[4]);
            if (lines[0] == "bruh")
                Add_variable(lines[1]), Add_variable(lines[5]);
            if (lines[0] == "*slaps")
                Add_variable(lines[1]), Add_variable(lines[5].substr(0, lines[5].size() - 1));
            if (lines[0] == "rip")
                Add_variable(lines[2]), Add_variable(lines[6]);
            if (lines[0] == "yoink")
                Add_variable(lines[1]);
            if (lines[0] == "yeet")
                Add_variable(lines[1]);
        }
        vector<string> var0, var1;
        for (auto &[u, v] : var_type)
            if (v)
                var1.push_back(u);
            else
                var0.push_back(u);
        cout << R""""(#include <bits/stdc++.h>
    using namespace std;
    void input(int &x)
    {
        string s;
        getline(cin, s);
        x = stoi(s);
    }
    void input(vector<int> &x)
    {
        string s;
        getline(cin, s);
        stringstream t(s);
        while (t >> s)
            x.push_back(stoi(s));
    })"""";
        cout << "\nint main(){\ncin.tie(0)->sync_with_stdio(0);\n";
        if (var0.size())
        {
            cout << "int ";
            for (auto &i : var0)
                cout << i << (&i != &var0.back() ? ", " : ";\n");
        }
        if (var1.size())
        {
            cout << "vector<int> ";
            for (auto &i : var1)
                cout << i << (&i != &var1.back() ? ", " : ";\n");
        }
        for (auto &lines : code)
        {
            if (label_id.find(&lines - &code[0]) != label_id.end())
                cout << "L" << label_id[&lines - &code[0]] << ":\n";
            if (lines[0] == "simp")
                cout << "goto L" << label_id[stoi(lines[2]) - 1] << ";\n";
            if (lines[0] == "vibe")
                cout << "if (" << lines[2] << " > " << lines[4] << ')' << "\n";
            if (lines[0] == "bruh")
                cout << lines[1] << " = " << lines[5] << ";\n";
            if (lines[0] == "*slaps")
                cout << lines[5].substr(0, lines[5].size() - 1) << " += " << lines[1] << ";\n";
            if (lines[0] == "rip")
                cout << lines[2] << " -= " << lines[6] << ";\n";
            if (lines[0] == "yoink")
                cout << "input(" << lines[1] << ");\n";
            if (lines[0] == "yeet")
                cout << "cout << " << lines[1] << " << \"\\n\";\n";
            if (lines[0] == "go")
                cout << "return 0;\n";
        }
        cout << "}" << endl;
    }
    signed main()
    {
    #ifndef yoshi_likes_e4
        ios::sync_with_stdio(0);
        cin.tie(0);
        if (fopen(problem ".inp", "r"))
        {
            freopen(problem ".inp", "r", stdin);
            freopen(problem ".out", "w", stdout);
        }
    #endif
        init();
        int t = 1;
    #if multitest
        cin >> t;
    #endif
        while (t--)
            Yoshi();
    }
    ```
*: Selection sort performance:

$n=3000$:

| Implementation | Runtime |
|----------------|---------|
| Reference      | 41.0s   |
| Compiled       | 2ms     |

$n=5000$:

| Implementation | Runtime  |
|----------------|----------|
| Reference      | 123.3s   |
| Compiled       | 6ms      |
