from typing import Optional
from util.path import join_path, PATH_SELECTORS, DOT_SELECTOR
from util.string import split_by
from util.html import wrap

def giphy_translator(flag: str, url: str) -> Optional[str]:
    by = lambda s, selector: s.find(selector, max(s.find(DOT_SELECTOR), 0))
    split_url = split_by(url, PATH_SELECTORS, by)
    (host, paths) = (split_url[0], split_url[1:])
    last_path_segment = paths[-1]
    split_segment = split_by(last_path_segment, '-', by = str.rfind)
    (alt, _id) = (None, split_segment[-1])
    if len(split_segment) == 2: alt = split_segment[0]
    embed_url = join_path(host, 'embed', _id)
    iframe_element = wrap('iframe', '', attributes = {"id": _id, "src": embed_url, "alt": alt})
    hash = flag
    div_element = wrap('div', iframe_element, attributes = {"class": hash})
    return div_element