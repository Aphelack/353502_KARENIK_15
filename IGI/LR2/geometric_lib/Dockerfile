FROM python:3.9-slim

WORKDIR /geometric_lib

COPY circle.py square.py ./

CMD ["python", "-c", "import sys, os; shape = os.getenv('SHAPE', 'circle'); import importlib; module = importlib.import_module(shape); print(f'Area: {module.area(5)}, Perimeter: {module.perimeter(5)}')"]