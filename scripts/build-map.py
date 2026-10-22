"""Prepare static cartography from INEGI; not run by the frontend or Cloudflare.
Usage: python scripts/build-map.py [directory_with_leon-boundary.json_and_leon-streets.json]
Requires Pillow only on the preparation computer. No fabricated geometry.
"""
import hashlib, json, math, sys, urllib.request
from pathlib import Path
from PIL import Image, ImageDraw

ROOT=Path(__file__).resolve().parents[1]
CACHE=Path(sys.argv[1]) if len(sys.argv)>1 else ROOT/'.map-cache'
CACHE.mkdir(exist_ok=True)
SOURCES={
 'leon-boundary':'https://gaia.inegi.org.mx/wscatgeo/v2/geo/mgem/11020',
 'leon-streets':'https://gaia.inegi.org.mx/wscatgeo/v2/geo/vialidades/11/020',
}
raw={}
for name,url in SOURCES.items():
 p=CACHE/(name+'.json')
 if not p.exists():
  with urllib.request.urlopen(url,timeout=180) as response:p.write_bytes(response.read())
 raw[name]=p.read_bytes()
area=json.loads(raw['leon-boundary']); roads=json.loads(raw['leon-streets'])
assert len(area['features'])==1 and area['features'][0]['properties']['cvegeo']=='11020'
assert all(f['properties']['cve_ent']=='11' and f['properties']['cve_mun']=='020' for f in roads['features'])
polygons=area['features'][0]['geometry']['coordinates']
def mercator(p):return (math.radians(p[0]),math.log(math.tan(math.pi/4+math.radians(p[1])/2)))
points=[mercator(p) for poly in polygons for ring in poly for p in ring]
west,south=min(p[0] for p in points),min(p[1] for p in points)
east,north=max(p[0] for p in points),max(p[1] for p in points)
scale=min(584/(east-west),584/(north-south));left=(640-(east-west)*scale)/2;top=(640-(north-south)*scale)/2
def project(p):
 x,y=mercator(p);return(left+(x-west)*scale,top+(north-y)*scale)
def path(ring):return 'M'+'L'.join(f'{x:.2f},{y:.2f}' for x,y in map(project,ring))+'Z'
outline=''.join(path(ring) for poly in polygons for ring in poly)
OUT=ROOT/'public/maps';OUT.mkdir(parents=True,exist_ok=True)
svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><title>León, Guanajuato — contorno municipal INEGI</title><path d="{outline}" fill="#b6ff00" fill-opacity=".025" fill-rule="evenodd" stroke="#b6ff00" stroke-width="1.5" stroke-linejoin="round"/></svg>'
(OUT/'leon-contorno.svg').write_text(svg)
# Rasterize real vectors at 2x display resolution; keep the frontend payload small.
ratio=4;image=Image.new('RGBA',(640*ratio,640*ratio),(0,0,0,0));draw=ImageDraw.Draw(image)
mask=Image.new('L',image.size,0);maskdraw=ImageDraw.Draw(mask)
for poly in polygons:
 for index,ring in enumerate(poly):maskdraw.polygon([(x*ratio,y*ratio) for x,y in map(project,ring)],fill=255 if index==0 else 0)
segments=0
for feature in roads['features']:
 geometry=feature['geometry']
 assert geometry['type'] in ('LineString','MultiLineString')
 lines=[geometry['coordinates']] if geometry['type']=='LineString' else geometry['coordinates']
 for line in lines:
  if len(line)<2:continue
  coords=[(x*ratio,y*ratio) for x,y in map(project,line)]
  major=feature['properties'].get('tipovial','').lower() in ('boulevard','avenida','calzada','periférico','eje vial')
  draw.line(coords,fill=(214,255,155,255) if major else (182,255,0,210),width=3 if major else 2,joint='curve');segments+=1
from PIL import ImageChops
image.putalpha(ImageChops.multiply(image.getchannel('A'),mask))
image.resize((1280,1280),Image.Resampling.LANCZOS).save(OUT/'leon-vialidades.webp',lossless=True,method=6)
meta={'area':'León, Guanajuato','cvegeo':'11020','downloaded':'2026-10-22','metadata':area['metadatos'],'streetMetadata':roads['metadatos'],'roadFeatures':len(roads['features']),'segments':segments,'projection':'Spherical Mercator, north up, identical bounds for both layers','derivative':'Boundary SVG; road vectors rasterized at 1280 × 1280 with alpha, clipped to municipality. Display only, not legal delimitation or navigation. Only vialidades available in the INEGI service; not a claim of exhaustive street coverage.','sources':[{'url':url,'sha256':hashlib.sha256(raw[name]).hexdigest()} for name,url in SOURCES.items()]}
(OUT/'fuentes.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2))
print(json.dumps({'features':len(roads['features']),'segments':segments,'files':{p.name:p.stat().st_size for p in OUT.iterdir()}}))
