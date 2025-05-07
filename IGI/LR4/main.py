import math
import turtle
from task_4 import Rectangle, Circle


def save_drawing(filename):
    """Saves the current turtle drawing to a file."""
    canvas = turtle.getcanvas()
    canvas.postscript(file=filename + ".eps")  # Save as PostScript file
    print(f"Drawing saved as {filename}.eps")

def get_float_input(prompt):
    """Function to get a float input with validation."""
    while True:
        try:
            value = float(input(prompt))
            if value <= 0:
                raise ValueError("The value must be positive.")
            return value
        except ValueError as e:
            print(f"Error: {e}. Please try again.")

def get_color_input(prompt):
    """Function to get a color input."""
    while True:
        color = input(prompt).strip()
        if color:
            return color
        print("Color cannot be empty. Please try again.")

def draw_rectangle(rectangle: Rectangle):
    """Draws a rectangle using the turtle module."""
    turtle.color(rectangle.color)
    turtle.begin_fill()
    for _ in range(2):
        turtle.forward(rectangle._width)
        turtle.left(90)
        turtle.forward(rectangle._height)
        turtle.left(90)
    turtle.end_fill()

def draw_circle(circle: Circle):
    """Draws a circle using the turtle module."""
    turtle.penup()
    turtle.goto(0, -circle._radius)  # Переместить черепашку вниз на радиус
    turtle.pendown()
    turtle.color(circle.color)
    turtle.begin_fill()
    turtle.circle(circle._radius)
    turtle.end_fill()

def draw_square(side, color):
    """Draws a square using the turtle module."""
    turtle.penup()
    turtle.goto(-side / 2, -side / 2)  # Переместить черепашку в левый нижний угол квадрата
    turtle.pendown()
    turtle.color(color)
    turtle.begin_fill()
    for _ in range(4):
        turtle.forward(side)
        turtle.left(90)
    turtle.end_fill()

def main():
    print("Choose a figure to create:")
    print("1. Rectangle")
    print("2. Circle")
    print("3. Square inscribed in a circle")
    choice = input("Enter the number of your choice (1, 2, or 3): ").strip()

    if choice == "1":
        # Input parameters for the rectangle
        width = get_float_input("Enter the width of the rectangle: ")
        height = get_float_input("Enter the height of the rectangle: ")
        color = get_color_input("Enter the color of the rectangle: ")

        # Create a Rectangle object
        rectangle = Rectangle(width, height, color)
        print("\nRectangle info:")
        print(rectangle.info())

        # Draw the rectangle
        draw_rectangle(rectangle)

    elif choice == "2":
        # Input parameters for the circle
        radius = get_float_input("Enter the radius of the circle: ")
        color = get_color_input("Enter the color of the circle: ")

        # Create a Circle object
        circle = Circle(radius, color)
        print("\nCircle info:")
        print(circle.info())

        # Draw the circle
        draw_circle(circle)

    elif choice == "3":
        # Input parameters for the square inscribed in a circle
        radius = get_float_input("Enter the radius of the circle: ")
        square_color = get_color_input("Enter the color of the square: ")
        circle_color = get_color_input("Enter the color of the square: ")

        # Calculate the side of the square
        side = radius * math.sqrt(2)

        # Draw the square
        print(f"\nDrawing a square inscribed in a circle with radius {radius} and side {side:.2f}.")
        draw_circle(Circle(radius, circle_color))
        draw_square(side, square_color)

    else:
        print("Invalid choice. Exiting the program.")
        return

    save_drawing("drawing")
    from PIL import Image


    def convert_eps_to_png(eps_file, png_file):
        img = Image.open(eps_file)
        img.save(png_file, "PNG")
        print(f"Converted {eps_file} to {png_file}")

    convert_eps_to_png("drawing.eps", "drawing.png")
    turtle.done()

if __name__ == "__main__":
    main()
