import cv2
import numpy as np
import dlib
from scipy.spatial import distance as dist
import random
import tensorflow as tf
from tensorflow.python.keras.models import Sequential
from tensorflow.python.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense
from tensorflow.python.keras.datasets.mnist # type: ignore
from tensorflow.python.keras.utils import to_categorical
import time

# Initialize face detector and shape predictor
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")

# Blink detection function
def eye_aspect_ratio(eye):
    A = dist.euclidean(eye[1], eye[5])
    B = dist.euclidean(eye[2], eye[4])
    C = dist.euclidean(eye[0], eye[3])
    ear = (A + B) / (2.0 * C)
    return ear

# Lighting check function
def check_lighting(frame):
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    brightness = hsv[..., 2].mean()
    if brightness < 50:
        return "Lighting is too low", False
    elif brightness > 200:
        return "Lighting is too bright", False
    return "Lighting is fine", True

# Function to generate a random math problem
def generate_math_problem():
    operators = ['+', '-']
    num1 = random.randint(1, 10)
    num2 = random.randint(1, num1)  # Ensure a valid subtraction
    operator = random.choice(operators)
    problem = f"{num1} {operator} {num2}"
    correct_answer = eval(problem)
    return problem, correct_answer

# Preprocess image for CNN (resize to 28x28 for digit recognition)
def preprocess_image_for_cnn(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    resized_image = cv2.resize(gray, (28, 28), interpolation=cv2.INTER_AREA)
    normalized_image = resized_image / 255.0  # Normalize pixel values
    reshaped_image = normalized_image.reshape(1, 28, 28, 1)  # Shape for CNN input
    return reshaped_image

# CNN model for digit recognition
def create_digit_recognition_model():
    model = Sequential()
    model.add(Conv2D(32, kernel_size=(3, 3), activation='relu', input_shape=(28, 28, 1)))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Conv2D(64, (3, 3), activation='relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Flatten())
    model.add(Dense(128, activation='relu'))
    model.add(Dense(10, activation='softmax'))  # Output layer for 10 digits
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    return model

# Train or load CNN model on MNIST dataset
def load_or_train_digit_recognition_model():
    try:
        # Try to load pre-trained model weights
        model = create_digit_recognition_model()
        model.load_weights('digit_recognition_model.h5')
        print("Loaded pre-trained digit recognition model.")
    except:
        # If model does not exist, train it on the MNIST dataset and save it
        print("Training a new digit recognition model...")
        (x_train, y_train), (x_test, y_test) = mnist.load_data()
        x_train = x_train.reshape(x_train.shape[0], 28, 28, 1).astype('float32') / 255
        x_test = x_test.reshape(x_test.shape[0], 28, 28, 1).astype('float32') / 255
        y_train = to_categorical(y_train, 10)
        y_test = to_categorical(y_test, 10)

        model = create_digit_recognition_model()
        model.fit(x_train, y_train, epochs=5, validation_data=(x_test, y_test))
        model.save_weights('digit_recognition_model.h5')  # Save model for future use
        print("Saved digit recognition model.")
    
    return model

# Capture image and save
def capture_image(frame):
    cv2.imwrite("captured_image.jpg", frame)
    print("Image captured and saved!")
    return frame

# Main liveness detection and OCR pipeline
def run_liveness_detection():
    # Load or train the CNN for digit recognition
    digit_recognition_model = load_or_train_digit_recognition_model()

    cap = cv2.VideoCapture(0)

    # Blink detection parameters
    EYE_AR_THRESH = 0.25
    COUNTER = 0
    BLINKS = 0
    MIN_BLINKS = 3
    MAX_FRAMES_WITHOUT_BLINK = 90
    NO_BLINK_COUNTER = 0
    
    # Face detection parameters
    FACE_DETECT_FRAMES = 5
    face_detect_counter = 0
    face_detected = False

    math_problem, correct_answer = generate_math_problem()
    print(f"Math Problem: {math_problem}")
    print("Please solve this problem and write the answer clearly within the designated circular area of the camera frame.")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame. Exiting...")
            break

        height, width = frame.shape[:2]
        center = (int(width / 2), int(height * 0.85))
        radius = int(min(width, height) * 0.15)

        cv2.circle(frame, center, radius, (0, 255, 0), 2)
        cv2.putText(frame, "Place your answer here", (center[0] - 100, center[1] - radius - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = detector(gray)

        lighting_status, correct_lighting = check_lighting(frame)
        cv2.putText(frame, lighting_status, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, 
                    (0, 255, 0) if correct_lighting else (0, 0, 255), 2)

        if len(faces) == 0:
            face_detect_counter += 1
            if face_detect_counter >= FACE_DETECT_FRAMES:
                cv2.putText(frame, "No face detected", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
                face_detected = False
        else:
            face_detect_counter = 0
            face_detected = True

            if len(faces) > 1:
                print("Multiple faces detected!")
                cv2.putText(frame, "Multiple faces detected!", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
                time.sleep(5)
                break
            else:
                face = faces[0]
                shape = predictor(gray, face)
                shape = np.array([[p.x, p.y] for p in shape.parts()])

                left_eye = shape[36:42]
                right_eye = shape[42:48]
                leftEAR = eye_aspect_ratio(left_eye)
                rightEAR = eye_aspect_ratio(right_eye)
                ear = (leftEAR + rightEAR) / 2.0

                if ear < EYE_AR_THRESH:
                    COUNTER += 1
                else:
                    if COUNTER >= 2:
                        BLINKS += 1
                    COUNTER = 0
                    NO_BLINK_COUNTER = 0

                NO_BLINK_COUNTER += 1
                if NO_BLINK_COUNTER > MAX_FRAMES_WITHOUT_BLINK:
                    BLINKS = 0
                    NO_BLINK_COUNTER = 0

                cv2.putText(frame, f"Blink Count: {BLINKS}", (10, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

        # Check if all conditions are met for capture
        if face_detected and BLINKS >= MIN_BLINKS and correct_lighting:
            cv2.putText(frame, "Press 'c' to capture image", (10, 150), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

        cv2.imshow("Liveness Detection & Digit Recognition", frame)

        key = cv2.waitKey(1) & 0xFF
        if key == 27:  # Press 'Esc' to exit
            break
        elif key == ord('c') and face_detected and BLINKS >= MIN_BLINKS and correct_lighting:
            captured_frame = capture_image(frame)
            roi = frame[center[1] - radius:center[1] + radius, center[0] - radius:center[0] + radius]
            
            preprocessed_roi = preprocess_image_for_cnn(roi)
            predicted_digit = np.argmax(digit_recognition_model.predict(preprocessed_roi))

            if predicted_digit == correct_answer:
                result_text = "Correct answer!"
            else:
                result_text = f"Incorrect! Predicted: {predicted_digit}, Expected: {correct_answer}"

            cv2.putText(captured_frame, result_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0) if "Correct" in result_text else (0, 0, 255), 2)
            cv2.imshow("Captured Image", captured_frame)
            cv2.waitKey(0)
            break

    cap.release()
    cv2.destroyAllWindows()

# Run the combined liveness detection and OCR pipeline
run_liveness_detection()