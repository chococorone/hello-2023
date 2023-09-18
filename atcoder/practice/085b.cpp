#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main()
{
    int n;
    cin >> n;
    int input[n];

    for (int i = 0; i < n; i++)
    {
        cin >> input[i];
    }

    // 与えられた数値を降順にソート
    for (int i = 0; i < n; i++)
    {
        int max = input[i];
        for (int j = i + 1; j < n; j++)
        {
            if (max <= input[j])
            {
                max = input[j];
                input[j] = input[i];
                input[i] = max;
            }
        }
    }

    // 重複した要素を削除し、残った数が正答
    vector<int> v;
    for (int i : input)
    {
        if (v.empty())
        {
            v.push_back(i);
            continue;
        }
        if (v[v.size() - 1] != i)
            v.push_back(i);
    }

    cout << v.size() << endl;

    return 0;
}