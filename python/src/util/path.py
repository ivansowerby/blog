from typing import Union, Callable
from util.string import find_all, find_by, __until__, count_all
from typing import Union

DOT_SELECTOR = '.'
PATH_SELECTORS = ('/', '\\')

upward_dot_padding = lambda s, start: __until__(s, DOT_SELECTOR, (start, len(s), +1))

PATH = Union[tuple[str], list[str]]

def __safe_path_delimiter_find__(path: str, by: Callable = str.find) -> list:
    l = find_by(path, PATH_SELECTORS, by)
    return min(l) if len(l) > 0 else -1

def format_filepath(path: str, format: str) -> str:
    if DOT_SELECTOR in path:
        d = 0
        i = find_by(path, PATH_SELECTORS, by = str.rfind)
        i = max(i) + 1 if i != -1 else 0
        filename, path = path[i:], path[:i]
        l = find_all(filename, DOT_SELECTOR, contiguous = False)
        for i in l:
            i -= d
            j = upward_dot_padding(filename, i)
            filename = filename[:i] + filename[j-1:]
            d += (j - i - 1)
        i = l[0] + 1
        if i < len(filename):
            format = filename[i:]
            filename = filename[:i-1]
        path = join_path(path, filename)
    if DOT_SELECTOR in format:
        j = upward_dot_padding(format, 0)
        format = format[j:]
    return f'{path}.{format}'

def backtrack_path(path: str) -> str:
    return path[:max(find_by(path, PATH_SELECTORS, by = str.rfind))]

def nth_backtrack_path(n: int, path: str) -> str:
    while n > 0:
        path = backtrack_path(path)
        n -= 1
        return nth_backtrack_path(n, path)
    else:
        return path

upward_path_padding = lambda s: __until__(s, PATH_SELECTORS, (0, len(s), +1))
downward_path_padding = lambda s: __until__(s, PATH_SELECTORS, (len(s) - 1, 0, -1))

def join_path(*paths: PATH, delimiter: str = '/') -> str:
    return delimiter.join([path[upward_path_padding(path):downward_path_padding(path)+1] for path in paths])

def split_path(path: str, delimiters: PATH = PATH_SELECTORS) -> tuple[str]:
    paths = []
    while True:
        l = find_by(path, delimiters, by = str.find)
        flag = len(l) == 0
        i = min(l) if not flag else len(path)
        paths.append(path[:i])
        path = path[i+1:]
        if flag: break
    return tuple(paths)

def enforce_root_path(filepath: PATH, root_path: PATH) -> tuple|None:
  if type(filepath) != list: filepath = list(filepath)
  for i, root_segment in enumerate(root_path):
    if len(filepath) <= i or filepath[i] != root_segment:
        filepath.insert(i, root_segment)
  return filepath

def extract_filename(filepath: str) -> str:
    return filepath[max(find_by(filepath, PATH_SELECTORS, by = str.rfind)):]

def trace_filepath(from_path: str, to_path: str) -> str:
    while True:
        i, j = map(__safe_path_delimiter_find__, (from_path, to_path))
        if (i == -1 or j == -1) or from_path[:i] != to_path[:j]: break
        from_path = from_path[i+1:]
        to_path = to_path[j+1:]
    return join_path(*['..'] * count_all(from_path, PATH_SELECTORS), to_path)
