#include <iostream>
using namespace std;

int main()
{
    cout << "helloworld" << endl;

    int a;
    cin >> a;
    int b, c;
    cin >> b >> c;
    string str;
    cin >> str;

    cout << (a + b + c) << " " << str << endl;

    return 0;
}