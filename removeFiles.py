import os
from pathlib import Path

# Silinecek klasörün yolu
folder_path = Path.cwd() / "admin" / "invoices"

# Klasördeki tüm dosyaları sil
for file in folder_path.iterdir():
    if file.is_file():  # sadece dosyaları sil
        try:
            file.unlink()
            print(f"Silindi: {file.name}")
        except Exception as e:
            print(f"Dosya silinemedi: {file.name}, Hata: {e}")
