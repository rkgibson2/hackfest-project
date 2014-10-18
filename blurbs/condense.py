import json
import os


files = [f for f in os.listdir('.') if os.path.isfile(f) and os.path.splitext(f)[1] == ".json"]

whole_data = {}

for file in files:
    name = os.path.splitext(file)[0]
    no_blurb = name.split("_")[:-1]
    name = "_".join(no_blurb)
    with open(file, "r") as infile:
        data = json.load(infile)
        whole_data[name] = data

with open("blurbs.json", "w") as outfile:
    json.dump(whole_data, outfile)
