from rembg import remove
from PIL import Image

input_path = '/Users/jaydendavis/trumpap/toppng.com-donald-trump-2005343-donald-trump-cartoon-face-2397x3135.png'
output_path = '/Users/jaydendavis/trumpap/trump_no_background.png'

print("Removing background...")

with open(input_path, 'rb') as i:
    input_img = i.read()
    output_img = remove(input_img)

    with open(output_path, 'wb') as o:
        o.write(output_img)

print(f"Done! Image saved to: {output_path}")
