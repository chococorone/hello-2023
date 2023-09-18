#include <iostream>
using namespace std;

int main()
{
    string a;
    cin >> a;

    int cnt = 0;
    for (auto &&i : a)
    {
        if (i == '1')
            cnt++;
    }
    cout << cnt << endl;

    return 0;
}