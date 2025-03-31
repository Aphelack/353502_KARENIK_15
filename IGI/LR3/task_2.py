from typing import Generator
def integer_input_and_sum_generator() -> Generator[int, None, None]:
    sum = 0
    while True:
        yield sum
        try:
            a = int(input())
        except ValueError:
            print("Invalid input. Please enter an integer.")
            continue
        if a > 100:
            break
        sum += a
