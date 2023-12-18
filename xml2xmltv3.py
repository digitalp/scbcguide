import xml.etree.ElementTree as ET
from datetime import datetime

# Function to format date and time to XMLTV format
def format_datetime(date_str, time_str):
    dt = datetime.strptime(f"{date_str} {time_str}", "%Y/%m/%d %H:%M")
    return dt.strftime("%Y%m%d%H%M%S +0000")

# Parse the original XML
tree = ET.parse('SCBC TV.xml')  # Replace with your XML file path
root = tree.getroot()

# Create a new root for XMLTV
tv = ET.Element('tv', attrib={
    'source-info-url': "http://www.scbcmedia.com/",
    'source-info-name': "SCBC TV",
    'generator-info-name': "XMLTV/SCBC",
    'generator-info-url': "http://www.scbcmedia.com/"
})

# Add channel information
channel_id = "SCBC Television"
channel = ET.SubElement(tv, 'channel', id=channel_id)
ET.SubElement(channel, 'display-name').text = "SCBC Television"

# Convert each programme
for programme in root.findall('programme'):
    new_programme = ET.SubElement(tv, 'programme', {
        'start': format_datetime(programme.get('date'), programme.get('time')),
        'stop': '',  # Add logic to calculate stop time if available
        'channel': channel_id
    })

    # Add title, description, etc.
    local_title_element = programme.find('local_title')
    if local_title_element is not None and local_title_element.text:
        ET.SubElement(new_programme, 'title', lang="en").text = local_title_element.text

    # Add other elements as needed
    # ...

# Write the new XML to a file
tree = ET.ElementTree(tv)
tree.write('scbcguide.xml', encoding='ISO-8859-1', xml_declaration=True)
