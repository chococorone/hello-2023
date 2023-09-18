#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

int main()
{
    string s;
    cin >> s;
    reverse(s.begin(), s.end());

    string list[4] = {"dream", "dreamer", "erase", "eraser"};
    /*
    for (int i = 0; i < 4; i++)
    {
        reverse(list[i].begin(), list[i].end());
    }
    */
    for (string &str : list)
    {
        reverse(str.begin(), str.end());
    }
    for (string str : list)
    {
        cout << str << endl;
    }

    int cnt = 0;
    string buffer = "";
    string result = "";

    for (auto &&c : s)
    {
        buffer += c;

        for (string i : list)
        {
            if (buffer == i)
            {
                result += buffer;
                buffer = "";
            }
        }
    }
    cout << (result == s ? "YES" : "NO") << endl;

    return 0;
}