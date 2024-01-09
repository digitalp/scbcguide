import os
import time
from datetime import datetime

def get_file_properties(file_path):
    """Retrieve size and modification date of a file."""
    try:
        file_stats = os.stat(file_path)
        return file_stats.st_size, file_stats.st_mtime
    except FileNotFoundError:
        return None, None

def monitor_file_changes(file_path, check_interval=5):
    """Monitor file for changes in size and modification date, and print date and time of change."""
    last_size, last_modified = get_file_properties(file_path)

    while True:
        current_size, current_modified = get_file_properties(file_path)

        if current_size is None or current_modified is None:
            print(f"The file '{file_path}' was not found.")
            break

        if current_size != last_size or current_modified != last_modified:
            change_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            print(f"Change detected in '{file_path}' at {change_time}.")
            print("Running convert.py...")
            os.system('python c:\\epg\\convert.py')

            last_size, last_modified = current_size, current_modified

        time.sleep(check_interval)

# Path to the file to be monitored
file_to_monitor = 'c:\\epg\\SCBC Television.xml'

# Start monitoring the file
monitor_file_changes(file_to_monitor)
