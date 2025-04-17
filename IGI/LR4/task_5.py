import numpy as np

arr = np.array([[3, 4, 5],
               [0, 1, 2]])

arr_like = np.zeros_like(arr)

print(arr_like[0, 1])
print(arr_like[:, 1])
print(arr_like[1, :])

arr_sum = arr + arr_like
arr_sqrt = np.sqrt(arr_sum)

arr_sum, arr_mean, arr_max = arr_sqrt.sum(axis=1), arr_sqrt.mean(axis=1), arr_sqrt.max(axis=1)

n, m = 5, 5
A = np.random.rand(n, m)
print(A)
def switch_max_with_diagonal(a):
    diagonal = a.diagonal().copy()
    max_values = a.max(axis=1)

    a[np.arange(n), np.argmax(a, axis=1)] = diagonal
    a[np.arange(n), np.arange(n)] = max_values
switch_max_with_diagonal(A)
print(A)