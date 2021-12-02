package parser

import (
	"encoding/json"
	"fmt"
	"sort"
	"strings"
)

type KeyWord struct {
	InheritWords []string
	Words        []string
}

func (k KeyWord) Contains(s string) bool {
	for _, v := range k.InheritWords {
		if v == s {
			return true
		}
	}
	for _, v := range k.Words {
		if v == s {
			return true
		}
	}
	return false
}

type TreeNode struct {
	Key            KeyWord
	CurrentLineNum int
	PreLineNum     int
	NextLines      []*TreeNode
}

func (t *TreeNode) CheckRef(lineNumber int, key string) bool {
	if t == nil {
		return false
	}
	if t.CurrentLineNum == lineNumber && t.Key.Contains(key) {
		return true
	}
	if t.NextLines != nil {
		for _, node := range t.NextLines {
			if node.CheckRef(lineNumber, key) {
				return true
			}
		}
	}
	return false
}

type Line struct {
	CurrentLineNum int
	RequireLineNum int
	Content        string
}

func (l Line) getKeyWords() []string {
	words := strings.Split(l.Content, " ")
	return words
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
		key, err := SimpleKeywordParser(l.Content)
		if err != nil {
			fmt.Println("Error parser line")
			return nil
		}
		n := &TreeNode{
			Key:            key,
			CurrentLineNum: l.CurrentLineNum,
			PreLineNum:     l.RequireLineNum,
		}
		if n.PreLineNum == 0 {
			root = n
		} else {
			n.Key.InheritWords = MergeSet(indexer[n.PreLineNum].Key.InheritWords, indexer[n.PreLineNum].Key.Words)
			indexer[n.PreLineNum].NextLines = append(indexer[n.PreLineNum].NextLines, n)
		}
		indexer[n.CurrentLineNum] = n
	}
	return root
}

func SimpleKeywordParser(s string) (KeyWord, error) {
	var k KeyWord
	words := strings.Split(s, " ")
	k.Words = words
	return k, nil
}

func MergeSet(s1 []string, s2 []string) []string {
	slice := make([]string, len(s1))
	copy(slice, s1)
	m := make(map[string]bool)
	for _, v := range s1 {
		m[v] = true
	}
	for _, v := range s2 {
		if !m[v] {
			slice = append(slice, v)
		}
	}
	return slice
}

/*
func main() {
	lines := Lines{
		{1, 0, "a b c d"},
		{2, 1, "a"},
		{3, 1, "b"},
		{4, 3, "b e"},
		{5, 4, "b f"},
		{6, 5, "e"},
		{7, 1, "c"},
		{8, 1, "d g"},
		{9, 8, "g"},
		{10, 8, "g"},
	}
	if !lines.HasRoot() {
		fmt.Println("Error input")
		return
	}
	sort.Sort(lines)
	tree := Construct(lines)
	jsonRes, _ := json.Marshal(tree)
	fmt.Println(string(jsonRes))

	for _, l := range lines {
		fmt.Println(l)
		for _, k := range l.getKeyWords() {
			fmt.Println(k)
			if tree.CheckRef(l.CurrentLineNum, k) == false {
				fmt.Println("Can not found reference of key")
			} else {
				fmt.Printf("%s at line %d is ok \n ", k, l.CurrentLineNum)
			}
		}
	}
}
*/
