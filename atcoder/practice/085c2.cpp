#include <iostream>
#include <random>
#include <ctime>
#define MANSATSU 10000
#define GOSEN 5000
#define SEN 1000
using namespace std;

string getresult(int n, int Y)
{
    for (int i = n; i >= 0; i--)
    {
        for (int j = n - i; j >= 0; j--)
        {
            int k = n - i - j;
            if (10000 * i + 5000 * j + 1000 * k == Y)
            {
                char buffer[100];
                snprintf(buffer, sizeof(buffer), "%d %d %d", i, j, k);
                return string(buffer);
            }
        }
    }
    return "-1 -1 -1";
}

// x + y + zがちょうどNにならないといけない。私の案だと、<=Nで満たすときもカウントしてしまっているためNG
string getjkamiResult(int n, int Y)
{
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
        // cout << x << " " << y << " " << z << endl;
        char buffer[100];
        snprintf(buffer, sizeof(buffer), "%d %d %d", x, y, z);
        return string(buffer);
    }
    else
    {
        return "-1 -1 -1";
    }
}

int random(int low, int high)
{
    return low + rand() % (high - low + 1);
}

int main()
{
    int n, Y;
    // cin >> n >> Y;
    srand(time(NULL));

    int cnt = 0;
    while (1)
    {
        cnt++;
        int case_n = random(0, 2000);
        int case_Y = random(1000, 2 * 10000000);
        case_Y = case_Y / 1000 * 1000;

        printf("testcase %d: %d %d\n", cnt, case_n, case_Y);

        string correct = getresult(case_n, case_Y);
        string challenge = getjkamiResult(case_n, case_Y);
        cout << correct << endl;
        cout << challenge << endl;

        if (correct == "-1 -1 -1")
        {
            if (challenge != "-1 -1 -1")
            {
                break;
            }
        }
    }

    return 0;
}