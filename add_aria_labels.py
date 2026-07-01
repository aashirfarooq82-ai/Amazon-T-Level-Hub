import os

files = ['Main.html', 'students.html', 'find-colleges.html', 'index.html', 'parents.html', 'schools.html']
base_path = 'AMAZONIAN/AMAZONIAN/AMAZON'

for filename in files:
    filepath = os.path.join(base_path, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add aria-label to logout button
    content = content.replace('id="logoutBtn" class="small-btn"', 'id="logoutBtn" class="small-btn" aria-label="Sign out"')
    
    # Add aria-label to dark mode button
    content = content.replace('id="darkModeBtn" class="small-btn"', 'id="darkModeBtn" class="small-btn" aria-label="Toggle dark mode"')
    
    # Add aria-label to text size button
    content = content.replace('id="textSizeBtn" class="small-btn">Aa', 'id="textSizeBtn" class="small-btn" aria-label="Increase text size">Aa')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f'Updated {filename}')