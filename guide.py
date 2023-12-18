import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from ftplib import FTP

class MyHandler(FileSystemEventHandler):
    def __init__(self, ftp_host, ftp_user, ftp_passwd, ftp_dir):
        self.ftp_host = ftp_host
        self.ftp_user = ftp_user
        self.ftp_passwd = ftp_passwd
        self.ftp_dir = ftp_dir

    def on_modified(self, event):
        if event.is_directory:
            return
        elif event.event_type == 'modified':
            print(f'File {event.src_path} has been modified. Uploading to FTP server...')
            self.upload_to_ftp(event.src_path)

    def upload_to_ftp(self, file_path):
        try:
            ftp = FTP(self.ftp_host)
            ftp.login(self.ftp_user, self.ftp_passwd)
            ftp.cwd(self.ftp_dir)

            with open(file_path, 'rb') as file:
                ftp.storbinary(f'STOR {file_path.split("/")[-1]}', file)

            ftp.quit()
            print(f'File {file_path} uploaded to FTP server successfully.')

        except Exception as e:
            print(f'Error uploading file to FTP server: {e}')

if __name__ == "__main__":
    # Set your FTP server credentials and directory
    ftp_host = '160.153.138.178'
    ftp_user = 'JgFeVxJBmXDK0O'
    ftp_passwd = 'Dw7BHGVTwXdR@v'
    ftp_dir = '/guides/'

    # Set the path to the file you want to monitor
    file_path = 'C:\epg\output_schedule.xml'

    event_handler = MyHandler(ftp_host, ftp_user, ftp_passwd, ftp_dir)
    observer = Observer()
    observer.schedule(event_handler, path=file_path, recursive=False)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
