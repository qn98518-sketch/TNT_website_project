from html.parser import HTMLParser
from urllib.request import urlopen
from pathlib import Path
import json,sys

origin=sys.argv[1] if len(sys.argv)>1 else 'http://localhost:3000'
routes={'overview':'/dich-vu','erp':'/dich-vu/erp','outsourcing':'/dich-vu/outsourcing','bodyshop':'/dich-vu/body-shop','projects':'/du-an','project-detail':'/du-an/kala','knowledge':'/kien-thuc','blog':'/kien-thuc/blog','article':'/kien-thuc/blog/erp-du-lieu','guides':'/kien-thuc/guides','faq':'/kien-thuc/faq'}
class Sections(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack=[]
        self.sections=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='section' and self.stack and self.stack[-1]=='main':self.sections.append(a.get('class',''))
        if tag not in ['img','input','meta','link','br','hr','source','path','use']:self.stack.append(tag)
    def handle_startendtag(self,tag,attrs):pass
    def handle_endtag(self,tag):
        for i in range(len(self.stack)-1,-1,-1):
            if self.stack[i]==tag:
                self.stack=self.stack[:i]
                break

reference=json.loads(Path('tmp/wireframe-structure.json').read_text(encoding='utf-8'))
result=[]
for page in reference:
    key=page['page']
    if key not in routes:continue
    parser=Sections()
    parser.feed(urlopen(origin+routes[key]).read().decode('utf-8'))
    expected=len(page['sections'])
    actual=len(parser.sections)
    result.append({'page':key,'reference_sections':expected,'implemented_sections':actual,'match':actual==expected})
print(json.dumps(result,indent=2))
Path('tmp/wireframe-layout-audit.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
assert all(row['match'] for row in result),'Section structure differs from the supplied reference'
