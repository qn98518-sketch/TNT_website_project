from html.parser import HTMLParser
from pathlib import Path
import json

class Parser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = {'tag': 'root', 'attrs': {}, 'children': []}
        self.stack = [self.root]
    def handle_starttag(self, tag, attrs):
        node = {'tag': tag, 'attrs': dict(attrs), 'children': []}
        self.stack[-1]['children'].append(node)
        if tag not in ['img','input','meta','link','br','hr','source','use','path']:
            self.stack.append(node)
    def handle_startendtag(self, tag, attrs):
        self.stack[-1]['children'].append({'tag': tag, 'attrs': dict(attrs), 'children': []})
    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1, 0, -1):
            if self.stack[i]['tag'] == tag:
                self.stack = self.stack[:i]
                break
    def handle_data(self, data):
        self.stack[-1]['children'].append(data)

def nodes(node):
    if isinstance(node, dict):
        yield node
        for child in node['children']:
            yield from nodes(child)

def text(node):
    if isinstance(node, str):
        return node
    return ' '.join(text(child) for child in node['children'])

source = Path(r'C:\Users\Admin\Downloads\TNT_Website.HTML.html').read_text(encoding='utf-8')
p = Parser()
p.feed(source)
pages = [n for n in nodes(p.root) if n['attrs'].get('data-page')]
result = []
for page in pages:
    sections = []
    for section in page['children']:
        if not isinstance(section, dict):
            continue
        section_nodes = list(nodes(section))
        sections.append({
            'tag': section['tag'], 'class': section['attrs'].get('class',''),
            'headings': [' '.join(text(n).split()) for n in section_nodes if n['tag'] in ['h1','h2']],
            'layouts': list(dict.fromkeys(n['attrs']['class'] for n in section_nodes if 'class' in n['attrs'] and any(s in n['attrs']['class'] for s in ['grid','layout','feature','panel','filter','table','contact','process','scope','benefit','step','stats','meta','case','article']))),
            'images': [n['attrs'] for n in section_nodes if n['tag']=='img' or 'data-bg' in n['attrs']],
        })
    result.append({'page':page['attrs']['data-page'], 'sections':sections})
Path('tmp/wireframe-structure.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps([r for r in result if r['page'] not in ['home','food','about']],ensure_ascii=False,indent=2))
