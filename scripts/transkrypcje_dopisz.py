# Dopisuje transkrypcje odcinków do src/data/transkrypcje.js (1.10.2026, Marcin).
# Źródła: Ksiazka/Odcinek-08_transkrypcja.txt (scenariusz po poprawkach) oraz
# Do publikacji/*/Odcinek-NN_transkrypcja.md (transkrypcja montażu, #10–#15).
# Użycie: python3 scripts/transkrypcje_dopisz.py --podglad  (tylko wypisuje)
import re, glob, json, sys, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = os.path.dirname(ROOT)
def zrodlo(nr):
    if nr == 8:
        return open(os.path.join(BASE,'Ksiazka','Odcinek-08_transkrypcja.txt'),encoding='utf-8').read().split('\n',3)[3]
    f = glob.glob(os.path.join(BASE,'Do publikacji','*',f'Odcinek-{nr:02d}_transkrypcja.md'))[0]
    return open(f,encoding='utf-8').read()
def czysc(t):
    out=[]
    for l in t.splitlines():
        l=l.strip()
        if not l or l.startswith('#') or l.startswith('Znaczniki czasu'): continue
        l=re.sub(r'\*\*\[\d+:\d{2}\]\*\*\s*','',l); l=re.sub(r'\[\d+:\d{2}\]\s*','',l)
        l=l.replace('**','')
        out.append(l)
    t=' '.join(out); t=re.sub(r'\s+',' ',t).strip()
    return t
def akapity(t, cel=75):
    zd=re.split(r'(?<=[.!?…”"])\s+(?=[A-ZĄĆĘŁŃÓŚŹŻ„"])',t)
    res=[];cur=[]
    for z in zd:
        cur.append(z)
        if sum(len(x.split()) for x in cur)>=cel: res.append(' '.join(cur)); cur=[]
    if cur:
        if res and sum(len(x.split()) for x in cur)<25: res[-1]+=' '+' '.join(cur)
        else: res.append(' '.join(cur))
    return res
NR=[8,10,11,12,13,14,15]
blok=''
for nr in NR:
    a=akapity(czysc(zrodlo(nr)))
    slow=sum(len(x.split()) for x in a)
    blok+=f'  // Odcinek {nr} — {len(a)} akapitów, {slow} słów\n  {nr}: [\n'+''.join('    '+json.dumps(x,ensure_ascii=False)+',\n' for x in a)+'  ],\n'
    print(nr,len(a),slow,file=sys.stderr)
if '--podglad' in sys.argv:
    open('/tmp/transk_podglad.txt','w').write(blok); sys.exit()
p=os.path.join(ROOT,'src','data','transkrypcje.js'); s=open(p,encoding='utf-8').read()
assert s.rstrip().endswith('};') and '\n  8: [' not in s
s=s.rstrip()[:-2]+blok+'};\n'; open(p,'w',encoding='utf-8').write(s)
