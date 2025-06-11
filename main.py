import os

def read_files(base_path, relative_path=""):
    full_path = os.path.join(base_path, relative_path)
    project_structure = []

    for entry in sorted(os.listdir(full_path)):
        entry_path = os.path.join(full_path, entry)
        entry_rel_path = os.path.join(relative_path, entry)

        if os.path.isdir(entry_path):
            subdir = read_files(base_path, entry_rel_path)
            project_structure.append({
                "type": "directory",
                "name": entry,
                "path": entry_rel_path,
                "children": subdir
            })
        else:
            with open(entry_path, "r", encoding="utf-8") as f:
                content = f.read()
            project_structure.append({
                "type": "file",
                "name": entry,
                "path": entry_rel_path,
                "content": content
            })

    return project_structure

def print_structure(structure, file, indent=0):
    for item in structure:
        prefix = "│   " * indent
        if item["type"] == "directory":
            file.write(f"{prefix}📁 {item['name']}/\n")
            print_structure(item["children"], file, indent + 1)
        else:
            file.write(f"{prefix}📄 {item['name']}\n")
            file.write(f"{prefix}─── Content:\n{prefix}{'-' * 50}\n")
            file.write(indent_multiline(item["content"], prefix) + "\n")
            file.write(f"{prefix}{'-' * 50}\n\n")

def indent_multiline(text, prefix):
    return '\n'.join(prefix + line for line in text.splitlines())

# Adjust path to point to the root of your Next.js app
base_dir = "my-product-crud-app"
subdirs = [".github/workflows", "utils", "pages", "pages/api"]

with open("project_structure.txt", "w", encoding="utf-8") as output_file:
    for sub in subdirs:
        output_file.write(f"\n📂 Exploring `{sub}` directory:\n{'='*70}\n")
        full_path = os.path.join(base_dir, sub)
        if os.path.exists(full_path):
            structure = read_files(base_dir, sub)
            print_structure(structure, output_file)
        else:
            output_file.write(f"❌ Directory not found: {full_path}\n")
