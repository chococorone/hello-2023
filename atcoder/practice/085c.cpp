#include <iostream>
#include <string>
#include <vector>
using namespace std;

#define MANSATSU 10000
#define GOSEN 5000
#define SEN 1000

int main()
{
    int n, Y;
    cin >> n >> Y;

    int x = 0;
    int y = 0;
    int z = 0;

    int xmod = Y % MANSATSU;
    x = Y / MANSATSU;
    if (xmod != 0)
    {
        int ymod = xmod % GOSEN;
        y = xmod / GOSEN;
        if (ymod != 0)
        {
            z = ymod / SEN;
        }
    }
    if (x + y + z <= n)
    {
        cout << x << " " << y << " " << z << endl;
    }
    else
    {
        cout << "-1 -1 -1" << endl;
    }

    return 0;
}