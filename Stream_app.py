import streamlit as st
from PIL import Image
import cv2
import numpy as np
from Models.face_utils import extract_face, save_extracted_face, verify_identity, visualize_results
from Models.liveness_detection import run_liveness_with_math_challenge

def main():
    # Center and increase the size of the title using Markdown
    st.markdown("<h1 style='text-align: center; font-size: 40px;'>ID Document and Random Image Upload</h1>", unsafe_allow_html=True)

    # Camera input
    st.markdown("<h3 style='font-size: 20px;'>Capture Image from Camera</h3>", unsafe_allow_html=True)
    camera_image = st.camera_input("Take a picture")

    if camera_image:
        st.image(camera_image, caption="Captured Image", use_column_width=True)

    # Upload ID document
    st.markdown("<h3 style='font-size: 20px;'>Upload ID Document (JPEG, JPG, PNG)</h3>", unsafe_allow_html=True)
    id_doc = st.file_uploader("Choose an ID document", type=["jpeg", "jpg", "png"])

    extracted_face_path = None  # Initialize variable to store extracted face path

    if id_doc:
        id_doc_image = Image.open(id_doc)
        st.image(id_doc_image, caption="Uploaded ID Document", use_column_width=True)

        # Convert the uploaded ID document to an OpenCV format
        id_doc_array = np.array(id_doc_image)
        id_doc_bgr = cv2.cvtColor(id_doc_array, cv2.COLOR_RGB2BGR)

        # Step 1: Extract face from ID document
        face_image = extract_face(id_doc_bgr)
        if face_image is not None:
            extracted_face_path = "extracted_face_id_doc.jpg"
            save_extracted_face(face_image, extracted_face_path)
            st.image(face_image, caption="Extracted Face from ID Document", use_column_width=True)
        else:
            st.error("No face detected in the uploaded ID document.")

    # Upload another random image (optional, if needed)
    st.markdown("<h3 style='font-size: 20px;'>Upload Another Random Image (JPEG, JPG, PNG)</h3>", unsafe_allow_html=True)
    random_image = st.file_uploader("Choose another image", type=["jpeg", "jpg", "png"], key="random_image")

    if random_image:
        random_image_image = Image.open(random_image)
        st.image(random_image_image, caption="Uploaded Random Image", use_column_width=True)

        if extracted_face_path is not None:  # Only verify if a face was extracted
            # Step 2: Verify identity using the extracted face from ID document
            is_match, similarity, model_distances = verify_identity(extracted_face_path, random_image)

            # Step 3: Display results
            st.success(f"Match: {is_match}")
            st.success(f"Similarity: {similarity:.4f}")
            st.write("Model distances:", model_distances)

            # Step 4: Visualize results
            visualize_results(extracted_face_path, random_image, is_match, similarity)

    # Run liveness detection with math challenge
    if st.button("Run Liveness Detection"):
        st.markdown("<h3 style='font-size: 20px;'>Liveness Detection Challenge</h3>", unsafe_allow_html=True)
        run_liveness_with_math_challenge()

if __name__ == "__main__":
    main()
