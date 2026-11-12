#!/usr/bin/env python3
"""Run offline DNS audit safety tests using synthetic records only."""
import copy
import json
import subprocess
import tempfile
from pathlib import Path

script=Path(__file__).with_name('audit_dns_changes.py').resolve()
work=Path.cwd()/'work'
work.mkdir(exist_ok=True)
base=[{'id':'a','name':'example.com','type':'A','content':'192.0.2.1','ttl':1,'proxied':True}, {'id':'mx','name':'example.com','type':'MX','content':'mail.example.net','priority':10,'ttl':300,'proxied':False}, {'id':'txt','name':'example.com','type':'TXT','content':'private-verification-marker','ttl':300}, {'id':'book','name':'books.example.com','type':'A','content':'192.0.2.2','ttl':1}]
passed=[]
with tempfile.TemporaryDirectory(dir=work) as tmp:
 before=Path(tmp)/'before.json';after=Path(tmp)/'after.json'
 def check(name, a, b, allowances, status, secret_check=False):
  before.write_text(json.dumps(a));after.write_text(json.dumps(b));args=['python',str(script),str(before),str(after)]
  for item in allowances:args+=['--allow-record',item]
  p=subprocess.run(args,capture_output=True,text=True)
  assert p.returncode==status,(name,p.returncode,p.stdout,p.stderr)
  if secret_check:assert 'private-verification-marker' not in p.stdout+p.stderr and 'changed-secret-marker' not in p.stdout+p.stderr
  passed.append(name)
 changed=[r for r in copy.deepcopy(base) if r['id']!='a']+[{'id':'new','name':'example.com','type':'AAAA','content':'100::','ttl':1,'proxied':True}]
 allowed=['example.com:A','example.com:AAAA']
 check('approved A to managed AAAA replacement',base,changed,allowed,0)
 check('root MX deletion detected despite allowed website pair',base,[r for r in changed if r['id']!='mx'],allowed,1)
 txt=copy.deepcopy(changed);next(r for r in txt if r['id']=='txt')['content']='changed-secret-marker'
 check('root TXT change detected without exposing values',base,txt,allowed,1,True)
 extra=copy.deepcopy(base)+[{'id':'www','name':'www.example.com','type':'AAAA','content':'100::'}]
 check('unapproved hostname addition detected',base,extra,allowed,1)
 moved=copy.deepcopy(base);moved[0]['name']='other.example.com'
 check('same ID moved to unapproved hostname detected',base,moved,['example.com:A'],1)
 other=copy.deepcopy(base);other[3]['content']='192.0.2.99'
 check('unrelated A content change detected',base,other,allowed,1)
 check('explicit single book record retirement',base,[r for r in base if r['id']!='book'],['books.example.com:A'],0)
 check('unchanged snapshot needs no allowances',base,base,[],0)
 check('Cloudflare envelope and operational snapshot formats',{'result':base,'result_info':{'total_count':4}}, {'dns':base},[],0)
 check('duplicate IDs rejected',base,base+[base[0]],[],2)
 check('partial paginated snapshot rejected',{'result':base,'result_info':{'total_count':10}},base,[],2)
 check('malformed input rejected',{'unknown':base},base,[],2)
 check('exact hostname allowance does not match subdomain',base,other,['example.com:A'],1)
 check('root MX priority change detected',base,[dict(r,priority=20) if r['id']=='mx' else r for r in base],allowed,1)
print(json.dumps({'passed':len(passed),'cases':passed},indent=2))
