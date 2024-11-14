from typing import Union
from util.path import join_path
from util.string import find_by, extract_enclosed
from os.path import isfile
from json import load
from translator.custom import *

class Translator:
    def __init__(self,
                 config: dict,
                 filepath: Union[tuple[str], list[str], str] = ('')) -> None:
        typeof = type(filepath)
        if typeof == tuple or typeof == list: filepath = join_path(*filepath)
        self.filepath = filepath
        if not isfile(self.filepath): raise FileExistsError(self.filepath)

        with open(self.filepath, 'r') as file:
            self.index = load(file)
        self.flags = self.index['flags']

        translator_settings = config['settings']
        self.selectors = translator_settings['selectors']
        if type(self.selectors) == str: self.selectors = [self.selectors]
        
        translator_output = config['output']
        self.output_format = translator_output['format']
    
    def __translate__(self, blog: str, selectors: Union[tuple[str], list[str]]) -> list[tuple]:
        i = 0
        while True:
            by = lambda s, selector: s.find(selector, i)
            l = find_by(blog, selectors, by)
            if len(l) == 0: break
            i = min(l)
            delimiter = blog.find('](', i)
            j = blog.find('\n', delimiter)
            if j == -1 or j > blog.find('\n', delimiter): continue
            token = blog[i:j]
            flag = extract_enclosed(token, '[', ']')[0]
            if not(len(flag) > 2 and flag[:2] == '--' and flag[2:] in self.flags): continue
            flag = flag[2:]
            data = extract_enclosed(token, '(', ')')[0]
            custom_method_name = self.flags[flag]
            try:
                custom_method = eval(custom_method_name)
                replacement = custom_method(flag, data)
                blog = blog[:i] + replacement + blog[j:]
            except Exception as e:
                print(e)
            i += 1
        return blog

    def translate(self, blog: str) -> str:
        return self.__translate__(blog, self.selectors)
    
    def output_filepath(self, filepath: str) -> str:
        format_delimiter = filepath.rfind('.')
        return filepath[:format_delimiter] + self.output_format
