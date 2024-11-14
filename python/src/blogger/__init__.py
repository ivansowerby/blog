from typing import Union, Optional
from collections import defaultdict
from util.path import format_filepath, backtrack_path, join_path, trace_filepath
from os.path import isfile, getctime, isdir
from translator import Translator
from ai import AI
from util.hash import hash
from json import load as json_load, dump as json_dump
from toml import load as toml_load

class Library:
    def __init__(self, library: Optional[dict] = None) -> None:
        self.library = []
        if type(library) == dict: self.load(library)
    
    def load(self, library: dict) -> None:
        library = defaultdict(list, library)
        self.library = library['library']

    def shelf(self, description: dict) -> None:
        self.library.append(description)

class Description:
    def __init__(self, description: Optional[dict] = None) -> None:
        self.filepath = ''
        self.title = ''
        self.author = ''
        self.blurb = ''
        self.timestamp = 0
        self.hash = ''
        if type(description) == dict: self.load(description) 
    
    def load(self, description: dict) -> None:
        for key, value in description.items():
            if key not in self.__dict__: continue
            self.__dict__[key] = value

CUSTOM_INDEX_PATH = ('translator', 'custom', 'json', 'index.json')
CONFIG_PATH = ('config', 'config.toml')

class Blogger:
    def __init__(self, filepath: Union[tuple[str], list[str], str]) -> None:
        typeof = type(filepath)
        if typeof == tuple or typeof == list: filepath = join_path(*filepath)
        self.filepath = format_filepath(filepath, format = '.md')
        if not isfile(self.filepath): raise FileExistsError(self.filepath)

        self.timestamp = getctime(self.filepath)
        with open(self.filepath, 'r') as file:
            self.blog = file.read()
        
        with open(join_path(*CONFIG_PATH), 'r') as file:
            self.config = toml_load(file)
        
        translator_config = self.config['translator']
        translator = Translator(translator_config, CUSTOM_INDEX_PATH)

        self.output_blog = translator.translate(self.blog)
        self.filepath = translator.output_filepath(self.filepath)
        
        with open(self.filepath, 'w') as file:
            file.write(self.output_blog)

        openai_config = self.config['openai']
        self.ai = AI(openai_config)
    
    def describe(self, max_attempts: int = 5) -> dict:
        if self.ai.describe_original: blog = self.blog
        else: blog = self.output_blog
        description = self.ai.describe(blog, max_attempts)
        return description
    
    def index(self, destination_path: Union[tuple[str], list[str], str], description: dict = {}, indent: int = 4) -> str:
        while not isdir(destination_path):
            destination_path = backtrack_path(destination_path)
        destination_path = join_path(destination_path, 'index.json')

        library = Library()
        if isfile(destination_path):
            with open(destination_path, 'r') as file:
                obj = json_load(file)
                library.load(obj)
        
        description = Description(description)
        description.filepath = trace_filepath(
            from_path = destination_path,
            to_path = self.filepath
        )
        description.timestamp = self.timestamp
        description.hash = hash(self.output_blog)

        library.shelf(vars(description))

        with open(destination_path, 'w') as file:
            json_dump(vars(library), file, indent = indent)

        return destination_path
