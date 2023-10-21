def __format_tag__(tag: str) -> str:
    if tag[0] != '<': tag = '<' + tag
    if tag[-1] != '>': tag = tag + '>'
    return tag

def wrap(tag: str, content: str = '', attributes: dict = {}) -> str:
    if len(tag) == 0: return content
    tag = __format_tag__(tag)
    attributes = [f'{key}="{value}"' for key, value in attributes.items() if value != None]
    opening_tag = __format_tag__(' '.join((tag[1:-1], *attributes)))
    closing_tag = tag[0] + '/' + tag[1:]
    return opening_tag + content + closing_tag