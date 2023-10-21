from sys import argv
from copy import deepcopy
from blogger import Blogger

if __name__ == '__main__':
    args = deepcopy(argv)
    main = args.pop(0)
    blogger = Blogger(filepath = args.pop(0))

    description = blogger.describe()
    blogger.index(args.pop(0), description)