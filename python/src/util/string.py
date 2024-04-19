from typing import Union, Callable

def find_all(s: str, selectors: Union[str, tuple[str], list[str]], by: Callable = str.find, contiguous: bool = True) -> tuple[int]:
    if type(selectors) == str: selectors = [selectors]
    l = []
    for selector in selectors:
        i = -1
        for _ in range(s.count(selector)):
            j = i
            i = by(s, selector, i + 1)
            if not contiguous and abs(i - j) == 1: continue
            l.append(i)
    return l

def find_by(s: str, selectors: Union[tuple[str], list[str]], by: Callable = str.find) -> int:
    return [i for i in map(lambda selector: by(s, selector), selectors) if i != -1]

def split_by(s: str, selectors: Union[str, tuple[str], list[str]], by: Callable = str.find) -> list:
    if type(selectors) == str: selectors = [selectors]
    l = []
    while True:
        li = find_by(s, selectors, by)
        flag = len(li) == 0
        i = min(li) if not flag else len(s)
        l.append(s[:i])
        if flag: break
        s = s[i+1:]
    return l

def __until__(s: str, selectors: Union[tuple[str], list[str], str], _range: Union[tuple[int], list[int]]) -> int:
    (start, stop, increment) = _range
    if type(selectors) == str: selectors = [selectors]
    i = start
    while i != stop and s[i] in selectors:
        i += increment
    return i

def count_all(s: str, selectors: Union[tuple[str], list[str]]) -> int:
    return sum([s.count(selector) for selector in selectors])

def find_inescapable(s: str, p: str, i: int) -> int:
    while True:
        i = s.find(p, i)
        if i == -1: return -1
        if i > 0 and s[i-1] == '\\':
            i += 1
            continue
        return i

def extract_enclosed(s: str, prefix: str, suffix: str) -> list[tuple]:
    l = []
    i = -1
    while True:
        i = find_inescapable(s, prefix, i + 1)
        if i == -1: break
        i += 1
        j = find_inescapable(s, suffix, i)
        if j == -1: break
        l.append(s[i:j])
    return l
