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
	clear_button := widget.NewButton("清空", func() {
		fmt.Println("clear button tapped!")
		input.SetText("")
		output.SetText("")
	})
	refer_button := widget.NewButton("引用关系", func() { fmt.Println("button tapped!") })
	setting_button := widget.NewButton("显示设置", func() { fmt.Println("button tapped!") })
	// TODO: only one help_win should appeared
	help_button := widget.NewButton("帮助", func() {
		help_win := a.NewWindow("帮助")
		help_doc := container.NewMax()
		set_help_tree := func(t Helper) {

			help_doc.Objects = []fyne.CanvasObject{widget.NewLabel(t.Intro)}
			help_doc.Refresh()
		}
		split := container.NewHSplit(makeNav(set_help_tree), help_doc)
		split.Offset = 0.2
		help_win.SetContent(split)

		help_win.Resize(fyne.NewSize(540, 420))
		help_win.Show()
	})
	info := widget.NewLabel("最短截词长度")
	length := widget.NewSelectEntry([]string{"2", "3", "4", "5", "6", "7", "8"})
	length.PlaceHolder = "4"

	tailline := container.NewHBox(search_button, clear_button, refer_button, setting_button, help_button, layout.NewSpacer(), info, length)
	diff := container.New(layout.NewGridLayout(1), input, output)
	finder := container.NewBorder(nil, tailline, nil, nil, diff)
	w.SetContent(finder)
	w.Resize(fyne.NewSize(640, 460))
	w.SetMaster()
	w.ShowAndRun()
}

var HelperIndex = map[string][]string{
	"":      {"特别声明", "基本操作方法", "基本概念", "软件功能", "自定义相关", "如何避免漏查", "版本更新历史", "问题反馈"},
	"基本概念":  {"引用词语", "被引用词语", "引用路径", "敏感词语", "最短截词长度", "误查", "漏查"},
	"软件功能":  {"查找引用基础", "定位敏感词语", "判断引用关系", "核对标点符号", "判断择一引用", "核对主题名称", "查看引用关系", "词语搜索", "结果定位", "清空"},
	"自定义相关": {"搜索词背景色", "显示设置", "窗口布局"},
}

type Helper struct {
	Intro string
}

var Helpers = map[string]Helper{
	"特别声明":   {"特别声明"},
	"基本操作方法": {"基本操作方法"},
	"基本概念":   {"基本概念"},
	"软件功能":   {"软件功能"},
	"自定义相关":  {"自定义相关"},
	"如何避免漏查": {"如何避免漏查"},
	"版本更新历史": {"版本更新历史"},
	"问题反馈":   {"问题反馈"},
	"引用词语":   {"引用词语"},
	"被引用词语":  {"被引用词语"},
	"引用路径":   {"引用路径"},
	"敏感词语":   {"敏感词语"},
	"最短截词长度": {"最短截词长度"},
	"误查":     {"误查"},
	"漏查":     {"漏查"},
	"查找引用基础": {"查找引用基础"},
	"定位敏感词语": {"定位敏感词语"},
	"判断引用关系": {"判断引用关系"},
	"核对标点符号": {"核对标点符号"},
	"判断择一引用": {"判断择一引用"},
	"核对主题名称": {"核对主题名称"},
	"查看引用关系": {"查看引用关系"},
	"词语搜索":   {"词语搜索"},
	"结果定位":   {"结果定位"},
	"清空":     {"清空"},
	"搜索词背景色": {"搜索词背景色"},
	"显示设置":   {"显示设置"},
	"窗口布局":   {"窗口布局"},
}

func makeNav(setHelper func(helper Helper)) fyne.CanvasObject {

	tree := &widget.Tree{
		ChildUIDs: func(uid string) []string {
			return HelperIndex[uid]
		},
		IsBranch: func(uid string) bool {
			children, ok := HelperIndex[uid]

			return ok && len(children) > 0
		},
		CreateNode: func(branch bool) fyne.CanvasObject {
			return widget.NewLabel("Collection Widgets")
		},
		UpdateNode: func(uid string, branch bool, obj fyne.CanvasObject) {
			_, ok := Helpers[uid]
			if !ok {
				fyne.LogError("Missing helper panel: "+uid, nil)
				return
			}
			obj.(*widget.Label).SetText(uid)
		},
		OnSelected: func(uid string) {
			if t, ok := Helpers[uid]; ok {
				setHelper(t)
			}
		},
	}

	return container.NewBorder(nil, nil, nil, nil, tree)
}
