// 重复的序号
export const duplicateNumber = function (context) {
  const { Syntax, RuleError, report, getSource } = context;
  return {
    [Syntax.Document](node) {
      const text = context.getSource(node);
      let lines = text.split('\n');
      let dict = new Map();
      let regex = /^[1-9][0-9]*(?=\.|、|．)/;
      let number = 0;
      let position = 0;
      for (let i = 0; i < lines.length; i++) {
        let match = lines[i].trim().match(regex);
        if (match) {
          number = parseInt(match[0]);
          let inline_position = lines[i].indexOf(number.toString());
          let intext_position = position + inline_position;
          if (dict.has(number)) {
            report(
              node,
              new RuleError('存在重复的序号：' + number.toString(), {
                index: intext_position,
              })
            );
          } else {
            dict.set(number, {
              content: lines[i] + '\n',
              position: intext_position,
            });
          }
        } else {
          if (dict.get(number)) {
            dict.set(number, {
              content: dict.get(number).content + lines[i] + '\n',
              position: dict.get(number).position,
            });
          } else {
            // 首行标题
            dict.set(number, {
              content: lines[i] + '\n',
              position: 0,
            });
          }
        }
        position += lines[i].length + 1; // 将\n的长度加回去
      }
    },
  };
};

// 序号递增
export const incrementalNumber = function (context) {
  const { Syntax, RuleError, report, getSource } = context;
  return {
    [Syntax.Document](node) {
      const text = context.getSource(node);
      let lines = text.split('\n');
      let regex = /^[1-9][0-9]*(?=\.|、|．)/;
      let number = 0;
      let position = 0;
      for (let i = 0; i < lines.length; i++) {
        let match = lines[i].trim().match(regex);
        if (match) {
          let found_number = parseInt(match[0]);
          let inline_position = lines[i].indexOf(found_number.toString());
          let intext_position = position + inline_position;
          if (found_number - number != 1) {
            if (number == 0) {
              report(
                node,
                new RuleError(
                  '首序号应从1开始，而不是：' + found_number.toString(),
                  {
                    index: intext_position,
                  }
                )
              );
            } else {
              report(
                node,
                new RuleError('不连续的序号：' + found_number.toString(), {
                  index: intext_position,
                })
              );
            }
          }
          number = found_number;
        }
        position += lines[i].length + 1; // 将\n的长度加回去
      }
    },
  };
};

// 段落内包含多余的空格
export const extraSpace = function (context) {
  const { Syntax, RuleError, report, getSource } = context;
  return {
    [Syntax.Document](node) {
      const text = context.getSource(node);
      let dict = getTextDict(text);

      dict.forEach((v, k) => {
        if (k.toString() != '0') {
          // 非首行开头不能存在空格
          if (v.content.startsWith(' ')) {
            report(
              node,
              new RuleError('行首存在多余的空格', {
                index: v.position,
              })
            );
          }
        }
        let c = v.content;
        let c_without_number = c.substring(c.indexOf(k.toString()) + 1);
        let c_content = '';
        if (
          c_without_number.startsWith('、') ||
          c_without_number.startsWith('．')
        ) {
          c_content = c_without_number.substring(1);
          if (c_content.includes(' ')) {
            report(
              node,
              new RuleError('存在多余的空格', {
                index:
                  v.position + c_content.indexOf(' ') + k.toString().length + 1,
              })
            );
          }
        } else if (c_without_number.startsWith('.')) {
          let shift = 1; // 符号"."占用的长度
          if (!c_without_number.startsWith('. ')) {
            c_content = c_without_number.substring(2);
            shift = 2; // 加上空格的长度
          } else {
            c_content = c_without_number.substring(1);
          }
          if (c_content.includes(' ')) {
            report(
              node,
              new RuleError('存在多余的空格', {
                index:
                  v.position +
                  c_content.indexOf(' ') +
                  k.toString().length +
                  shift,
              })
            );
          }
        }
      });
    },
  };
};

// 段落内包含多个句号或者没有以句号结尾
export const repeatPeriod = function (context) {
  const { Syntax, RuleError, report, getSource } = context;
  return {
    [Syntax.Document](node) {
      const text = context.getSource(node);
      let dict = getTextDict(text);

      dict.forEach((v, k) => {
        if (k.toString() == '0') {
          // 首行不检查
          return;
        }
        let c = v.content.replace(/\n*$/, '');
        if (!c.endsWith('。')) {
          report(
            node,
            new RuleError('本条没有以句号结尾', {
              index: v.position,
            })
          );
        }
        let r = new RegExp('。', 'g');
        let matches = v.content.match(r);
        let count = matches ? matches.length : 0;
        if (count > 1) {
          report(
            node,
            new RuleError('本条包含有多个句号', {
              index: v.position,
            })
          );
        }
      });
    },
  };
};

// 连续重复的词或者标点符号
export const repeatWords = function (context) {
  const { Syntax, RuleError, report, getSource } = context;
  return {
    [Syntax.Document](node) {
      const text = context.getSource(node);
      let dict = getTextDict(text);

      dict.forEach((v, k) => {
        let c = v.content.replace(/\n*$/, '').replace(/\s/g, '');
        let punctuation = `!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~，。；：“”！？{}【】（）’‘．`;
        for (let i = 0; i < c.length - 1; i++) {
          if (punctuation.includes(c[i]) && punctuation.includes(c[i + 1])) {
            if (c[i] == c[i + 1]) {
              report(
                node,
                new RuleError('本条存在重复的标点符号：' + c[i], {
                  index: v.position,
                })
              );
            } else if ('。；：“！？{【（(‘'.includes(c[i])) {
              report(
                node,
                new RuleError(
                  '本条存在连续的标点符号' + c[i] + '与' + c[i + 1],
                  {
                    index: v.position,
                  }
                )
              );
            }
          }
        }
        // Regular expression with all punctuation characters
        // The u flag is added to enable Unicode mode for proper matching of full-width punctuation characters.
        let delimiterRegex = /[\p{P}]+/u;
        let array = c.split(delimiterRegex);
        for (let index = 0; index < array.length; index++) {
          const element = array[index];
          let elementLength = element.length;
          for (let i = 0; i < elementLength; i++) {
            for (let j = 1; j < Math.floor(elementLength / 2) + 1; j++) {
              if (i + 2 * j <= elementLength) {
                if (
                  element.slice(i, i + j) == element.slice(i + j, i + 2 * j) &&
                  isNaN(element.slice(i, i + j))
                ) {
                  // 连续的数字可能是标号，如11
                  report(
                    node,
                    new RuleError(
                      '本条存在连续的词：' + element.slice(i, i + j),
                      {
                        index: v.position,
                      }
                    )
                  );
                }
              }
            }
          }
        }
      });
    },
  };
};

export const legalSerialNumber = function (context) {
  function isSubset(setA, setB) {
    return [...setA].every(item => setB.has(item));
  }
  const { Syntax, RuleError, report, getSource } = context;
  return {
    [Syntax.Document](node) {
      const text = context.getSource(node);
      let dict = getTextDict(text);

      let appeared_number = [];
      dict.forEach((v, k) => {
        let c = v.content.replace(/\n*$/, '').replace(/\s/g, '');
        let ref_number = [];
        let reg_with_to = new RegExp('[0-9]+[-至][0-9]+', 'g');
        let reg_with_or = new RegExp('[0-9]+或[0-9]+', 'g');
        if (c.match(reg_with_to)) {
          if (!c.includes('任一项')) {
            report(
              node,
              new RuleError('本条权利要求范围应加任一项限定词', {
                index: v.position,
              })
            );
          } else {
            let r = new RegExp('权利要求(.*?)[中]?任一项', 'g');
            let match = c.match(r);
            if (match) {
              for (let i = 0; i < match.length; i++) {
                let range = match[i].match(/\d+[-至]\d+/)[0];
                var start;
                var end;
                if (range.includes('至')) {
                  [start, end] = range.split('至');
                } else {
                  [start, end] = range.split('-');
                }
                ref_number.push(parseInt(start), parseInt(end));
              }
            }
          }
        } else if (c.match(reg_with_or)) {
          let r = new RegExp('权利要求([0-9]+或[0-9]+)', 'g');
          let match = c.match(r);
          if (match) {
            for (let i = 0; i < match.length; i++) {
              let range = match[i].match(/\d+或\d+/)[0];
              let [left, right] = range.split('或');
              ref_number.push(parseInt(left), parseInt(right));
            }
          }
        } else {
          if (c.includes('任一项')) {
            report(
              node,
              new RuleError(
                '本条权利要求"任一项"引用的数字要以 "-" 或 "至" 或 "或" 连接',
                {
                  index: v.position,
                }
              )
            );
          }
          if (c.includes('权利要求')) {
            let r = new RegExp('权利要求[0-9]+', 'g');
            let match = c.match(r);
            if (match) {
              for (let i = 0; i < match.length; i++) {
                let number = match[i].match(/\d+/)[0];
                ref_number.push(parseInt(number));
              }
            }
          }
        }
        let ref_number_set = new Set(ref_number);
        let appeared_number_set = new Set(appeared_number);
        if (!isSubset(ref_number_set, appeared_number_set)) {
          report(
            node,
            new RuleError('本条权利要求引用的序号存在错误', {
              index: v.position,
            })
          );
        }
        appeared_number.push(k);
      });
    },
  };
};

var RefSearchWordWidth = 4; // 引用最小查找长度
export const setRefSearchWordWidth = function (v) {
  RefSearchWordWidth = v;
};

function findByRef(dict, ref_number, keyword, loop_max) {
  if (loop_max < 0) {
    return false;
  }
  if (!dict.has(ref_number)) {
    return false;
  }
  let ref_content = dict.get(ref_number).content;
  if (ref_content.includes(keyword)) {
    return true;
  } else {
    let pre_ref_number_list = getRefList(ref_content);
    if (pre_ref_number_list.length > 0) {
      loop_max = loop_max - 1;
      return findByRefList(dict, pre_ref_number_list, keyword, loop_max);
    } else {
      return false;
    }
  }
}

function findByRefList(dict, ref_number_list, keyword, loop_max) {
  for (let i = 0; i < ref_number_list.length; i++) {
    let ref_number = ref_number_list[i];
    if (findByRef(dict, ref_number, keyword, loop_max)) {
      return true;
    }
  }
  return false;
}

// 获取引用条目列表
function getRefList(content) {
  var match;
  var ref_number_list = []; // 引用条目列表

  let reg_with_to = new RegExp('[0-9]+[-至][0-9]+', 'g');
  let reg_with_or = new RegExp('[0-9]+或[0-9]+', 'g');

  if (content.replace(/\s/g, '').match(reg_with_to)) {
    let r_list = new RegExp('权利要求(.*?)[中]?任一项', 'g');
    match = content.replace(/\s/g, '').match(r_list);
    if (match) {
      let range = match[0].match(/\d+[-至]\d+/)[0];
      var start;
      var end;
      if (range.includes('至')) {
        [start, end] = range.split('至');
      } else {
        [start, end] = range.split('-');
      }
      for (let i = parseInt(start); i <= parseInt(end); i++) {
        ref_number_list.push(i);
      }
    }
  } else if (content.replace(/\s/g, '').match(reg_with_or)) {
    let r_list = new RegExp('权利要求([0-9]+或[0-9]+)', 'g');
    let match = content.replace(/\s/g, '').match(r_list);
    if (match) {
      let range = match[0].match(/\d+或\d+/)[0];
      let [left, right] = range.split('或');
      ref_number_list.push(parseInt(left), parseInt(right));
    }
  } else {
    let r2 = /根据权利要求[0-9]+/;
    let m = content.match(r2);
    var ref_number;
    if (m) {
      ref_number = parseInt(m[0].replace('根据权利要求', ''));
      ref_number_list.push(ref_number);
    }
  }
  return ref_number_list;
}

export const refHasBase = function (context) {
  const { Syntax, RuleError, report, getSource } = context;
  const findWidth = RefSearchWordWidth;
  return {
    [Syntax.Document](node) {
      const text = context.getSource(node);
      let dict = getTextDict(text);

      let line_independent = '';
      dict.forEach((v, k) => {
        let c = v.content;
        let r = /^\d+[\.、．]根据|^\d+\.\s根据/;
        if (!r.test(c)) {
          // 获取独权内容
          line_independent = c;
        }
        // 独权和从权判断逻辑一致
        // 1. 获取需要匹配的词
        const regex = /所述[的]?(.*?)(?=所述[的]?|，|（|。)/g;
        let matches = [];
        let match;
        while ((match = regex.exec(c)) !== null) {
          matches.push({
            content: match[0].replace(/所述[的]?/g, ''), // 完整子串 (e.g., "所述的冷媒分配器，")
            index: match.index, // 在字符串中的索引
          });
        }

        // 2. 获取本条目的引用列表
        var ref_number_list = getRefList(c);
        // 3. 判断能否找到引用基础
        for (let i = 0; i < matches.length; i++) {
          let found = false;
          let old_content = matches[i].content;
          // 如果匹配到的引用本身长度就小于findWidth 需要先判断
          if (matches[i].content.length < findWidth) {
            if (ref_number_list.length > 0) {
              // 有引用先判断是否在引用号条目中出现
              found = findByRefList(
                dict,
                ref_number_list,
                matches[i].content,
                100
              );
            }
            // 没有引用或者引用中没有匹配到那么只能判断是否在本条目之前出现过
            // 或者在上一条独权条目中出现过
            let pre_content = c.substring(0, matches[i].index);
            if (
              pre_content.includes(matches[i].content) ||
              line_independent.includes(matches[i].content)
            ) {
              found = true;
            }
            if (!found) {
              report(
                node,
                new RuleError('所述的："' + old_content + '" 找不到引用基础', {
                  index: v.position + matches[i].index,
                })
              );
            }
            continue;
          }
          // 否则逐步缩小查找长度直到等于findWidth
          while (matches[i].content.length >= findWidth && !found) {
            if (ref_number_list.length > 0) {
              // 有引用先判断是否在引用号条目中出现
              found = findByRefList(
                dict,
                ref_number_list,
                matches[i].content,
                100
              );
              if (found) {
                break;
              }
            }
            // 没有引用或者引用中没有匹配到那么只能判断是否在本条目之前出现过
            // 或者在上一条独权条目中出现过
            let pre_content = c.substring(0, matches[i].index);
            if (
              pre_content.includes(matches[i].content) ||
              line_independent.includes(matches[i].content)
            ) {
              found = true;
              break;
            }
            old_content = matches[i].content;
            matches[i].content = old_content.substring(
              0,
              matches[i].content.length - 1
            );
          }
          if (!found) {
            report(
              node,
              new RuleError('所述的："' + old_content + '" 找不到引用基础', {
                index: v.position + matches[i].index,
              })
            );
          }
        }
      });
    },
  };
};

function getTextDict(text) {
  let lines = text.split('\n');
  let dict = new Map();
  let regex = /^[1-9][0-9]*(?=\.|、|．)/;
  let number = 0;
  let position = 0;
  for (let i = 0; i < lines.length; i++) {
    let match = lines[i].trim().match(regex);
    if (match) {
      number = parseInt(match[0]);
      let inline_position = lines[i].indexOf(number.toString());
      let intext_position = position + inline_position;
      dict.set(number, {
        content: lines[i] + '\n',
        position: intext_position,
      });
    } else {
      if (dict.get(number)) {
        dict.set(number, {
          content: dict.get(number).content + lines[i] + '\n',
          position: dict.get(number).position,
        });
      } else {
        // 首行标题
        dict.set(number, {
          content: lines[i] + '\n',
          position: 0,
        });
      }
    }
    position += lines[i].length + 1; // 将\n的长度加回去
  }
  return dict;
}
