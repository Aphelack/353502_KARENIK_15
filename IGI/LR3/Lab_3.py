from task_1 import calculateF
from task_2 import integer_input_and_sum_generator
from task_3 import words_starts_with_lowercase_consonant
from task_4 import analize_string
from task_5 import analyze_list

NUNTASKS = 5

def task_1_interface() -> None:
    args = input("Enter x and eps (optionally, separated by space): ").split()
    try:
        if len(args) == 2:
            x, eps = map(float, args)
            calculateF(x=x, eps=eps)
        elif len(args) == 1:
            x = float(args[0])
            calculateF(x=x)
        else:
            print("Incorrect number of arguments. Enter 1 or 2 values.")
    except ValueError:
        print("Incorrect arguments. Please enter valid numbers.")

def task_2_interface() -> None:
    print("Enter integer numbers <= 100 to claculate sum (integer > 100 will stop program).")
    sum_gen = integer_input_and_sum_generator()
    for current_sum in sum_gen:
        print(f"Current sum: {current_sum}")

    print("Stopped (number >100 entered).")

def task_3_interface() -> None:
    sentence = input("Enter an english sentence: ")
    count = words_starts_with_lowercase_consonant(sentence)
    print(count, 'words starts with consonant letter')

def task_4_interface() -> None:
    num_of_words_with_maximal_len, words_before_punctuation, max_len_words_ends_with_e = analize_string()
    print(num_of_words_with_maximal_len, 'words have maximal length')
    print('words before , or .')
    print(words_before_punctuation)
    print('the longest word ends wirh e', max_len_words_ends_with_e)

def task_5_interface() -> None:
    print('Enter a list of float numbers')
    try:
        lst = list(map(float, input().split()))
    except ValueError:
        print("incorrect input")
        return
    zero_count, sum_after_min = analyze_list(lst)
    print('Number of zeros in list', zero_count)
    print('Sum of elements after smallet absolute value element', sum_after_min)

def interface():
    while True:
        user_input = input("Enter a number of task (or 'q' to quit): ")
        if user_input.lower() == 'q':
            break
        try:
            task_number = int(user_input)
        except ValueError:
            print("Incorrect input")
            continue
        if task_number < 1 or task_number > NUNTASKS:
            print("Incorrect task number.")
        if task_number == 1:
            task_1_interface()
        if task_number == 2:
            task_2_interface()
        if task_number == 3:
            task_3_interface()
        if task_number == 4:
            task_4_interface()
        if task_number == 5:
            task_5_interface()

def main():
    interface()

if __name__ == "__main__":
    main()