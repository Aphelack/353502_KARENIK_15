def analyze_list(lst : list[float]) -> tuple[int, float]:
    """
    Counts zeros and sums elements after the smallest absolute value element.
    
    Args:
        lst: List of numbers
        
    Returns:
        Tuple (zero_count, sum_after_min) where:
        zero_count: Number of zeros in list
        sum_after_min: Sum of elements after smallest absolute value element
    """
    zero_count = lst.count(0)
    min_abs_index = min(range(len(lst)), key=lambda i: abs(lst[i]))
    sum_after_min = sum(lst[min_abs_index + 1:]) if min_abs_index + 1 < len(lst) else 0
    return zero_count, sum_after_min