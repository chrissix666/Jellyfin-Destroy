import pathlib, zipfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'dist' / 'quotes' / 'packed'
OUT = ROOT / 'dist' / 'quotes.zip'
files = sorted(SRC.glob('*.json.gz'))
with zipfile.ZipFile(OUT, 'w', compression=zipfile.ZIP_STORED) as z:
    for f in files:
        z.write(f, f.name)
print(f'{OUT.name}: {len(files)} entries, {OUT.stat().st_size / 1e6:.1f} MB')
