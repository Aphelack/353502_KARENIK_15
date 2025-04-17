from abc import ABC
from abc import abstractmethod

class GeometicFigure(ABC):
    @abstractmethod
    def area(self):
        pass

class FigureColor(ABC):
    def __init__(self, color: str):
        self._color = color

    @property
    def color(self):
        return self._color

class Rectangle(GeometicFigure, FigureColor):
    def __init__(self, width: float, height: float, color: str):
        GeometicFigure.__init__(self)
        FigureColor.__init__(self, color)
        self._width = width
        self._height = height

    def area(self) -> float:
        return self._width * self._height

    def info(self) -> str:
        return "{}: Width = {}, Height = {}, Color = {}, Area = {:.2f}".format(
            self.name(), self._width, self._height, self.color, self.area()
        )
    def name(self) -> str:
        return "Rectangle"
    
class Circle(GeometicFigure, FigureColor):
    def __init__(self, radius: float, color: str):
        GeometicFigure.__init__(self)
        FigureColor.__init__(self, color)
        self._radius = radius

    def area(self) -> float:
        return 3.14 * self._radius ** 2

    def info(self) -> str:
        return "{}: Radius = {}, Color = {}, Area = {:.2f}".format(
            self.name(), self._radius, self.color, self.area()
        )
    def name(self) -> str:
        return "Circle"
