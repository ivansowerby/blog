from hashlib import sha256

def hash(s: str, encoding: str = 'UTF-8') -> str:
    return sha256(s.encode(encoding)).hexdigest()
