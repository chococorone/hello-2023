#include <iostream>
using namespace std;

int main()
{
    cout << "helloworld" << endl;

    int a, b;
    cin >> a >> b;

    string ret = (a * b) % 2 == 0 ? "Even" : "Odd";

    cout << ret << endl;

    return 0;
}