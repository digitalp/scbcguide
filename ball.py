from PIL import Image, ImageDraw

# Load the image from file
img_path = "C:\\epg\\ball.png"
with Image.open(img_path) as img:
    # Let's draw a cross at the approximate center of the ball
    # As we do not have the exact location, we'll estimate the center by eye
    # The location will be provided in x, y coordinates (distance from the left and top edges)
    # Let's set the cross size to be 10 pixels in each direction
    draw = ImageDraw.Draw(img)
    # Estimate center of the ball
    ball_center_x = 446 # This is a placeholder value and will be visually determined
    ball_center_y = 315 # This is a placeholder value and will be visually determined
    cross_size = 10
    # Draw vertical line of the cross
    draw.line((ball_center_x, ball_center_y - cross_size, ball_center_x, ball_center_y + cross_size), fill='red', width=3)
    # Draw horizontal line of the cross
    draw.line((ball_center_x - cross_size, ball_center_y, ball_center_x + cross_size, ball_center_y), fill='red', width=3)
    # Save the modified image
    img.save("C:\\epg\\image_with_cross.png")

'/mnt/data/image_with_cross.png'
