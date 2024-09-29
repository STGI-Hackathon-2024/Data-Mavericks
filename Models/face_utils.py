import cv2
import numpy as np
from deepface import DeepFace
import matplotlib.pyplot as plt

def extract_face(image):
    # Load pre-trained face detection model
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    # Read the image
    img = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    if img is None:
        print("Error: Unable to read image")
        return None

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Detect faces
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    # Assuming the largest face is the person's
    if len(faces) > 0:
        x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
        face = img[y:y+h, x:x+w]
        return face
    else:
        print("No faces detected in the image.")
        return None

def save_extracted_face(face_image, output_path):
    if face_image is not None:
        cv2.imwrite(output_path, face_image)
        print(f"Extracted face saved as {output_path}")
        return output_path
    return None

def verify_identity(img1, img2, threshold=0.6):
    # Verify using DeepFace
    models = ["VGG-Face", "Facenet", "OpenFace", "DeepFace"]
    results = []
    
    for model in models:
        try:
            result = DeepFace.verify(img1_path=img1, img2_path=img2, model_name=model, distance_metric="cosine", enforce_detection=False)
            results.append(result["distance"])
        except Exception as e:
            print(f"Error with model {model}: {e}. Skipping...")

    # Calculate average distance
    avg_distance = np.mean(results)
    similarity = avg_distance
    is_match = avg_distance <= threshold  # Adjusted threshold for more realistic matching

    return is_match, similarity, results

def visualize_results(img1, img2, is_match, similarity):
    plt.figure(figsize=(12, 4))
    plt.subplot(121)
    plt.imshow(cv2.cvtColor(img1, cv2.COLOR_BGR2RGB))
    plt.title("Aadhaar Image")
    plt.axis('off')
    plt.subplot(122)
    plt.imshow(cv2.cvtColor(img2, cv2.COLOR_BGR2RGB))
    plt.title("Live Photo")
    plt.axis('off')
    plt.suptitle(f"Match: {is_match}, Similarity: {similarity:.4f}", fontsize=16)
    plt.show()
