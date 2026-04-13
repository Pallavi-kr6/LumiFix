import cv2
import numpy as np
from PIL import Image
import io
import base64

class ImageProcessor:
    def __init__(self):
        pass
    
    def process_image(self, image_bytes, params):
        """
        Process image based on params dict:
        - brightness: float (0.5-2.0)
        - contrast: float (0.5-2.0)
        - gaussian_sigma: float (0-10)
        - bilateral_d: int (1-50)
        - bilateral_sigma_color: int (1-200)
        - sharpen_strength: float (0-3)
        - histogram_eq: bool
        """
        # Load image
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        # Brightness & Contrast
        brightness = params.get('brightness', 1.0)
        contrast = params.get('contrast', 1.0)
        img = np.clip((img * brightness * contrast), 0, 255).astype(np.uint8)
        
        # Histogram Equalization
        if params.get('histogram_eq', False):
            img_yuv = cv2.cvtColor(img, cv2.COLOR_RGB2YUV)
            img_yuv[:,:,0] = cv2.equalizeHist(img_yuv[:,:,0])
            img = cv2.cvtColor(img_yuv, cv2.COLOR_YUV2RGB)
        
        # Gaussian Blur
        gaussian_sigma = params.get('gaussian_sigma', 0)
        if gaussian_sigma > 0:
            ksize = int(gaussian_sigma * 4) | 1  # odd kernel size
            img = cv2.GaussianBlur(img, (ksize, ksize), gaussian_sigma)
        
        # Bilateral Filter
        bilateral_d = params.get('bilateral_d', 9)
        bilateral_sigma_color = params.get('bilateral_sigma_color', 75)
        if bilateral_d > 0:
            img = cv2.bilateralFilter(img, bilateral_d, bilateral_sigma_color, bilateral_sigma_color)
        
        # Sharpening
        sharpen_strength = params.get('sharpen_strength', 0)
        if sharpen_strength > 0:
            kernel = np.array([[-1,-1,-1], [-1,9*sharpen_strength,-1], [-1,-1,-1]])
            img = cv2.filter2D(img, -1, kernel)
            img = np.clip(img, 0, 255).astype(np.uint8)
        
        # Encode back to bytes
        img_pil = Image.fromarray(img)
        buffer = io.BytesIO()
        img_pil.save(buffer, format='PNG')
        img_base64 = base64.b64encode(buffer.getvalue()).decode()
        
        return img_base64

# For testing
if __name__ == "__main__":
    processor = ImageProcessor()
    print("ImageProcessor ready")

