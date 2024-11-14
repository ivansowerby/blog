from typing import Optional
from util.path import  PATH_SELECTORS, DOT_SELECTOR, join_path, split_path, enforce_root_path
from util.string import split_by
from util.html import wrap

ROOT_PATH = ('..', 'library')

# !$[--script](url)
def script_translator(flag: str, url: str) -> str:
    script_element = wrap('script', attributes = {'src': url})
    return script_element

# !$[--giphy](url)
def giphy_translator(flag: str, url: str) -> Optional[str]:
    by = lambda s, selector: s.find(selector, max(s.find(DOT_SELECTOR), 0))
    split_url = split_by(url, PATH_SELECTORS, by)
    (host, paths) = (split_url[0], split_url[1:])
    last_path_segment = paths[-1]
    split_segment = split_by(last_path_segment, '-', by = str.rfind)
    (alt, _id) = (None, split_segment[-1])
    if len(split_segment) == 2: alt = split_segment[0]
    embed_url = join_path(host, 'embed', _id)
    iframe_element = wrap('iframe', '', attributes = {'id': _id, 'src': embed_url, 'alt': alt})
    hash = flag
    div_element = wrap('div', iframe_element, attributes = {'class': hash})
    return div_element

# !$[--box](children)
def box_translator(flag: str, children: str) -> str:
    div_element = wrap('div', children, attributes = {'class': 'box'})
    return div_element

IMAGE_PATH = (*ROOT_PATH, 'img')
# !$[--image](filepath)
def image_translator(flag: str, filepath: str) -> str:
  filepath = split_path(filepath)
  if len(filepath) == 0 or filepath[-1] == '': return ''
  filepath = enforce_root_path(filepath, IMAGE_PATH)
  url = join_path(*filepath)
  img_element = wrap('img', attributes = {'src': url, 'class': 'image'})
  return img_element

# !$[--list](items)
def list_translator(flag: str, items: str) -> str:
    pass
