import csv
import pickle


class RationalNumber(object):
    def __init__(self, numerator: int, denominator: int):
        if denominator <= 0:
            raise ValueError("Denominator must be positive")
        self.numerator = numerator
        self.denominator = denominator

    def __str__(self):
        return f"{self.numerator}/{self.denominator}"

    def __eq__(self, other):
        if not isinstance(other, RationalNumber):
            return NotImplemented
        return self.numerator * other.denominator == self.denominator * other.numerator

    def __lt__(self, other):
        if not isinstance(other, RationalNumber):
            return NotImplemented
        return self.numerator * other.denominator < self.denominator * other.numerator

    @staticmethod
    def from_csv(file_path: str) -> dict:
        rational_numbers = {}
        with open(file_path, mode='r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                numerator = int(row['numerator'])
                denominator = int(row['denominator'])
                rational_numbers[
                    f"{numerator}/{denominator}"
                ] = RationalNumber(numerator, denominator)
        return rational_numbers

    @staticmethod
    def to_csv(data, file_path: str):
        with open(file_path, mode='w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(['numerator', 'denominator'])
            for item in data.values():
                writer.writerow([item.numerator, item.denominator])

    @staticmethod
    def to_pickle(data, file_path: str):
        with open(file_path, mode='wb') as file:
            pickle.dump(data, file)

    @staticmethod
    def from_pickle(file_path: str) -> dict:
        with open(file_path, mode='rb') as file:
            return pickle.load(file)


def find_equal(data: dict) -> tuple[RationalNumber, RationalNumber] | None:
    sorted_number = sorted(data.values())
    for i in range(len(sorted_number) - 1):
        if sorted_number[i] == sorted_number[i + 1]:
            return sorted_number[i], sorted_number[i + 1]

def main():
    data_1 = RationalNumber.from_csv("data.csv")
    print([str(num) for num in data_1.values()])
    try:
        num_1, num_2 = find_equal(data_1)
        print(f"Equal: {num_1} and {num_2}")
    except TypeError:
        print("No duplicates found.")


    def find_maximal(data: dict) -> RationalNumber:
        return max(data.values())


    data_2 = RationalNumber.from_pickle("data.pkl")
    max_number = find_maximal(data_2)
    print(f"from numbers:{[str(num) for num in data_2.values()]} {max_number} is maximal")

if __name__ == "__main__":
    main()

