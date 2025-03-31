from typing import Tuple, List
with open('string for task 4.txt', 'r') as file:
    string_for_analize = file.read()

def analize_string(string : str = string_for_analize) -> Tuple[int, List[str], str]:
    words = string.split()
    num_of_words_with_maximal_len = 0
    max_len = 0
    end_symbol = 'e'
    max_len_words_ends_with_e = ''
    punctuations = set([',', '.'])
    words_before_punctuation = []

    for word in words:
        if len(word) > 0 and word[-1] in punctuations:
            words_before_punctuation.append(word[:-1])
            max_len = max(max_len, len(word) - 1)
            if len(word) > 1 and word[-2] == end_symbol:
                max_len_words_ends_with_e = word[:-1] if len(word) - 1 > max_len_words_ends_with_e else max_len_words_ends_with_e
        else:
            max_len = max(max_len, len(word))
            if len(word) > 0 and word[-1] == end_symbol:
                max_len_words_ends_with_e = word if len(word) > len(max_len_words_ends_with_e) else max_len_words_ends_with_e

    for word in words:
        if len(word) > 0 and word[-1] in punctuations:
            if len(word) == max_len + 1:
                num_of_words_with_maximal_len += 1
        else:
            if len(word) == max_len:
                num_of_words_with_maximal_len += 1

    return num_of_words_with_maximal_len, words_before_punctuation, max_len_words_ends_with_e