from task_1 import RationalNumber

def create_dict(n: int) -> dict:
    result = {}
    for i in range(1, n + 1):
        result[i] = RationalNumber(i, i + 1)
    import random
    keys = list(result.keys())
    random.shuffle(keys)
    shuffled_result = {}
    for key in keys:
        shuffled_result[key] = result[key]
    return result

def create_dict_for_test() -> dict:
    result = {}
    for i in range(10, 18):
        result[i] = RationalNumber(i, i + 1)
    result[8] = RationalNumber(1, 2)
    result[9] = RationalNumber(2, 4)
    return result

data_1 = create_dict(10)
data_2 = create_dict_for_test()
RationalNumber.to_pickle(data_1, "data.pkl")
RationalNumber.to_csv(data_2, "data.csv")

sample_text = """Hello there! How are you doing today? I hope everything is fine. 
    This is a test input file. It contains multiple sentences, some of which are declarative, 
    some are interrogative, and some are exclamatory! Let's see how well the analyzer works. 
    Here are some phone numbers: 291234567, 298765432, and 291112223. 
    Also, some smileys: :) :( ;) :D. And some words: apple, banana, cherry."""

with open("input.txt", "w", encoding="utf-8") as file:
    file.write(sample_text)