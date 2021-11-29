package main

import (
	"encoding/json"
	"fmt"
	"sort"
)

type TreeNode struct {
	Content        string
	CurrentLineNum int
	PreLineNum     int
	NextLines      []*TreeNode
}

type Line struct {
	CurrentLineNum int
	RequireLineNum int
	Content        string
}

type Lines []Line

func (l Lines) Len() int           { return len(l) }
func (l Lines) Swap(i, j int)      { l[i], l[j] = l[j], l[i] }
func (l Lines) Less(i, j int) bool { return l[i].RequireLineNum < l[j].RequireLineNum }

func (l Lines) HasRoot() bool {
	for _, line := range l {
		if line.RequireLineNum == 0 && line.CurrentLineNum == 1 {
			return true
		}
	}
	return false
}

type LineIndex map[int]*TreeNode

func Construct(lines Lines) *TreeNode {
	var root *TreeNode
	indexer := make(map[int]*TreeNode)
	for _, l := range lines {
		n := &TreeNode{
			Content:        l.Content,
			CurrentLineNum: l.CurrentLineNum,
			PreLineNum:     l.RequireLineNum,
		}
		if n.PreLineNum == 0 {
			root = n
		} else {
			indexer[n.PreLineNum].NextLines = append(indexer[n.PreLineNum].NextLines, n)
		}
		indexer[n.CurrentLineNum] = n
	}
	return root
}

func main() {
	lines := Lines{
		{1, 0, "a"},
		{2, 1, "b"},
		{3, 1, "c"},
		{4, 3, "d"},
		{5, 4, "e"},
		{6, 5, "f"},
		{7, 1, "g"},
		{8, 1, "h"},
		{9, 8, "i"},
		{10, 8, "j"},
	}
	if !lines.HasRoot() {
		fmt.Println("Error input")
		return
	}
	sort.Sort(lines)
	tree := Construct(lines)
	jsonRes, _ := json.Marshal(tree)
	fmt.Println(string(jsonRes))
}
