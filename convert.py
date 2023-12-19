import xml.etree.ElementTree as ET
from datetime import datetime

def convert_time(date, time):
    # Converts time to the required format: YYYYMMDDHHMMSS +0000
    dt = datetime.strptime(f"{date} {time}", "%Y/%m/%d %H:%M")
    return dt.strftime("%Y%m%d%H%M%S +0000")

def get_next_start_time(programmes, index):
    if index + 1 < len(programmes):
        next_programme = programmes[index + 1]
        date = next_programme.get("date")
        time = next_programme.get("time")
        return convert_time(date, time)
    return ""  # No next program

def convert_xml(input_file, output_file):
    # Parse the input XML file
    tree = ET.parse(input_file)
    root = tree.getroot()

    # Create the root element for the new XML
    tv = ET.Element("tv", {
        "date": datetime.now().strftime("%Y/%m/%d"),
        "source-info-url": "http://www.scbcplayer.com",
        "source-info-name": "SCBC Player"
    })

    # Add the channel element
    channel = ET.SubElement(tv, "channel", {"id": "SCBC Television"})
    ET.SubElement(channel, "display-name").text = "SCBC Television"
    ET.SubElement(channel, "url").text = "http://www.scbcplayer.com"

    # Process each program
    for i, programme in enumerate(root.findall("programme")):
        date = programme.get("date")
        time = programme.get("time")
        start_time = convert_time(date, time)
        stop_time = get_next_start_time(root.findall("programme"), i)

        prog = ET.SubElement(tv, "programme", {
            "start": start_time,
            "stop": stop_time,
            "channel": "SCBC Television"
        })

        for element in programme:
            if element.tag in ["local_title", "original_title"]:
                ET.SubElement(prog, "title", {"lang": element.get("lang")}).text = element.text
            elif element.tag in ["local_episode_title", "original_episode_title"]:
                ET.SubElement(prog, "sub-title", {"lang": element.get("lang")}).text = element.text
            elif element.tag == "description":
                ET.SubElement(prog, "desc", {"lang": element.get("lang")}).text = element.text
            # Add other elements as needed

    # Write to the output file
    tree = ET.ElementTree(tv)
    tree.write(output_file, encoding="utf-8", xml_declaration=True)

# Convert the file
convert_xml("SCBC Television.xml", "scbcguide.xml")
