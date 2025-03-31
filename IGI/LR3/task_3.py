def words_starts_with_lowercase_consonant(line : str) -> int:
    '''
    Calculates number or words starting with lowercase consonant letter
    '''
    consonant_letters = set(['q', 'w', 'r', 't', 'p', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm'])
    words = line.split()
    count = 0
    for word in words:
        if word[0] in consonant_letters:
            count += 1
    return count
