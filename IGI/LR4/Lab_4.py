NUNTASKS = 5

def task_1_interface() -> None:
    pass

def task_2_interface() -> None:
    pass

def task_3_interface() -> None:
    pass

def task_4_interface() -> None:
    pass

def task_5_interface() -> None:
    pass

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