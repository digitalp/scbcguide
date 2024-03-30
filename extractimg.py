import cv2
import numpy as np

def is_well_lit(frame, threshold=100):
    """Check if the frame is well-lit. Adjust threshold as needed."""
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    mean_value = np.mean(hsv[:, :, 2])
    return mean_value > threshold

def is_interesting_shot(current_frame, previous_frame, threshold=0.5):
    """Determine if the shot is interesting by comparing it with the previous frame."""
    current_hist = cv2.calcHist([current_frame], [0], None, [256], [0, 256])
    previous_hist = cv2.calcHist([previous_frame], [0], None, [256], [0, 256])
    similarity = cv2.compareHist(current_hist, previous_hist, cv2.HISTCMP_CORREL)
    return similarity < threshold

def extract_stills(video_path, output_folder):
    cap = cv2.VideoCapture(video_path)
    frame_rate = cap.get(cv2.CAP_PROP_FPS)
    success, previous_frame = cap.read()
    count = 0

    while success:
        success, frame = cap.read()
        if success and count % (frame_rate // 2) == 0:  # Check one frame every half-second
            if is_well_lit(frame) and is_interesting_shot(frame, previous_frame):
                cv2.imwrite(f"{output_folder}/frame_{count}.jpg", frame)
            previous_frame = frame
        count += 1

    cap.release()

video_path = 'c:\\Concert - 03 March 2024 - 12-47-44 am.mp4'
output_folder = 'd:\\PhilBillconcert\\'
extract_stills(video_path, output_folder)
