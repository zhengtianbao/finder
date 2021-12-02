package main

import (
	"fmt"
	"os"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/app"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/layout"
	"fyne.io/fyne/v2/widget"
)

var topWindow fyne.Window

func main() {
	os.Setenv("FYNE_FONT", "fonts/Alibaba-PuHuiTi-Medium.ttf")
	a := app.New()
	w := a.NewWindow("Finder")
	topWindow = w

	input := widget.NewMultiLineEntry()
	output := widget.NewMultiLineEntry()

	search_button := widget.NewButton("查找", func() { fmt.Println("button tapped!") })
	clear_button := widget.NewButton("清空", func() { fmt.Println("button tapped!") })
	refer_button := widget.NewButton("引用关系", func() { fmt.Println("button tapped!") })
	setting_button := widget.NewButton("显示设置", func() { fmt.Println("button tapped!") })
	help_button := widget.NewButton("帮助", func() { fmt.Println("button tapped!") })
	info := widget.NewLabel("最短截词长度")
	length := widget.NewSelectEntry([]string{"2", "3", "4", "5", "6", "7", "8"})
	length.PlaceHolder = "4"

	tailline := container.NewHBox(search_button, clear_button, refer_button, setting_button, help_button, layout.NewSpacer(), info, length)
	diff := container.New(layout.NewGridLayout(1), input, output)
	finder := container.NewBorder(nil, tailline, nil, nil, diff)
	w.SetContent(finder)
	w.Resize(fyne.NewSize(640, 460))
	w.ShowAndRun()
}
