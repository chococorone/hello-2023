#include <iostream>
#include <string>
using namespace std;

int main()
{
    int n;
    cin >> n;
    int input[n];
    for (int i = 0; i < n; i++)
    {
        int j;
        cin >> j;
        input[i] = j;
        cout << input[i] << endl;
    }

    // 与えられているｎカードｎ点数を降順にソート
    // 練習がてらバブルソート書いてみる
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

    int a = 0;
    int b = 0;
    // 交互に大きい順から選択し、差分を出力
    bool isTurnA = true;
    for (int i : input)
    {
        if (isTurnA)
        {
            a += i;
        }
        else
        {
            b += i;
        }
        isTurnA = !isTurnA;
    }
    cout << a - b << endl;

    return 0;
}