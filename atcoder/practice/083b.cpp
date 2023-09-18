#include <iostream>
#include <string>
using namespace std;

int main()
{
    int n, a, b;
    cin >> n >> a >> b;

    string n_str = to_string(n);

    int sum_sum = 0;
    for (int i = 1; i <= n; i++)
    {
        int sum = 0;
        for (auto &&c : to_string(i))
        {
            sum += (int)(c - '0');
        }

        if (a <= sum && sum <= b)
        {
            sum_sum += i;
        }
    }

    cout << sum_sum << endl;

    return 0;
}