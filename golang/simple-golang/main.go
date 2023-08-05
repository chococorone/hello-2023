package main

import (
	"fmt"
	"time"
)

func getMessage(name string) string {
	var msg = "test: " + name
	return msg
}

// 名前付きreturn関数
func getMessage2(name string) (msg string) {
	msg = "test2: " + name
	return
}

func task1(){
	time.Sleep(time.Second * 2)
	fmt.Println("task1 finished")
}
func task2(){
	fmt.Println("task2 finished")
}

func channeltask1(result chan string){
	time.Sleep(time.Second * 2)
	fmt.Println("task1 finished")

	result <- "task1 result"
}

func main(){
	a := 5

	var pa *int
	pa = &a

	fmt.Println(pa)
	fmt.Println(*pa)

	fmt.Println("----")
	fmt.Println(getMessage("jkami"))
	fmt.Println(getMessage2("jkami"))
	fmt.Println("----")
	var testfunc = func(a int, b int)(int, int){
		return a * b, a / b
	}
	fmt.Println(testfunc(9,3))

	func(msg string){
		fmt.Println(msg)
	}("JKAMI")

	fmt.Println("----")

	list := [5]int{2,3,4,5,6}
	list_b := list[4:]
	fmt.Println(list)
	fmt.Println(list_b)

	fmt.Println("----")
	s1 := make([]int, 3)
	s2 := []int{1,3,5}
	fmt.Println(s1)
	fmt.Println(s2)

	s3 := append(s2, 8,2,10)
	fmt.Println(s3)

	t := make ([]int, len(s3))
	s4 := copy(t,s3)
	fmt.Println(s4)
	fmt.Println(t)

	fmt.Println("----")
	m := map[string]int{"jkami":300, "akak":2}

	v, ok := m["jkami"]
	fmt.Println(v)
	fmt.Println(ok)
	fmt.Println("----")
	for i := 0; i<10; i++{
		if i==3{
			continue
		}else if i ==5{
			break
		}
		fmt.Println(i)
	}

	// goをつけて並行処理にする
	//go task1()
	//go task2()

	result := make(chan string)
	go channeltask1(result)
	go task2()
	fmt.Println(<-result)

	time.Sleep(time.Second * 3)
}

